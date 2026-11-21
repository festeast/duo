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

// iPhone (Safari) әр жаңа SpeechRecognition объектісі үшін микрофон рұқсатын қайта сұрайды.
// Сондықтан бір ғана объектіні жасап, барлық тапсырмада соны қайта қолданамыз —
// рұқсат бір рет берілсе, қосымша ашық тұрғанда қайта сұралмайды.
let shared: Rec | null = null
let busy = false
// Микрофон жабылып жатыр: оның кеш келетін onerror/onend оқиғалары жаңа тыңдауға әсер етпеуі керек
let closing = false
let afterClose: (() => void) | null = null
let waiting: ((a: string[]) => void) | null = null // жабылуын күтіп тұрған тыңдау

function closed() {
  closing = false
  const fn = afterClose
  afterClose = null
  waiting = null
  fn?.()
}
let current: { resolve: (a: string[]) => void; reject: (e: Error) => void; timer: ReturnType<typeof setTimeout> } | null = null

function recognizer(lang: string): Rec | null {
  const C = ctor()
  if (!C) return null
  if (!shared) {
    shared = new C()
    shared.interimResults = false
    shared.maxAlternatives = 5
    shared.continuous = false
    shared.onresult = (e) => {
      const alts: string[] = []
      const res = e.results[0]
      for (let i = 0; i < res.length; i++) alts.push(res[i].transcript)
      settle((c) => c.resolve(alts))
      // iPhone сөйлем біткенде де тыңдауды өзі тоқтатпайды — микрофонды бірден жабамыз
      release()
    }
    shared.onerror = (e) => {
      if (closing) return
      // Рұқсат берілмесе — объектіні тастаймыз, келесіде қайта сұрай алсын
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') shared = null
      settle((c) => (e.error === 'no-speech' || e.error === 'aborted' ? c.resolve([]) : c.reject(new Error(e.error))))
    }
    shared.onend = () => {
      busy = false
      if (closing) return closed()
      settle((c) => c.resolve([]))
    }
  }
  shared.lang = lang
  return shared
}

function settle(fn: (c: NonNullable<typeof current>) => void) {
  const c = current
  if (!c) return
  current = null
  clearTimeout(c.timer)
  fn(c)
}

/** Бір рет тыңдайды. Нәтиже — танылған нұсқалар тізімі. */
export function listenOnce(lang = 'tr-TR', timeoutMs = 9000): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const r = recognizer(lang)
    if (!r) return reject(new Error('unsupported'))
    window.speechSynthesis?.cancel()
    // Алдыңғы тыңдау аяқталмаса — оны бос нәтижемен жабамыз
    settle((c) => c.resolve([]))
    const start = (retry: boolean) => {
      // current тек осы жерде қойылады: алдыңғы тыңдаудың кеш келген onend-і жаңасын жаппауы үшін
      const timer = setTimeout(() => {
        settle((c) => c.resolve([]))
        release()
      }, timeoutMs)
      current = { resolve, reject, timer }
      try {
        r.start()
        busy = true
      } catch (err) {
        // Әлі жұмыс істеп тұрса (InvalidStateError) — тоқтатып, сәл күтіп бір рет қайталаймыз
        current = null
        clearTimeout(timer)
        if (!retry) return reject(err as Error)
        try {
          r.abort()
        } catch {
          /* бос */
        }
        setTimeout(() => start(false), 300)
      }
    }
    if (busy) release()
    if (closing) {
      // Алдыңғы тыңдау толық жабылғанша күтеміз (onend келмесе — 600 мс кейін бәрібір бастаймыз)
      afterClose = () => start(true)
      waiting = resolve
      setTimeout(() => closing && closed(), 600)
    } else start(true)
  })
}

/** Микрофонды толық жабу (iPhone-дағы қызғылт сары нүкте сөнеді) */
function release() {
  if (!shared || !busy) return
  closing = true
  try {
    shared.abort()
  } catch {
    closing = false
  }
  busy = false
}

/** Тыңдауды тоқтату: тапсырмадан шыққанда, қосымша фонға кеткенде */
export function stopListening() {
  if (afterClose) {
    afterClose = null
    waiting?.([])
    waiting = null
  }
  settle((c) => c.resolve([]))
  release()
}

if (typeof document !== 'undefined')
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') stopListening()
  })

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
