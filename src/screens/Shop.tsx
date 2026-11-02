import { PixelCat } from '../components/PixelCat'
import { ITEMS } from '../data/cat'
import { t } from '../i18n/kk'
import { sfx } from '../lib/sound'
import { activePlayer, updatePlayer, useStore } from '../lib/store'

export function Shop() {
  const me = useStore(activePlayer)
  if (!me) return null

  const buy = (id: string, price: number) => {
    if (me.coins < price) return
    sfx.coin()
    const item = ITEMS.find((i) => i.id === id)!
    updatePlayer(me.id, (p) => ({ ...p, coins: p.coins - price, owned: [...p.owned, id], cat: { ...p.cat, [item.slot]: id } }))
  }

  const toggle = (id: string) => {
    sfx.click()
    const item = ITEMS.find((i) => i.id === id)!
    updatePlayer(me.id, (p) => ({ ...p, cat: { ...p.cat, [item.slot]: p.cat[item.slot] === id ? undefined : id } }))
  }

  return (
    <div className="screen">
      <h2 className="center">{t.shopTitle}</h2>
      <div className="row" style={{ justifyContent: 'center' }}>
        <PixelCat look={me.cat} size={128} bounce />
      </div>
      <p className="center" style={{ color: 'var(--yellow)', margin: 0 }}>
        🪙 {me.coins} {t.coins}
      </p>

      <div className="shop-grid">
        {ITEMS.map((item) => {
          const owned = me.owned.includes(item.id)
          const wearing = me.cat[item.slot] === item.id
          return (
            <div key={item.id} className="px-box shop-item">
              <PixelCat look={{ ...me.cat, head: undefined, face: undefined, neck: undefined, [item.slot]: item.id }} size={72} />
              <span>{item.name}</span>
              <span className="muted" style={{ fontSize: 14 }}>{t.slots[item.slot]}</span>
              {owned ? (
                <button className={`btn small ${wearing ? 'ghost' : 'blue'}`} onClick={() => toggle(item.id)}>
                  {wearing ? t.takeOff : t.wear}
                </button>
              ) : (
                <button className="btn small yellow" disabled={me.coins < item.price} onClick={() => buy(item.id, item.price)}>
                  🪙 {item.price}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
