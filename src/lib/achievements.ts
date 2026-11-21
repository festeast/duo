// Жетістіктерді тексеру: жаңасы орындалса — серверден сыйлықты аламыз.
import { useEffect } from 'react'
import { BADGES, type Ctx } from '../data/achievements'
import { STORIES } from '../data/stories'
import { EPISODES } from '../data/dialogs'
import { claimAchievement } from './api'
import { getState, levelOf, setState, streakOf, useStore, withFrozen } from './store'

export const HARD_KEY = 'duo-hard-done'

function local(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function achievementCtx(): Ctx {
  const s = getState()
  const p = s.profile
  const done = Object.keys(s.progress)
  let stories = 0
  try {
    stories = Object.keys(JSON.parse(local('duo-stories-read') ?? '{}')).length
  } catch {
    /* бос */
  }
  return {
    learned: Object.values(s.words).filter((w) => w.stage >= 1).length,
    streak: streakOf(withFrozen(s.days, p?.frozen)),
    dialogs: done.filter((k) => k.startsWith('dlg-')).length,
    series: EPISODES.filter((e) => done.includes(`dlg-${e.id}`)).length,
    seriesTotal: EPISODES.length,
    stories,
    storiesTotal: STORIES.length,
    friends: s.friends.filter((f) => f.status === 'accepted').length,
    level: p ? levelOf(p.xp).level : 0,
    hard: Number(local(HARD_KEY) ?? 0),
  }
}

let running = false
async function check() {
  const s = getState()
  if (running || !s.profile || !s.achievements || !s.online) return
  const ctx = achievementCtx()
  const todo = BADGES.filter((b) => !s.achievements!.includes(b.id)).filter((b) => {
    const [v, n] = b.goal(ctx)
    return n > 0 && v >= n
  })
  if (!todo.length) return
  running = true
  try {
    for (const b of todo) {
      const reward = await claimAchievement(b.id)
      if (reward === null) break
      setState((st) => ({
        achievements: [...(st.achievements ?? []), b.id],
        newBadges: reward > 0 ? [...st.newBadges, { id: b.id, reward }] : st.newBadges,
        profile: st.profile && reward > 0 ? { ...st.profile, coins: st.profile.coins + reward } : st.profile,
      }))
    }
  } finally {
    running = false
  }
}

/** App ішінде: деректер өзгерген сайын жетістіктерді тексереміз */
export function useAchievements() {
  const words = useStore((s) => s.words)
  const days = useStore((s) => s.days)
  const progress = useStore((s) => s.progress)
  const friends = useStore((s) => s.friends)
  const xp = useStore((s) => s.profile?.xp)
  const ach = useStore((s) => s.achievements)
  const online = useStore((s) => s.online)
  useEffect(() => {
    const id = setTimeout(() => void check(), 1200)
    return () => clearTimeout(id)
  }, [words, days, progress, friends, xp, ach, online])
}

/** Әңгіме оқылғанда немесе қиын сөз жаттығуы біткенде қолмен шақыру */
export const checkAchievements = () => void check()
