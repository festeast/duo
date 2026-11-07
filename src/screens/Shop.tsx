import { Cat } from '../components/Cat'
import { Coin } from '../components/Icon'
import { ITEMS } from '../data/cat'
import { t } from '../i18n/kk'
import { buyItem, saveProfile } from '../lib/api'
import { sfx } from '../lib/sound'
import { useStore } from '../lib/store'

export function Shop() {
  const me = useStore((s) => s.profile)
  if (!me) return null

  const wear = (id: string) => {
    sfx.click()
    const item = ITEMS.find((i) => i.id === id)!
    void saveProfile({ cat: { ...me.cat, [item.slot]: me.cat[item.slot] === id ? null : id } })
  }

  return (
    <div className="screen">
      <h2>{t.shopTitle}</h2>
      <div className="cat-stage">
        <Cat look={me.cat} size={150} bounce />
        <span className="chip coin big">
          <Coin size={24} /> {me.coins}
        </span>
      </div>

      <div className="shop-grid">
        {ITEMS.map((item) => {
          const owned = me.owned.includes(item.id)
          const wearing = me.cat[item.slot] === item.id
          return (
            <div key={item.id} className={`card shop-item${wearing ? ' wearing' : ''}`}>
              <Cat look={{ ...me.cat, ear: null, face: null, cheek: null, [item.slot]: item.id }} size={84} />
              <b>{item.name}</b>
              <span className="muted tiny">{t.slots[item.slot]}</span>
              {owned ? (
                <button className={`btn small ${wearing ? 'ghost' : 'blue'}`} onClick={() => wear(item.id)}>
                  {wearing ? t.takeOff : t.wear}
                </button>
              ) : (
                <button
                  className="btn small yellow"
                  disabled={me.coins < item.price}
                  onClick={async () => {
                    if (await buyItem(item.id, item.price)) {
                      sfx.coin()
                      wear(item.id)
                    }
                  }}
                >
                  <Coin size={18} /> {item.price}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
