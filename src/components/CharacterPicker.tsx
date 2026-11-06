import { CHARACTERS, charOwnedId } from '../data/characters'
import { t } from '../i18n/kk'
import { buyItem, saveProfile } from '../lib/api'
import { sfx } from '../lib/sound'
import { useStore } from '../lib/store'
import { Cat } from './Cat'

/** Профильдегі аниме кейіпкерлер галереясы: тиынға сатып алып, таңдауға болады */
export function CharacterPicker() {
  const me = useStore((s) => s.profile)
  if (!me) return null
  const current = me.cat.char ?? 'classic'

  const choose = (id: string | null) => {
    sfx.meow()
    void saveProfile({ cat: { ...me.cat, char: id } })
  }

  return (
    <section className="card col">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h3>🎭 {t.charsTitle}</h3>
        <span className="chip coin">🪙 {me.coins}</span>
      </div>
      <p className="muted small" style={{ margin: 0 }}>
        {t.charsHint}
      </p>
      <div className="char-grid">
        {CHARACTERS.map((c) => {
          const owned = c.price === 0 || me.owned.includes(charOwnedId(c.id))
          const selected = current === c.id
          return (
            <button
              key={c.id}
              className={`char-card${selected ? ' on' : ''}${owned ? '' : ' locked'}`}
              disabled={!owned && me.coins < c.price}
              onClick={async () => {
                if (owned) return choose(c.id)
                if (await buyItem(charOwnedId(c.id), c.price)) {
                  sfx.coin()
                  choose(c.id)
                }
              }}
            >
              <Cat look={{ ...me.cat, char: c.id }} size={86} mood={selected ? 'happy' : 'normal'} />
              <b>{c.name}</b>
              <span className="muted tiny">{c.desc}</span>
              <span className={`char-price${owned ? ' owned' : ''}`}>
                {selected ? t.charSelected : owned ? t.charChoose : `🪙 ${c.price}`}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
