import { useEffect, useMemo, useState } from 'react'
import { Cat } from '../components/Cat'
import { Feedback, Match, MicButton, Options, SpeakButtons, TileBuilder, TypeAnswer, WordCard, type Status } from '../components/Exercises'
import { SENTENCES, WORD_LIST, type Word } from '../data/words'
import { randomPraise, t } from '../i18n/kk'
import { addXp, saveWords } from '../lib/api'
import { checkTyped, normTr, shuffle, tokenize } from '../lib/exercises'
import { canListen } from '../lib/listen'
import { sfx } from '../lib/sound'
import { speak } from '../lib/speech'
import { grade, type Plan, type WordState } from '../lib/srs'
import { getState, levelOf, useStore } from '../lib/store'
import type { LessonResult } from './Result'

type Ex =
  | { kind: 'intro'; word: Word }
  | { kind: 'choose'; dir: 'tr-kk' | 'kk-tr'; word: Word; prompt: string; options: string[]; answer: string; speak?: string }
  | { kind: 'listen'; word: Word; options: string[]; answer: string }
  | { kind: 'type'; word: Word; prompt: string; answer: string }
  | { kind: 'match'; words: Word[] }
  | { kind: 'build'; prompt: string; tiles: string[]; answer: string; tests: string[] }
  | { kind: 'shadow'; tr: string; kk: string }

type Q = Ex & { key: number }

const pick = <T,>(arr: T[], n: number) => shuffle(arr).slice(0, n)

function distract(answer: string, pool: string[], n = 3) {
  return pick([...new Set(pool)].filter((x) => normTr(x) !== normTr(answer)), n)
}

const choose = (w: Word, dir: 'tr-kk' | 'kk-tr'): Ex =>
  dir === 'tr-kk'
    ? { kind: 'choose', dir, word: w, prompt: w.tr, speak: w.tr, answer: w.kk, options: shuffle([w.kk, ...distract(w.kk, WORD_LIST.map((x) => x.kk))]) }
    : { kind: 'choose', dir, word: w, prompt: w.kk, answer: w.tr, options: shuffle([w.tr, ...distract(w.tr, WORD_LIST.map((x) => x.tr))]) }

const listen = (w: Word): Ex => ({ kind: 'listen', word: w, answer: w.tr, options: shuffle([w.tr, ...distract(w.tr, WORD_LIST.map((x) => x.tr))]) })

/** Сөйлемде осы сөз (немесе оның түрі) бар ма */
const hasWord = (sentence: string, w: Word) =>
  tokenize(sentence).some((x) => {
    const a = normTr(x)
    const b = normTr(w.tr)
    return a === b || (b.length >= 4 && a.startsWith(b.slice(0, -1)))
  })

/** Бүгінгі жаттығуды құрастыру: жаңа сөздер таныстырылады, бәрі араласып қайталанады */
function buildSession(plan: Plan, states: Record<string, WordState>): Ex[] {
  const all = [...plan.review, ...plan.fresh]
  const intro: Ex[] = plan.fresh.flatMap((w) => [{ kind: 'intro', word: w } as Ex, choose(w, 'tr-kk')])
  const mixed: Ex[] = []

  for (const w of plan.fresh) mixed.push(Math.random() < 0.5 ? choose(w, 'kk-tr') : listen(w))
  for (const w of plan.review) {
    const st = states[w.tr]?.stage ?? 1
    // Сөз бекіген сайын тапсырма қиындайды: таңдау → тыңдау → өзің жаз
    if (st >= 3) mixed.push({ kind: 'type', word: w, prompt: w.kk, answer: w.tr })
    else mixed.push(Math.random() < 0.5 ? choose(w, 'kk-tr') : listen(w))
  }
  // Жаңа сөздің біреуін жазып көру
  if (plan.fresh.length) {
    const w = pick(plan.fresh, 1)[0]
    mixed.push({ kind: 'type', word: w, prompt: w.kk, answer: w.tr })
  }
  if (all.length >= 4) mixed.push({ kind: 'match', words: pick(all, 5) })

  // Сөздер сөйлем ішінде (контекст)
  const sents = shuffle(SENTENCES.filter(([tr]) => all.some((w) => hasWord(tr, w)))).slice(0, 2)
  const allTokens = SENTENCES.flatMap(([tr]) => tokenize(tr))
  for (const [tr, kk] of sents) {
    const tokens = tokenize(tr)
    const extra = pick([...new Set(allTokens)].filter((x) => !tokens.some((y) => normTr(y) === normTr(x))), 3)
    mixed.push({ kind: 'build', prompt: kk, answer: tr, tiles: shuffle([...tokens, ...extra]), tests: all.filter((w) => hasWord(tr, w)).map((w) => w.tr) })
  }

  // Тыңда да қайтала (shadowing)
  const sh = sents[0] ?? pick(SENTENCES, 1)[0]
  if (sh) mixed.push({ kind: 'shadow', tr: sh[0], kk: sh[1] })

  return [...intro, ...shuffle(mixed)]
}

function reshuffle(ex: Q, key: number): Q {
  if (ex.kind === 'choose' || ex.kind === 'listen') return { ...ex, key, options: shuffle(ex.options) }
  if (ex.kind === 'build') return { ...ex, key, tiles: shuffle(ex.tiles) }
  return { ...ex, key }
}

const testsOf = (ex: Ex): string[] => {
  switch (ex.kind) {
    case 'choose':
    case 'listen':
    case 'type':
      return [ex.word.tr]
    case 'build':
      return ex.tests
    default:
      return []
  }
}

export function Session({ plan, onExit, onFinish }: { plan: Plan; onExit: () => void; onFinish: (r: LessonResult) => void }) {
  const me = useStore((s) => s.profile)!
  const initial = useMemo(() => buildSession(plan, getState().words).map((e, i) => ({ ...e, key: i })), [plan])
  const [queue, setQueue] = useState<Q[]>(initial)
  const [pos, setPos] = useState(0)
  const [sel, setSel] = useState<string | null>(null)
  const [picked, setPicked] = useState<number[]>([])
  const [typed, setTyped] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [note, setNote] = useState<string | undefined>()
  const [praise, setPraise] = useState('')
  const [failed, setFailed] = useState<Set<string>>(new Set())
  const [mistakes, setMistakes] = useState(0)
  const [solved, setSolved] = useState(0)

  const ex = queue[pos]
  const total = initial.length

  useEffect(() => {
    if (ex?.kind === 'listen') speak(ex.answer)
    else if (ex?.kind === 'choose' && ex.speak) speak(ex.speak)
    else if (ex?.kind === 'intro') speak(ex.word.tr)
    else if (ex?.kind === 'shadow') speak(ex.tr)
  }, [ex])

  const markFailed = (words: string[]) => setFailed((f) => new Set([...f, ...words]))

  const succeed = (n?: string) => {
    sfx.correct()
    setPraise(randomPraise())
    setNote(n)
    setSolved((x) => x + 1)
    setStatus('ok')
  }

  const fail = () => {
    sfx.wrong()
    setMistakes((x) => x + 1)
    markFailed(testsOf(ex))
    setStatus('no')
    setQueue((q) => [...q, reshuffle(ex, q.length + 1000)])
  }

  const check = () => {
    if (ex.kind === 'choose' || ex.kind === 'listen') return sel !== null && normTr(sel) === normTr(ex.answer) ? succeed() : fail()
    if (ex.kind === 'build') {
      const ok = picked.map((i) => normTr(ex.tiles[i])).join(' ') === tokenize(ex.answer).map(normTr).join(' ')
      if (ok) speak(ex.answer)
      return ok ? succeed() : fail()
    }
    if (ex.kind === 'type') {
      const r = checkTyped(typed, ex.answer)
      if (r === 'wrong') return fail()
      speak(ex.answer)
      return succeed(r === 'almost' ? `${t.almostRight} ${ex.answer}` : undefined)
    }
  }

  const finish = () => {
    const words = [...plan.review, ...plan.fresh]
    const states = getState().words
    const updates: Record<string, WordState> = {}
    for (const w of words) updates[w.tr] = grade(states[w.tr], !failed.has(w.tr))
    void saveWords(updates)
    const perfect = mistakes === 0
    const xp = Math.min(40, 10 + words.length + (perfect ? 5 : 0))
    const coins = 10 + (perfect ? 5 : 0)
    void addXp(xp, coins)
    onFinish({
      title: t.sessionComplete,
      stars: perfect ? 3 : mistakes <= 2 ? 2 : 1,
      xp,
      coins,
      accuracy: Math.round((total / (total + mistakes)) * 100),
      levelUp: levelOf(me.xp + xp).level > levelOf(me.xp).level,
      summary: t.sessionSummary(plan.fresh.length, plan.review.length),
    })
  }

  const next = () => {
    sfx.click()
    if (pos + 1 >= queue.length) return finish()
    setPos(pos + 1)
    setSel(null)
    setPicked([])
    setTyped('')
    setNote(undefined)
    setStatus('idle')
  }

  const canCheck =
    (ex.kind === 'build' && picked.length > 0) ||
    ((ex.kind === 'choose' || ex.kind === 'listen') && sel !== null) ||
    (ex.kind === 'type' && typed.trim().length > 0)
  const answerText = 'answer' in ex ? ex.answer : ''

  return (
    <div className="screen lesson">
      <div className="lesson-top">
        <button className="icon-btn" aria-label={t.quit} onClick={() => confirm(t.quitConfirm) && onExit()}>
          ✕
        </button>
        <div className="bar">
          <i style={{ width: `${(solved / total) * 100}%` }} />
        </div>
      </div>

      <div key={ex.key} className="col pop" style={{ flex: 1, gap: 18 }}>
        {ex.kind === 'intro' && (
          <>
            <WordCard w={ex.word} />
            <div className="spacer" />
          </>
        )}
        {ex.kind === 'choose' && (
          <>
            <h3 className="ex-title">{ex.dir === 'tr-kk' ? t.chooseTranslation : t.chooseTurkish}</h3>
            <div className="card row" style={{ justifyContent: 'space-between' }}>
              <span className="prompt">
                {ex.dir === 'kk-tr' && ex.word.emoji ? `${ex.word.emoji} ` : ''}
                {ex.prompt}
              </span>
              {ex.speak && <SpeakButtons text={ex.speak} />}
            </div>
            <div className="spacer" />
            <Options options={ex.options} sel={sel} setSel={setSel} status={status} answer={ex.answer} />
          </>
        )}
        {ex.kind === 'listen' && (
          <>
            <h3 className="ex-title">{t.whatHeard}</h3>
            <SpeakButtons text={ex.answer} big />
            <div className="spacer" />
            <Options options={ex.options} sel={sel} setSel={setSel} status={status} answer={ex.answer} grid speakOnTap />
          </>
        )}
        {ex.kind === 'type' && (
          <>
            <h3 className="ex-title">✍️ {t.typeTitle}</h3>
            <div className="card row">
              {ex.word.emoji && <span style={{ fontSize: 34 }}>{ex.word.emoji}</span>}
              <span className="prompt">{ex.prompt}</span>
            </div>
            <TypeAnswer value={typed} setValue={setTyped} locked={status !== 'idle'} onEnter={() => status === 'idle' && check()} />
            <div className="spacer" />
          </>
        )}
        {ex.kind === 'build' && (
          <>
            <h3 className="ex-title">{t.buildSentence}</h3>
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <Cat look={me.cat} size={84} />
              <div className="bubble">{ex.prompt}</div>
            </div>
            <div className="spacer" />
            <TileBuilder tiles={ex.tiles} picked={picked} setPicked={setPicked} locked={status !== 'idle'} />
          </>
        )}
        {ex.kind === 'match' && (
          <>
            <h3 className="ex-title">{t.matchPairs}</h3>
            <div className="spacer" />
            <Match
              pairs={ex.words.map((w) => [w.tr, w.kk])}
              onDone={(errs, wrong) => {
                setMistakes((n) => n + errs)
                markFailed(wrong)
                succeed()
              }}
            />
            <div className="spacer" />
          </>
        )}
        {ex.kind === 'shadow' && (
          <>
            <h3 className="ex-title">🗣️ {t.shadowTitle}</h3>
            <p className="muted small" style={{ margin: 0 }}>
              {t.shadowHint}
            </p>
            <div className="card col center">
              <span className="prompt">{ex.tr}</span>
              <span className="muted">{ex.kk}</span>
              <SpeakButtons text={ex.tr} big />
            </div>
            <div className="spacer" />
            {status === 'idle' && <MicButton target={ex.tr} onResult={(ok) => ok && succeed()} />}
          </>
        )}
      </div>

      {status === 'idle' && ex.kind === 'intro' && (
        <button
          className="btn wide"
          onClick={() => {
            setSolved((x) => x + 1)
            next()
          }}
        >
          {t.gotIt}
        </button>
      )}
      {status === 'idle' && ex.kind === 'shadow' && (
        <button className={`btn wide ${canListen() ? 'ghost' : ''}`} onClick={() => succeed()}>
          {canListen() ? t.shadowSkip : t.shadowSaid}
        </button>
      )}
      {status === 'idle' && ex.kind !== 'match' && ex.kind !== 'intro' && ex.kind !== 'shadow' && (
        <button className="btn wide" disabled={!canCheck} onClick={check}>
          {t.check}
        </button>
      )}

      {status !== 'idle' && <Feedback ok={status === 'ok'} praise={praise} answer={answerText} note={note} look={me.cat} onNext={next} />}
    </div>
  )
}
