import { useEffect } from 'react'
import { Cat } from '../components/Cat'
import { t } from '../i18n/kk'
import { sfx } from '../lib/sound'
import { levelOf, useStore } from '../lib/store'
import type { LessonResult } from './Lesson'

export function Result({ r, onDone }: { r: LessonResult; onDone: () => void }) {
  const me = useStore((s) => s.profile)!
  const lvl = levelOf(me.xp)

  useEffect(() => {
    sfx.win()
    const id = setTimeout(() => sfx.coin(), 900)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="screen center result">
      <div className="confetti" aria-hidden>
        {Array.from({ length: 18 }, (_, i) => (
          <i key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 6) * 0.15}s`, ['--h' as string]: `${(i * 47) % 360}` }} />
        ))}
      </div>
      <h1 className="pop">{r.title}</h1>
      <div className="big-stars">
        {[1, 2, 3].map((n) => (
          <span key={n} className={n <= r.stars ? 'on pop' : ''} style={{ animationDelay: `${n * 0.15}s` }}>
            ★
          </span>
        ))}
      </div>
      <Cat look={me.cat} size={170} mood="happy" bounce />

      <div className="stat-row">
        <div className="stat">
          <span className="muted small">XP</span>
          <b className="xp-text">+{r.xp}</b>
        </div>
        <div className="stat">
          <span className="muted small">🪙 {t.coins}</span>
          <b className="coin-text">+{r.coins}</b>
        </div>
        <div className="stat">
          <span className="muted small">{t.accuracy}</span>
          <b className="ok-text">{r.accuracy}%</b>
        </div>
      </div>

      {r.levelUp && (
        <div className="card level-up pop">
          <h3>🎉 {t.levelUp}</h3>
          <span>
            {t.level} {lvl.level}: {lvl.name}
          </span>
        </div>
      )}

      <button className="btn wide" onClick={onDone}>
        {t.continue}
      </button>
    </div>
  )
}
