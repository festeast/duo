import { useEffect } from 'react'
import { CHARACTERS } from '../data/characters'
import { t } from '../i18n/kk'
import { giftsSeen, saveProfile } from '../lib/api'
import { sfx } from '../lib/sound'
import { useStore } from '../lib/store'
import { Cat } from './Cat'

/** Досыңнан келген сыйлық туралы хабар */
export function GiftModal() {
  const gifts = useStore((s) => s.gifts)
  const me = useStore((s) => s.profile)
  const g = gifts[0]
  useEffect(() => {
    if (g) sfx.win()
  }, [g])
  if (!g || !me) return null
  const charId = g.item.replace(/^char-/, '')
  const c = CHARACTERS.find((x) => x.id === charId)
  return (
    <div className="sheet-back center-modal">
      <div className="card col center gift-modal pop">
        <h2 style={{ margin: 0 }}>{t.giftGot(g.from)}</h2>
        <Cat look={{ ...me.cat, char: charId }} size={150} mood="happy" bounce />
        {c && <b style={{ fontSize: 20 }}>{c.name}</b>}
        <button
          className="btn wide"
          onClick={() => {
            void saveProfile({ cat: { ...me.cat, char: charId } })
            void giftsSeen()
          }}
        >
          {t.giftWear}
        </button>
        <button className="btn ghost wide" onClick={() => void giftsSeen()}>
          {t.giftThanks}
        </button>
      </div>
    </div>
  )
}
