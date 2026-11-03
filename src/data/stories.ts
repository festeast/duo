// Қысқа әңгімелер (comprehensible input): түсінікті мәтінді көп оқу/тыңдау.
// Әр сөзді басқанда аудармасы шығады (gloss — сөзбе-сөз аударма).

export type Story = {
  id: string
  title: string
  icon: string
  level: 1 | 2 | 3
  lines: [tr: string, kk: string][]
  gloss: Record<string, string> // кіші әріппен жазылған сөз → қазақша
}

export const STORIES: Story[] = [
  {
    id: 'mia',
    title: 'Мысығымыз Миа',
    icon: '🐱',
    level: 1,
    lines: [
      ['Bizim bir kedimiz var.', 'Біздің бір мысығымыз бар.'],
      ['Onun adı Mia.', 'Оның аты — Миа.'],
      ['Mia küçük ve çok sevimli.', 'Миа кішкентай және өте сүйкімді.'],
      ['Sabah süt içer.', 'Таңертең сүт ішеді.'],
      ['Öğleden sonra pencerede uyur.', 'Түстен кейін терезе алдында ұйықтайды.'],
      ['Akşam bizimle oynar.', 'Кешке бізбен ойнайды.'],
      ['Mia’yı çok seviyoruz.', 'Біз Мианы қатты жақсы көреміз.'],
    ],
    gloss: {
      bizim: 'біздің', bir: 'бір', kedimiz: 'мысығымыз', var: 'бар', onun: 'оның', adı: 'аты', mia: 'Миа',
      küçük: 'кішкентай', ve: 'және', çok: 'өте', sevimli: 'сүйкімді', sabah: 'таңертең', süt: 'сүт',
      içer: 'ішеді', öğleden: 'түстен', sonra: 'кейін', pencerede: 'терезеде', uyur: 'ұйықтайды',
      akşam: 'кешке', bizimle: 'бізбен', oynar: 'ойнайды', 'mia’yı': 'Мианы', seviyoruz: 'жақсы көреміз',
    },
  },
  {
    id: 'sunday',
    title: 'Жексенбі таңы',
    icon: '☀️',
    level: 1,
    lines: [
      ['Bugün pazar.', 'Бүгін жексенбі.'],
      ['Erken kalkıyoruz.', 'Біз ерте тұрамыз.'],
      ['Ben çay yapıyorum.', 'Мен шай дайындап жатырмын.'],
      ['Eşim ekmek ve peynir getiriyor.', 'Жұбайым нан мен ірімшік әкеліп жатыр.'],
      ['Birlikte kahvaltı yapıyoruz.', 'Біз бірге таңғы ас ішіп жатырмыз.'],
      ['Kahvaltı çok lezzetli.', 'Таңғы ас өте дәмді.'],
      ['Sonra parkta yürüyoruz.', 'Сосын саябақта серуендейміз.'],
    ],
    gloss: {
      bugün: 'бүгін', pazar: 'жексенбі', erken: 'ерте', kalkıyoruz: 'тұрамыз', ben: 'мен', çay: 'шай',
      yapıyorum: 'дайындап жатырмын', eşim: 'жұбайым', ekmek: 'нан', ve: 'және', peynir: 'ірімшік',
      getiriyor: 'әкеліп жатыр', birlikte: 'бірге', kahvaltı: 'таңғы ас', yapıyoruz: 'істеп жатырмыз',
      çok: 'өте', lezzetli: 'дәмді', sonra: 'сосын', parkta: 'саябақта', yürüyoruz: 'серуендейміз',
    },
  },
  {
    id: 'market',
    title: 'Базарда',
    icon: '🍅',
    level: 2,
    lines: [
      ['Cumartesi günü pazara gidiyoruz.', 'Сенбі күні базарға барамыз.'],
      ['Pazarda çok insan var.', 'Базарда адам көп.'],
      ['Domatesler kırmızı ve taze.', 'Қызанақтар қызыл әрі балғын.'],
      ['“Bir kilo elma ne kadar?” diye soruyorum.', '«Бір келі алма қанша тұрады?» деп сұраймын.'],
      ['Satıcı “Otuz lira” diyor.', 'Сатушы «Отыз лира» дейді.'],
      ['Biraz pahalı ama elmalar çok güzel.', 'Сәл қымбат, бірақ алмалар өте әдемі.'],
      ['Eve mutlu dönüyoruz.', 'Үйге көңілді қайтамыз.'],
    ],
    gloss: {
      cumartesi: 'сенбі', günü: 'күні', pazara: 'базарға', gidiyoruz: 'барамыз', pazarda: 'базарда',
      çok: 'көп / өте', insan: 'адам', var: 'бар', domatesler: 'қызанақтар', kırmızı: 'қызыл', ve: 'және',
      taze: 'балғын', bir: 'бір', kilo: 'келі', elma: 'алма', ne: 'не', kadar: '(ne kadar — қанша)',
      diye: 'деп', soruyorum: 'сұраймын', satıcı: 'сатушы', otuz: 'отыз', lira: 'лира', diyor: 'дейді',
      biraz: 'сәл', pahalı: 'қымбат', ama: 'бірақ', elmalar: 'алмалар', güzel: 'әдемі', eve: 'үйге',
      mutlu: 'бақытты, көңілді', dönüyoruz: 'қайтамыз',
    },
  },
  {
    id: 'istanbul',
    title: 'Стамбұлға сапар',
    icon: '🌉',
    level: 2,
    lines: [
      ['Geçen yaz İstanbul’a gittik.', 'Өткен жазда Стамбұлға бардық.'],
      ['Otelimiz denize çok yakındı.', 'Қонақүйіміз теңізге өте жақын еді.'],
      ['Her sabah balkonda çay içtik.', 'Әр таңертең балконда шай іштік.'],
      ['Ayasofya’yı ve Kapalıçarşı’yı gezdik.', 'Айя-София мен Жабық базарды араладық.'],
      ['Akşamları balık yedik.', 'Кештері балық жедік.'],
      ['Türkçe konuşmaya çalıştık.', 'Түрікше сөйлеуге тырыстық.'],
      ['İnsanlar çok sıcak ve misafirperverdi.', 'Адамдар өте жылы әрі қонақжай еді.'],
    ],
    gloss: {
      geçen: 'өткен', yaz: 'жаз', 'istanbul’a': 'Стамбұлға', gittik: 'бардық', otelimiz: 'қонақүйіміз',
      denize: 'теңізге', çok: 'өте', yakındı: 'жақын еді', her: 'әр', sabah: 'таңертең', balkonda: 'балконда',
      çay: 'шай', içtik: 'іштік', 'ayasofya’yı': 'Айя-Софияны', ve: 'және', 'kapalıçarşı’yı': 'Жабық базарды',
      gezdik: 'араладық', akşamları: 'кештері', balık: 'балық', yedik: 'жедік', türkçe: 'түрікше',
      konuşmaya: 'сөйлеуге', çalıştık: 'тырыстық', insanlar: 'адамдар', sıcak: 'жылы, ыстық',
      misafirperverdi: 'қонақжай еді',
    },
  },
  {
    id: 'grandma',
    title: 'Әжемнің үйі',
    icon: '👵',
    level: 3,
    lines: [
      ['Çocukken yazları ninemin köyüne giderdim.', 'Бала кезімде жаз сайын әжемнің ауылына баратынмын.'],
      ['Köyde büyük bir bahçe vardı.', 'Ауылда үлкен бақ бар еді.'],
      ['Ninem her gün taze ekmek pişirirdi.', 'Әжем күн сайын жаңа нан пісіретін.'],
      ['Akşamları bize eski masallar anlatırdı.', 'Кештері бізге ескі ертегілер айтып беретін.'],
      ['O masalları hâlâ hatırlıyorum.', 'Сол ертегілер әлі есімде.'],
      ['Şimdi ben de çocuklarıma anlatıyorum.', 'Енді мен де балаларыма айтып беремін.'],
    ],
    gloss: {
      çocukken: 'бала кезімде', yazları: 'жаз сайын', ninemin: 'әжемнің', köyüne: 'ауылына',
      giderdim: 'баратынмын', köyde: 'ауылда', büyük: 'үлкен', bir: 'бір', bahçe: 'бақ', vardı: 'бар еді',
      ninem: 'әжем', her: 'әр', gün: 'күн', taze: 'жаңа, балғын', ekmek: 'нан', pişirirdi: 'пісіретін',
      akşamları: 'кештері', bize: 'бізге', eski: 'ескі', masallar: 'ертегілер', anlatırdı: 'айтып беретін',
      o: 'сол', masalları: 'ертегілерді', hâlâ: 'әлі күнге дейін', hatırlıyorum: 'есімде', şimdi: 'енді',
      ben: 'мен', de: 'де, да', çocuklarıma: 'балаларыма', anlatıyorum: 'айтып беремін',
    },
  },
]

/** Мәтінді сөздерге бөледі, тыныс белгілерін сақтап */
export function splitWords(line: string) {
  return line.split(/(\s+)/).filter(Boolean)
}

/** Сөзді сөздіктен іздеу үшін тазалау */
export const glossKey = (w: string) => w.toLocaleLowerCase('tr').replace(/[.,!?;:“”"«»]/g, '')
