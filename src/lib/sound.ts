import { getState } from './store'

// 8-bit дыбыстар — файлсыз, WebAudio арқылы синтезделеді.

let ctx: AudioContext | null = null

/** iPhone-да дыбыс тек пайдаланушы басқаннан кейін ашылады. */
export function unlockAudio() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    ctx = new AC()
  }
  if (ctx.state === 'suspended') void ctx.resume()
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'square', vol = 0.08) {
  if (!ctx) return
  const t = ctx.currentTime + start
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  gain.gain.setValueAtTime(vol, t)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(gain).connect(ctx.destination)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

function play(notes: [number, number, number][], type?: OscillatorType) {
  if (!getState().sound) return
  unlockAudio()
  notes.forEach(([f, s, d]) => tone(f, s, d, type))
}

export const sfx = {
  click: () => play([[880, 0, 0.05]]),
  tile: () => play([[660, 0, 0.04]], 'triangle'),
  correct: () => play([[523, 0, 0.08], [659, 0.08, 0.08], [784, 0.16, 0.16]]),
  wrong: () => play([[220, 0, 0.12], [165, 0.12, 0.22]], 'sawtooth'),
  match: () => play([[784, 0, 0.06], [1047, 0.06, 0.1]], 'triangle'),
  win: () =>
    play([
      [523, 0, 0.1], [659, 0.1, 0.1], [784, 0.2, 0.1], [1047, 0.3, 0.2],
      [784, 0.5, 0.1], [1047, 0.6, 0.35],
    ]),
  coin: () => play([[988, 0, 0.06], [1319, 0.06, 0.18]]),
  meow: () => {
    if (!getState().sound || !ctx) return
    unlockAudio()
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(600, t)
    osc.frequency.linearRampToValueAtTime(900, t + 0.12)
    osc.frequency.linearRampToValueAtTime(500, t + 0.35)
    gain.gain.setValueAtTime(0.06, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.38)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.4)
  },
}
