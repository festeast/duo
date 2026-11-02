// Түрікше айтылым: iPhone-дағы кірістірілген түрік дауысы (Yelda) қолданылады.

let voice: SpeechSynthesisVoice | null = null

function pickVoice() {
  if (!('speechSynthesis' in window)) return
  const voices = speechSynthesis.getVoices()
  voice = voices.find((v) => v.lang === 'tr-TR') ?? voices.find((v) => v.lang.startsWith('tr')) ?? null
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  pickVoice()
  speechSynthesis.onvoiceschanged = pickVoice
}

export function speak(text: string, slow = false) {
  if (!('speechSynthesis' in window)) return
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'tr-TR'
  if (voice) u.voice = voice
  u.rate = slow ? 0.55 : 0.85
  speechSynthesis.speak(u)
}

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window
