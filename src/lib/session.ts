// Күнделікті жаттығуды құрастыру (интерфейссіз, тест жазуға ыңғайлы)
import { SENTENCE_BANK, WORD_LIST, type Sentence, type Word } from '../data/words'
import { normTr, shuffle, tokenize } from './exercises'
import type { Plan, WordState } from './srs'

export type Ex =
  | { kind: 'intro'; word: Word }
  | { kind: 'choose'; dir: 'tr-kk' | 'kk-tr'; word: Word; prompt: string; options: string[]; answer: string; speak?: string }
  | { kind: 'listen'; word: Word; options: string[]; answer: string }
  | { kind: 'type'; word: Word; prompt: string; answer: string }
  | { kind: 'match'; words: Word[] }
  | { kind: 'build'; prompt: string; tiles: string[]; answer: string; tests: string[]; fresh: string[]; review: string[] }
  | { kind: 'sentence'; prompt: string; options: string[]; answer: string; tests: string[]; fresh: string[]; review: string[] }
  | { kind: 'shadow'; tr: string; kk: string }

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

  for (const s of chosen) {
    const fresh = s.uses.filter((u) => freshSet.has(u))
    const review = s.uses.filter((u) => reviewSet.has(u))
    const tests = [...fresh, ...review]
    const tokens = tokenize(s.tr)
    if (tokens.length <= 9) {
      const pool = [...new Set(SENTENCE_BANK.flatMap((x) => tokenize(x.tr)))]
      const extra = pick(pool.filter((x) => !tokens.some((y) => normTr(y) === normTr(x))), 3)
      mixed.push({ kind: 'build', prompt: s.kk, answer: s.tr, tiles: shuffle([...tokens, ...extra]), tests, fresh, review })
    } else {
      const others = pick(SENTENCE_BANK.filter((x) => x.tr !== s.tr && x.uses.some((u) => s.uses.includes(u))), 2).map((x) => x.kk)
      mixed.push({ kind: 'sentence', prompt: s.tr, answer: s.kk, options: shuffle([s.kk, ...others]), tests, fresh, review })
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

  return [...intro, ...shuffle(mixed)]
}

