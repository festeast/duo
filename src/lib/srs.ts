// Аралықпен қайталау (spaced repetition).
// Сөз дұрыс айтылған сайын келесі қайталауға дейінгі аралық ұзарады:
// 1 → 3 → 7 → 14 → 30 → 60 → 120 күн. Қате жіберсең — қайтадан 1 күн.

import { BANDS, SENTENCE_BANK, WORD_LIST, type Word } from '../data/words'
import { dayKey } from './store'

export type WordState = {
  stage: number // 0 — тестпен «білемін» деп белгіленген, бірақ әлі тексерілмеген; 1..7 — бекігені; -1 — өшірілген
  due_on: string // 'YYYY-MM-DD' — келесі қайталау күні
  first_seen: string
  last_seen: string
  correct: number
  wrong: number
}

export const INTERVALS = [0, 1, 3, 7, 14, 30, 60, 120] // stage → күн
export const MAX_STAGE = INTERVALS.length - 1
export const MAX_REVIEWS = 10 // күніне қайталанатын сөздер шегі

// Күніне неше жаңа сөз (аз, бірақ терең): Профильде өзгертуге болады
const NEW_KEY = 'duo-new-per-day'
export const NEW_OPTIONS = [3, 5, 8]
export function getNewPerDay() {
  try {
    const n = Number(localStorage.getItem(NEW_KEY))
    return NEW_OPTIONS.includes(n) ? n : 5
  } catch {
    return 5
  }
}
export function setNewPerDay(n: number) {
  try {
    localStorage.setItem(NEW_KEY, String(n))
  } catch {
    /* бос */
  }
}

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

export type Plan = { review: Word[]; fresh: Word[]; check: Word[]; dueTotal: number; doneToday: number; unverified: number }

export const MAX_CHECKS = 15 // күніне тексерілетін «тексерілмеген» сөздер

/** Сөз үйренілген бе (тексерілмегендер мен өшірілгендерді есептемейміз) */
export const isLearned = (s?: WordState) => !!s && s.stage >= 1

/** Бүгінгі жоспар: қайталау керек сөздер (≤10) + бірнеше жаңа сөз (әдепкі 5) */
export function todayPlan(states: Record<string, WordState>, extraNew = 0, today = dayKey()): Plan {
  const due = WORD_LIST.filter((w) => isLearned(states[w.tr]) && states[w.tr].due_on <= today).sort((a, b) =>
    states[a.tr].due_on.localeCompare(states[b.tr].due_on),
  )
  const reviewedToday = WORD_LIST.filter((w) => {
    const s = states[w.tr]
    return s && s.last_seen === today && s.first_seen !== today
  }).length
  const newToday = WORD_LIST.filter((w) => states[w.tr]?.first_seen === today).length

  const review = due.slice(0, Math.max(0, MAX_REVIEWS - reviewedToday))
  // Тест бойынша «білемін» деп белгіленген сөздерді біртіндеп тексереміз
  const unverifiedAll = WORD_LIST.filter((w) => states[w.tr]?.stage === 0)
  // Бүгін тексерілгендер: білді (stage 4, 1/0) немесе білмеді (stage 1, 0/1)
  const checkedToday = WORD_LIST.filter((w) => {
    const s = states[w.tr]
    if (!s || s.last_seen !== today || s.first_seen === today) return false
    return (s.stage === 4 && s.correct === 1 && s.wrong === 0) || (s.stage === 1 && s.correct === 0 && s.wrong === 1)
  }).length
  const check = unverifiedAll.filter((w) => states[w.tr].due_on <= today).slice(0, Math.max(0, MAX_CHECKS - checkedToday))
  const freshCount = Math.max(0, getNewPerDay() + extraNew - newToday)
  // Жаңа сөздер деңгей ретімен, бірақ келесі 12 сөздің ішінен бүгінгі қайталанатын
  // сөздермен бір сөйлемде кездесетіндері таңдалады (сонда екеуі бірге жаттығады)
  const fresh = pickFresh(states, review, freshCount)

  return { review, fresh, check, dueTotal: due.length, doneToday: reviewedToday + newToday, unverified: unverifiedAll.length }
}

function pickFresh(states: Record<string, WordState>, review: Word[], n: number): Word[] {
  const window = WORD_LIST.filter((w) => !states[w.tr] || states[w.tr].stage < 0).slice(0, Math.max(n, 30))
  if (!review.length || window.length <= n) return window.slice(0, n)
  const reviewSet = new Set(review.map((w) => w.tr))
  const scored = window.map((w, i) => {
    let links = 0
    for (const s of SENTENCE_BANK) {
      if (!s.uses.includes(w.tr)) continue
      links += s.uses.filter((u) => reviewSet.has(u)).length
    }
    // Ерте тұрған сөзге басымдық: ретінен тым алыстамаймыз
    return { w, i, score: Math.min(links, 3) * 3 - i * 0.3 }
  })
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .sort((a, b) => a.i - b.i)
    .map((x) => x.w)
}

/** Деңгей тестінің нәтижесі: өтілген деңгейлердің сөздерін «білемін» деп белгілейміз.
 *  Олар 1–2 ай ішінде біртіндеп тексеріліп отырады. */
export function placementStates(passedBands: number, wrong: Set<string>, today = dayKey()) {
  const updates: Record<string, WordState> = {}
  const yesterday = addDays(today, -1)
  BANDS.slice(0, passedBands).forEach((band, bi) => {
    band.words.forEach((w, i) => {
      if (wrong.has(w.tr)) return // тестте қате жауап берілген сөз — жаңа сөз ретінде үйретіледі
      // Тексерілмеген сөз: алдағы 3 апта ішінде күн сайын біртіндеп тексеріледі
      const spread = (i * 7 + bi * 3) % 21
      updates[w.tr] = { stage: 0, due_on: addDays(today, spread), first_seen: yesterday, last_seen: yesterday, correct: 0, wrong: 0 }
    })
  })
  return updates
}

/** Тексеру нәтижесі: білсе — сөз бекиді (2 аптадан кейін қайталау), білмесе — үйренуге түседі */
export function gradeCheck(prev: WordState, ok: boolean, today = dayKey()): WordState {
  return ok
    ? { ...prev, stage: 4, due_on: addDays(today, INTERVALS[4]), last_seen: today, correct: 1, wrong: 0 }
    : { ...prev, stage: 1, due_on: addDays(today, 1), last_seen: today, correct: 0, wrong: 1 }
}

/** Ескі тест «білемін» деп бірден бекіткен сөздер (stage 4, correct 1, wrong 0) — оларды тексерілмеген етеміз */
export function legacyPlaced(states: Record<string, WordState>) {
  return Object.entries(states).filter(([, s]) => s.stage === 4 && s.correct === 1 && s.wrong === 0 && s.first_seen === s.last_seen)
}

/** Сөздердің қай деңгейге дейін бекігені (Профильде көрсету үшін) */
export function estimatedBand(states: Record<string, WordState>) {
  let lvl = -1
  BANDS.forEach((b, i) => {
    const known = b.words.filter((w) => states[w.tr] && states[w.tr].stage >= 0).length
    if (known / b.words.length >= 0.7 && lvl === i - 1) lvl = i
  })
  return lvl
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
