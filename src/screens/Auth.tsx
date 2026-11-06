import { useState } from 'react'
import { Cat } from '../components/Cat'
import { t } from '../i18n/kk'
import { signIn, signUp } from '../lib/api'
import { sfx, unlockAudio } from '../lib/sound'

export function Auth({ onSignedUp }: { onSignedUp: () => void }) {
  const [mode, setMode] = useState<'in' | 'up'>('up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    unlockAudio()
    setBusy(true)
    setError(null)
    const err = mode === 'up' ? await signUp(name.trim(), email.trim(), password) : await signIn(email.trim(), password)
    setBusy(false)
    if (err) {
      sfx.wrong()
      setError(err)
    } else {
      sfx.win()
      if (mode === 'up') onSignedUp()
    }
  }

  const valid = email.includes('@') && password.length >= 6 && (mode === 'in' || name.trim().length > 0)

  return (
    <div className="screen auth">
      <div className="hero">
        <div className="duo-cats">
          <Cat look={{ fur: 'ginger', eyes: 'green', char: 'classic', ear: 'ear-ring', cheek: 'blush' }} size={120} bounce />
          <span className="heart beat">♥</span>
          <Cat look={{ fur: 'gray', eyes: 'blue', char: 'smart', ear: 'ear-ribbon', cheek: 'heart-paint' }} size={120} bounce flip />
        </div>
        <h1 className="logo">{t.appName}</h1>
        <p className="muted">{t.tagline} 🇰🇿 → 🇹🇷</p>
      </div>

      <form className="card col" onSubmit={submit}>
        <h2>{mode === 'up' ? t.signUp : t.signIn}</h2>
        {mode === 'up' && (
          <label className="field">
            <span>{t.yourName}</span>
            <input className="input" value={name} maxLength={20} placeholder={t.namePlaceholder} onChange={(e) => setName(e.target.value)} autoComplete="nickname" />
          </label>
        )}
        <label className="field">
          <span>{t.email}</span>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" autoCapitalize="off" />
        </label>
        <label className="field">
          <span>{t.password}</span>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'up' ? 'new-password' : 'current-password'}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn wide" disabled={!valid || busy}>
          {busy ? t.loading : mode === 'up' ? t.signUp : t.signIn}
        </button>
        <button
          type="button"
          className="link-btn"
          onClick={() => {
            setMode(mode === 'up' ? 'in' : 'up')
            setError(null)
          }}
        >
          {mode === 'up' ? t.haveAccount : t.noAccount}
        </button>
      </form>
    </div>
  )
}
