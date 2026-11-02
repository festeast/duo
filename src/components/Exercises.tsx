import { useMemo, useState } from 'react'
import type { Pair } from '../data/course'
import { t } from '../i18n/kk'
import { shuffle } from '../lib/exercises'
import { sfx } from '../lib/sound'
import { canSpeak, speak } from '../lib/speech'

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

export function Match({ pairs, onDone }: { pairs: Pair[]; onDone: (mistakes: number) => void }) {
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
      if (m.length === pairs.length * 2) setTimeout(() => onDone(errs), 300)
    } else {
      sfx.wrong()
      setErrs((e) => e + 1)
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
