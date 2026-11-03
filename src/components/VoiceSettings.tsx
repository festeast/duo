import { useEffect, useState } from 'react'
import { t } from '../i18n/kk'
import {
  RATES,
  canSpeak,
  getRateId,
  getVoiceUri,
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
  const [uri, setUri] = useState(getVoiceUri())
  const [rate, setRate] = useState(getRateId())

  useEffect(() => onVoicesChanged(() => setVoices([...turkishVoices()])), [])

  if (!canSpeak()) return null
  const match = voices.find((v) => voiceKey(v) === uri) ?? voices.find((v) => v.voiceURI === uri) ?? voices[0]
  const selected = match ? voiceKey(match) : null

  return (
    <div className="card col">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h3>🗣️ {t.voiceTitle}</h3>
        <button className="btn small blue" onClick={() => speak(SAMPLE)}>
          ▶ {t.voiceTest}
        </button>
      </div>

      {voices.length > 0 ? (
        <div className="voice-list">
          {voices.map((v) => (
            <button
              key={voiceKey(v)}
              className={`voice${voiceKey(v) === selected ? ' on' : ''}`}
              onClick={() => {
                setVoiceUri(voiceKey(v))
                setUri(voiceKey(v))
                speak(SAMPLE)
              }}
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
