import { useState } from 'react'
import { Cat } from '../components/Cat'
import { EYES, FURS, type EyeId, type FurId } from '../data/cat'
import { t } from '../i18n/kk'
import { saveProfile } from '../lib/api'
import { sfx } from '../lib/sound'
import { useStore } from '../lib/store'
import type { CatLook } from '../lib/types'

export function Setup({ first, onDone }: { first?: boolean; onDone: () => void }) {
  const profile = useStore((s) => s.profile)
  const [name, setName] = useState(profile?.name ?? '')
  const [look, setLook] = useState<CatLook>(profile?.cat ?? { fur: 'ginger', eyes: 'green' })
  const [busy, setBusy] = useState(false)

  const save = async () => {
    const n = name.trim()
    if (!n) return
    setBusy(true)
    sfx.meow()
    await saveProfile({ name: n, cat: look })
    setBusy(false)
    onDone()
  }

  return (
    <div className="screen">
      <h2 className="center">{first ? t.makeCat : t.editCat}</h2>

      <div className="cat-stage">
        <Cat look={look} size={180} bounce mood="happy" />
      </div>

      <label className="field">
        <span>{t.yourName}</span>
        <input className="input" value={name} maxLength={20} placeholder={t.namePlaceholder} onChange={(e) => setName(e.target.value)} />
      </label>

      <div className="field">
        <span>
          {t.fur}: <b>{FURS[look.fur].name}</b>
        </span>
        <div className="swatches">
          {(Object.keys(FURS) as FurId[]).map((f) => (
            <button
              key={f}
              aria-label={FURS[f].name}
              className={`swatch${look.fur === f ? ' on' : ''}`}
              style={{ background: FURS[f].fur }}
              onClick={() => {
                sfx.click()
                setLook({ ...look, fur: f })
              }}
            />
          ))}
        </div>
      </div>

      <div className="field">
        <span>
          {t.eyes}: <b>{EYES[look.eyes].name}</b>
        </span>
        <div className="swatches">
          {(Object.keys(EYES) as EyeId[]).map((e) => (
            <button
              key={e}
              aria-label={EYES[e].name}
              className={`swatch${look.eyes === e ? ' on' : ''}`}
              style={{ background: EYES[e].color }}
              onClick={() => {
                sfx.click()
                setLook({ ...look, eyes: e })
              }}
            />
          ))}
        </div>
      </div>

      <div className="spacer" />
      <button className="btn wide" disabled={!name.trim() || busy} onClick={save}>
        {t.ready}
      </button>
      {!first && (
        <button className="btn ghost wide" onClick={onDone}>
          {t.cancel}
        </button>
      )}
    </div>
  )
}
