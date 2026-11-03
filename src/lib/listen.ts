// Дауысты тану (микрофон): түрікше айтылғанды мәтінге айналдырады.
// iPhone-да Safari арқылы жұмыс істейді (Siri диктовкасы қосулы болуы керек).

type Rec = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  continuous: boolean
  start(): void
  stop(): void
  abort(): void
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
}

function ctor(): (new () => Rec) | null {
  const w = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export const canListen = () => typeof window !== 'undefined' && ctor() !== null

let active: Rec | null = null

/** Бір рет тыңдайды. Нәтиже — танылған нұсқалар тізімі. */
export function listenOnce(lang = 'tr-TR', timeoutMs = 9000): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const C = ctor()
    if (!C) return reject(new Error('unsupported'))
    active?.abort()
    window.speechSynthesis?.cancel()
    const r = new C()
    active = r
    r.lang = lang
    r.interimResults = false
    r.maxAlternatives = 5
    r.continuous = false
    let done = false
    const finish = (fn: () => void) => {
      if (done) return
      done = true
      clearTimeout(timer)
      active = null
      fn()
    }
    const timer = setTimeout(() => {
      r.stop()
      finish(() => resolve([]))
    }, timeoutMs)
    r.onresult = (e) => {
      const alts: string[] = []
      const res = e.results[0]
      for (let i = 0; i < res.length; i++) alts.push(res[i].transcript)
      finish(() => resolve(alts))
    }
    r.onerror = (e) => finish(() => (e.error === 'no-speech' ? resolve([]) : reject(new Error(e.error))))
    r.onend = () => finish(() => resolve([]))
    try {
      r.start()
    } catch (err) {
      finish(() => reject(err as Error))
    }
  })
}

export function stopListening() {
  active?.stop()
}

// ---------- Салыстыру ----------

const norm = (s: string) =>
  s
    .toLocaleLowerCase('tr')
    .replace(/[.,!?;:’'"“”«»-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

// Микрофон кейде ş/ç/ğ таңбаларын жоғалтады — жеңілдетіп салыстырамыз
const fold = (s: string) => s.replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')

function lev(a: string, b: string) {
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0]
    dp[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j]
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = tmp
    }
  }
  return dp[b.length]
}

/** Айтылған мен күтілгеннің ұқсастығы, 0–1 */
export function similarity(heard: string, target: string) {
  const a = fold(norm(heard))
  const b = fold(norm(target))
  if (!a || !b) return 0
  return 1 - lev(a, b) / Math.max(a.length, b.length)
}

/** Ең жақсы нұсқа және өтті ме */
export function judge(alts: string[], target: string, threshold = 0.75) {
  let best = { text: alts[0] ?? '', score: 0 }
  for (const t of alts) {
    const score = similarity(t, target)
    if (score > best.score) best = { text: t, score }
  }
  return { ...best, ok: best.score >= threshold }
}
