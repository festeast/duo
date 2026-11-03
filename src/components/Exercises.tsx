import { useMemo, useRef, useState } from 'react'
import type { Pair } from '../data/course'
import type { Word } from '../data/words'
import { t } from '../i18n/kk'
import { exampleFor, shuffle } from '../lib/exercises'
import { canListen, judge, listenOnce } from '../lib/listen'
import { sfx } from '../lib/sound'
import { canSpeak, speak } from '../lib/speech'
import type { CatLook } from '../lib/types'
import { Cat } from './Cat'

export type Status = 'idle' | 'ok' | 'no'

export function SpeakButtons({ text, big }: { text: string; big?: boolean }) {
  if (!canSpeak()) return null
  return (
    <div className="row" style={{ justifyContent: 'center', gap: 10 }}>
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

export function Options({
  options,
  sel,
  setSel,
  status,
  answer,
  grid,
  speakOnTap,
}: {
  options: string[]
  sel: string | null
  setSel: (s: string) => void
  status: Status
  answer: string
  grid?: boolean
  speakOnTap?: boolean
}) {
  return (
    <div className={grid ? 'grid2' : 'col'} style={{ gap: 10 }}>
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
              if (speakOnTap) speak(o)
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

/** Сөздерден сөйлем құрастыру */
export function TileBuilder({
  tiles,
  picked,
  setPicked,
  locked,
}: {
  tiles: string[]
  picked: number[]
  setPicked: (p: number[]) => void
  locked: boolean
}) {
  return (
    <>
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
            {tiles[i]}
          </button>
        ))}
      </div>
      <div className="tiles">
        {tiles.map((w, i) => (
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

export function Match({ pairs, onDone }: { pairs: Pair[]; onDone: (mistakes: number, wrongTr: string[]) => void }) {
  const left = useMemo(() => shuffle(pairs.map((p) => p[0])), [pairs])
  const right = useMemo(() => shuffle(pairs.map((p) => p[1])), [pairs])
  const [l, setL] = useState<string | null>(null)
  const [r, setR] = useState<string | null>(null)
  const [matched, setMatched] = useState<string[]>([])
  const [bad, setBad] = useState<[string, string] | null>(null)
  const [errs, setErrs] = useState(0)
  const wrong = useRef(new Set<string>())

  const tryPair = (tr: string | null, kk: string | null) => {
    if (!tr || !kk) return
    const ok = pairs.some((p) => p[0] === tr && p[1] === kk)
    if (ok) {
      sfx.match()
      const m = [...matched, tr, kk]
      setMatched(m)
      if (m.length === pairs.length * 2) setTimeout(() => onDone(errs, [...wrong.current]), 300)
    } else {
      sfx.wrong()
      setErrs((e) => e + 1)
      wrong.current.add(tr)
      setBad([tr, kk])
      setTimeout(() => setBad(null), 450)
    }
    setL(null)
    setR(null)
  }

  const cls = (v: string, selected: boolean) => {
    if (matched.includes(v)) return 'option good faded'
    if (bad?.includes(v)) return 'option bad'
    return `option${selected ? ' selected' : ''}`
  }

  return (
    <div className="grid2">
      <div className="col" style={{ gap: 10 }}>
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
      <div className="col" style={{ gap: 10 }}>
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
  )
}

// ---------- Нәтиже панелі ----------

export function Feedback({
  ok,
  praise,
  answer,
  note,
  look,
  onNext,
  nextLabel = t.continue,
}: {
  ok: boolean
  praise: string
  answer: string
  note?: string
  look: CatLook
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
          {note && <span className="small">{note}</span>}
        </div>
      </div>
      <button className={`btn wide${ok ? '' : ' red'}`} onClick={onNext}>
        {nextLabel}
      </button>
    </div>
  )
}

// ---------- Өзің жаз ----------

const TR_KEYS = ['ç', 'ğ', 'ı', 'İ', 'ö', 'ş', 'ü']

export function TypeAnswer({ value, setValue, locked, onEnter }: { value: string; setValue: (v: string) => void; locked: boolean; onEnter: () => void }) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div className="col" style={{ gap: 8 }}>
      <input
        ref={ref}
        className="input type-input"
        value={value}
        disabled={locked}
        autoFocus
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder={t.typePlaceholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value.trim()) onEnter()
        }}
      />
      <div className="tr-keys">
        {TR_KEYS.map((k) => (
          <button
            key={k}
            type="button"
            className="tr-key"
            disabled={locked}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setValue(value + k)
              ref.current?.focus()
            }}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  )
}

// ---------- Микрофон ----------

type MicState = 'idle' | 'listening' | 'ok' | 'no' | 'error'

/** Түрікше айтып жауап беру. Микрофон жоқ құрылғыда көрінбейді. */
export function MicButton({ target, onResult, label = t.micSay }: { target: string; onResult: (ok: boolean, heard: string) => void; label?: string }) {
  const [state, setState] = useState<MicState>('idle')
  const [heard, setHeard] = useState('')
  if (!canListen()) return null

  const go = async () => {
    setState('listening')
    setHeard('')
    try {
      const alts = await listenOnce('tr-TR')
      if (!alts.length) {
        setState('no')
        setHeard('')
        return
      }
      const r = judge(alts, target)
      setHeard(r.text)
      setState(r.ok ? 'ok' : 'no')
      if (r.ok) sfx.correct()
      else sfx.wrong()
      onResult(r.ok, r.text)
    } catch {
      setState('error')
    }
  }

  return (
    <div className="mic-wrap">
      <button className={`mic-btn ${state}`} onClick={go} disabled={state === 'listening'}>
        <span className="mic-ico">🎤</span>
        {state === 'listening' ? t.micListening : label}
      </button>
      {state === 'ok' && <span className="ok-text small">✓ {t.micHeard}: «{heard}»</span>}
      {state === 'no' && <span className="error small">{heard ? `${t.micHeard}: «${heard}» — ${t.micTryAgain}` : t.micNothing}</span>}
      {state === 'error' && <span className="error small">{t.micError}</span>}
    </div>
  )
}

// ---------- Жаңа сөз карточкасы ----------

export function WordCard({ w }: { w: Word }) {
  const ex = useMemo(() => exampleFor(w), [w])
  return (
    <div className="word-card pop">
      <span className="new-badge">✨ {t.newWord}</span>
      {w.emoji && <span className="word-emoji">{w.emoji}</span>}
      <button className="word-tr" onClick={() => speak(w.tr)}>
        {w.tr} <span className="speaker">🔊</span>
      </button>
      <span className="word-kk">{w.kk}</span>
      {w.cognate && <CognateBadge c={w.cognate} />}
      {ex && (
        <button className="word-example" onClick={() => speak(ex[0])}>
          <span>{ex[0]}</span>
          <span className="muted small">{ex[1]}</span>
        </button>
      )}
    </div>
  )
}

export function CognateBadge({ c, compact }: { c: NonNullable<Word['cognate']>; compact?: boolean }) {
  if (compact) return <span className={`cognate-chip ${c.kind}`} title={c.note}>{c.kind === 'same' ? '🔗' : '⚠️'}</span>
  return (
    <div className={`cognate ${c.kind}`}>
      <b>{c.kind === 'same' ? `🔗 ${t.cognateSame}: ${c.kk}` : `⚠️ ${t.cognateFalse}: ${c.kk}`}</b>
      {c.note && <span>{c.note}</span>}
    </div>
  )
}
