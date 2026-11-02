import { useEffect, useMemo, useState } from 'react'
import { Cat } from '../components/Cat'
import { Match, Options, SpeakButtons, TileBuilder, type Status } from '../components/Exercises'
import { lessonById } from '../data/course'
import { randomPraise, t } from '../i18n/kk'
import { completeLesson } from '../lib/api'
import { buildLesson, checkBuild, normTr, shuffle, type Exercise } from '../lib/exercises'
import { sfx } from '../lib/sound'
import { speak } from '../lib/speech'
import { levelOf, useStore } from '../lib/store'

export type LessonResult = { title: string; stars: number; xp: number; coins: number; accuracy: number; levelUp: boolean }

type Q = Exercise & { key: number }

function reshuffle(ex: Q, key: number): Q {
  if (ex.kind === 'choose' || ex.kind === 'listen') return { ...ex, key, options: shuffle(ex.options) }
  if (ex.kind === 'build') return { ...ex, key, tiles: shuffle(ex.tiles) }
  return { ...ex, key }
}

export function Lesson({ lessonId, onExit, onFinish }: { lessonId: string; onExit: () => void; onFinish: (r: LessonResult) => void }) {
  const lesson = lessonById(lessonId)!
  const me = useStore((s) => s.profile)!
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

  const answerText = ex.kind === 'match' ? '' : ex.answer

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
      void completeLesson(lesson.id, stars, xp, coins)
      onFinish({
        title: t.lessonComplete,
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
    <div className="screen lesson">
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

      <div key={ex.key} className="col pop" style={{ flex: 1, gap: 18 }}>
        {ex.kind === 'choose' && (
          <>
            <h3 className="ex-title">{ex.dir === 'tr-kk' ? t.chooseTranslation : t.chooseTurkish}</h3>
            <div className="card row" style={{ justifyContent: 'space-between' }}>
              <span className="prompt">{ex.prompt}</span>
              {ex.speak && <SpeakButtons text={ex.speak} />}
            </div>
            <div className="spacer" />
            <Options options={ex.options} sel={sel} setSel={setSel} status={status} answer={ex.answer} />
          </>
        )}
        {ex.kind === 'listen' && (
          <>
            <h3 className="ex-title">{t.whatHeard}</h3>
            <SpeakButtons text={ex.audio} big />
            <div className="spacer" />
            <Options options={ex.options} sel={sel} setSel={setSel} status={status} answer={ex.answer} grid speakOnTap />
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
              pairs={ex.pairs}
              onDone={(errs) => {
                setMistakes((n) => n + errs)
                setSolved((n) => n + 1)
                setPraise(randomPraise())
                setStatus('ok')
                sfx.correct()
              }}
            />
            <div className="spacer" />
          </>
        )}
      </div>

      {status === 'idle' && ex.kind !== 'match' && (
        <button className="btn wide" disabled={!canCheck} onClick={check}>
          {t.check}
        </button>
      )}

      {status !== 'idle' && (
        <Feedback ok={status === 'ok'} praise={praise} answer={answerText} look={me.cat} onNext={next} />
      )}
    </div>
  )
}

export function Feedback({
  ok,
  praise,
  answer,
  look,
  onNext,
  nextLabel = t.continue,
}: {
  ok: boolean
  praise: string
  answer: string
  look: Parameters<typeof Cat>[0]['look']
  onNext: () => void
  nextLabel?: string
}) {
  return (
    <div className={`feedback ${ok ? 'ok' : 'no'} slide-up`}>
      <div className="row">
        <Cat look={look} size={56} mood={ok ? 'happy' : 'sad'} />
        <div className="col" style={{ gap: 2 }}>
          <h3>{ok ? praise : t.wrong}</h3>
          {!ok && (
            <span>
              {t.correctAnswer} <b>{answer}</b>
            </span>
          )}
        </div>
      </div>
      <button className={`btn wide${ok ? '' : ' red'}`} onClick={onNext}>
        {nextLabel}
      </button>
    </div>
  )
}
