import { Cat } from '../components/Cat'
import { CharacterPicker } from '../components/CharacterPicker'
import { t } from '../i18n/kk'
import { useStore } from '../lib/store'

/** Дүкен: кейіпкерлерді (скиндерді) тиынға сатып алу және таңдау */
export function Shop() {
  const me = useStore((s) => s.profile)
  if (!me) return null
  return (
    <div className="screen">
      <h2>{t.shopTitle}</h2>
      <div className="cat-stage">
        <Cat look={me.cat} size={150} bounce />
      </div>
      <CharacterPicker />
    </div>
  )
}
