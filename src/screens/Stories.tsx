import { useState } from 'react'
import { STORIES, glossKey, splitWords, type Story } from '../data/stories'
import { wordByTr } from '../data/words'
import { t } from '../i18n/kk'
import { addXp } from '../lib/api'
import { sfx } from '../lib/sound'
import { speak } from '../lib/speech'
import { dayKey } from '../lib/store'

const READ_KEY = 'duo-stories-read'

function readLog(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(READ_KEY) ?? '{}') as Record<string, string>
  } catch {
    return {}
  }
}

const LEVELS = ['', 'Оңай', 'Орта', 'Қиын']

export function Stories({ onOpen }: { onOpen: (id: string) => void }) {
  const log = readLog()
  return (
    <div className="screen">
      <h2>📖 {t.storiesTitle}</h2>
      <p className="muted small" style={{ margin: 0 }}>
        {t.storiesHint}
      </p>
      <div className="col">
        {STORIES.map((s) => (
          <button
            key={s.id}
            className="card story-tile"
            onClick={() => {
              sfx.click()
              onOpen(s.id)
            }}
          >
            <span className="story-icon">{s.icon}</span>
            <span className="col" style={{ gap: 2, flex: 1, alignItems: 'flex-start' }}>
              <b>{s.title}</b>
              <span className={`level-tag l${s.level}`}>
                {'●'.repeat(s.level)}
                {'○'.repeat(3 - s.level)} {LEVELS[s.level]} · {s.lines.length} {t.sentences}
              </span>
            </span>
            {log[s.id] && <span className="ok-text">✓</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

export function StoryRead({ id, onBack }: { id: string; onBack: () => void }) {
  const story = STORIES.find((s) => s.id === id) as Story
  const [showKk, setShowKk] = useState(false)
  const [popup, setPopup] = useState<{ word: string; gloss: string; line: number } | null>(null)
  const [finished, setFinished] = useState(() => readLog()[id] === dayKey())

  const finish = () => {
    sfx.win()
    const log = readLog()
    // XP күніне бір рет беріледі
    if (log[id] !== dayKey()) void addXp(5, 3)
    log[id] = dayKey()
    try {
      localStorage.setItem(READ_KEY, JSON.stringify(log))
    } catch {
      /* бос */
    }
    setFinished(true)
  }

  return (
    <div className="screen story">
      <div className="lesson-top">
        <button className="icon-btn" onClick={onBack} aria-label={t.cancel}>
          ←
        </button>
        <h2 style={{ flex: 1 }}>
          {story.icon} {story.title}
        </h2>
      </div>

      <div className="seg">
        <button className={!showKk ? 'on' : ''} onClick={() => setShowKk(false)}>
          🇹🇷 {t.onlyTurkish}
        </button>
        <button className={showKk ? 'on' : ''} onClick={() => setShowKk(true)}>
          🇰🇿 {t.withTranslation}
        </button>
      </div>
      <p className="muted small" style={{ margin: 0 }}>
        {t.tapWordHint}
      </p>

      <div className="col story-text">
        {story.lines.map(([tr, kk], li) => (
          <div key={li} className="story-line">
            <button className="line-play" onClick={() => speak(tr)} aria-label={t.tapToListen}>
              🔊
            </button>
            <div className="col" style={{ gap: 2 }}>
              <p className="tr-line">
                {splitWords(tr).map((w, i) => {
                  const key = glossKey(w)
                  if (!key.trim()) return <span key={i}>{w}</span>
                  return (
                    <span
                      key={i}
                      className={`tw${popup?.line === li && popup.word === w ? ' on' : ''}`}
                      onClick={() => {
                        speak(w.replace(/[“”"«»]/g, ''))
                        setPopup({ word: w, gloss: story.gloss[key] ?? wordByTr(key)?.kk ?? '—', line: li })
                      }}
                    >
                      {w}
                    </span>
                  )
                })}
              </p>
              {popup?.line === li && (
                <span className="gloss pop">
                  <b>{popup.word.replace(/[.,!?;:“”"«»]/g, '')}</b> — {popup.gloss}
                </span>
              )}
              {showKk && <span className="muted small">{kk}</span>}
            </div>
          </div>
        ))}
      </div>

      <button className="btn blue wide" onClick={() => speak(story.lines.map((l) => l[0]).join(' '))}>
        🔊 {t.listenAll}
      </button>
      {finished ? (
        <p className="center ok-text">✓ {t.storyDone}</p>
      ) : (
        <button className="btn wide" onClick={finish}>
          {t.storyFinish}
        </button>
      )}
    </div>
  )
}
