import { useMemo, useState } from 'react'
import { BADGES, badgeById, type Badge } from '../data/achievements'
import { t } from '../i18n/kk'
import { achievementCtx } from '../lib/achievements'
import { sfx } from '../lib/sound'
import { setState, useStore } from '../lib/store'
import { Coin, Lock, Trophy } from './Icon'

function BadgeIcon({ b, on, size = 52 }: { b: Badge; on: boolean; size?: number }) {
  const I = b.icon
  return (
    <span
      className={`badge-ico${on ? ' on' : ''}`}
      style={{ width: size, height: size, ...(on ? { background: b.color, boxShadow: `0 3px 0 color-mix(in srgb, ${b.color} 70%, #000)` } : null) }}
    >
      {on ? <I size={size * 0.5} color="#fff" strokeWidth={2.2} /> : <Lock size={size * 0.38} />}
    </span>
  )
}

/** Профильдегі жетістіктер тізімі */
export function Badges() {
  const ach = useStore((s) => s.achievements)
  // Прогресс үшін деректерге тәуелді қайта есептейміз
  const words = useStore((s) => s.words)
  const days = useStore((s) => s.days)
  const ctx = useMemo(() => achievementCtx(), [words, days, ach])
  const [open, setOpen] = useState<string | null>(null)
  if (!ach) return null
  const got = BADGES.filter((b) => ach.includes(b.id)).length
  return (
    <section className="card col">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h3 className="ih" style={{ margin: 0 }}>
          <Trophy size={22} /> {t.badgesTitle}
        </h3>
        <span className="muted small">
          {got}/{BADGES.length}
        </span>
      </div>
      <div className="badge-grid">
        {BADGES.map((b) => {
          const on = ach.includes(b.id)
          const [v, n] = b.goal(ctx)
          return (
            <button key={b.id} className={`badge${open === b.id ? ' sel' : ''}`} onClick={() => setOpen(open === b.id ? null : b.id)}>
              <BadgeIcon b={b} on={on} />
              <span className={`badge-name${on ? '' : ' muted'}`}>{b.name}</span>
              {!on && n > 1 && (
                <span className="badge-bar">
                  <i style={{ width: `${(v / n) * 100}%` }} />
                </span>
              )}
            </button>
          )
        })}
      </div>
      {open && (() => {
        const b = badgeById(open)!
        const [v, n] = b.goal(ctx)
        const on = ach.includes(b.id)
        return (
          <div className="badge-detail pop">
            <b>{b.name}</b>
            <span className="small">{b.desc}</span>
            <span className="small muted ih">
              {on ? t.badgeGot : `${v} / ${n}`} · <Coin size={14} /> {b.reward}
            </span>
          </div>
        )
      })()}
    </section>
  )
}

/** Жаңа жетістік алынғанда шығатын терезе */
export function BadgeModal() {
  const list = useStore((s) => s.newBadges)
  const gifts = useStore((s) => s.gifts)
  const first = list[0]
  const b = first && badgeById(first.id)
  if (!b || gifts.length) return null
  return (
    <div className="sheet-back center-modal">
      <div className="card col center gift-modal pop">
        <span className="muted small">{t.badgeNew}</span>
        <BadgeIcon b={b} on size={96} />
        <h2 style={{ margin: 0 }}>{b.name}</h2>
        <span className="muted">{b.desc}</span>
        <span className="chip coin big">
          <Coin size={22} /> +{first.reward}
        </span>
        <button
          className="btn wide"
          onClick={() => {
            sfx.coin()
            setState((s) => ({ newBadges: s.newBadges.slice(1) }))
          }}
        >
          {t.continue}
        </button>
      </div>
    </div>
  )
}
