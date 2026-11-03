import { ALL_LESSONS, type Lesson, type Pair } from '../data/course'
import { SENTENCES, type Word } from '../data/words'

export type Exercise =
  | { kind: 'choose'; dir: 'tr-kk' | 'kk-tr'; prompt: string; options: string[]; answer: string; speak?: string }
  | { kind: 'listen'; audio: string; options: string[]; answer: string }
  | { kind: 'build'; prompt: string; tiles: string[]; answer: string; speak: string }
  | { kind: 'match'; pairs: Pair[] }

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Сөйлемді сөздерге бөлу (тыныс белгілерсіз). */
export const tokenize = (s: string) =>
  s
    .replace(/[.,!?;:]/g, '')
    .split(/\s+/)
    .filter(Boolean)

/** Салыстыру үшін: түрікше кіші әріп (İ→i, I→ı). */
export const normTr = (s: string) => s.toLocaleLowerCase('tr-TR')

function distractors(answer: string, pool: string[], n: number) {
  const uniq = [...new Set(pool)].filter((x) => normTr(x) !== normTr(answer))
  return shuffle(uniq).slice(0, n)
}

export function buildLesson(lesson: Lesson): Exercise[] {
  const idx = ALL_LESSONS.findIndex((l) => l.id === lesson.id)
  // Алдағы сабақтардың сөздерін де қайталауға және жалған нұсқаларға қолданамыз
  const prev = ALL_LESSONS.slice(Math.max(0, idx - 2), idx)
  const allWords = [...lesson.words, ...prev.flatMap((l) => l.words)]
  const allTr = allWords.map((w) => w[0])
  const allKk = allWords.map((w) => w[1])
  const sentenceWords = ALL_LESSONS.flatMap((l) => l.sentences.flatMap((s) => tokenize(s[0])))

  const words = shuffle(lesson.words)
  const ex: Exercise[] = []

  // 1. Таныстыру: түрікше → қазақша
  words.slice(0, 3).forEach(([tr, kk]) => {
    ex.push({ kind: 'choose', dir: 'tr-kk', prompt: tr, speak: tr, answer: kk, options: shuffle([kk, ...distractors(kk, allKk, 3)]) })
  })

  // 2. Жұптар
  ex.push({ kind: 'match', pairs: shuffle(lesson.words).slice(0, 5) })

  // 3. Қазақша → түрікше
  words.slice(3, 5).forEach(([tr, kk]) => {
    ex.push({ kind: 'choose', dir: 'kk-tr', prompt: kk, answer: tr, options: shuffle([tr, ...distractors(tr, allTr, 3)]) })
  })

  // 4. Тыңдау
  shuffle(lesson.words)
    .slice(0, 2)
    .forEach(([tr]) => {
      ex.push({ kind: 'listen', audio: tr, answer: tr, options: shuffle([tr, ...distractors(tr, allTr, 3)]) })
    })

  // 5. Сөйлем құрастыру
  lesson.sentences.forEach(([tr, kk]) => {
    const answerTokens = tokenize(tr)
    const extra = distractors('', sentenceWords.filter((w) => !answerTokens.some((a) => normTr(a) === normTr(w))), 3)
    ex.push({ kind: 'build', prompt: kk, speak: tr, answer: tr, tiles: shuffle([...answerTokens, ...extra]) })
  })

  // Тыңдау тапсырмаларын араластырып жібереміз, бірақ таныстыру басында қалады
  const intro = ex.slice(0, 3)
  return [...intro, ...shuffle(ex.slice(3, ex.length - lesson.sentences.length)), ...ex.slice(ex.length - lesson.sentences.length)]
}

export function checkBuild(ex: Extract<Exercise, { kind: 'build' }>, picked: string[]) {
  const want = tokenize(ex.answer).map(normTr).join(' ')
  return picked.map(normTr).join(' ') === want
}

const fold = (s: string) => s.replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
const clean = (s: string) => normTr(s).replace(/[.,!?;:’'"]/g, '').replace(/\s+/g, ' ').trim()

/** Жазылған жауапты тексеру: 'exact' | 'almost' (тек ş/ç/ğ т.б. қате) | 'wrong' */
export function checkTyped(input: string, answer: string): 'exact' | 'almost' | 'wrong' {
  const a = clean(input)
  const b = clean(answer)
  if (a === b) return 'exact'
  if (fold(a) === fold(b)) return 'almost'
  return 'wrong'
}


export function exampleFor(w: Word) {
  return SENTENCES.find(([tr]) => tokenize(tr).some((x) => normTr(x) === normTr(w.tr) || (w.tr.length >= 4 && normTr(x).startsWith(normTr(w.tr).slice(0, -1)))))
}

