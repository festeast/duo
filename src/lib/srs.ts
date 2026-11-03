// Аралықпен қайталау (spaced repetition).
// Сөз дұрыс айтылған сайын келесі қайталауға дейінгі аралық ұзарады:
// 1 → 3 → 7 → 14 → 30 → 60 → 120 күн. Қате жіберсең — қайтадан 1 күн.

import { WORD_LIST, type Word } from '../data/words'
import { dayKey } from './store'

export type WordState = {
  stage: number // 1..7
  due_on: string // 'YYYY-MM-DD' — келесі қайталау күні
  first_seen: string
  last_seen: string
  correct: number
  wrong: number
}

export const INTERVALS = [0, 1, 3, 7, 14, 30, 60, 120] // stage → күн
export const MAX_STAGE = INTERVALS.length - 1
export const DAILY_TARGET = 10
const MAX_REVIEWS = 7
const MIN_NEW = 3

export function addDays(day: string, n: number) {
  const [y, m, d] = day.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + n)
  return dayKey(dt)
}

export function daysBetween(from: string, to: string) {
  const a = new Date(from + 'T00:00:00')
  const b = new Date(to + 'T00:00:00')
  return Math.round((b.getTime() - a.getTime()) / 86400000)
}

export type Plan = { review: Word[]; fresh: Word[]; dueTotal: number; doneToday: number }

/** Бүгінгі жоспар: алдымен қайталау керек сөздер, қалғаны — жаңа сөздер (барлығы ~10) */
export function todayPlan(states: Record<string, WordState>, extraNew = 0, today = dayKey()): Plan {
  const due = WORD_LIST.filter((w) => states[w.tr] && states[w.tr].due_on <= today).sort((a, b) =>
    states[a.tr].due_on.localeCompare(states[b.tr].due_on),
  )
  const reviewedToday = WORD_LIST.filter((w) => {
    const s = states[w.tr]
    return s && s.last_seen === today && s.first_seen !== today
  }).length
  const newToday = WORD_LIST.filter((w) => states[w.tr]?.first_seen === today).length

  const review = due.slice(0, Math.max(0, MAX_REVIEWS - reviewedToday))
  const reviewLoad = Math.min(MAX_REVIEWS, review.length + reviewedToday)
  const newTarget = Math.max(MIN_NEW, DAILY_TARGET - reviewLoad) + extraNew
  const freshCount = Math.max(0, newTarget - newToday)
  const fresh = WORD_LIST.filter((w) => !states[w.tr]).slice(0, freshCount)

  return { review, fresh, dueTotal: due.length, doneToday: reviewedToday + newToday }
}

/** Жаттығудан кейін сөздің жаңа күйі */
export function grade(prev: WordState | undefined, ok: boolean, today = dayKey()): WordState {
  if (!prev) {
    // Жаңа сөз: ертең бірінші қайталау
    return { stage: 1, due_on: addDays(today, 1), first_seen: today, last_seen: today, correct: ok ? 1 : 0, wrong: ok ? 0 : 1 }
  }
  const stage = ok ? Math.min(MAX_STAGE, prev.stage + 1) : 1
  return {
    ...prev,
    stage,
    due_on: addDays(today, INTERVALS[stage]),
    last_seen: today,
    correct: prev.correct + (ok ? 1 : 0),
    wrong: prev.wrong + (ok ? 0 : 1),
  }
}

/** «2 күннен кейін», «Ертең», «Бүгін» */
export function dueLabel(due_on: string, today = dayKey()) {
  const n = daysBetween(today, due_on)
  if (n <= 0) return 'Бүгін'
  if (n === 1) return 'Ертең'
  if (n < 7) return `${n} күннен кейін`
  if (n < 30) return `${Math.round(n / 7)} аптадан кейін`
  return `${Math.round(n / 30)} айдан кейін`
}

/** Сөз қаншалықты бекіген (0–1) */
export const strength = (s: WordState) => s.stage / MAX_STAGE
