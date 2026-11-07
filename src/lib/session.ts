// Күнделікті жаттығуды құрастыру (интерфейссіз, тест жазуға ыңғайлы)
import { hasRecording } from './speech'
import { SENTENCE_BANK, WORD_LIST, type Sentence, type Word } from '../data/words'
import { normTr, shuffle, tokenize } from './exercises'
import type { Plan, WordState } from './srs'

export type Ex =
  | { kind: 'check'; word: Word; options: string[]; answer: string }
  | { kind: 'intro'; word: Word }
  | { kind: 'choose'; dir: 'tr-kk' | 'kk-tr'; word: Word; prompt: string; options: string[]; answer: string; speak?: string }
  | { kind: 'listen'; word: Word; options: string[]; answer: string }
  | { kind: 'type'; word: Word; prompt: string; answer: string }
  | { kind: 'match'; words: Word[] }
  | { kind: 'build'; prompt: string; tiles: string[]; answer: string; tests: string[]; fresh: string[]; review: string[] }
  | { kind: 'sentence'; prompt: string; options: string[]; answer: string; tests: string[]; fresh: string[]; review: string[] }
  | { kind: 'shadow'; tr: string; kk: string }
  // Тыңдап түсіну: мәтін көрсетілмейді, тек дыбыс — мағынасын таңда
  | { kind: 'hear'; tr: string; options: string[]; answer: string; tests: string[]; fresh: string[]; review: string[] }
  // Диктант: тыңдап, сөйлемді толық жаз
  | { kind: 'dictate'; tr: string; kk: string; answer: string; tests: string[]; fresh: string[]; review: string[] }

const pick = <T,>(arr: T[], n: number) => shuffle(arr).slice(0, n)

function distract(answer: string, pool: string[], n = 3) {
  return pick([...new Set(pool)].filter((x) => normTr(x) !== normTr(answer)), n)
}

const choose = (w: Word, dir: 'tr-kk' | 'kk-tr'): Ex =>
  dir === 'tr-kk'
    ? { kind: 'choose', dir, word: w, prompt: w.tr, speak: w.tr, answer: w.kk, options: shuffle([w.kk, ...distract(w.kk, WORD_LIST.map((x) => x.kk))]) }
    : { kind: 'choose', dir, word: w, prompt: w.kk, answer: w.tr, options: shuffle([w.tr, ...distract(w.tr, WORD_LIST.map((x) => x.tr))]) }

const listen = (w: Word): Ex => ({ kind: 'listen', word: w, answer: w.tr, options: shuffle([w.tr, ...distract(w.tr, WORD_LIST.map((x) => x.tr))]) })

/** Сөйлемді бағалау: жаңа сөзді қайталанатын сөздермен бірге қолданса және
 *  бейтаныс сөз болмаса — жақсы сөйлем (i+1 қағидасы) */
function scoreSentence(s: Sentence, need: Set<string>, session: Set<string>, reviewSet: Set<string>, states: Record<string, WordState>) {
  let score = 0
  let unknown = s.unknown
  for (const u of s.uses) {
    if (need.has(u)) score += reviewSet.has(u) ? 5 : 3 // әлі сөйлемде кездеспеген сөз (қайталау сөзі — маңыздырақ)
    else if (session.has(u)) score += 1
    else if (states[u]) score += 0.5 // бұрын үйренілген сөз — жақсы
    else unknown++ // әлі үйренілмеген сөз
  }
  if (s.tokens > 9) score -= 2
  return score - unknown * 4 + Math.random() * 0.5
}

/** Бүгінгі жаттығу: жаңа сөздер аз, бірақ терең үйретіледі;
 *  қайталанатын сөздер мүмкіндігінше жаңа сөздермен бір сөйлемде қолданылады */
export function buildSession(plan: Plan, states: Record<string, WordState>): Ex[] {
  const all = [...plan.review, ...plan.fresh]
  const freshSet = new Set(plan.fresh.map((w) => w.tr))
  const reviewSet = new Set(plan.review.map((w) => w.tr))
  const session = new Set(all.map((w) => w.tr))
  const intro: Ex[] = plan.fresh.flatMap((w) => [{ kind: 'intro', word: w } as Ex, choose(w, 'tr-kk')])
  const mixed: Ex[] = []

  // 1) Әр жаңа сөз: тыңдау/кері аударма + өзің жаз (фокус)
  for (const w of plan.fresh) {
    mixed.push(Math.random() < 0.5 ? choose(w, 'kk-tr') : listen(w))
    mixed.push({ kind: 'type', word: w, prompt: w.kk, answer: w.tr })
  }

  // 2) Сөйлемдер: әр жаңа сөзге — қайталанатын сөздері көп сөйлем
  const need = new Set([...freshSet, ...reviewSet]) // сөйлемде әлі кездеспеген сөздер
  const usedSent = new Set<string>()
  const chosen: Sentence[] = []
  const pickFor = (tr: string, mustHaveFresh: boolean, minSession = 1) => {
    const cands = SENTENCE_BANK.filter(
      (s) =>
        s.uses.includes(tr) &&
        !usedSent.has(s.tr) &&
        (!mustHaveFresh || s.uses.some((u) => freshSet.has(u))) &&
        s.uses.filter((u) => session.has(u)).length >= minSession,
    )
    let best: Sentence | null = null
    let bestScore = -Infinity
    for (const s of cands) {
      const sc = scoreSentence(s, need, session, reviewSet, states)
      if (sc > bestScore) [best, bestScore] = [s, sc]
    }
    if (best && bestScore > -6) {
      usedSent.add(best.tr)
      chosen.push(best)
      best.uses.forEach((u) => need.delete(u))
    }
    return best
  }
  for (const w of plan.fresh) pickFor(w.tr, false)
  // Сөйлемге түспей қалған қайталанатын сөздер: алдымен жаңа сөзбен бірге,
  // болмаса — басқа қайталанатын сөзбен бірге (контексте қайталау)
  for (const w of plan.review) if (need.has(w.tr) && plan.fresh.length) pickFor(w.tr, true)
  for (const w of plan.review) if (need.has(w.tr) && chosen.length < plan.fresh.length + 4) pickFor(w.tr, false, 2)

  // Сөйлем тапсырмалары кезектесіп беріледі: құрастыру → тыңдап түсіну → диктант
  const MODES = ['build', 'hear', 'dictate'] as const
  let turn = Math.floor(Math.random() * MODES.length)
  for (const s of chosen) {
    const fresh = s.uses.filter((u) => freshSet.has(u))
    const review = s.uses.filter((u) => reviewSet.has(u))
    const tests = [...fresh, ...review]
    const tokens = tokenize(s.tr)
    const audio = hasRecording(s.tr)
    let mode: string = MODES[turn++ % MODES.length]
    if (mode === 'dictate' && (!audio || tokens.length > 7 || tokens.length < 2)) mode = audio ? 'hear' : 'build'
    if (mode === 'hear' && !audio) mode = 'build'
    if (mode === 'build' && tokens.length > 9) mode = 'sentence'
    const others = () => pick(SENTENCE_BANK.filter((x) => x.tr !== s.tr && x.uses.some((u) => s.uses.includes(u))), 2).map((x) => x.kk)
    if (mode === 'build') {
      const pool = [...new Set(SENTENCE_BANK.flatMap((x) => tokenize(x.tr)))]
      const extra = pick(pool.filter((x) => !tokens.some((y) => normTr(y) === normTr(x))), 3)
      mixed.push({ kind: 'build', prompt: s.kk, answer: s.tr, tiles: shuffle([...tokens, ...extra]), tests, fresh, review })
    } else if (mode === 'hear') {
      const opts = others()
      while (opts.length < 3) {
        const x = SENTENCE_BANK[Math.floor(Math.random() * SENTENCE_BANK.length)].kk
        if (x !== s.kk && !opts.includes(x)) opts.push(x)
      }
      mixed.push({ kind: 'hear', tr: s.tr, answer: s.kk, options: shuffle([s.kk, ...opts]), tests, fresh, review })
    } else if (mode === 'dictate') {
      mixed.push({ kind: 'dictate', tr: s.tr, kk: s.kk, answer: s.tr, tests, fresh, review })
    } else {
      mixed.push({ kind: 'sentence', prompt: s.tr, answer: s.kk, options: shuffle([s.kk, ...others()]), tests, fresh, review })
    }
  }

  // 3) Сөйлемге кірмеген қайталанатын сөздер — жеке тапсырма (бекіген сайын қиындайды)
  for (const w of plan.review) {
    if (!need.has(w.tr)) continue
    const st = states[w.tr]?.stage ?? 1
    if (st >= 3) mixed.push({ kind: 'type', word: w, prompt: w.kk, answer: w.tr })
    else mixed.push(Math.random() < 0.5 ? choose(w, 'kk-tr') : listen(w))
  }

  if (all.length >= 4) mixed.push({ kind: 'match', words: pick(all, 5) })

  // 4) Тыңда да қайтала: жаңа сөзі бар сөйлем
  const sh = chosen.find((s) => s.uses.some((u) => freshSet.has(u))) ?? chosen[0]
  if (sh) mixed.push({ kind: 'shadow', tr: sh.tr, kk: sh.kk })

  // Тесттен кейінгі «тексерілмеген» сөздер: жылдам «білесің бе?» сұрағы (басында)
  const checks: Ex[] = plan.check.map((w) => ({
    kind: 'check',
    word: w,
    answer: w.kk,
    options: shuffle([w.kk, ...distract(w.kk, WORD_LIST.filter((x) => x.level === w.level).map((x) => x.kk))]),
  }))

  return [...checks, ...intro, ...shuffle(mixed)]
}

