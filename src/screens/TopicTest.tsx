import { useEffect, useMemo, useState } from 'react'
import { Cat } from '../components/Cat'
import { Feedback, MicButton, SpeakButtons, TypeAnswer } from '../components/Exercises'
import { Coin, Ear, Mic, PenLine, Target, X } from '../components/Icon'
import { TopicPic, WordPic } from '../components/Pictos'
import { TOPICS } from '../components/TopicGroups'
import type { Word } from '../data/words'
import { t } from '../i18n/kk'
import { finishTopicTest, saveWords, startTopicTest } from '../lib/api'
import { checkTyped, shuffle } from '../lib/exercises'
import { canListen, stopListening } from '../lib/listen'
import { sfx } from '../lib/sound'
import { hasRecording, speak, stopSpeaking } from '../lib/speech'
import { masterWords } from '../lib/srs'
import { getState, useStore } from '../lib/store'

const MAX_Q = 20
type Kind = 'type' | 'listen' | 'speak'
type Q = { w: Word; kind: Kind }

/** Тақырып тесті: нұсқасыз — жазу, тыңдап жазу, ауызша айту. 90% — өтті */
export function TopicTest({ topic, onDone }: { topic: string; onDone: () => void }) {
  const me = useStore((s) => s.profile)!
  const tests = useStore((s) => s.topicTests)
  const tp = TOPICS.find((x) => x.name === topic)!
  const qs = useMemo<Q[]>(() => {
    const kinds: Kind[] = canListen() ? ['type', 'listen', 'speak'] : ['type', 'listen']
    return shuffle([...tp.words])
      .slice(0, MAX_Q)
      .map((w, i) => {
        let kind = kinds[i % kinds.length]
        if (kind === 'listen' && !hasRecording(w.tr)) kind = 'type'
        return { w, kind }
      })
  }, [tp])
  const [testId, setTestId] = useState<number | null>(null)
  const [i, setI] = useState(0)
  const [typed, setTyped] = useState('')
  const [status, setStatus] = useState<'idle' | 'ok' | 'no'>('idle')
  const [score, setScore] = useState(0)
  const [result, setResult] = useState<boolean | null>(null)
  const [busy, setBusy] = useState(false)
  const q = qs[i]
  const need = Math.ceil(qs.length * 0.9)

  useEffect(
    () => () => {
      stopSpeaking()
      stopListening()
    },
    [],
  )
  useEffect(() => {
    if (testId !== null && q?.kind === 'listen' && status === 'idle') speak(q.w.tr)
  }, [testId, i, q, status])

  const answer = (ok: boolean) => {
    if (ok) {
      sfx.correct()
      setScore((s) => s + 1)
    } else sfx.wrong()
    setStatus(ok ? 'ok' : 'no')
  }

  const next = async () => {
    stopSpeaking()
    sfx.click()
    if (i + 1 < qs.length) {
      setI(i + 1)
      setTyped('')
      setStatus('idle')
      return
    }
    // Соңы: нәтиже
    const passed = await finishTopicTest(testId!, score, qs.length)
    if (passed) {
      sfx.win()
      await saveWords(masterWords(tp.words, getState().words))
    }
    setResult(passed)
  }

  // ---------- Басы: ережелер мен баға ----------
  if (testId === null)
    return (
      <div className="screen">
        <div className="lesson-top">
          <button className="icon-btn" onClick={onDone} aria-label={t.cancel}>
            <X size={26} />
          </button>
        </div>
        <div className="card col center" style={{ gap: 12 }}>
          <TopicPic topic={topic} size={72} color="var(--purple)" />
          <h2 style={{ margin: 0 }}>{topic}</h2>
          <span className="muted">{t.topicTestIntro(qs.length, need)}</span>
          <div className="col" style={{ gap: 6, alignSelf: 'stretch' }}>
            <span className="small ih">
              <PenLine size={16} /> {t.topicKindType}
            </span>
            <span className="small ih">
              <Ear size={16} /> {t.topicKindListen}
            </span>
            {canListen() && (
              <span className="small ih">
                <Mic size={16} /> {t.topicKindSpeak}
              </span>
            )}
          </div>
          <span className="muted small">{t.topicTestReward}</span>
          <button
            className="btn purple wide"
            disabled={busy || (!tests?.freeLeft && me.coins < 30)}
            onClick={async () => {
              setBusy(true)
              const id = await startTopicTest(topic)
              setBusy(false)
              if (id !== null) setTestId(id)
            }}
          >
            <Target size={18} /> {t.topicStart}
            <span className="topic-price">
              {tests?.freeLeft ? (
                t.topicFree
              ) : (
                <>
                  <Coin size={15} /> 30
                </>
              )}
            </span>
          </button>
          {!tests?.freeLeft && <span className="tiny muted">{t.topicFreeNext}</span>}
        </div>
      </div>
    )

  // ---------- Нәтиже ----------
  if (result !== null)
    return (
      <div className="screen result">
        <h1 className="pop">{result ? t.topicPassed : t.topicFailed}</h1>
        <Cat look={me.cat} size={160} mood={result ? 'happy' : 'sad'} bounce={result} />
        <div className="stat-row">
          <div className="stat">
            <span className="muted small">{t.topicScore}</span>
            <b className={result ? 'ok-text' : 'error'}>
              {score}/{qs.length}
            </b>
          </div>
          <div className="stat">
            <span className="muted small">{t.topicNeed}</span>
            <b>{need}</b>
          </div>
        </div>
        <p className="muted center" style={{ margin: 0 }}>
          {result ? t.topicPassedText(tp.words.length) : t.topicFailedText}
        </p>
        <div className="spacer" />
        <button className="btn wide" onClick={onDone}>
          {t.continue}
        </button>
      </div>
    )

  // ---------- Сұрақ ----------
  const title = q.kind === 'type' ? t.topicQType : q.kind === 'listen' ? t.topicQListen : t.topicQSpeak
  return (
    <div className="screen lesson">
      <div className="lesson-top">
        <button className="icon-btn" aria-label={t.quit} onClick={() => confirm(t.topicQuitConfirm) && onDone()}>
          <X size={26} />
        </button>
        <div className="bar">
          <i style={{ width: `${(i / qs.length) * 100}%` }} />
        </div>
        <span className="muted small">
          {i + 1}/{qs.length}
        </span>
      </div>
      <div key={i} className="col pop" style={{ flex: 1, gap: 18 }}>
        <h3 className="ex-title ih">
          {q.kind === 'type' ? <PenLine size={22} className="ih-accent" /> : q.kind === 'listen' ? <Ear size={22} className="ih-accent" /> : <Mic size={22} className="ih-accent" />}
          {title}
        </h3>
        {q.kind === 'listen' ? (
          <SpeakButtons text={q.w.tr} big />
        ) : (
          <div className="card row">
            <WordPic w={q.w} size={44} />
            <span className="prompt">{q.w.kk}</span>
          </div>
        )}
        {q.kind === 'speak' ? (
          status === 'idle' && (
            <MicButton
              target={q.w.tr}
              onResult={(ok) => {
                stopListening()
                answer(ok)
              }}
            />
          )
        ) : (
          <TypeAnswer value={typed} setValue={setTyped} locked={status !== 'idle'} onEnter={() => status === 'idle' && answer(checkTyped(typed, q.w.tr) !== 'wrong')} />
        )}
        <div className="spacer" />
      </div>
      {status === 'idle' && q.kind !== 'speak' && (
        <button className="btn wide" disabled={!typed.trim()} onClick={() => answer(checkTyped(typed, q.w.tr) !== 'wrong')}>
          {t.check}
        </button>
      )}
      {status === 'idle' && q.kind === 'speak' && (
        <button className="btn ghost wide" onClick={() => answer(false)}>
          {t.dontKnow}
        </button>
      )}
      {status !== 'idle' && <Feedback ok={status === 'ok'} praise={t.correct[0]} answer={q.w.tr} look={me.cat} onNext={() => void next()} />}
    </div>
  )
}
