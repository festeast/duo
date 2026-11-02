import { useState } from 'react'
import { PixelCat } from '../components/PixelCat'
import { EYES, FURS, type EyeId, type FurId } from '../data/cat'
import { t } from '../i18n/kk'
import { sfx } from '../lib/sound'
import { createPlayer, updatePlayer, type CatLook, type Player } from '../lib/store'

type Props = { editing?: Player; onDone: () => void; onCancel?: () => void }

export function Setup({ editing, onDone, onCancel }: Props) {
  const [name, setName] = useState(editing?.name ?? '')
  const [look, setLook] = useState<CatLook>(editing?.cat ?? { fur: 'ginger', eyes: 'green' })

  const save = () => {
    const n = name.trim()
    if (!n) return
    sfx.meow()
    if (editing) updatePlayer(editing.id, (p) => ({ ...p, name: n, cat: look }))
    else createPlayer(n, look)
    onDone()
  }

  return (
    <div className="screen">
      <h2 className="center">{editing ? t.editPlayer : t.newPlayer}</h2>

      <div className="row" style={{ justifyContent: 'center' }}>
        <PixelCat look={look} size={160} bounce />
      </div>

      <div className="col">
        <label>{t.yourName}</label>
        <input
          className="input"
          value={name}
          maxLength={14}
          placeholder={t.namePlaceholder}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="col">
        <label>{t.fur}: <span className="muted">{FURS[look.fur].name}</span></label>
        <div className="swatches">
          {(Object.keys(FURS) as FurId[]).map((f) => (
            <button
              key={f}
              aria-label={FURS[f].name}
              className={`swatch${look.fur === f ? ' on' : ''}`}
              style={{ background: FURS[f].F }}
              onClick={() => {
                sfx.click()
                setLook({ ...look, fur: f })
              }}
            />
          ))}
        </div>
      </div>

      <div className="col">
        <label>{t.eyes}: <span className="muted">{EYES[look.eyes].name}</span></label>
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
      <button className="btn wide" disabled={!name.trim()} onClick={save}>
        {t.ready}
      </button>
      {onCancel && (
        <button className="btn ghost wide" onClick={onCancel}>
          {t.cancel}
        </button>
      )}
    </div>
  )
}
