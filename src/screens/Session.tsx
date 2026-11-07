import { useEffect, useMemo, useState } from 'react'
import { Ear, PenLine, Repeat, Search, Sparkles, Speech, X } from '../components/Icon'
import { Cat } from '../components/Cat'
import { Feedback, Match, MicButton, Options, SpeakButtons, TileBuilder, TypeAnswer, WordCard, type Status } from '../components/Exercises'
import { wordByTr } from '../data/words'
import { buildSession, type Ex } from '../lib/session'
import { randomPraise, t } from '../i18n/kk'
import { addXp, saveWords } from '../lib/api'
import { checkDictation, checkTyped, normTr, shuffle, tokenize, type DictWord } from '../lib/exercises'
import { canListen } from '../lib/listen'
import { sfx } from '../lib/sound'
import { speak, stopSpeaking } from '../lib/speech'
import { grade, gradeCheck, type Plan, type WordState } from '../lib/srs'
import { getState, levelOf, useStore } from '../lib/store'
import type { LessonResult } from './Result'

type Q = Ex & { key: number }

function reshuffle(ex: Q, key: number): Q {
  if (ex.kind === 'choose' || ex.kind === 'listen' || ex.kind === 'sentence' || ex.kind === 'hear') return { ...ex, key, options: shuffle(ex.options) }
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
    case 'sentence':
    case 'hear':
    case 'dictate':
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
  const [checkFailed, setCheckFailed] = useState<Set<string>>(new Set())
  const [mistakes, setMistakes] = useState(0)
  const [solved, setSolved] = useState(0)
  const [dict, setDict] = useState<DictWord[] | null>(null)

  const ex = queue[pos]
  const total = initial.length

  // Экраннан шыққанда дыбысты тоқтатамыз
  useEffect(() => () => stopSpeaking(), [])

  useEffect(() => {
    if (ex?.kind === 'listen') speak(ex.answer)
    else if (ex?.kind === 'choose' && ex.speak) speak(ex.speak)
    else if (ex?.kind === 'intro') speak(ex.word.tr)
    else if (ex?.kind === 'shadow') speak(ex.tr)
    else if (ex?.kind === 'hear' || ex?.kind === 'dictate') speak(ex.tr)
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
    if (ex.kind === 'check') {
      // Тексеру: қате болса — сөз үйренуге түседі (қайта сұралмайды)
      const ok = sel === ex.answer
      if (ok) speak(ex.word.tr)
      if (!ok) setCheckFailed((f) => new Set([...f, ex.word.tr]))
      if (ok) return succeed()
      sfx.wrong()
      setMistakes((x) => x + 1)
      setStatus('no')
      return
    }
    if (ex.kind === 'choose' || ex.kind === 'listen') return sel !== null && normTr(sel) === normTr(ex.answer) ? succeed() : fail()
    if (ex.kind === 'hear') return sel === ex.answer ? succeed(ex.tr) : fail()
    if (ex.kind === 'dictate') {
      const r = checkDictation(typed, ex.answer)
      setDict(r.words)
      if (r.result === 'wrong') return fail()
      speak(ex.answer)
      return succeed(r.result === 'almost' ? `${t.almostRight} ${ex.answer}` : undefined)
    }
    if (ex.kind === 'sentence') {
      if (sel === ex.answer) speak(ex.prompt)
      return sel === ex.answer ? succeed() : fail()
    }
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
    for (const w of plan.check) if (states[w.tr]) updates[w.tr] = gradeCheck(states[w.tr], !checkFailed.has(w.tr))
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
      summary:
        t.sessionSummary(plan.fresh.length, plan.review.length) +
        (plan.check.length ? ` · ${plan.check.length - checkFailed.size}/${plan.check.length} ${t.checkKnown}` : ''),
    })
  }

  const next = () => {
    // Алдыңғы тапсырманың дыбысы келесіге өтпеуі керек
    stopSpeaking()
    sfx.click()
    if (pos + 1 >= queue.length) return finish()
    setPos(pos + 1)
    setSel(null)
    setPicked([])
    setTyped('')
    setDict(null)
    setNote(undefined)
    setStatus('idle')
  }

  const canCheck =
    (ex.kind === 'build' && picked.length > 0) ||
    ((ex.kind === 'choose' || ex.kind === 'listen' || ex.kind === 'sentence' || ex.kind === 'check' || ex.kind === 'hear') && sel !== null) ||
    ((ex.kind === 'type' || ex.kind === 'dictate') && typed.trim().length > 0)
  const answerText = 'answer' in ex ? ex.answer : ''

  return (
    <div className="screen lesson">
      <div className="lesson-top">
        <button className="icon-btn" aria-label={t.quit} onClick={() => confirm(t.quitConfirm) && onExit()}>
          <X size={26} />
        </button>
        <div className="bar">
          <i style={{ width: `${(solved / total) * 100}%` }} />
        </div>
      </div>

      <div key={ex.key} className="col pop" style={{ flex: 1, gap: 18 }}>
        {ex.kind === 'check' && (
          <>
            <h3 className="ex-title ih">
              <Search size={22} className="ih-accent" /> {t.checkTitle}
            </h3>
            <p className="muted small" style={{ margin: 0 }}>
              {t.checkHint}
            </p>
            <div className="card row" style={{ justifyContent: 'space-between' }}>
              <span className="prompt">{ex.word.tr}</span>
              <SpeakButtons text={ex.word.tr} />
            </div>
            <div className="spacer" />
            <Options options={ex.options} sel={sel} setSel={setSel} status={status} answer={ex.answer} />
            {status === 'idle' && (
              <button
                className="option dont-know"
                onClick={() => {
                  setSel('∅')
                  setCheckFailed((f) => new Set([...f, ex.word.tr]))
                  setMistakes((x) => x + 1)
                  setStatus('no')
                }}
              >
                {t.dontKnow}
              </button>
            )}
          </>
        )}
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
            <h3 className="ex-title ih">
              <PenLine size={22} className="ih-accent" /> {t.typeTitle}
            </h3>
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
            <FocusChips fresh={ex.fresh} review={ex.review} />
            <div className="spacer" />
            <TileBuilder tiles={ex.tiles} picked={picked} setPicked={setPicked} locked={status !== 'idle'} />
          </>
        )}
        {ex.kind === 'sentence' && (
          <>
            <h3 className="ex-title">{t.sentenceMeaning}</h3>
            <div className="card col" style={{ gap: 8 }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="prompt small-prompt">{ex.prompt}</span>
                <SpeakButtons text={ex.prompt} />
              </div>
              <FocusChips fresh={ex.fresh} review={ex.review} />
            </div>
            <div className="spacer" />
            <Options options={ex.options} sel={sel} setSel={setSel} status={status} answer={ex.answer} />
          </>
        )}
        {ex.kind === 'hear' && (
          <>
            <h3 className="ex-title ih">
              <Ear size={22} className="ih-accent" /> {t.hearTitle}
            </h3>
            <p className="muted small" style={{ margin: 0 }}>
              {t.hearHint}
            </p>
            <SpeakButtons text={ex.tr} big />
            {status !== 'idle' && (
              <div className="card col" style={{ gap: 6 }}>
                <span className="prompt small-prompt">{ex.tr}</span>
                <FocusChips fresh={ex.fresh} review={ex.review} />
              </div>
            )}
            <div className="spacer" />
            <Options options={ex.options} sel={sel} setSel={setSel} status={status} answer={ex.answer} />
          </>
        )}
        {ex.kind === 'dictate' && (
          <>
            <h3 className="ex-title ih">
              <PenLine size={22} className="ih-accent" /> {t.dictTitle}
            </h3>
            <p className="muted small" style={{ margin: 0 }}>
              {t.dictHint}
            </p>
            <SpeakButtons text={ex.tr} big />
            <TypeAnswer value={typed} setValue={setTyped} locked={status !== 'idle'} onEnter={() => status === 'idle' && check()} />
            {dict && (
              <div className="dict-diff">
                {dict.map((w, i) => (
                  <span key={i} className={`dict-w ${w.state}`}>
                    {w.word}
                  </span>
                ))}
              </div>
            )}
            {status !== 'idle' && <span className="muted small">{ex.kk}</span>}
            <div className="spacer" />
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
            <h3 className="ex-title ih">
              <Speech size={22} className="ih-accent" /> {t.shadowTitle}
            </h3>
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

/** Сөйлемдегі бүгінгі сөздер: ✨ жаңа, 🔁 қайталау */
function FocusChips({ fresh, review }: { fresh: string[]; review: string[] }) {
  if (!fresh.length && !review.length) return null
  return (
    <div className="chips">
      {fresh.map((tr) => (
        <span key={tr} className="chip-word fresh">
          <Sparkles size={13} /> {tr} — {wordByTr(tr)?.kk}
        </span>
      ))}
      {review.map((tr) => (
        <span key={tr} className="chip-word review">
          <Repeat size={13} /> {tr} — {wordByTr(tr)?.kk}
        </span>
      ))}
    </div>
  )
}
