import { useEffect, useState } from 'react'
import { Clapperboard, Lightbulb, Play, Square, Target, Trophy, Volume2, X } from '../components/Icon'
import { PHRASES, type Phrase } from '../data/phrases'
import { t } from '../i18n/kk'
import { addXp } from '../lib/api'
import { shuffle } from '../lib/exercises'
import { sfx } from '../lib/sound'
import { speak, speakAs, speakScene, stopSpeaking } from '../lib/speech'
import { dayKey } from '../lib/store'

const QUIZ_KEY = 'duo-phrases-quiz'
const dirOf = (v: 'f' | 'm') => (v === 'f' ? 'female' : 'male') as 'female' | 'male'

/** Репликадағы тіркесті белгілеу (бас әріп, тыныс белгісіне қарамай) */
function Highlight({ text, phrase }: { text: string; phrase: string }) {
  const core = phrase.replace(/[.!?]+$/, '')
  const i = text.toLocaleLowerCase('tr').indexOf(core.toLocaleLowerCase('tr'))
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <mark className="phrase-mark">{text.slice(i, i + core.length)}</mark>
      {text.slice(i + core.length)}
    </>
  )
}

/** Сериал сахнасы: сипаттама, кейіпкерлер, чат түріндегі репликалар */
function SceneView({ p }: { p: Phrase }) {
  const [playing, setPlaying] = useState(-1)
  const { scene } = p
  useEffect(() => () => stopSpeaking(), [])
  const playAll = () => {
    if (playing >= 0) {
      stopSpeaking()
      return setPlaying(-1)
    }
    speakScene(
      scene.lines.map(([who, tr]) => ({ text: tr, dir: dirOf(scene.cast[who][1]) })),
      setPlaying,
    )
  }
  return (
    <div className="col pop" style={{ gap: 10 }}>
      <div className="scene-place">
        <Clapperboard size={16} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>{scene.place}</span>
      </div>
      <div className="scene-chat">
        {scene.lines.map(([who, tr, kk], j) => {
          const [name, voice] = scene.cast[who]
          const right = who % 2 === 1
          return (
            <button
              key={j}
              className={`scene-line ${right ? 'right' : 'left'} ${voice}${playing === j ? ' now' : ''}`}
              onClick={() => {
                setPlaying(-1)
                speakAs(tr, dirOf(voice))
              }}
            >
              <span className="scene-name">{name}</span>
              <span className="scene-tr">
                <Highlight text={tr} phrase={p.tr} />
              </span>
              <span className="muted small">{kk}</span>
            </button>
          )
        })}
      </div>
      <button className="btn blue small" onClick={playAll}>
        {playing >= 0 ? <Square size={16} /> : <Play size={16} />} {playing >= 0 ? t.sceneStop : t.scenePlay}
      </button>
      <span className="small phrase-note ih" style={{ alignItems: 'flex-start' }}>
        <Lightbulb size={16} style={{ flexShrink: 0, marginTop: 2 }} /> {p.note}
      </span>
    </div>
  )
}

/** Телехикаялардағы ауызекі тіркестер: тізім + шағын тест */
export function Phrases() {
  const [open, setOpen] = useState<number | null>(null)
  const [quiz, setQuiz] = useState(false)

  if (quiz) return <PhraseQuiz onClose={() => setQuiz(false)} />

  return (
    <div className="col">
      <p className="muted small" style={{ margin: 0 }}>
        {t.phrasesHint}
      </p>
      <button className="btn blue wide" onClick={() => setQuiz(true)}>
        <Target size={20} /> {t.phrasesQuiz}
      </button>
      {PHRASES.map((p, i) => (
        <div key={p.tr} className={`card phrase${open === i ? ' open' : ''}`}>
          <button
            className="phrase-head"
            onClick={() => {
              sfx.click()
              speak(p.tr)
              setOpen(open === i ? null : i)
            }}
          >
            <span className="phrase-emoji">{p.emoji}</span>
            <span className="col" style={{ gap: 2, flex: 1, alignItems: 'flex-start', textAlign: 'left' }}>
              <b className="phrase-tr">{p.tr}</b>
              <span className="muted small">{p.kk}</span>
            </span>
            <span className="muted">{open === i ? '▴' : '▾'}</span>
          </button>
          {open === i && <SceneView p={p} />}
        </div>
      ))}
    </div>
  )
}

function PhraseQuiz({ onClose }: { onClose: () => void }) {
  const [qs] = useState(() =>
    shuffle([...PHRASES])
      .slice(0, 6)
      .map((p, i) => {
        // Кезектесіп: тіркес → мағынасы, жағдай → тіркес
        const byNote = i % 2 === 1
        const others = shuffle(PHRASES.filter((x) => x !== p)).slice(0, 3)
        return byNote
          ? { prompt: p.note, speak: undefined, answer: p.tr, options: shuffle([p.tr, ...others.map((x) => x.tr)]), audio: p.tr }
          : { prompt: p.tr, speak: p.tr, answer: p.kk, options: shuffle([p.kk, ...others.map((x) => x.kk)]), audio: p.tr }
      }),
  )
  const [i, setI] = useState(0)
  const [sel, setSel] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [over, setOver] = useState(false)

  if (over)
    return (
      <div className="card col center pop">
        <span className="result-ico">{score === qs.length ? <Trophy size={44} /> : <Clapperboard size={44} />}</span>
        <h3 style={{ margin: 0 }}>{t.quizResult(score, qs.length)}</h3>
        <button className="btn wide" onClick={onClose}>
          {t.continue}
        </button>
      </div>
    )

  const q = qs[i]
  return (
    <div className="card col pop" key={i}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="muted small">
          {i + 1}/{qs.length}
        </span>
        <button className="link-btn" onClick={onClose} aria-label="✕">
          <X size={20} />
        </button>
      </div>
      <span className="muted small">{q.speak ? t.phrasesQMeaning : t.phrasesQWhich}</span>
      <button className="phrase-q" onClick={() => q.speak && speak(q.speak)}>
        {q.prompt} {q.speak && <Volume2 size={18} style={{ verticalAlign: '-3px' }} />}
      </button>
      <div className="col" style={{ gap: 8 }}>
        {q.options.map((o) => {
          const cls = sel === null ? '' : o === q.answer ? ' good' : o === sel ? ' bad' : ' faded'
          return (
            <button
              key={o}
              className={`option${cls}`}
              disabled={sel !== null}
              onClick={() => {
                setSel(o)
                speak(q.audio)
                if (o === q.answer) {
                  sfx.correct()
                  setScore((x) => x + 1)
                } else sfx.wrong()
              }}
            >
              {o}
            </button>
          )
        })}
      </div>
      {sel !== null && (
        <button
          className="btn wide"
          onClick={() => {
            sfx.click()
            setSel(null)
            if (i + 1 < qs.length) return setI(i + 1)
            // Күніне бір рет XP
            try {
              if (localStorage.getItem(QUIZ_KEY) !== dayKey()) {
                void addXp(5 + score, 3)
                localStorage.setItem(QUIZ_KEY, dayKey())
              }
            } catch {
              /* бос */
            }
            sfx.win()
            setOver(true)
          }}
        >
          {t.continue}
        </button>
      )}
    </div>
  )
}
