import { useEffect, useState } from 'react'
import { Bell, Check } from './Icon'
import { t } from '../i18n/kk'
import { disablePush, enablePush, pushState, testPush, type PushState } from '../lib/push'
import { sfx } from '../lib/sound'
import { toast, useStore } from '../lib/store'

/** Профильдегі «Еске салу» бөлімі */
export function Reminders() {
  const me = useStore((s) => s.profile)
  const [state, setState] = useState<PushState | null>(null)
  const [busy, setBusy] = useState(false)
  const [diag, setDiag] = useState('')
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
        <span className="muted small ih">
          <Bell size={16} /> {t.remindTitle}
        </span>
        {state === 'on' && (
          <span className="ok-text small ih">
            <Check size={16} /> {t.on}
          </span>
        )}
      </div>
      <span className="small">{t.remindHint}</span>
      {state === 'needs-install' && <span className="small muted">{t.remindInstall}</span>}
      {state === 'unsupported' && <span className="small muted">{t.remindUnsupported}</span>}
      {state === 'denied' && <span className="small muted">{t.remindDenied}</span>}
      {state === 'off' && (
        <button className="btn blue wide" disabled={busy} onClick={() => run(() => enablePush(me.id))}>
          <Bell size={18} /> {t.remindOn}
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
              setDiag('')
              try {
                const r = await testPush(me.id)
                if (r.sent) toast(t.remindTestSent)
                else {
                  toast(r.subs ? t.remindTestRejected : t.remindTestNone)
                  setDiag(r.errors.join(' · ') || `subs: ${r.subs}`)
                }
              } catch (e) {
                toast(t.remindTestFail)
                setDiag(String((e as Error)?.message ?? e))
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
      {diag && <span className="tiny muted" style={{ wordBreak: 'break-all' }}>{diag}</span>}
    </div>
  )
}
