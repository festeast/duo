import { useMemo, useState } from 'react'
import { PenLine, Target, Volume2, X } from '../components/Icon'
import { Cat } from '../components/Cat'
import { BANDS, type Word } from '../data/words'
import { t } from '../i18n/kk'
import { saveWords } from '../lib/api'
import { checkTyped, shuffle } from '../lib/exercises'
import { TypeAnswer } from '../components/Exercises'
import { sfx } from '../lib/sound'
import { speak, stopSpeaking } from '../lib/speech'
import { placementStates, type WordState } from '../lib/srs'
import { markPlaced } from '../lib/placement'
import { useStore } from '../lib/store'

// Деңгей тесті: әр деңгейден 6 сұрақ, 5-еуіне дұрыс жауап берсең — келесі деңгейге өтесің.
// A1+ деңгейінен басталады: өтсең жоғары көтерілеміз, өтпесең A1-ді тексереміз.
// Қазақшаға ұқсас сөздер (су, көз…) тестке кірмейді — оларды болжау тым оңай.
const PER_BAND = 6
const PASS = 5
const START = 1

type Q = { word: Word; dir: 'tr-kk' | 'kk-tr' | 'type'; options: string[]; answer: string }

function makeQuestions(band: number): Q[] {
  const pool = BANDS[band].words.filter((w) => w.cognate?.kind !== 'same' && w.tr.length >= 3)
  const words = shuffle(pool).slice(0, PER_BAND)
  return words.map((w, i) => {
    // Көбіне қазақшадан түрікшеге (бұл қиынырақ); B1-ден бастап екі сұрақты өзің жазасың
    const dir: Q['dir'] = band >= 3 && i >= PER_BAND - 2 ? 'type' : i % 3 === 0 ? 'tr-kk' : 'kk-tr'
    const answer = dir === 'tr-kk' ? w.kk : w.tr
    if (dir === 'type') return { word: w, dir, answer, options: [] }
    const field = (x: Word) => (dir === 'tr-kk' ? x.kk : x.tr)
    // Алдағыш нұсқалар: бір әріптен басталатын немесе ұзындығы ұқсас сөздер
    const similar = pool.filter((x) => x.tr !== w.tr && (x.tr[0] === w.tr[0] || Math.abs(x.tr.length - w.tr.length) <= 1))
    const others = shuffle(similar.length >= 3 ? similar : pool.filter((x) => x.tr !== w.tr))
      .map(field)
      .filter((x, j, arr) => x !== answer && arr.indexOf(x) === j)
      .slice(0, 3)
    return { word: w, dir, answer, options: shuffle([answer, ...others]) }
  })
}

export function Placement({ onDone }: { onDone: () => void }) {
  const me = useStore((s) => s.profile)!
  const [band, setBand] = useState(START)
  const [qs, setQs] = useState<Q[]>(() => makeQuestions(START))
  const [i, setI] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [results, setResults] = useState<Record<number, boolean>>({}) // деңгей → өтті ме
  const [wrong] = useState(() => new Set<string>())
  const [right] = useState(() => new Set<string>())
  const [flash, setFlash] = useState<string | null>(null)
  const [done, setDone] = useState<number | null>(null) // өтілген деңгейлер саны
  const [saving, setSaving] = useState(false)
  const [typed, setTyped] = useState('')
  const asked = useMemo(() => Object.keys(results).length * PER_BAND + i, [results, i])

  const q = qs[i]

  const finishBand = (ok: boolean) => {
    const r = { ...results, [band]: ok }
    setResults(r)
    let next: number | null = null
    if (ok && band + 1 < BANDS.length && r[band + 1] === undefined) next = band + 1
    else if (!ok && band > 0 && r[band - 1] === undefined && band === START) next = band - 1
    if (next === null) {
      // Төменнен бастап қатарынан өтілген деңгейлер
      let passed = 0
      while (passed < BANDS.length && (r[passed] ?? (passed < START && r[START]))) passed++
      setDone(passed)
      sfx.win()
      return
    }
    setBand(next)
    setQs(makeQuestions(next))
    setI(0)
    setCorrect(0)
  }

  const answer = (opt: string | null) => {
    if (flash) return
    const ok = q.dir === 'type' ? opt !== null && checkTyped(opt, q.answer) !== 'wrong' : opt === q.answer
    setTyped('')
    ;(ok ? right : wrong).add(q.word.tr)
    if (ok) sfx.correct()
    else sfx.wrong()
    setFlash(opt ?? '∅')
    setTimeout(() => {
      stopSpeaking()
      setFlash(null)
      const c = correct + (ok ? 1 : 0)
      const remaining = PER_BAND - (i + 1)
      // Нәтиже анық болса — деңгейді ерте аяқтаймыз
      if (c >= PASS) return finishBand(true)
      if (c + remaining < PASS) return finishBand(false)
      setCorrect(c)
      setI(i + 1)
    }, q.dir === 'type' && !ok ? 1700 : 550)
  }

  if (done !== null) {
    const label = done === 0 ? t.placeZero : BANDS[done - 1].label
    const updates: Record<string, WordState> = done > 0 ? placementStates(done, wrong) : {}
    const known = Object.keys(updates).length
    return (
      <div className="screen center" style={{ justifyContent: 'center' }}>
        <Cat look={me.cat} size={150} mood="happy" bounce />
        <h1>{t.placeResult}</h1>
        <div className="level-badge pop">{label}</div>
        <p className="muted" style={{ margin: 0 }}>
          {done === 0 ? t.placeZeroText : t.placeKnown(known)}
        </p>
        <button
          className="btn wide"
          disabled={saving}
          onClick={async () => {
            setSaving(true)
            if (known) await saveWords(updates)
            markPlaced()
            onDone()
          }}
        >
          {saving ? t.loading : t.placeStart}
        </button>
      </div>
    )
  }

  return (
    <div className="screen">
      <div className="lesson-top">
        <button className="icon-btn" aria-label={t.cancel} onClick={onDone}>
          <X size={26} />
        </button>
        <div className="bar xp">
          <i style={{ width: `${Math.min(100, (asked / 24) * 100)}%` }} />
        </div>
        <span className="level-tag l2">{BANDS[band].id}</span>
      </div>

      <h3 className="ex-title ih">
        <Target size={24} className="ih-accent" /> {t.placeTitle}
      </h3>
      <p className="muted small" style={{ margin: 0 }}>
        {t.placeHint}
      </p>

      <div key={`${band}-${i}`} className="col pop" style={{ flex: 1, gap: 14 }}>
        <div className="card row" style={{ justifyContent: 'space-between' }}>
          <span className="prompt">{q.dir === 'tr-kk' ? q.word.tr : q.word.kk}</span>
          {q.dir === 'tr-kk' && (
            <button className="speak-btn" onClick={() => speak(q.word.tr)} aria-label={t.tapToListen}>
              <Volume2 size={22} />
            </button>
          )}
        </div>
        <div className="spacer" />
        {q.dir === 'type' && (
          <>
            <span className="muted small ih">
              <PenLine size={16} /> {t.typeTitle}
            </span>
            <TypeAnswer value={typed} setValue={setTyped} locked={!!flash} onEnter={() => answer(typed)} />
            {flash && <span className="muted">{t.correctAnswer} <b>{q.answer}</b></span>}
            <button className="btn wide" disabled={!typed.trim() || !!flash} onClick={() => answer(typed)}>
              {t.check}
            </button>
          </>
        )}
        <div className="col" style={{ gap: 10 }}>
          {q.options.map((o) => (
            <button
              key={o}
              className={`option${flash && o === q.answer ? ' good' : flash === o ? ' bad' : ''}`}
              onClick={() => answer(o)}
            >
              {o}
            </button>
          ))}
          <button className="option dont-know" onClick={() => answer(null)}>
            {t.dontKnow}
          </button>
        </div>
      </div>
    </div>
  )
}
