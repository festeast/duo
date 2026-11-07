import { useEffect, useState } from 'react'
import { Speech } from './Icon'
import { t } from '../i18n/kk'
import {
  CLOUD_VOICES,
  RATES,
  canSpeak,
  getRateId,
  getVoiceChoice,
  onVoicesChanged,
  setRateId,
  setVoiceUri,
  speak,
  turkishVoices,
  voiceLabel,
  voiceKey,
  voiceTech,
} from '../lib/speech'

const SAMPLE = 'Merhaba! Birlikte Türkçe öğreniyoruz.'

/** Профильдегі түрікше дауыс баптауы */
export function VoiceSettings() {
  const [voices, setVoices] = useState(turkishVoices())
  const [uri, setUri] = useState(getVoiceChoice())
  const [rate, setRate] = useState(getRateId())

  useEffect(() => onVoicesChanged(() => setVoices([...turkishVoices()])), [])

  const choose = (key: string) => {
    setVoiceUri(key)
    setUri(key)
    speak(SAMPLE)
  }

  return (
    <div className="card col">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h3 className="ih">
          <Speech size={22} /> {t.voiceTitle}
        </h3>
        <button className="btn small blue" onClick={() => speak(SAMPLE)}>
          ▶ {t.voiceTest}
        </button>
      </div>

      <span className="muted small">{t.voiceCloud}</span>
      <div className="voice-list">
        {CLOUD_VOICES.map((v) => (
          <button key={v.id} className={`voice cloud${uri === v.id ? ' on' : ''}`} onClick={() => choose(v.id)}>
            <span>{v.label}</span>
            <span className="voice-tech">Google · {t.voiceBest}</span>
          </button>
        ))}
      </div>

      <span className="muted small">{t.voiceDevice}</span>
      {canSpeak() && voices.length > 0 ? (
        <div className="voice-list">
          {voices.map((v) => (
            <button
              key={voiceKey(v)}
              className={`voice${voiceKey(v) === uri ? ' on' : ''}`}
              onClick={() => choose(voiceKey(v))}
            >
              <span>{voiceLabel(v)}</span>
              <span className="voice-tech">{voiceTech(v)}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="muted small" style={{ margin: 0 }}>
          {t.voiceNone}
        </p>
      )}

      <span className="muted small">{t.voiceSpeed}</span>
      <div className="seg three">
        {RATES.map((r) => (
          <button
            key={r.id}
            className={rate === r.id ? 'on' : ''}
            onClick={() => {
              setRateId(r.id)
              setRate(r.id)
              speak(SAMPLE)
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      <details className="voice-help">
        <summary>{t.voiceMoreTitle}</summary>
        <p>{t.voiceMoreText}</p>
      </details>
    </div>
  )
}
