import { useState } from 'react'
import { Cat } from '../components/Cat'
import { DEFAULT_NAMES, DIALOGS, EPISODES, LEVEL_NAMES, dialogById, isNamedRole, personalize, turnsOf, type Dialog, type Level } from '../data/dialogs'
import { getSolo } from '../lib/dialogProgress'
import { t } from '../i18n/kk'
import { acceptFriend, addFriend, inviteDialog, removeFriend } from '../lib/api'
import { sfx } from '../lib/sound'
import { levelOf, streakOf, studiedToday, toast, useStore, weeklyXp, type Friend } from '../lib/store'

export type DialogStart = { kind: 'online'; sessionId: string } | { kind: 'solo'; dialogId: string; role: 'A' | 'B' }

export function Together({ onDialog }: { onDialog: (d: DialogStart) => void }) {
  const me = useStore((s) => s.profile)
  const myDays = useStore((s) => s.days)
  const friends = useStore((s) => s.friends)
  const activeDialogs = useStore((s) => s.activeDialogs)
  const progress = useStore((s) => s.progress)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [picking, setPicking] = useState<Dialog | null>(null)

  if (!me) return null
  const accepted = friends.filter((f) => f.status === 'accepted')
  const incoming = friends.filter((f) => f.incoming)
  const outgoing = friends.filter((f) => f.status === 'pending' && !f.incoming)

  const share = async () => {
    sfx.click()
    const text = t.shareText(me.friend_code)
    try {
      if (navigator.share) await navigator.share({ text })
      else {
        await navigator.clipboard.writeText(me.friend_code)
        toast(t.copied)
      }
    } catch {
      /* пайдаланушы бас тартты */
    }
  }

  const board = [
    { id: me.id, name: `${me.name} (${t.you})`, cat: me.cat, xp: weeklyXp(myDays) },
    ...accepted.map((f) => ({ id: f.profile.id, name: f.profile.name, cat: f.profile.cat, xp: weeklyXp(f.days) })),
  ].sort((a, b) => b.xp - a.xp)

  return (
    <div className="screen">
      <h2>{t.togetherTitle}</h2>

      {/* Достық код */}
      <div className="card code-card">
        <div className="col" style={{ gap: 2 }}>
          <span className="muted small">{t.myCode}</span>
          <span className="friend-code">{me.friend_code}</span>
        </div>
        <button className="btn small blue" onClick={share}>
          {t.shareCode}
        </button>
      </div>

      {/* Дос қосу */}
      <form
        className="row"
        onSubmit={async (e) => {
          e.preventDefault()
          if (!code.trim()) return
          setBusy(true)
          const r = await addFriend(code)
          setBusy(false)
          if (r === 'sent' || r === 'accepted') {
            sfx.coin()
            setCode('')
          }
        }}
      >
        <input
          className="input"
          style={{ flex: 1 }}
          value={code}
          placeholder={t.friendCodePlaceholder}
          autoCapitalize="characters"
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          aria-label={t.addFriend}
        />
        <button className="btn small" disabled={!code.trim() || busy}>
          + {t.add}
        </button>
      </form>

      {incoming.length > 0 && (
        <section className="col">
          <h3>{t.requests}</h3>
          {incoming.map((f) => (
            <div key={f.friendshipId} className="card row">
              <Cat look={f.profile.cat} size={52} />
              <b style={{ flex: 1 }}>{f.profile.name}</b>
              <button
                className="btn small"
                onClick={() => {
                  sfx.coin()
                  void acceptFriend(f.friendshipId)
                }}
              >
                {t.accept}
              </button>
              <button className="btn small ghost" onClick={() => void removeFriend(f.friendshipId)}>
                ✕
              </button>
            </div>
          ))}
        </section>
      )}

      <section className="col">
        <h3>{t.friends}</h3>
        {accepted.length === 0 && outgoing.length === 0 && <p className="muted">{t.noFriends}</p>}
        {accepted.map((f) => (
          <FriendCard key={f.friendshipId} f={f} myDays={myDays} />
        ))}
        {outgoing.map((f) => (
          <div key={f.friendshipId} className="card row faded">
            <Cat look={f.profile.cat} size={44} />
            <b style={{ flex: 1 }}>{f.profile.name}</b>
            <span className="muted small">{t.pendingOut}</span>
          </div>
        ))}
      </section>

      {/* Кідіртілген диалогтар */}
      {(() => {
        const online = activeDialogs.filter((d) => dialogById(d.dialog_id))
        const solo = [...DIALOGS, ...EPISODES].map((d) => ({ d, p: getSolo(d.id) })).filter((x) => x.p)
        if (!online.length && !solo.length) return null
        return (
          <section className="col">
            <h3>⏸ {t.continueDialogs}</h3>
            {online.map((sess) => {
              const d = dialogById(sess.dialog_id)!
              const pid = sess.host === me.id ? sess.guest : sess.host
              const partner = friends.find((f) => f.profile.id === pid)?.profile
              return (
                <button key={sess.id} className="card row choice" onClick={() => onDialog({ kind: 'online', sessionId: sess.id })}>
                  <span style={{ fontSize: 30 }}>{d.icon}</span>
                  <span className="col" style={{ gap: 2, flex: 1, alignItems: 'flex-start' }}>
                    <b>{d.title}</b>
                    <span className="muted small">
                      {partner?.name ?? '…'} · {sess.step}/{sess.turns.length}
                    </span>
                  </span>
                  <span className="btn small">{t.resume}</span>
                </button>
              )
            })}
            {solo.map(({ d, p }) => (
              <button key={d.id} className="card row choice" onClick={() => onDialog({ kind: 'solo', dialogId: d.id, role: p!.role })}>
                <span style={{ fontSize: 30 }}>{d.icon}</span>
                <span className="col" style={{ gap: 2, flex: 1, alignItems: 'flex-start' }}>
                  <b>{d.title}</b>
                  <span className="muted small">
                    🐱 {t.withCat} · {p!.step}/{d.lines.length}
                  </span>
                </span>
                <span className="btn small ghost">{t.resume}</span>
              </button>
            ))}
          </section>
        )
      })()}

      {/* Сериал */}
      <section className="col">
        <h3>{t.seriesTitle(EPISODES[0].series!.name)}</h3>
        <p className="muted small" style={{ margin: 0 }}>
          {t.seriesHint}
        </p>
        <div className="episodes">
          {EPISODES.map((d, i) => {
            const done = !!progress[`dlg-${d.id}`]
            const open = i === 0 || !!progress[`dlg-${EPISODES[i - 1].id}`]
            return (
              <button
                key={d.id}
                className={`episode${done ? ' done' : ''}${open && !done ? ' next' : ''}`}
                disabled={!open}
                onClick={() => {
                  sfx.click()
                  setPicking(d)
                }}
              >
                <span className="ep-num">{done ? '✓' : open ? d.icon : '🔒'}</span>
                <span className="col" style={{ gap: 0, alignItems: 'flex-start', flex: 1 }}>
                  <span className="muted tiny">{t.episode(d.series!.episode)}</span>
                  <b>{d.title}</b>
                </span>
                <span className="muted tiny">{d.lines.length} реплика</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Диалогтар */}
      <section className="col">
        <h3>💬 {t.dialogs}</h3>
        <p className="muted small" style={{ margin: 0 }}>
          {t.dialogsHint}
        </p>
        {([1, 2, 3] as Level[]).map((lvl) => (
          <div key={lvl} className="col" style={{ gap: 8 }}>
            <span className={`level-tag l${lvl}`}>{'●'.repeat(lvl)}{'○'.repeat(3 - lvl)} {LEVEL_NAMES[lvl]}</span>
            <div className="dialog-grid">
              {DIALOGS.filter((d) => d.level === lvl).map((d) => {
                const shown = personalize(d, { A: me.name || DEFAULT_NAMES.A, B: accepted[0]?.profile.name || DEFAULT_NAMES.B })
                return (
                  <button
                    key={d.id}
                    className="dialog-tile"
                    onClick={() => {
                      sfx.click()
                      setPicking(d)
                    }}
                  >
                    <span className="dialog-icon">{d.icon}</span>
                    <b>{d.title}</b>
                    <span className="muted small">
                      {shown.roles.A} · {shown.roles.B}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </section>

      {accepted.length > 0 && (
        <section className="col">
          <h3>🏆 {t.leaderboard}</h3>
          <div className="card col" style={{ gap: 8 }}>
            {board.map((p, i) => (
              <div key={p.id} className="row">
                <span className="rank">{['🥇', '🥈', '🥉'][i] ?? i + 1}</span>
                <Cat look={p.cat} size={36} />
                <span style={{ flex: 1 }} className="ellipsis">
                  {p.name}
                </span>
                <b className="xp-text">{p.xp} XP</b>
              </div>
            ))}
          </div>
        </section>
      )}

      {picking && <DialogSheet dialog={picking} friends={accepted} onClose={() => setPicking(null)} onStart={onDialog} />}
    </div>
  )
}

function FriendCard({ f, myDays }: { f: Friend; myDays: Record<string, number> }) {
  const lvl = levelOf(f.profile.xp)
  const together = streakOf(myDays, f.days)
  const today = studiedToday(f.days)
  return (
    <div className="card friend-card">
      <Cat look={f.profile.cat} size={64} mood={today ? 'happy' : 'normal'} />
      <div className="col" style={{ gap: 3, flex: 1, minWidth: 0 }}>
        <b className="ellipsis">{f.profile.name}</b>
        <span className="muted small">
          {t.level} {lvl.level} · 📚 {f.wordsLearned} {t.wordsShort}
        </span>
        <span className={`small ${today ? 'ok-text' : 'muted'}`}>{today ? t.studiedToday : t.notStudiedToday}</span>
      </div>
      <div className="col center" style={{ gap: 0 }}>
        <span className={`together-streak ${together > 0 ? 'on' : ''}`}>🔥 {together}</span>
        <span className="muted tiny">{t.togetherStreak}</span>
      </div>
      <button
        className="icon-btn small-x"
        aria-label={t.remove}
        onClick={() => {
          if (confirm(t.removeConfirm)) void removeFriend(f.friendshipId)
        }}
      >
        ⋯
      </button>
    </div>
  )
}

function DialogSheet({
  dialog,
  friends,
  onClose,
  onStart,
}: {
  dialog: Dialog
  friends: Friend[]
  onClose: () => void
  onStart: (d: DialogStart) => void
}) {
  const [role, setRole] = useState<'A' | 'B'>('A')
  const [busy, setBusy] = useState(false)

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <h2>
          {dialog.icon} {dialog.title}
        </h2>

        <span className="muted small">{t.chooseRole}</span>
        <div className="seg">
          {(['A', 'B'] as const).map((r) => (
            <button key={r} className={role === r ? 'on' : ''} onClick={() => setRole(r)}>
              {isNamedRole(dialog.roles[r]) ? (r === 'A' ? t.roleFirst : t.roleSecond) : dialog.roles[r]}
            </button>
          ))}
        </div>

        <span className="muted small">{t.playWith}</span>
        {friends.map((f) => (
          <button
            key={f.profile.id}
            className="card row choice"
            disabled={busy}
            onClick={async () => {
              setBusy(true)
              sfx.click()
              const s = await inviteDialog(dialog.id, f.profile.id, role, turnsOf(dialog))
              setBusy(false)
              if (s) onStart({ kind: 'online', sessionId: s.id })
            }}
          >
            <Cat look={f.profile.cat} size={44} />
            <b style={{ flex: 1, textAlign: 'left' }}>{f.profile.name}</b>
            <span className="btn small">{t.invite}</span>
          </button>
        ))}
        <button
          className="card row choice"
          onClick={() => {
            sfx.click()
            onStart({ kind: 'solo', dialogId: dialog.id, role })
          }}
        >
          <span style={{ fontSize: 32 }}>🐱</span>
          <b style={{ flex: 1, textAlign: 'left' }}>{t.playSolo}</b>
          <span className="btn small ghost">▶</span>
        </button>
      </div>
    </div>
  )
}
