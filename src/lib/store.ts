import { useSyncExternalStore } from 'react'
import type { EyeId, FurId } from '../data/cat'

// Қазір деректер телефонның өзінде (localStorage) сақталады.
// 2-кезеңде осы модуль Supabase-ке қосылады: екі iPhone арасында синхрондау.

export type CatLook = { fur: FurId; eyes: EyeId; head?: string; face?: string; neck?: string }

export type Player = {
  id: string
  name: string
  cat: CatLook
  xp: number
  coins: number
  owned: string[]
  lessons: Record<string, number> // сабақ id → жұлдыз (1–3)
  days: Record<string, number> // 'YYYY-MM-DD' → сол күнгі XP
}

export type State = {
  players: Player[]
  activeId: string | null
  sound: boolean
}

const KEY = 'duo-state-v1'

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as State
  } catch {
    /* бос */
  }
  return { players: [], activeId: null, sound: true }
}

let state: State = load()
const listeners = new Set<() => void>()

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* бос */
  }
}

export function setState(fn: (s: State) => State) {
  state = fn(state)
  save()
  listeners.forEach((l) => l())
}

export function getState() {
  return state
}

export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => sel(state),
  )
}

// ---------- Көмекші функциялар ----------

export function dayKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return dayKey(d)
}

export function activePlayer(s: State): Player | undefined {
  return s.players.find((p) => p.id === s.activeId)
}

export function partnerOf(s: State): Player | undefined {
  return s.players.find((p) => p.id !== s.activeId)
}

/** Бірге стрик: екеуі де сабақ өткен қатарынан күндер саны.
 *  Бүгін әлі өтпесе, кешегі күннен бастап санаймыз (от әлі сөнген жоқ). */
export function sharedStreak(players: Player[]): number {
  if (players.length === 0) return 0
  const studied = (n: number) => players.every((p) => (p.days[daysAgo(n)] ?? 0) > 0)
  const start = studied(0) ? 0 : 1
  let count = 0
  while (studied(start + count)) count++
  return count
}

export function studiedToday(p: Player) {
  return (p.days[dayKey()] ?? 0) > 0
}

export function weeklyXp(p: Player) {
  let sum = 0
  for (let i = 0; i < 7; i++) sum += p.days[daysAgo(i)] ?? 0
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

// ---------- Әрекеттер ----------

const uid = () => Math.random().toString(36).slice(2, 10)

export function createPlayer(name: string, cat: CatLook) {
  const p: Player = { id: uid(), name, cat, xp: 0, coins: 20, owned: [], lessons: {}, days: {} }
  setState((s) => ({ ...s, players: [...s.players, p].slice(-2), activeId: p.id }))
}

export function updatePlayer(id: string, fn: (p: Player) => Player) {
  setState((s) => ({ ...s, players: s.players.map((p) => (p.id === id ? fn(p) : p)) }))
}

export function switchPlayer(id: string) {
  setState((s) => ({ ...s, activeId: id }))
}

export function finishLesson(lessonId: string, stars: number, xp: number, coins: number) {
  const s = getState()
  if (!s.activeId) return
  const today = dayKey()
  updatePlayer(s.activeId, (p) => ({
    ...p,
    xp: p.xp + xp,
    coins: p.coins + coins,
    lessons: { ...p.lessons, [lessonId]: Math.max(stars, p.lessons[lessonId] ?? 0) },
    days: { ...p.days, [today]: (p.days[today] ?? 0) + xp },
  }))
}

export function toggleSound() {
  setState((s) => ({ ...s, sound: !s.sound }))
}
