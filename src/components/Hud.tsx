import { t } from '../i18n/kk'
import { levelOf, sharedStreak, useStore, activePlayer } from '../lib/store'
import { PixelCat } from './PixelCat'

export function Hud({ onCat }: { onCat: () => void }) {
  const me = useStore(activePlayer)
  const players = useStore((s) => s.players)
  if (!me) return null
  const lvl = levelOf(me.xp)
  const streak = sharedStreak(players)

  return (
    <div className="hud">
      <button onClick={onCat} style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer' }} aria-label={t.editPlayer}>
        <PixelCat look={me.cat} size={44} />
      </button>
      <div className="col" style={{ gap: 2, flex: 1, minWidth: 0 }}>
        <div className="row" style={{ gap: 6, fontSize: 16 }}>
          <span>{me.name}</span>
          <span className="muted">· {t.level} {lvl.level}</span>
        </div>
        <div className="bar xp" style={{ height: 12 }}>
          <i style={{ width: `${lvl.progress * 100}%` }} />
        </div>
      </div>
      <span className="chip" title={t.streakTogether} style={{ color: streak > 0 ? 'var(--orange)' : 'var(--muted)' }}>
        🔥{streak}
      </span>
      <span className="chip" style={{ color: 'var(--yellow)' }}>🪙{me.coins}</span>
    </div>
  )
}
