import { useEffect, useMemo } from 'react'
import { WordPic } from './Pictos'
import { wordByTr } from '../data/words'
import { t } from '../i18n/kk'
import { formsOf } from '../lib/forms'
import { speak } from '../lib/speech'
import { Volume2, X } from './Icon'

/** Сөздің мәтіндерде кездесетін түрлері — төменнен шығатын парақ */
export function FormsSheet({ tr, onClose }: { tr: string; onClose: () => void }) {
  const w = wordByTr(tr)
  const forms = useMemo(() => formsOf(tr), [tr])
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  return (
    <div className="sheet-back" onClick={onClose}>
      <div className="sheet slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <button className="word-tr small-word ih" onClick={() => speak(tr)}>
            {w && <WordPic w={w} size={36} />}
            {tr} <Volume2 className="speaker" size={20} />
          </button>
          <button className="icon-btn" onClick={onClose} aria-label={t.cancel}>
            <X size={24} />
          </button>
        </div>
        {w && <span className="muted">{w.kk}</span>}
        <h3 style={{ margin: '6px 0 0' }}>{t.formsTitle}</h3>
        {forms.length === 0 ? (
          <p className="muted small">{t.formsNone}</p>
        ) : (
          <div className="col" style={{ gap: 8 }}>
            {forms.map((f) => (
              <button key={f.form} className="form-row" onClick={() => speak(f.ex.tr)}>
                <span className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                  <b className="form-word">{f.form}</b>
                  {f.label && <span className="form-label">{f.label}</span>}
                </span>
                <span className="small">{f.ex.tr}</span>
                <span className="muted small">{f.ex.kk}</span>
              </button>
            ))}
          </div>
        )}
        <p className="muted tiny" style={{ margin: 0 }}>
          {t.formsHint}
        </p>
      </div>
    </div>
  )
}
