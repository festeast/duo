import { useEffect, useMemo, useState } from 'react'
import { PixelCat } from '../components/PixelCat'
import { lessonById, type Pair } from '../data/course'
import { randomPraise, t } from '../i18n/kk'
import { buildLesson, checkBuild, normTr, shuffle, type Exercise } from '../lib/exercises'
import { sfx } from '../lib/sound'
import { canSpeak, speak } from '../lib/speech'
import { activePlayer, finishLesson, levelOf, useStore } from '../lib/store'

export type LessonResult = { lessonId: string; stars: number; xp: number; coins: number; accuracy: number; levelUp: boolean }

type Q = Exercise & { key: number }
type Status = 'idle' | 'ok' | 'no'

export function Lesson({ lessonId, onExit, onFinish }: { lessonId: string; onExit: () => void; onFinish: (r: LessonResult) => void }) {
  const lesson = lessonById(lessonId)!
  const me = useStore(activePlayer)!
  const initial = useMemo(() => buildLesson(lesson).map((e, i) => ({ ...e, key: i })), [lesson])
  const [queue, setQueue] = useState<Q[]>(initial)
  const [pos, setPos] = useState(0)
  const [sel, setSel] = useState<string | null>(null)
  const [picked, setPicked] = useState<number[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [praise, setPraise] = useState('')
  const [mistakes, setMistakes] = useState(0)
  const [solved, setSolved] = useState(0)

  const ex = queue[pos]
  const total = initial.length

  // Түрікше сөзді автоматты түрде айту
  useEffect(() => {
    if (ex?.kind === 'listen') speak(ex.audio)
    else if (ex?.kind === 'choose' && ex.speak) speak(ex.speak)
  }, [ex])

  const answerText = (): string => {
    if (ex.kind === 'build') return ex.answer
    if (ex.kind === 'choose' || ex.kind === 'listen') return ex.answer
    return ''
  }

  const check = () => {
    let ok = false
    if (ex.kind === 'choose' || ex.kind === 'listen') ok = sel !== null && normTr(sel) === normTr(ex.answer)
    else if (ex.kind === 'build') ok = checkBuild(ex, picked.map((i) => ex.tiles[i]))
    if (ok) {
      sfx.correct()
      setPraise(randomPraise())
      setSolved((n) => n + 1)
      setStatus('ok')
      if (ex.kind === 'build') speak(ex.speak)
    } else {
      sfx.wrong()
      setMistakes((n) => n + 1)
      setStatus('no')
      // Қате тапсырма соңына қайта қосылады
      setQueue((q) => [...q, reshuffle(ex, q.length + 1000)])
    }
  }

  const next = () => {
    sfx.click()
    if (pos + 1 >= queue.length) {
      const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1
      const xp = 10 + (mistakes === 0 ? 5 : 0)
      const coins = stars * 5
      const before = levelOf(me.xp).level
      finishLesson(lesson.id, stars, xp, coins)
      onFinish({
        lessonId: lesson.id,
        stars,
        xp,
        coins,
        accuracy: Math.round((total / (total + mistakes)) * 100),
        levelUp: levelOf(me.xp + xp).level > before,
      })
      return
    }
    setPos(pos + 1)
    setSel(null)
    setPicked([])
    setStatus('idle')
  }

  const canCheck = (ex.kind === 'build' && picked.length > 0) || ((ex.kind === 'choose' || ex.kind === 'listen') && sel !== null)

  return (
    <div className="screen">
      <div className="lesson-top">
        <button
          className="icon-btn"
          aria-label={t.quit}
          onClick={() => {
            if (confirm(t.quitConfirm)) onExit()
          }}
        >
          ✕
        </button>
        <div className="bar">
          <i style={{ width: `${(solved / total) * 100}%` }} />
        </div>
      </div>

      <div key={ex.key} className="col pop" style={{ flex: 1, gap: 16 }}>
        {ex.kind === 'choose' && <Choose ex={ex} sel={sel} setSel={setSel} status={status} />}
        {ex.kind === 'listen' && <Listen ex={ex} sel={sel} setSel={setSel} status={status} />}
        {ex.kind === 'build' && <Build ex={ex} picked={picked} setPicked={setPicked} status={status} cat={me.cat} />}
        {ex.kind === 'match' && (
          <Match
            pairs={ex.pairs}
            onDone={(errs) => {
              setMistakes((n) => n + errs)
              setSolved((n) => n + 1)
              setPraise(randomPraise())
              setStatus('ok')
              sfx.correct()
            }}
          />
        )}
      </div>

      {status === 'idle' && ex.kind !== 'match' && (
        <button className="btn wide" disabled={!canCheck} onClick={check}>
          {t.check}
        </button>
      )}

      {status !== 'idle' && (
        <div className={`feedback ${status === 'ok' ? 'ok' : 'no'} pop`}>
          <div className="row">
            <PixelCat look={me.cat} size={48} mood={status === 'ok' ? 'happy' : 'sad'} />
            <div className="col" style={{ gap: 4 }}>
              <h3>{status === 'ok' ? praise : t.wrong}</h3>
              {status === 'no' && (
                <span>
                  {t.correctAnswer} <b style={{ color: 'var(--text)' }}>{answerText()}</b>
                </span>
              )}
            </div>
          </div>
          <button className={`btn wide${status === 'no' ? ' red' : ''}`} onClick={next}>
            {t.continue}
          </button>
        </div>
      )}
    </div>
  )
}

function reshuffle(ex: Q, key: number): Q {
  if (ex.kind === 'choose' || ex.kind === 'listen') return { ...ex, key, options: shuffle(ex.options) }
  if (ex.kind === 'build') return { ...ex, key, tiles: shuffle(ex.tiles) }
  return { ...ex, key }
}

// ---------- Тапсырма түрлері ----------

function SpeakButtons({ text, big }: { text: string; big?: boolean }) {
  if (!canSpeak()) return null
  return (
    <div className="row" style={{ justifyContent: 'center' }}>
      <button className={`speak-btn${big ? ' big' : ''}`} aria-label={t.tapToListen} onClick={() => speak(text)}>
        🔊
      </button>
      {big && (
        <button className="speak-btn slow" aria-label={t.slow} onClick={() => speak(text, true)}>
          🐢
        </button>
      )}
    </div>
  )
}

function Options({ options, sel, setSel, status, answer }: { options: string[]; sel: string | null; setSel: (s: string) => void; status: Status; answer: string }) {
  return (
    <div className="col" style={{ gap: 8 }}>
      {options.map((o) => {
        let cls = 'option'
        if (status !== 'idle' && o === answer) cls += ' good'
        else if (status === 'no' && o === sel) cls += ' bad'
        else if (o === sel) cls += ' selected'
        return (
          <button
            key={o}
            className={cls}
            disabled={status !== 'idle'}
            onClick={() => {
              sfx.tile()
              setSel(o)
            }}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

type ChooseEx = Extract<Exercise, { kind: 'choose' }>
function Choose({ ex, sel, setSel, status }: { ex: ChooseEx; sel: string | null; setSel: (s: string) => void; status: Status }) {
  return (
    <>
      <h3 className="muted">{ex.dir === 'tr-kk' ? t.chooseTranslation : t.chooseTurkish}</h3>
      <div className="px-box row" style={{ justifyContent: 'space-between' }}>
        <span className="prompt">{ex.prompt}</span>
        {ex.speak && <SpeakButtons text={ex.speak} />}
      </div>
      <div className="spacer" />
      <Options options={ex.options} sel={sel} setSel={setSel} status={status} answer={ex.answer} />
    </>
  )
}

type ListenEx = Extract<Exercise, { kind: 'listen' }>
function Listen({ ex, sel, setSel, status }: { ex: ListenEx; sel: string | null; setSel: (s: string) => void; status: Status }) {
  return (
    <>
      <h3 className="muted">{t.whatHeard}</h3>
      <SpeakButtons text={ex.audio} big />
      <div className="spacer" />
      <div className="grid2">
        {ex.options.map((o) => {
          let cls = 'option'
          if (status !== 'idle' && o === ex.answer) cls += ' good'
          else if (status === 'no' && o === sel) cls += ' bad'
          else if (o === sel) cls += ' selected'
          return (
            <button
              key={o}
              className={cls}
              disabled={status !== 'idle'}
              onClick={() => {
                sfx.tile()
                speak(o)
                setSel(o)
              }}
            >
              {o}
            </button>
          )
        })}
      </div>
    </>
  )
}

type BuildEx = Extract<Exercise, { kind: 'build' }>
function Build({ ex, picked, setPicked, status, cat }: { ex: BuildEx; picked: number[]; setPicked: (p: number[]) => void; status: Status; cat: Parameters<typeof PixelCat>[0]['look'] }) {
  const locked = status !== 'idle'
  return (
    <>
      <h3 className="muted">{t.buildSentence}</h3>
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <PixelCat look={cat} size={72} />
        <div className="bubble">{ex.prompt}</div>
      </div>
      <div className="answer-line">
        {picked.map((i) => (
          <button
            key={i}
            className="option tile"
            disabled={locked}
            onClick={() => {
              sfx.tile()
              setPicked(picked.filter((p) => p !== i))
            }}
          >
            {ex.tiles[i]}
          </button>
        ))}
      </div>
      <div className="spacer" />
      <div className="tiles">
        {ex.tiles.map((w, i) => (
          <button
            key={i}
            className={`option tile${picked.includes(i) ? ' gone' : ''}`}
            disabled={locked || picked.includes(i)}
            onClick={() => {
              sfx.tile()
              speak(w)
              setPicked([...picked, i])
            }}
          >
            {w}
          </button>
        ))}
      </div>
    </>
  )
}

function Match({ pairs, onDone }: { pairs: Pair[]; onDone: (mistakes: number) => void }) {
  const left = useMemo(() => shuffle(pairs.map((p) => p[0])), [pairs])
  const right = useMemo(() => shuffle(pairs.map((p) => p[1])), [pairs])
  const [l, setL] = useState<string | null>(null)
  const [r, setR] = useState<string | null>(null)
  const [matched, setMatched] = useState<string[]>([])
  const [bad, setBad] = useState<[string, string] | null>(null)
  const [errs, setErrs] = useState(0)

  const tryPair = (tr: string | null, kk: string | null) => {
    if (!tr || !kk) return
    const ok = pairs.some((p) => p[0] === tr && p[1] === kk)
    if (ok) {
      sfx.match()
      const m = [...matched, tr, kk]
      setMatched(m)
      if (m.length === pairs.length * 2) setTimeout(() => onDone(errs), 250)
    } else {
      sfx.wrong()
      setErrs((e) => e + 1)
      setBad([tr, kk])
      setTimeout(() => setBad(null), 400)
    }
    setL(null)
    setR(null)
  }

  const cls = (v: string, selected: boolean) => {
    if (matched.includes(v)) return 'option good'
    if (bad?.includes(v)) return 'option bad'
    return `option${selected ? ' selected' : ''}`
  }

  return (
    <>
      <h3 className="muted">{t.matchPairs}</h3>
      <div className="spacer" />
      <div className="grid2">
        <div className="col" style={{ gap: 8 }}>
          {left.map((v) => (
            <button
              key={v}
              className={cls(v, l === v)}
              disabled={matched.includes(v)}
              onClick={() => {
                sfx.tile()
                speak(v)
                setL(v)
                tryPair(v, r)
              }}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="col" style={{ gap: 8 }}>
          {right.map((v) => (
            <button
              key={v}
              className={cls(v, r === v)}
              disabled={matched.includes(v)}
              onClick={() => {
                sfx.tile()
                setR(v)
                tryPair(l, v)
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <div className="spacer" />
    </>
  )
}
