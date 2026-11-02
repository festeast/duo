import { PixelCat } from '../components/PixelCat'
import { ALL_LESSONS } from '../data/course'
import { t } from '../i18n/kk'
import { sfx } from '../lib/sound'
import { levelOf, sharedStreak, studiedToday, switchPlayer, toggleSound, useStore, weeklyXp, type Player } from '../lib/store'

export function Duo({ onAddPartner }: { onAddPartner: () => void }) {
  const players = useStore((s) => s.players)
  const activeId = useStore((s) => s.activeId)
  const sound = useStore((s) => s.sound)
  const streak = sharedStreak(players)
  const [a, b] = players

  const leader = a && b ? (weeklyXp(a) === weeklyXp(b) ? null : weeklyXp(a) > weeklyXp(b) ? a : b) : null

  return (
    <div className="screen">
      <h2 className="center">{t.duoTitle}</h2>

      <div className="duo-cats">
        {a && <PixelCat look={a.cat} size={110} mood={studiedToday(a) ? 'happy' : 'sad'} bounce={studiedToday(a)} />}
        <span className="heart">♥</span>
        {b ? (
          <PixelCat look={b.cat} size={110} mood={studiedToday(b) ? 'happy' : 'sad'} bounce={studiedToday(b)} flip />
        ) : (
          <button className="btn ghost" style={{ width: 110, height: 130, fontSize: 40 }} onClick={onAddPartner} aria-label={t.addPartner}>
            ?
          </button>
        )}
      </div>

      <div className="px-box center" style={{ background: 'var(--purple)' }}>
        <h1 style={{ color: 'var(--orange)' }}>🔥 {streak}</h1>
        <span>
          {t.streakTogether}: {streak} {t.days}
        </span>
      </div>

      {b ? (
        <>
          <p className="center" style={{ margin: 0, color: 'var(--yellow)' }}>
            {leader ? `👑 ${leader.name} ${t.leading}` : t.tie}
          </p>
          <div className="grid2">
            {[a, b].map((p) => (
              <PlayerCard key={p.id} p={p} active={p.id === activeId} />
            ))}
          </div>
        </>
      ) : (
        <div className="px-box col center">
          <h3>{t.addPartner}</h3>
          <span className="muted">{t.addPartnerHint}</span>
          <button
            className="btn"
            onClick={() => {
              sfx.click()
              onAddPartner()
            }}
          >
            + {t.addPartner}
          </button>
        </div>
      )}

      <button
        className="btn ghost wide small"
        onClick={() => {
          toggleSound()
          sfx.click()
        }}
      >
        {sound ? '🔊' : '🔇'} {t.sound}: {sound ? t.on : t.off}
      </button>
      <p className="muted center" style={{ fontSize: 14 }}>{t.syncNote}</p>
    </div>
  )
}

function PlayerCard({ p, active }: { p: Player; active: boolean }) {
  const lvl = levelOf(p.xp)
  const done = Object.keys(p.lessons).length
  return (
    <div className="px-box col" style={{ gap: 6, background: active ? 'var(--bg2)' : undefined }}>
      <h3>{p.name}</h3>
      <span className="muted" style={{ fontSize: 16 }}>
        {t.level} {lvl.level} · {lvl.name}
      </span>
      <span style={{ fontSize: 16 }}>
        {t.weekXp}: <b style={{ color: 'var(--cyan)' }}>{weeklyXp(p)}</b>
      </span>
      <span style={{ fontSize: 16 }}>
        {t.lessonsDone}: {done}/{ALL_LESSONS.length}
      </span>
      <span style={{ fontSize: 16, color: studiedToday(p) ? 'var(--green-hi)' : 'var(--muted)' }}>
        {studiedToday(p) ? t.partnerDone : t.partnerNotDone}
      </span>
      {!active && (
        <button
          className="btn small blue"
          onClick={() => {
            sfx.meow()
            switchPlayer(p.id)
          }}
        >
          {t.switchTo}
        </button>
      )}
    </div>
  )
}
