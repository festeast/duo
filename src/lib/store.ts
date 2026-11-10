import { useSyncExternalStore } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { DialogSession, Profile } from './types'
import type { WordState } from './srs'

export type Friend = {
  friendshipId: number
  status: 'pending' | 'accepted'
  incoming: boolean // маған келген сұраныс па
  profile: Profile
  days: Record<string, number>
  wordsLearned: number
}

export type State = {
  ready: boolean
  session: Session | null
  profile: Profile | null
  progress: Record<string, number> // сабақ/диалог → жұлдыз
  words: Record<string, WordState> // түрікше сөз → қайталау күйі
  wordsLoaded: boolean
  days: Record<string, number> // күн → XP
  friends: Friend[]
  invites: DialogSession[] // маған келген диалог шақырулары
  activeDialogs: DialogSession[] // кідіртілген (жалғастыруға болатын) диалогтар
  sound: boolean
  toast: string | null
  online: boolean // интернет бар ма
  pending: number // серверге әлі жіберілмеген өзгерістер саны
}

const SOUND_KEY = 'duo-sound'

function loadSound() {
  try {
    return localStorage.getItem(SOUND_KEY) !== 'off'
  } catch {
    return true
  }
}

let state: State = {
  ready: false,
  session: null,
  profile: null,
  progress: {},
  words: {},
  wordsLoaded: false,
  days: {},
  friends: [],
  invites: [],
  activeDialogs: [],
  sound: loadSound(),
  toast: null,
  online: typeof navigator === 'undefined' ? true : navigator.onLine,
  pending: 0,
}

const listeners = new Set<() => void>()
const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

export function setState(patch: Partial<State> | ((s: State) => Partial<State>)) {
  const p = typeof patch === 'function' ? patch(state) : patch
  state = { ...state, ...p }
  if ('sound' in p) {
    try {
      localStorage.setItem(SOUND_KEY, state.sound ? 'on' : 'off')
    } catch {
      /* бос */
    }
  }
  listeners.forEach((l) => l())
}

export const getState = () => state
export const subscribeStore = subscribe

export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => sel(state))
}

let toastTimer: ReturnType<typeof setTimeout> | undefined
export function toast(msg: string) {
  setState({ toast: msg })
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => setState({ toast: null }), 2600)
}

// ---------- Есептеулер ----------

export function dayKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return dayKey(d)
}

/** Барлық берілген адамдар бірге сабақ өткен қатарынан күндер.
 *  Бүгін әлі өтпесе, кешеден бастап санаймыз (от әлі сөнген жоқ). */
export function streakOf(...people: Record<string, number>[]): number {
  if (people.length === 0) return 0
  const studied = (n: number) => people.every((d) => (d[daysAgo(n)] ?? 0) > 0)
  const start = studied(0) ? 0 : 1
  let count = 0
  while (studied(start + count)) count++
  return count
}

export const studiedToday = (days: Record<string, number>) => (days[dayKey()] ?? 0) > 0

export function weeklyXp(days: Record<string, number>) {
  let sum = 0
  for (let i = 0; i < 7; i++) sum += days[daysAgo(i)] ?? 0
  return sum
}

export const LEVELS = [
  { xp: 0, name: 'Марғау' },
  { xp: 60, name: 'Мысық' },
  { xp: 180, name: 'Ержүрек мысық' },
  { xp: 400, name: 'Ақылды мысық' },
  { xp: 800, name: 'Шебер мысық' },
  { xp: 1500, name: 'Мысық патша' },
]

export function levelOf(xp: number) {
  let i = 0
  while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1].xp) i++
  const cur = LEVELS[i]
  const next = LEVELS[i + 1]
  const progress = next ? (xp - cur.xp) / (next.xp - cur.xp) : 1
  return { level: i + 1, name: cur.name, progress, next }
}

export const acceptedFriends = (s: State) => s.friends.filter((f) => f.status === 'accepted')
