// Түрікше айтылым: телефондағы кірістірілген түрік дауыстары қолданылады.
// Пайдаланушы Профильде дауыс пен жылдамдықты таңдай алады.

const VOICE_KEY = 'duo-voice'
const RATE_KEY = 'duo-rate'

export const RATES = [
  { id: 'slow', label: 'Баяу', value: 0.65 },
  { id: 'normal', label: 'Қалыпты', value: 0.85 },
  { id: 'fast', label: 'Жылдам', value: 1.0 },
] as const

function read(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* бос */
  }
}

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window

let voices: SpeechSynthesisVoice[] = []
const listeners = new Set<() => void>()

function refresh() {
  if (!canSpeak()) return
  voices = speechSynthesis
    .getVoices()
    .filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith('tr'))
    // Жақсартылған (Enhanced / Premium) дауыстар бірінші тұрады
    .sort((a, b) => quality(b) - quality(a))
  listeners.forEach((l) => l())
}

function quality(v: SpeechSynthesisVoice) {
  const n = v.name.toLowerCase()
  if (/premium/.test(n)) return 3
  if (/enhanced|gelişmiş|улучш/.test(n) || /\.premium|\.enhanced/.test(v.voiceURI)) return 2
  if (v.localService) return 1
  return 0
}

if (canSpeak()) {
  refresh()
  speechSynthesis.addEventListener?.('voiceschanged', refresh)
}

/** Құрылғыдағы түрік дауыстары */
export function turkishVoices() {
  return voices
}

export function onVoicesChanged(l: () => void) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

export function voiceLabel(v: SpeechSynthesisVoice) {
  const q = quality(v)
  return v.name.replace(/\s*\(.*\)\s*/, '') + (q >= 2 ? ' ⭐' : '')
}

export const getVoiceUri = () => read(VOICE_KEY)
export const setVoiceUri = (uri: string) => write(VOICE_KEY, uri)
export const getRateId = () => read(RATE_KEY) ?? 'normal'
export const setRateId = (id: string) => write(RATE_KEY, id)

function currentVoice() {
  const uri = getVoiceUri()
  return voices.find((v) => v.voiceURI === uri) ?? voices[0] ?? null
}

export function speak(text: string, slow = false) {
  if (!canSpeak()) return
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'tr-TR'
  const v = currentVoice()
  if (v) u.voice = v
  const rate = RATES.find((r) => r.id === getRateId())?.value ?? 0.85
  u.rate = slow ? Math.min(rate, 0.6) * 0.85 : rate
  speechSynthesis.speak(u)
}
