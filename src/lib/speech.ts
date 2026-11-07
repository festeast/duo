// Түрікше айтылым.
// 1) Негізгі: Google Chirp3-HD дауысымен алдын ала жазылған аудиофайлдар (public/audio).
// 2) Файлы жоқ мәтін (мысалы, ойыншылардың аттары) — телефонның өз түрік дауысымен.
// Пайдаланушы Профильде дауыс пен жылдамдықты таңдай алады.

import manifest from '../data/audio-manifest.json'
import { audioKey } from './audioKey'

const AUDIO_KEYS = new Set<string>(manifest.keys)
export const CLOUD_VOICES = [
  { id: 'g:female', dir: 'female', label: 'Әйел дауысы' },
  { id: 'g:male', dir: 'male', label: 'Ер дауысы' },
] as const
const DEFAULT_VOICE = 'g:female'

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
  const seen = new Set<string>()
  voices = speechSynthesis
    .getVoices()
    .filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith('tr'))
    // iPhone кейде бір дауысты екі рет қайтарады — қайталанғанын алып тастаймыз
    .filter((v) => {
      const k = `${v.voiceURI}|${v.name}`
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
    // Жақсартылған (Enhanced / Premium) дауыстар бірінші тұрады
    .sort((a, b) => quality(b) - quality(a))
  listeners.forEach((l) => l())
}

function quality(v: SpeechSynthesisVoice) {
  const n = `${v.name} ${v.voiceURI}`.toLowerCase()
  if (/premium|высок/.test(n)) return 3
  if (/enhanced|gelişmiş|улучш|жақсарт/.test(n)) return 2
  if (/compact|default/.test(n)) return 0
  return 1
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
  return v.name + (q === 3 ? ' · Premium' : q === 2 ? ' · Enhanced' : '')
}

/** Дауыстың техникалық атауының қысқа түрі (мысалы, «enhanced.tr-TR.Yelda») */
export function voiceTech(v: SpeechSynthesisVoice) {
  return v.voiceURI.replace(/^com\.apple\.(voice|speech\.synthesis\.voice)\./, '')
}

/** Дауыстың бірегей кілті: кейбір iPhone-да екі дауыстың voiceURI-і бірдей болады */
export const voiceKey = (v: SpeechSynthesisVoice) => `${v.voiceURI}|${v.name}`
export const getVoiceUri = () => read(VOICE_KEY)
export const getVoiceChoice = () => read(VOICE_KEY) ?? DEFAULT_VOICE
export const setVoiceUri = (key: string) => write(VOICE_KEY, key)
export const getRateId = () => read(RATE_KEY) ?? 'normal'
export const setRateId = (id: string) => write(RATE_KEY, id)

// ---------- Аудиофайлдар ----------

let player: HTMLAudioElement | null = null

function getPlayer() {
  if (!player && typeof Audio !== 'undefined') {
    player = new Audio()
    player.preload = 'auto'
  }
  return player
}

// iPhone дыбысты тек пайдаланушы басқаннан кейін ғана ойнатуға рұқсат береді.
// Бірінші басқанда ойнатқышты үнсіз «оятып» қоямыз.
if (typeof document !== 'undefined') {
  const unlock = () => {
    const p = getPlayer()
    const first = manifest.keys[0]
    if (p && first && !p.src) {
      p.muted = true
      p.src = `/audio/female/${first}.mp3`
      void p.play().then(
        () => {
          p.pause()
          p.muted = false
        },
        () => {
          p.muted = false
        },
      )
    }
    document.removeEventListener('pointerdown', unlock)
  }
  document.addEventListener('pointerdown', unlock)
}

// Мәтінді салыстыруға келтіру: кіші әріп, тыныс белгілерсіз («Merhaba,» → «merhaba»)
const norm = (t: string) => t.toLocaleLowerCase('tr').replace(/[.,!?;:“”"«»—…()]/g, '').trim()

function fileFor(text: string) {
  for (const t of [text, text.trim(), text.toLocaleLowerCase('tr'), norm(text)]) {
    const k = audioKey(t)
    if (AUDIO_KEYS.has(k)) return k
  }
  return null
}

/** Бұл мәтіннің Google жазбасы бар ма */
export const hasRecording = (text: string) => fileFor(text) !== null

let seq = 0 // тізбекті ойнатуды тоқтату үшін

/** Дыбысты тоқтату (келесі тапсырмаға өткенде) */
export function stopSpeaking() {
  stopAll()
}

function stopAll() {
  seq++
  if (player) {
    player.onended = null
    player.pause()
  }
  if (canSpeak()) speechSynthesis.cancel()
}

function currentVoice() {
  const key = getVoiceUri()
  if (key?.startsWith('g:')) return voices[0] ?? null
  return voices.find((v) => voiceKey(v) === key) ?? voices.find((v) => v.voiceURI === key) ?? voices[0] ?? null
}

export function speak(text: string, slow = false) {
  stopAll()
  playOne(text, slow, seq)
}

/** Бірнеше сөйлемді қатарынан ойнату (мысалы, бүкіл әңгіме) */
export function speakAll(texts: string[]) {
  stopAll()
  const my = seq
  let i = 0
  const next = () => {
    if (my !== seq || i >= texts.length) return
    playOne(texts[i++], false, my, next)
  }
  next()
}

/** Бір мәтінді ойнату. Google жазбасы болса — тек соны қолданамыз (iPhone-ның ескі дауысына ауыспаймыз). */
function playOne(text: string, slow: boolean, my: number, onDone?: () => void) {
  const choice = getVoiceUri() ?? DEFAULT_VOICE
  const rate = RATES.find((r) => r.id === getRateId())?.value ?? 0.85
  const cloud = CLOUD_VOICES.find((v) => v.id === choice)
  const key = cloud ? fileFor(text) : null
  const p = getPlayer()
  if (cloud && key && p) {
    const play = (dir: string, retry: boolean) => {
      if (my !== seq) return
      p.muted = false
      p.src = `/audio/${dir}/${key}.mp3`
      // Жазылған дауыс табиғи жылдамдықта: «Қалыпты» = 1.0
      p.playbackRate = slow ? 0.7 : rate / 0.85
      ;(p as HTMLAudioElement & { preservesPitch?: boolean }).preservesPitch = true
      p.onended = () => onDone?.()
      p.play().catch((err: DOMException) => {
        // iPhone дыбысты уақытша бұғаттаса (NotAllowedError) — ескі дауысқа ауыспаймыз, жай үнсіз қаламыз.
        // Файл табылмаса — екінші Google дауысын байқап көреміз.
        if (err?.name === 'NotAllowedError' || err?.name === 'AbortError') return
        if (retry) play(dir === 'female' ? 'male' : 'female', false)
        else onDone?.()
      })
    }
    play(cloud.dir, true)
    return
  }
  // Google жазбасы жоқ мәтін (сирек: басқа есімдер т.б.) — телефон дауысы
  speakDevice(text, slow, onDone)
}

/** Телефонның өз дауысымен айту */
function speakDevice(text: string, slow: boolean, onDone?: () => void) {
  if (!canSpeak()) return onDone?.()
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.onend = () => onDone?.()
  u.lang = 'tr-TR'
  const v = currentVoice()
  try {
    if (v) u.voice = v
  } catch {
    /* дауыс қабылданбаса — әдепкі түрік дауысы */
  }
  const rate = RATES.find((r) => r.id === getRateId())?.value ?? 0.85
  u.rate = slow ? Math.min(rate, 0.6) * 0.85 : rate
  speechSynthesis.speak(u)
}
