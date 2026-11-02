// Бірге ойнайтын рөлдік диалогтар.
// Әр ойыншы өз рөлін алады да, өз репликасын түрікше құрастырады.

export type Line = { role: 'A' | 'B'; tr: string; kk: string }

export type Dialog = {
  id: string
  title: string
  icon: string
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
    roles: { A: 'Әли', B: 'Айша' },
    lines: [
      A('Merhaba!', 'Сәлем!'),
      B('Merhaba! Nasılsın?', 'Сәлем! Қалайсың?'),
      A('İyiyim, teşekkürler. Sen nasılsın?', 'Жақсымын, рахмет. Сен қалайсың?'),
      B('Ben de iyiyim. Adın ne?', 'Мен де жақсымын. Атың кім?'),
      A('Benim adım Ali.', 'Менің атым Әли.'),
      B('Tanıştığıma memnun oldum.', 'Танысқаныма қуаныштымын.'),
    ],
  },
  {
    id: 'cafe',
    title: 'Кафеде',
    icon: '☕',
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
    roles: { A: 'Әли', B: 'Айша' },
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
    roles: { A: 'Әкімші', B: 'Қонақ' },
    lines: [
      A('İyi akşamlar, hoş geldiniz!', 'Қайырлы кеш, қош келдіңіз!'),
      B('İyi akşamlar. Rezervasyonum var.', 'Қайырлы кеш. Менде брондау бар.'),
      A('Adınız nedir?', 'Атыңыз кім?'),
      B('Adım Ayşe Kaya.', 'Атым Айша Қая.'),
      A('Odanız beşinci katta.', 'Бөлмеңіз бесінші қабатта.'),
      B('Kahvaltı saat kaçta?', 'Таңғы ас сағат нешеде?'),
      A('Sabah yedide.', 'Таңертең жетіде.'),
    ],
  },
  {
    id: 'date',
    title: 'Кездесу',
    icon: '💌',
    roles: { A: 'Әли', B: 'Айша' },
    lines: [
      A('Bu akşam boş musun?', 'Бүгін кешке бос боласың ба?'),
      B('Evet, neden?', 'Иә, неге?'),
      A('Seninle sinemaya gitmek istiyorum.', 'Сенімен киноға барғым келеді.'),
      B('Ne güzel! Saat kaçta?', 'Қандай керемет! Сағат нешеде?'),
      A('Saat yedide.', 'Сағат жетіде.'),
      B('Tamam, görüşürüz canım!', 'Жарайды, кездескенше, жаным!'),
    ],
  },
]

export const dialogById = (id: string) => DIALOGS.find((d) => d.id === id)
export const turnsOf = (d: Dialog) => d.lines.map((l) => l.role).join('')
