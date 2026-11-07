import { useEffect, useState } from 'react'
import { t } from '../i18n/kk'
import { disablePush, enablePush, pushState, testPush, type PushState } from '../lib/push'
import { sfx } from '../lib/sound'
import { toast, useStore } from '../lib/store'

/** Профильдегі «Еске салу» бөлімі */
export function Reminders() {
  const me = useStore((s) => s.profile)
  const [state, setState] = useState<PushState | null>(null)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    void pushState().then(setState)
  }, [])
  if (!me || state === null) return null

  const run = async (fn: () => Promise<PushState>) => {
    sfx.click()
    setBusy(true)
    try {
      setState(await fn())
    } catch {
      toast(t.errNetwork)
    }
    setBusy(false)
  }

  return (
    <div className="card col">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="muted small">🔔 {t.remindTitle}</span>
        {state === 'on' && <span className="ok-text small">✓ {t.on}</span>}
      </div>
      <span className="small">{t.remindHint}</span>
      {state === 'needs-install' && <span className="small muted">📲 {t.remindInstall}</span>}
      {state === 'unsupported' && <span className="small muted">{t.remindUnsupported}</span>}
      {state === 'denied' && <span className="small muted">{t.remindDenied}</span>}
      {state === 'off' && (
        <button className="btn blue wide" disabled={busy} onClick={() => run(() => enablePush(me.id))}>
          🔔 {t.remindOn}
        </button>
      )}
      {state === 'on' && (
        <div className="row">
          <button
            className="btn ghost"
            style={{ flex: 1 }}
            disabled={busy}
            onClick={async () => {
              sfx.click()
              try {
                const n = await testPush()
                toast(n ? t.remindTestSent : t.remindTestNone)
              } catch {
                toast(t.remindTestFail)
              }
            }}
          >
            {t.remindTest}
          </button>
          <button className="btn ghost" style={{ flex: 1 }} disabled={busy} onClick={() => run(disablePush)}>
            {t.remindOff}
          </button>
        </div>
      )}
    </div>
  )
}
