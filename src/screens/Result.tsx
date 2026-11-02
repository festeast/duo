import { useEffect } from 'react'
import { PixelCat } from '../components/PixelCat'
import { t } from '../i18n/kk'
import { sfx } from '../lib/sound'
import { activePlayer, levelOf, useStore } from '../lib/store'
import type { LessonResult } from './Lesson'

export function Result({ r, onDone }: { r: LessonResult; onDone: () => void }) {
  const me = useStore(activePlayer)!
  const lvl = levelOf(me.xp)

  useEffect(() => {
    sfx.win()
    const id = setTimeout(() => sfx.coin(), 900)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="screen center" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ color: 'var(--yellow)' }} className="pop">{t.lessonComplete}</h1>
      <div style={{ fontSize: 48, color: 'var(--yellow)', letterSpacing: 8 }}>
        {'★'.repeat(r.stars)}
        <span className="muted">{'☆'.repeat(3 - r.stars)}</span>
      </div>
      <PixelCat look={me.cat} size={160} mood="happy" bounce />

      <div className="row" style={{ gap: 16 }}>
        <div className="px-box col" style={{ gap: 4, minWidth: 92 }}>
          <span className="muted" style={{ fontSize: 16 }}>XP</span>
          <h2 style={{ color: 'var(--cyan)' }}>+{r.xp}</h2>
        </div>
        <div className="px-box col" style={{ gap: 4, minWidth: 92 }}>
          <span className="muted" style={{ fontSize: 16 }}>🪙 {t.coins}</span>
          <h2 style={{ color: 'var(--yellow)' }}>+{r.coins}</h2>
        </div>
        <div className="px-box col" style={{ gap: 4, minWidth: 92 }}>
          <span className="muted" style={{ fontSize: 16 }}>{t.accuracy}</span>
          <h2 style={{ color: 'var(--green-hi)' }}>{r.accuracy}%</h2>
        </div>
      </div>

      {r.levelUp && (
        <div className="px-box pop" style={{ background: 'var(--purple)' }}>
          <h3 className="blink" style={{ color: 'var(--yellow)' }}>▲ {t.levelUp}</h3>
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
