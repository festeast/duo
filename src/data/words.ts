// Сөздік: курстағы сөздер (A1) + кеңейтілген сөздік (A1+ → B2).
// Әр сөзде: деңгей, сурет (эмодзи), қазақшаға ұқсастығы, мысал сөйлем.
// Сөйлемдер банкі: әр сөйлемде қай сөздер кездесетіні автоматты анықталады —
// сонда жаңа сөзді қайталанатын сөздермен бір сөйлемде көрсете аламыз.
import { COURSE } from './course'
import { DIALOGS, EPISODES } from './dialogs'
import { STORIES } from './stories'
import { BRIDGES, EXTRA_EXAMPLES, VOCAB, VOCAB_COGNATES } from './vocab'
import { VOCAB_A2 } from './vocab-a2'
import { VOCAB_B1 } from './vocab-b1'
import { VOCAB_B2 } from './vocab-b2'
import { VOCAB_C1 } from './vocab-c1'
import { VOCAB_EXTRA } from './vocab-extra'

export type Cognate = { kind: 'same' | 'false'; kk: string; note?: string }

export type Word = {
  tr: string // түрікше (бұл сөздің id-і де)
  kk: string
  topic: string
  level: 1 | 2 | 3 | 4 | 5 // 1 — A1, 2 — A2, 3 — B1, 4 — B2, 5 — C1
  order: number // үйрену реті
  emoji?: string
  cognate?: Cognate
}

// Екі код жүйесі (dual coding): сөз + сурет бірге жақсырақ есте қалады
const EMOJI: Record<string, string> = {
  merhaba: '👋', günaydın: '🌅', 'iyi akşamlar': '🌆', 'iyi geceler': '🌙', 'hoşça kal': '👋', görüşürüz: '🤝',
  evet: '✅', hayır: '❌', teşekkürler: '🙏', lütfen: '🙏', ben: '🙋', sen: '👉',
  anne: '👩', baba: '👨', kardeş: '🧑‍🤝‍🧑', aile: '👨‍👩‍👧', çocuk: '🧒', eş: '💑',
  kız: '👧', oğul: '👦', büyükanne: '👵', büyükbaba: '👴', ev: '🏠', biz: '👫',
  kedi: '🐱', köpek: '🐶', kuş: '🐦', balık: '🐟', süt: '🥛', at: '🐴',
  küçük: '🐭', büyük: '🐘', siyah: '⚫', beyaz: '⚪', sevimli: '🥰', uyumak: '😴',
  ekmek: '🍞', su: '💧', çay: '🍵', kahve: '☕', et: '🥩', elma: '🍎',
  peynir: '🧀', yumurta: '🥚', şeker: '🍬', kahvaltı: '🍳', lezzetli: '😋', aç: '🤤',
  bir: '1️⃣', iki: '2️⃣', üç: '3️⃣', dört: '4️⃣', beş: '5️⃣', altı: '6️⃣', yedi: '7️⃣', sekiz: '8️⃣', dokuz: '9️⃣', on: '🔟',
  yirmi: '20', otuz: '30', kırk: '40', elli: '50', yüz: '💯', bin: '1000',
  kırmızı: '🔴', mavi: '🔵', yeşil: '🟢', sarı: '🟡', mor: '🟣', pembe: '🩷',
  turuncu: '🟠', gri: '🩶', kahverengi: '🟤', renk: '🎨', araba: '🚗', çiçek: '🌸',
  bugün: '📅', yarın: '➡️', dün: '⬅️', sabah: '🌄', akşam: '🌇', gece: '🌃',
  pazartesi: '📆', salı: '📆', çarşamba: '📆', perşembe: '📆', cuma: '🕌', cumartesi: '🎉', pazar: '🛋️',
  ne: '❓', kim: '🧐', nerede: '📍', 'ne zaman': '⏰', neden: '🤔', nasıl: '🙂',
  oda: '🛏️', mutfak: '🍳', kapı: '🚪', pencere: '🪟', yatak: '🛏️', masa: '🪑',
  gelmek: '🚶‍➡️', gitmek: '🚶', yemek: '🍽️', içmek: '🥤', okumak: '📖', konuşmak: '🗣️',
  sevmek: '❤️', istemek: '🙏', bilmek: '🧠', anlamak: '💡', yapmak: '🛠️', öğrenmek: '🎓',
  üzgün: '😢', yorgun: '🥱', kızgın: '😠', hasta: '🤒', iyi: '👍', kötü: '👎',
  hava: '🌤️', güneş: '☀️', yağmur: '🌧️', kar: '❄️', sıcak: '🥵', soğuk: '🥶',
  elbise: '👗', gömlek: '👔', ayakkabı: '👟', şapka: '👒', ceket: '🧥', pantolon: '👖',
  baş: '🙆', göz: '👁️', el: '✋', ayak: '🦶', ağız: '👄', kulak: '👂',
  otel: '🏨', havalimanı: '✈️', istasyon: '🚉', sokak: '🛣️', deniz: '🌊', müze: '🏛️',
  sağ: '👉', sol: '👈', düz: '⬆️', yakın: '📍', uzak: '🔭', burada: '📌',
  para: '💵', ucuz: '🏷️', pahalı: '💎', market: '🛒', almak: '🛍️', indirim: '🔖',
  menü: '📋', hesap: '🧾', garson: '🤵', tatlı: '🍰', çorba: '🍲', salata: '🥗',
  aşk: '💘', kalp: '❤️', canım: '🥰', mutlu: '😊', birlikte: '🤝', güzel: '✨',
  sarılmak: '🤗', özlemek: '🥺', öpmek: '😘', hayat: '🌱', söz: '🤞', 'sonsuza dek': '♾️',
}

// Қазақ пен түрік — туыс тілдер. Ұқсас сөздер бірден есте қалады.
const S = (kk: string, note?: string): Cognate => ({ kind: 'same', kk, note })
const F = (kk: string, note: string): Cognate => ({ kind: 'false', kk, note })

const COGNATES: Record<string, Cognate> = {
  ben: S('мен'), sen: S('сен'), biz: S('біз'),
  anne: S('ана'), kız: S('қыз'), oğul: S('ұл'), ev: S('үй'),
  baba: F('баба', 'Түрікше baba — әке. Қазақша «баба» — ата-баба, арғы ата.'),
  kardeş: S('қарындас', 'Түбірі ортақ, бірақ түрікше kardeş — кез келген бауыр (аға, іні, апа, сіңлі).'),
  kuş: S('құс'), balık: S('балық'), süt: S('сүт'), at: S('ат', 'Қазақша да «ат» — жылқы.'),
  köpek: S('күшік', 'Қазақша «күшік» — ит баласы, түрікше köpek — жалпы ит.'),
  küçük: S('кішкентай', 'Көне түрікше kiçig — «кіші».'), uyumak: S('ұйықтау'),
  su: S('су'), çay: S('шай'), et: S('ет'), elma: S('алма'), şeker: S('шекер', 'Қазақша «шекер» — қант кесегі.'),
  aç: S('аш'),
  bir: S('бір'), iki: S('екі'), üç: S('үш'), dört: S('төрт'), beş: S('бес'),
  altı: S('алты'), yedi: S('жеті'), sekiz: S('сегіз'), dokuz: S('тоғыз'), on: S('он'),
  yirmi: S('жиырма'), otuz: S('отыз'), kırk: S('қырық'), elli: S('елу'), yüz: S('жүз', 'Түрікше yüz — «жүз» сан және «бет, жүз».'),
  kırmızı: S('қызыл'), yeşil: S('жасыл'), sarı: S('сары'), renk: S('рең'),
  bugün: S('бүгін'), akşam: S('ақшам', 'Ескі қазақша «ақшам» — кеш.'),
  gece: S('кеш', 'Түбірі бір (көне keç). Бірақ түрікше gece — түн, қазақша «кеш» — кешкі уақыт.'),
  dün: F('түн', 'Түрікше dün — кеше! Қазақша «түн» — түрікше gece.'),
  cuma: S('жұма'),
  ne: S('не'), kim: S('кім'),
  kapı: S('қақпа', 'Түбірі бір: қақпа — үлкен есік.'),
  gelmek: S('келу'), gitmek: S('кету', 'Түрікше gitmek — бару, қазақша «кету».'),
  yemek: S('жеу'), içmek: S('ішу'), okumak: S('оқу'), bilmek: S('білу'),
  iyi: S('игі', 'Қазақша «игі» — жақсы (игі іс).'),
  sıcak: S('ыстық'), soğuk: S('суық'), yağmur: S('жаңбыр'), kar: S('қар'),
  güneş: S('күн', 'Түбірі бір: kün → güneş. Түрікше gün — күн (тәулік).'),
  baş: S('бас'), göz: S('көз'), ayak: S('аяқ'), ağız: S('ауыз'), kulak: S('құлақ'),
  el: F('ел', 'Түрікше el — қол! Қазақша «ел» — түрікше ülke.'),
  sağ: S('оң', 'Қазақша «сау» да осы түбірден: түрікше sağ — оң және сау.'),
  sol: S('сол'), yakın: S('жақын'),
  almak: S('алу'), hesap: S('есеп'),
  söz: S('сөз', 'Түрікше söz — сөз және уәде.'),
  ...VOCAB_COGNATES,
}

// ---------- Кеңейтілген сөздік (мәтін форматында) ----------

type Level = Word['level']
type Parsed = { level: Level; topic: string; tr: string; kk: string; ex?: [string, string] }

function parseVocab(text: string, defaultLevel: Level): Parsed[] {
  const out: Parsed[] = []
  let topic = ''
  let level = defaultLevel
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith('## ')) {
      // «## тақырып» немесе «## 4 | тақырып»
      const head = line.slice(3).split(' | ')
      if (head.length === 2) {
        level = Number(head[0]) as Level
        topic = head[1].trim()
      } else topic = head[0].trim()
      continue
    }
    const [tr, kk, exTr, exKk] = line.split(' | ').map((x) => x?.trim())
    if (!tr || !kk) continue
    out.push({ level, topic, tr, kk, ex: exTr && exKk ? [exTr, exKk] : undefined })
  }
  return out
}

const EXTENDED: Parsed[] = [
  ...parseVocab(VOCAB_A2, 2),
  ...parseVocab(VOCAB_B1, 3),
  ...parseVocab(VOCAB_B2, 4),
  ...parseVocab(VOCAB_C1, 5),
  ...parseVocab(VOCAB_EXTRA, 3),
]

// ---------- Сөздер тізімі ----------

let order = 0
const RAW: Word[] = [
  ...COURSE.flatMap((u) =>
    u.lessons.flatMap((l) =>
      l.words.map(([tr, kk]) => ({ tr, kk, topic: u.title, level: 1 as const, order: order++, emoji: EMOJI[tr], cognate: COGNATES[tr] })),
    ),
  ),
  ...VOCAB.flatMap((g) =>
    g.words.map(([tr, kk, emoji]) => ({ tr, kk, topic: g.topic, level: g.level, order: order++, emoji, cognate: COGNATES[tr] })),
  ),
  ...EXTENDED.map((p) => ({ tr: p.tr, kk: p.kk, topic: p.topic, level: p.level, order: order++, emoji: EMOJI[p.tr], cognate: COGNATES[p.tr] })),
]
// Деңгей бойынша реттеу (сөздік бірнеше файлдан жиналады)
RAW.sort((a, b) => a.level - b.level || a.order - b.order)

// Бір сөз екі жерде кездессе, біріншісін қалдырамыз
const seen = new Set<string>()
export const WORD_LIST: Word[] = RAW.filter((w) => (seen.has(w.tr) ? false : (seen.add(w.tr), true)))
export const WORDS = WORD_LIST

const BY_TR = new Map(WORD_LIST.map((w) => [w.tr, w]))
export const wordByTr = (tr: string) => BY_TR.get(tr)

// ---------- Сөйлемдегі сөздерді табу ----------

const lower = (s: string) => s.toLocaleLowerCase('tr')
export const tokensOf = (s: string) =>
  lower(s)
    .replace(/[.,!?;:“”"«»—-]/g, ' ')
    .split(/\s+/)
    .map((x) => x.replace(/[’'].*$/, '')) // İstanbul’a → istanbul
    .filter(Boolean)

const SOFT: Record<string, string[]> = { p: ['b'], ç: ['c'], t: ['d'], k: ['ğ', 'g'] }
const VOWELS = 'aeıioöuü'
// Зат есімнен кейінгі жиі қосымшалар (көптік, тәуелдік, септік, жіктік)
const NOUN_SUF = /^(l[ae]r)?(m|n|n?[ıiuü]n|y?[ıiuü]m|y?[ıiuü]z|s?[ıiuü]|y[ıiuü]|[ıiuü]m[ıiuü]z|[ıiuü]n[ıiuü]z|m[ıiuü]z|n[ıiuü]z|n?[dt][ae]n?|y?[ae]|n[ae]|y?l[ae]|d[ıiuü]r|k[ıiuü]|s[ıiuü]n|y?[dt][ıiuü]|y?m[ıiuü]ş)*$/
// Сөзжасам қосымшалары (ұзын түбірлерге): başarı-lı, deneyim-li, bilim-sel
const DERIV = /^(l[ıiuü]|s[ıiuü]z|c[ıiuü]|ç[ıiuü]|l[ıiuü]k|sel|sal|c[ae]|ç[ae])/
// Қысқа етістік түбірінен кейінгі қосымшалар
const VERB_SUF = /^(y?[ıiuü]yor|[ae]r|[ıiuü]r|[dt][ıiuü]|m[ae]|y?[ae]c[ae][kğ]|y?[ae]bil|y?[ıiuü]p|y?[ae]l[ıi]m|y?[ae]y[ıi]m|s[ıi]n|[ıiuü]n|y?[ıiuü]n|y?[ae]n|m[ae]k|m[ae]l[ıi])/

type Matcher = { tr: string; parts: string[][]; narrow: string[]; verb: boolean; len: number }

// Дауысты дыбысы түсетін сөздер: şehir → şehri, ağız → ağzı, oğul → oğlu
const DROP = new Set(['şehir', 'ağız', 'oğul', 'isim', 'akıl', 'resim', 'vakit', 'kayıp', 'fikir', 'burun', 'omuz', 'karın', 'alın', 'beyin', 'nehir', 'gönül', 'boyun', 'şekil', 'kayın'])

function stems(word: string): { stems: string[]; narrow: string[]; verb: boolean } {
  let w = lower(word)
  const verb = /(mak|mek)$/.test(w) && w.length > 4
  if (verb) w = w.slice(0, -3)
  const out = new Set([w])
  const last = w[w.length - 1]
  if (SOFT[last] && w.length >= 3) for (const x of SOFT[last]) out.add(w.slice(0, -1) + x) // kitap → kitab-ı, renk → reng-i
  if (!verb && DROP.has(w)) out.add(w.slice(0, -2) + last)
  // Етістікте -yor алдында дауысты тарылады: başla → başlıyor, öde → ödüyor
  const narrow = verb && 'ae'.includes(last) ? [...'ıiuü'].map((v) => w.slice(0, -1) + v) : []
  void VOWELS
  return { stems: [...out], narrow, verb }
}

function partMatches(token: string, st: string[], verb: boolean, allowSuffix: boolean, narrow: string[] = []) {
  // Тарылған түбір тек -yor алдында: başlıyor, ödüyor
  if (allowSuffix && narrow.some((n) => token.startsWith(n + 'yor'))) return true
  for (const s of st) {
    if (token === s) return true
    if (!allowSuffix || !token.startsWith(s)) continue
    const rest = token.slice(s.length)
    if (verb) {
      if (s.length >= 3 || VERB_SUF.test(rest)) return true
    } else if (NOUN_SUF.test(rest) || (s.length >= 4 && DERIV.test(rest))) return true
  }
  return false
}

const MATCHERS: Matcher[] = WORD_LIST.map((w) => {
  const pieces = w.tr.split(' ')
  const parts = pieces.map((p, i) => (i === pieces.length - 1 ? stems(p).stems : stems(p).stems.filter((x) => !/(mak|mek)$/.test(x))))
  const info = stems(pieces[pieces.length - 1])
  const verb = info.verb
  // Ұзын түбір бірінші тексеріледі (soru ≠ sor-mak), тең болса — зат есім бірінші
  return { tr: w.tr, parts, narrow: info.narrow, verb, len: Math.max(...parts[parts.length - 1].map((x) => x.length)) * 2 + (verb ? 0 : 1) }
}).sort((a, b) => b.parts.length - a.parts.length || b.len - a.len)

/** Сөйлемде кездесетін сөздік сөздері және танылмаған сөздер саны */
export function analyze(sentence: string): { uses: string[]; unknown: number } {
  const toks = tokensOf(sentence)
  const used = new Set<string>()
  let unknown = 0
  for (let i = 0; i < toks.length; i++) {
    let hit: Matcher | undefined
    for (const m of MATCHERS) {
      if (i + m.parts.length > toks.length) continue
      const lastPart = (j: number) => j === m.parts.length - 1
      // Тіркестің әр бөлігі де түрленуі мүмкін: göz-üm kal-dı, el-i açık-tı
      const ok = m.parts.every((st, j) => partMatches(toks[i + j], st, m.verb && lastPart(j), true, lastPart(j) ? m.narrow : []))
      if (ok) {
        hit = m
        break
      }
    }
    if (hit) {
      used.add(hit.tr)
      i += hit.parts.length - 1
    } else unknown++
  }
  return { uses: [...used], unknown }
}

// ---------- Сөйлемдер банкі ----------

export type Sentence = { tr: string; kk: string; uses: string[]; unknown: number; tokens: number }

const rawSentences: [string, string][] = [
  ...COURSE.flatMap((u) => u.lessons.flatMap((l) => l.sentences)),
  ...VOCAB.flatMap((g) => g.words.map(([, , , ex, exKk]) => [ex, exKk] as [string, string])),
  ...EXTRA_EXAMPLES,
  ...BRIDGES,
  ...EXTENDED.filter((p) => p.ex).map((p) => p.ex as [string, string]),
  ...[...DIALOGS, ...EPISODES].flatMap((d) => d.lines.filter((l) => !/\{[AB]\}/.test(l.tr)).map((l) => [l.tr, l.kk] as [string, string])),
  ...STORIES.flatMap((s) => s.lines),
]

const sentSeen = new Set<string>()
export const SENTENCE_BANK: Sentence[] = rawSentences
  .filter(([tr]) => (sentSeen.has(tr) ? false : (sentSeen.add(tr), true)))
  .map(([tr, kk]) => ({ tr, kk, ...analyze(tr), tokens: tokensOf(tr).length }))

/** Ескі API: [түрікше, қазақша] жұптары */
export const SENTENCES: [string, string][] = SENTENCE_BANK.map((s) => [s.tr, s.kk])

/** Деңгей шкаласы (деңгей тесті үшін) */
export const BANDS = [
  { id: 'A1', label: 'A1 · Бастауыш', words: WORD_LIST.filter((w) => w.level === 1).slice(0, 100) },
  { id: 'A1+', label: 'A1+ · Бастауыш+', words: WORD_LIST.filter((w) => w.level === 1).slice(100) },
  { id: 'A2', label: 'A2 · Негізгі', words: WORD_LIST.filter((w) => w.level === 2) },
  { id: 'B1', label: 'B1 · Орта', words: WORD_LIST.filter((w) => w.level === 3) },
  { id: 'B2', label: 'B2 · Ортадан жоғары', words: WORD_LIST.filter((w) => w.level === 4) },
  { id: 'C1', label: 'C1 · Жоғары', words: WORD_LIST.filter((w) => w.level === 5) },
]
