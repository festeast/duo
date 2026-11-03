// Бірге ойнайтын рөлдік диалогтар.
// Әр ойыншы өз рөлін алады да, өз репликасын түрікше құрастырады.

export type Line = { role: 'A' | 'B'; tr: string; kk: string }

export type Level = 1 | 2 | 3 // 1 — оңай, 2 — орта, 3 — қиын

export type Dialog = {
  id: string
  title: string
  icon: string
  level: Level
  // {A} және {B} — ойыншылардың аттары қойылатын орын
  roles: { A: string; B: string }
  lines: Line[]
}

const A = (tr: string, kk: string): Line => ({ role: 'A', tr, kk })
const B = (tr: string, kk: string): Line => ({ role: 'B', tr, kk })

export const DIALOGS: Dialog[] = [
  {
    id: 'meet',
    title: 'Танысу',
    icon: '👋',
    level: 1,
    roles: { A: '{A}', B: '{B}' },
    lines: [
      A('Merhaba!', 'Сәлем!'),
      B('Merhaba! Nasılsın?', 'Сәлем! Қалайсың?'),
      A('İyiyim, teşekkürler. Sen nasılsın?', 'Жақсымын, рахмет. Сен қалайсың?'),
      B('Ben de iyiyim. Adın ne?', 'Мен де жақсымын. Атың кім?'),
      A('Benim adım {A}. Senin adın ne?', 'Менің атым {A}. Сенің атың кім?'),
      B('Benim adım {B}. Tanıştığıma memnun oldum.', 'Менің атым {B}. Танысқаныма қуаныштымын.'),
    ],
  },
  {
    id: 'cafe',
    title: 'Кафеде',
    icon: '☕',
    level: 1,
    roles: { A: 'Даяшы', B: 'Қонақ' },
    lines: [
      A('Hoş geldiniz! Ne istersiniz?', 'Қош келдіңіз! Не қалайсыз?'),
      B('Bir çay, lütfen.', 'Бір шай, өтінемін.'),
      A('Şekerli mi?', 'Қантпен бе?'),
      B('Hayır, şekersiz.', 'Жоқ, қантсыз.'),
      A('Başka bir şey?', 'Тағы бірдеңе керек пе?'),
      B('Hesap, lütfen.', 'Есепшот, өтінемін.'),
      A('Tabii, buyurun.', 'Әрине, мархабат.'),
    ],
  },
  {
    id: 'dinner',
    title: 'Кешкі ас',
    icon: '🍝',
    level: 1,
    roles: { A: '{A}', B: '{B}' },
    lines: [
      A('Akşam yemeğinde ne yiyelim?', 'Кешкі асқа не жейміз?'),
      B('Bilmiyorum. Sen ne istiyorsun?', 'Білмеймін. Сен не қалайсың?'),
      A('Pizza sipariş edelim mi?', 'Пиццаға тапсырыс берейік пе?'),
      B('Hayır, ev yemeği istiyorum.', 'Жоқ, үй тамағын қалаймын.'),
      A('Tamam, birlikte yemek yapalım.', 'Жарайды, бірге тамақ дайындайық.'),
      B('Harika fikir!', 'Керемет ой!'),
    ],
  },
  {
    id: 'shop',
    title: 'Дүкенде',
    icon: '🛍️',
    level: 1,
    roles: { A: 'Сатушы', B: 'Сатып алушы' },
    lines: [
      A('Buyurun, yardım edebilir miyim?', 'Мархабат, көмектесейін бе?'),
      B('Bu elbise ne kadar?', 'Бұл көйлек қанша тұрады?'),
      A('Yüz lira.', 'Жүз лира.'),
      B('Çok pahalı! İndirim var mı?', 'Өте қымбат! Жеңілдік бар ма?'),
      A('Tamam, seksen lira olsun.', 'Жарайды, сексен лира болсын.'),
      B('Teşekkürler, alıyorum.', 'Рахмет, аламын.'),
    ],
  },
  {
    id: 'taxi',
    title: 'Таксиде',
    icon: '🚕',
    level: 1,
    roles: { A: 'Жүргізуші', B: 'Жолаушы' },
    lines: [
      A('Merhaba, nereye gidiyorsunuz?', 'Сәлеметсіз бе, қайда барасыз?'),
      B('Havalimanına, lütfen.', 'Әуежайға, өтінемін.'),
      A('Tamam. Acele var mı?', 'Жарайды. Асығып тұрсыз ба?'),
      B('Evet, uçağım saat sekizde.', 'Иә, ұшағым сағат сегізде.'),
      A('Merak etmeyin, yetişiriz.', 'Уайымдамаңыз, үлгереміз.'),
      B('Çok teşekkür ederim!', 'Көп рахмет!'),
    ],
  },
  {
    id: 'hotel',
    title: 'Қонақүйде',
    icon: '🏨',
    level: 1,
    roles: { A: 'Әкімші', B: 'Қонақ' },
    lines: [
      A('İyi akşamlar, hoş geldiniz!', 'Қайырлы кеш, қош келдіңіз!'),
      B('İyi akşamlar. Rezervasyonum var.', 'Қайырлы кеш. Менде брондау бар.'),
      A('Adınız nedir?', 'Атыңыз кім?'),
      B('Adım {B}.', 'Атым {B}.'),
      A('Odanız beşinci katta.', 'Бөлмеңіз бесінші қабатта.'),
      B('Kahvaltı saat kaçta?', 'Таңғы ас сағат нешеде?'),
      A('Sabah yedide.', 'Таңертең жетіде.'),
    ],
  },
  {
    id: 'date',
    title: 'Кездесу',
    icon: '💌',
    level: 1,
    roles: { A: '{A}', B: '{B}' },
    lines: [
      A('{B}, bu akşam boş musun?', '{B}, бүгін кешке бос боласың ба?'),
      B('Evet, neden?', 'Иә, неге?'),
      A('Seninle sinemaya gitmek istiyorum.', 'Сенімен киноға барғым келеді.'),
      B('Ne güzel! Saat kaçta?', 'Қандай керемет! Сағат нешеде?'),
      A('Saat yedide.', 'Сағат жетіде.'),
      B('Tamam, görüşürüz {A}!', 'Жарайды, кездескенше, {A}!'),
    ],
  },

  // ---------- Орта деңгей ----------
  {
    id: 'health',
    title: 'Дәрігерде',
    icon: '🩺',
    level: 2,
    roles: { A: 'Дәрігер', B: 'Науқас' },
    lines: [
      A('Şikayetiniz nedir?', 'Сізді не мазалайды?'),
      B('Üç gündür başım ağrıyor ve ateşim var.', 'Үш күннен бері басым ауырып, қызуым бар.'),
      A('Öksürüğünüz var mı?', 'Жөтеліңіз бар ма?'),
      B('Evet, özellikle geceleri öksürüyorum.', 'Иә, әсіресе түнде жөтелемін.'),
      A('Grip olmuşsunuz. Bol su için ve dinlenin.', 'Сіз тұмауратып қалыпсыз. Көп су ішіп, демалыңыз.'),
      B('İlaç almam gerekiyor mu?', 'Дәрі ішуім керек пе?'),
      A('Size bir reçete yazacağım.', 'Сізге рецепт жазып беремін.'),
    ],
  },
  {
    id: 'education',
    title: 'Білім',
    icon: '🎓',
    level: 2,
    roles: { A: 'Оқушы', B: 'Кеңесші' },
    lines: [
      A('Üniversitede hangi bölümü seçmeliyim?', 'Университетте қай мамандықты таңдауым керек?'),
      B('Hangi dersleri seviyorsun?', 'Қай сабақтарды жақсы көресің?'),
      A('Matematik ve fizik en sevdiğim dersler.', 'Математика мен физика — менің ең сүйікті сабақтарым.'),
      B('O zaman mühendislik senin için uygun olabilir.', 'Онда инженерия саған лайық болуы мүмкін.'),
      A('Burs almak için ne yapmam gerekiyor?', 'Шәкіртақы алу үшін не істеуім керек?'),
      B('Sınavda yüksek puan alman lazım.', 'Емтиханда жоғары балл алуың керек.'),
      A('Çok çalışacağım, teşekkür ederim!', 'Көп оқимын, рахмет!'),
    ],
  },
  {
    id: 'religion',
    title: 'Мешітте',
    icon: '🕌',
    level: 2,
    roles: { A: 'Қонақ', B: 'Имам' },
    lines: [
      A('Camiyi ziyaret edebilir miyiz?', 'Мешітке кіруге бола ма?'),
      B('Tabii, hoş geldiniz. Lütfen ayakkabılarınızı çıkarın.', 'Әрине, қош келдіңіздер. Аяқкиімдеріңізді шешіңіздер.'),
      A('Bu cami ne zaman yapıldı?', 'Бұл мешіт қашан салынған?'),
      B('On altıncı yüzyılda Mimar Sinan yaptı.', 'Он алтыншы ғасырда сәулетші Синан салған.'),
      A('Ramazan ayında burada iftar var mı?', 'Рамазан айында мұнда ауызашар бола ма?'),
      B('Evet, her akşam herkese iftar veriyoruz.', 'Иә, күн сайын кешке бәріне ауызашар береміз.'),
      A('Çok güzel bir gelenek.', 'Өте әдемі дәстүр.'),
    ],
  },
  {
    id: 'culture',
    title: 'Мәдениет',
    icon: '🎭',
    level: 2,
    roles: { A: '{A}', B: '{B}' },
    lines: [
      A('Türk kahvesini hiç denedin mi?', 'Түрік кофесін татып көрдің бе?'),
      B('Evet, ama bana çok sert geldi.', 'Иә, бірақ маған өте қою көрінді.'),
      A('Türkiye’de kahveden sonra fal bakılır.', 'Түркияда кофеден кейін бал ашады.'),
      B('Bizde de çay kültürü çok önemli.', 'Бізде де шай мәдениеті өте маңызды.'),
      A('Kazak çayı sütlü içilir, değil mi?', 'Қазақ шайы сүтпен ішіледі, солай ма?'),
      B('Evet, misafirlere her zaman çay ikram ederiz.', 'Иә, қонаққа әрқашан шай ұсынамыз.'),
    ],
  },
  {
    id: 'history',
    title: 'Тарих',
    icon: '🏛️',
    level: 2,
    roles: { A: 'Турист', B: 'Гид' },
    lines: [
      A('Ayasofya kaç yaşında?', 'Айя-София неше жаста?'),
      B('Yaklaşık bin beş yüz yıllık bir yapı.', 'Шамамен бір мың бес жүз жылдық ғимарат.'),
      A('Daha önce kilise miydi?', 'Бұрын шіркеу болған ба?'),
      B('Evet, sonra cami ve müze oldu.', 'Иә, кейін мешіт, сосын мұражай болды.'),
      A('Şimdi ne olarak kullanılıyor?', 'Қазір не ретінде қолданылады?'),
      B('2020’den beri tekrar cami olarak kullanılıyor.', '2020 жылдан бері қайтадан мешіт ретінде қолданылады.'),
    ],
  },

  // ---------- Қиын деңгей ----------
  {
    id: 'science',
    title: 'Ғылым',
    icon: '🔬',
    level: 3,
    roles: { A: 'Студент', B: 'Профессор' },
    lines: [
      A('Hocam, bu deney neden önemli?', 'Ұстаз, бұл тәжірибе неге маңызды?'),
      B('Bu deney, suyun nasıl temizlenebileceğini gösteriyor.', 'Бұл тәжірибе суды қалай тазартуға болатынын көрсетеді.'),
      A('Sonuçları ne zaman yayınlayacaksınız?', 'Нәтижелерін қашан жариялайсыз?'),
      B('Önce verileri dikkatlice analiz etmemiz gerekiyor.', 'Алдымен деректерді мұқият талдауымыз керек.'),
      A('Size yardım edebilir miyim?', 'Сізге көмектесе аламын ба?'),
      B('Elbette, laboratuvarda bir asistana ihtiyacımız var.', 'Әрине, зертханада бізге көмекші керек.'),
      A('Harika, yarın sabah gelirim.', 'Керемет, ертең таңертең келемін.'),
    ],
  },
  {
    id: 'work',
    title: 'Жұмыс сұхбаты',
    icon: '💼',
    level: 3,
    roles: { A: 'Жұмыс беруші', B: 'Үміткер' },
    lines: [
      A('Kendinizden biraz bahseder misiniz?', 'Өзіңіз туралы аздап айтып бересіз бе?'),
      B('Beş yıldır yazılım mühendisi olarak çalışıyorum.', 'Бес жылдан бері бағдарламашы-инженер болып жұмыс істеймін.'),
      A('Neden şirketimizde çalışmak istiyorsunuz?', 'Неге біздің компанияда жұмыс істегіңіз келеді?'),
      B('Yenilikçi projelerinizden çok etkilendim.', 'Сіздердің жаңашыл жобаларыңыз маған қатты әсер етті.'),
      A('En güçlü yönünüz nedir?', 'Ең күшті жағыңыз қандай?'),
      B('Takım çalışmasına yatkınım ve hızlı öğrenirim.', 'Командада жұмыс істеуге бейіммін және тез үйренемін.'),
      A('Teşekkürler, size en kısa sürede dönüş yapacağız.', 'Рахмет, сізге жақын арада хабарласамыз.'),
    ],
  },
  {
    id: 'nature',
    title: 'Экология',
    icon: '🌍',
    level: 3,
    roles: { A: '{A}', B: '{B}' },
    lines: [
      A('İklim değişikliği hakkında ne düşünüyorsun?', 'Климаттың өзгеруі туралы не ойлайсың?'),
      B('Bence dünyanın en büyük sorunu bu.', 'Менің ойымша, бұл — әлемнің ең үлкен мәселесі.'),
      A('Biz ne yapabiliriz?', 'Біз не істей аламыз?'),
      B('Daha az plastik kullanabilir ve geri dönüşüm yapabiliriz.', 'Пластикті азырақ қолданып, қалдықты қайта өңдей аламыз.'),
      A('Toplu taşıma da çevre için daha iyi.', 'Қоғамдық көлік те табиғатқа жақсырақ.'),
      B('Haklısın, bundan sonra otobüsle gidelim.', 'Дұрыс айтасың, бұдан былай автобуспен жүрейік.'),
    ],
  },
  {
    id: 'literature',
    title: 'Әдебиет',
    icon: '📖',
    level: 3,
    roles: { A: '{A}', B: '{B}' },
    lines: [
      A('En sevdiğin yazar kim?', 'Ең сүйікті жазушың кім?'),
      B('Abay’ın şiirlerini çok seviyorum.', 'Абайдың өлеңдерін қатты жақсы көремін.'),
      A('Türk şairlerinden kimi okudun?', 'Түрік ақындарынан кімді оқыдың?'),
      B('Nazım Hikmet ve Yunus Emre’yi okudum.', 'Назым Хикмет пен Юнус Эмрені оқыдым.'),
      A('Yunus Emre’nin şiirleri sevgi hakkında.', 'Юнус Эмренің өлеңдері махаббат туралы.'),
      B('Abay da insan sevgisini anlatır.', 'Абай да адамға деген сүйіспеншілікті жырлайды.'),
    ],
  },
]

export const dialogById = (id: string) => DIALOGS.find((d) => d.id === id)

export const LEVEL_NAMES: Record<Level, string> = { 1: 'Оңай', 2: 'Орта', 3: 'Қиын' }

/** Тіркелген аттар жоқ болса қолданылатын аттар */
export const DEFAULT_NAMES = { A: 'Әділхан', B: 'Шырайлым' }

/** Рөл аты ойыншының атына байланған ба ({A}/{B}) */
export const isNamedRole = (label: string) => /^\{[AB]\}$/.test(label)

// Қазақша атты түрікше жазу: Әділхан → Edilhan, Шырайлым → Şıraylım
const LATIN: Record<string, string> = {
  а: 'a', ә: 'e', б: 'b', в: 'v', г: 'g', ғ: 'ğ', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z', и: 'i', й: 'y',
  к: 'k', қ: 'k', л: 'l', м: 'm', н: 'n', ң: 'n', о: 'o', ө: 'ö', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
  ұ: 'u', ү: 'ü', ф: 'f', х: 'h', һ: 'h', ц: 'ts', ч: 'ç', ш: 'ş', щ: 'şç', ъ: '', ы: 'ı', і: 'i', ь: '',
  э: 'e', ю: 'yu', я: 'ya',
}

export function toTurkishLatin(name: string) {
  return name
    .toLocaleLowerCase('kk')
    .split('')
    .map((c) => LATIN[c] ?? c)
    .join('')
    .split(' ')
    .map((w) => (w ? w[0].toLocaleUpperCase('tr') + w.slice(1) : w))
    .join(' ')
}

const cache = new Map<string, Dialog>()

/** Диалогқа ойыншылардың аттарын қояды (нәтиже кэштеледі — объект тұрақты болуы керек) */
export function personalize(d: Dialog, names: { A: string; B: string }): Dialog {
  const key = `${d.id}|${names.A}|${names.B}`
  const hit = cache.get(key)
  if (hit) return hit
  const fill = (s: string, latin: boolean) =>
    s.replace(/\{([AB])\}/g, (_, r: 'A' | 'B') => (latin ? toTurkishLatin(names[r]) : names[r]))
  const out: Dialog = {
    ...d,
    roles: { A: fill(d.roles.A, false), B: fill(d.roles.B, false) },
    lines: d.lines.map((l) => ({ ...l, tr: fill(l.tr, true), kk: fill(l.kk, false) })),
  }
  cache.set(key, out)
  return out
}
export const turnsOf = (d: Dialog) => d.lines.map((l) => l.role).join('')
