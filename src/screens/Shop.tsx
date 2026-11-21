import { useState } from 'react'
import { Cat } from '../components/Cat'
import { CharacterPicker } from '../components/CharacterPicker'
import { Coin, Gift, Snowflake } from '../components/Icon'
import { CHARACTERS, charOwnedId } from '../data/characters'
import { t } from '../i18n/kk'
import { buyFreeze, giftChar } from '../lib/api'
import { sfx } from '../lib/sound'
import { toast, useStore } from '../lib/store'

const FREEZE_PRICE = 50

/** Дүкен: серияны сақтау, кейіпкерлер (скиндер), досқа сыйлық */
export function Shop() {
  const me = useStore((s) => s.profile)
  if (!me) return null
  const freezes = me.freezes ?? 0
  return (
    <div className="screen">
      <h2>{t.shopTitle}</h2>
      <div className="cat-stage">
        <Cat look={me.cat} size={150} bounce />
      </div>

      <section className="card freeze-card">
        <span className="freeze-ico">
          <Snowflake size={28} />
        </span>
        <div className="col" style={{ gap: 2, flex: 1 }}>
          <b>{t.freezeTitle}</b>
          <span className="muted small">{t.freezeText}</span>
          <span className="small freeze-have">{t.freezeHave(freezes)}</span>
        </div>
        <button
          className="btn small yellow"
          disabled={freezes >= 2 || me.coins < FREEZE_PRICE}
          onClick={async () => {
            if (await buyFreeze()) sfx.coin()
          }}
        >
          {freezes >= 2 ? (
            t.freezeFull
          ) : (
            <>
              <Coin size={16} /> {FREEZE_PRICE}
            </>
          )}
        </button>
      </section>

      <CharacterPicker />
      <GiftSection />
    </div>
  )
}

function GiftSection() {
  const me = useStore((s) => s.profile)!
  const friends = useStore((s) => s.friends).filter((f) => f.status === 'accepted')
  const [sel, setSel] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const friend = friends.find((f) => f.profile.id === sel) ?? friends[0]

  return (
    <section className="card col">
      <h3 className="ih" style={{ margin: 0 }}>
        <Gift size={22} /> {t.giftTitle}
      </h3>
      <p className="muted small" style={{ margin: 0 }}>
        {friends.length ? t.giftHint : t.giftNoFriends}
      </p>
      {friends.length > 1 && (
        <div className="chips">
          {friends.map((f) => (
            <button
              key={f.profile.id}
              className={`chip-word friend-pick${friend?.profile.id === f.profile.id ? ' on' : ''}`}
              onClick={() => setSel(f.profile.id)}
            >
              {f.profile.name}
            </button>
          ))}
        </div>
      )}
      {friend && (
        <div className="col" style={{ gap: 8 }}>
          {CHARACTERS.filter((c) => c.price > 0 && !friend.profile.owned.includes(charOwnedId(c.id))).map((c) => (
            <div key={c.id} className="gift-row">
              <Cat look={{ ...friend.profile.cat, char: c.id }} size={48} />
              <b style={{ flex: 1 }}>{c.name}</b>
              <button
                className="btn small yellow"
                disabled={busy || me.coins < c.price}
                onClick={async () => {
                  if (!confirm(t.giftConfirm(friend.profile.name, c.name, c.price))) return
                  setBusy(true)
                  if (await giftChar(friend.profile.id, charOwnedId(c.id))) {
                    sfx.win()
                    toast(t.giftSent(friend.profile.name))
                  }
                  setBusy(false)
                }}
              >
                <Coin size={16} /> {c.price}
              </button>
            </div>
          ))}
          {CHARACTERS.every((c) => c.price === 0 || friend.profile.owned.includes(charOwnedId(c.id))) && (
            <span className="muted small">{t.giftAllOwned}</span>
          )}
        </div>
      )}
    </section>
  )
}
