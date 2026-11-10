import { levelOf, streakOf, useStore } from '../lib/store'
import { CloudUpload, Coin, Flame, WifiOff } from './Icon'
import { t } from '../i18n/kk'
import { Cat } from './Cat'

export function Header({ onCat }: { onCat: () => void }) {
  const me = useStore((s) => s.profile)
  const days = useStore((s) => s.days)
  const online = useStore((s) => s.online)
  const pending = useStore((s) => s.pending)
  if (!me) return null
  const lvl = levelOf(me.xp)
  const streak = streakOf(days)

  return (
    <header className="header">
      <button className="avatar-btn" onClick={onCat} aria-label={t.editCat}>
        <Cat look={me.cat} size={46} />
      </button>
      <div className="col" style={{ gap: 4, flex: 1, minWidth: 0 }}>
        <div className="row" style={{ gap: 6, fontSize: 15 }}>
          <b className="ellipsis">{me.name}</b>
          <span className="muted">
            · {t.level} {lvl.level}
          </span>
        </div>
        <div className="bar xp small">
          <i style={{ width: `${lvl.progress * 100}%` }} />
        </div>
      </div>
      {(!online || pending > 0) && (
        <span className="chip offline-chip" title={pending ? t.offlineSaved(pending) : t.offline}>
          {online ? <CloudUpload size={18} /> : <WifiOff size={18} />}
        </span>
      )}
      <span className={`chip ${streak > 0 ? 'fire' : ''}`} title={t.streak}>
        <Flame size={20} off={streak === 0} /> {streak}
      </span>
      <span className="chip coin">
        <Coin size={20} /> {me.coins}
      </span>
    </header>
  )
}
