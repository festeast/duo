import { PixelCat } from '../components/PixelCat'
import { t } from '../i18n/kk'
import { sfx, unlockAudio } from '../lib/sound'
import { useStore } from '../lib/store'

const STARS = Array.from({ length: 30 }, () => ({ l: Math.random() * 100, t: Math.random() * 100, d: Math.random() * 2 }))

export function Title({ onStart }: { onStart: () => void }) {
  const players = useStore((s) => s.players)
  const a = players[0]?.cat ?? { fur: 'ginger', eyes: 'green' }
  const b = players[1]?.cat ?? { fur: 'gray', eyes: 'blue', head: 'bow' }

  return (
    <div
      className="screen title-screen"
      onClick={() => {
        unlockAudio()
        sfx.win()
        onStart()
      }}
    >
      <div className="stars-bg">
        {STARS.map((s, i) => (
          <i key={i} style={{ left: `${s.l}%`, top: `${s.t}%`, animationDelay: `${s.d}s` }} />
        ))}
      </div>
      <div className="logo">{t.appName}</div>
      <p className="muted" style={{ fontSize: 22 }}>{t.tagline}</p>
      <div className="duo-cats">
        <PixelCat look={a} size={112} bounce />
        <span className="heart">♥</span>
        <PixelCat look={b} size={112} bounce flip />
      </div>
      <p style={{ fontSize: 26, color: 'var(--yellow)' }} className="blink">
        ▶ {t.pressStart} ◀
      </p>
      <p className="muted" style={{ fontSize: 16 }}>{t.tapToStart}</p>
      <p className="muted" style={{ fontSize: 16 }}>🇰🇿 → 🇹🇷</p>
    </div>
  )
}
