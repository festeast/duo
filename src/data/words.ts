// Сөздік: курстағы барлық сөздер бір тізімде + сурет (эмодзи) + қазақшаға ұқсастығы.
import { COURSE } from './course'

export type Word = {
  tr: string // түрікше (бұл сөздің id-і де)
  kk: string // қазақша
  topic: string // тақырып (бөлім аты)
  order: number // үйрену реті
  emoji?: string
  cognate?: Cognate
}

/** same — қазақшаға ұқсас сөз; false — «жалған дос»: ұқсас, бірақ мағынасы басқа */
export type Cognate = { kind: 'same' | 'false'; kk: string; note?: string }

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
}

let order = 0
export const WORDS: Word[] = COURSE.flatMap((u) =>
  u.lessons.flatMap((l) =>
    l.words.map(([tr, kk]) => ({ tr, kk, topic: u.title, order: order++, emoji: EMOJI[tr], cognate: COGNATES[tr] })),
  ),
)

// Бір сөз екі сабақта кездессе, біріншісін қалдырамыз
const seen = new Set<string>()
export const WORD_LIST = WORDS.filter((w) => (seen.has(w.tr) ? false : (seen.add(w.tr), true)))

export const wordByTr = (tr: string) => WORD_LIST.find((w) => w.tr === tr)

/** Курстағы барлық сөйлемдер — сөздерді контексте көрсету үшін */
export const SENTENCES = COURSE.flatMap((u) => u.lessons.flatMap((l) => l.sentences))
