import { useEffect, useRef } from 'react'
import { dialogById } from '../data/dialogs'
import { t } from '../i18n/kk'
import { respondDialog } from '../lib/api'
import { sfx } from '../lib/sound'
import { useStore } from '../lib/store'
import { Cat } from './Cat'

/** Серігің диалогқа шақырғанда экранның жоғарғы жағында шығады */
export function InviteBanner({ onJoin }: { onJoin: (sessionId: string) => void }) {
  const invites = useStore((s) => s.invites)
  const friends = useStore((s) => s.friends)
  const inv = invites[0]
  const seen = useRef<string | null>(null)

  useEffect(() => {
    if (inv && seen.current !== inv.id) {
      seen.current = inv.id
      sfx.meow()
      navigator.vibrate?.(200)
    }
  }, [inv])

  if (!inv) return null
  const host = friends.find((f) => f.profile.id === inv.host)?.profile
  const d = dialogById(inv.dialog_id)

  return (
    <div className="invite slide-down" role="alert">
      {host && <Cat look={host.cat} size={48} mood="happy" />}
      <span style={{ flex: 1 }}>
        {d?.icon} {t.inviteFrom(host?.name ?? '…', d?.title ?? '')}
      </span>
      <div className="col" style={{ gap: 6 }}>
        <button
          className="btn small"
          onClick={async () => {
            sfx.click()
            await respondDialog(inv.id, true)
            onJoin(inv.id)
          }}
        >
          {t.join}
        </button>
        <button className="btn small ghost" onClick={() => void respondDialog(inv.id, false)}>
          {t.decline}
        </button>
      </div>
    </div>
  )
}
