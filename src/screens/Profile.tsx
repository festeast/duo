import { Cat } from '../components/Cat'
import { VoiceSettings } from '../components/VoiceSettings'
import { BANDS } from '../data/words'
import { NEW_OPTIONS, estimatedBand, getNewPerDay, setNewPerDay } from '../lib/srs'
import { useState } from 'react'
import { t } from '../i18n/kk'
import { resetPlacement, signOut } from '../lib/api'
import { sfx } from '../lib/sound'
import { levelOf, setState, streakOf, toast, useStore } from '../lib/store'

export function Profile({ onEdit, onPlacement }: { onEdit: () => void; onPlacement: () => void }) {
  const [perDay, setPerDay] = useState(getNewPerDay())
  const me = useStore((s) => s.profile)
  const words = useStore((s) => s.words)
  const days = useStore((s) => s.days)
  const sound = useStore((s) => s.sound)
  if (!me) return null
  const lvl = levelOf(me.xp)
  const learned = Object.values(words).filter((w) => w.stage >= 1).length
  const unverified = Object.values(words).filter((w) => w.stage === 0).length

  return (
    <div className="screen">
      <div className="cat-stage">
        <Cat look={me.cat} size={160} bounce />
        <h2>{me.name}</h2>
        <span className="muted">
          {t.level} {lvl.level} · {lvl.name}
        </span>
        <div className="bar xp" style={{ width: '70%' }}>
          <i style={{ width: `${lvl.progress * 100}%` }} />
        </div>
      </div>

      <div className="stat-row">
        <div className="stat">
          <span className="muted small">{t.totalXp}</span>
          <b className="xp-text">{me.xp}</b>
        </div>
        <div className="stat">
          <span className="muted small">{t.wordsLearned}</span>
          <b>{learned}</b>
        </div>
        <div className="stat">
          <span className="muted small">🔥 {t.bestStreak}</span>
          <b className="fire-text">{streakOf(days)}</b>
        </div>
      </div>

      <div className="card row">
        <span className="muted small" style={{ flex: 1 }}>
          {t.myCode}
        </span>
        <b className="friend-code small-code">{me.friend_code}</b>
      </div>

      <div className="card col">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="muted small">{t.myLevel}</span>
          <b className="level-badge small">{estimatedBand(words) >= 0 ? BANDS[estimatedBand(words)].label : t.placeZero}</b>
        </div>
        <span className="muted small">{t.newPerDay}</span>
        <div className="seg three">
          {NEW_OPTIONS.map((n) => (
            <button
              key={n}
              className={perDay === n ? 'on' : ''}
              onClick={() => {
                sfx.click()
                setNewPerDay(n)
                setPerDay(n)
              }}
            >
              {n} {t.wordsShort}
            </button>
          ))}
        </div>
        <button className="link-btn" onClick={onPlacement}>
          🎯 {t.placeRetake}
        </button>
        {unverified > 0 && (
          <button
            className="link-btn danger"
            onClick={async () => {
              if (!confirm(t.placeResetConfirm)) return
              const n = await resetPlacement()
              toast(t.placeResetDone(n))
            }}
          >
            🗑️ {t.placeReset} ({unverified})
          </button>
        )}
      </div>

      <button className="btn blue wide" onClick={onEdit}>
        🎨 {t.editCat}
      </button>
      <button
        className="btn ghost wide"
        onClick={() => {
          setState({ sound: !sound })
          sfx.click()
        }}
      >
        {sound ? '🔊' : '🔇'} {t.sound}: {sound ? t.on : t.off}
      </button>
      <VoiceSettings />
      <div className="spacer" />
      <button className="btn ghost wide" onClick={() => void signOut()}>
        {t.signOut}
      </button>
    </div>
  )
}
