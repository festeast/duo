// Түрік тілі курсы (қазақ тілінде сөйлейтіндерге арналған).
// Жаңа сабақ қосу оңай: words — [түрікше, қазақша], sentences — [түрікше, қазақша].

export type Pair = [tr: string, kk: string]

export type Lesson = {
  id: string
  title: string
  words: Pair[]
  sentences: Pair[]
}

export type Unit = {
  id: string
  title: string
  icon: string
  color: string
  lessons: Lesson[]
}

export const COURSE: Unit[] = [
  {
    id: 'greet',
    title: 'Сәлемдесу',
    icon: '👋',
    color: '#38b764',
    lessons: [
      {
        id: 'greet-1',
        title: 'Сәлем!',
        words: [
          ['merhaba', 'сәлем'],
          ['günaydın', 'қайырлы таң'],
          ['iyi akşamlar', 'қайырлы кеш'],
          ['iyi geceler', 'қайырлы түн'],
          ['hoşça kal', 'сау бол'],
          ['görüşürüz', 'кездескенше'],
        ],
        sentences: [
          ['Merhaba, nasılsın?', 'Сәлем, қалайсың?'],
          ['İyiyim, teşekkürler.', 'Жақсымын, рахмет.'],
          ['Görüşürüz, hoşça kal!', 'Кездескенше, сау бол!'],
        ],
      },
      {
        id: 'greet-2',
        title: 'Танысу',
        words: [
          ['evet', 'иә'],
          ['hayır', 'жоқ'],
          ['teşekkürler', 'рахмет'],
          ['lütfen', 'өтінемін'],
          ['ben', 'мен'],
          ['sen', 'сен'],
        ],
        sentences: [
          ['Benim adım Ayşe.', 'Менің атым Айша.'],
          ['Senin adın ne?', 'Сенің атың кім?'],
          ['Tanıştığıma memnun oldum.', 'Танысқаныма қуаныштымын.'],
        ],
      },
    ],
  },
  {
    id: 'family',
    title: 'Отбасы',
    icon: '🏠',
    color: '#41a6f6',
    lessons: [
      {
        id: 'family-1',
        title: 'Менің отбасым',
        words: [
          ['anne', 'ана'],
          ['baba', 'әке'],
          ['kardeş', 'бауыр'],
          ['aile', 'отбасы'],
          ['çocuk', 'бала'],
          ['eş', 'жұбай'],
        ],
        sentences: [
          ['Bu benim eşim.', 'Бұл менің жұбайым.'],
          ['Ailemi seviyorum.', 'Мен отбасымды жақсы көремін.'],
          ['Annem ve babam evde.', 'Анам мен әкем үйде.'],
        ],
      },
      {
        id: 'family-2',
        title: 'Үй',
        words: [
          ['kız', 'қыз'],
          ['oğul', 'ұл'],
          ['büyükanne', 'әже'],
          ['büyükbaba', 'ата'],
          ['ev', 'үй'],
          ['biz', 'біз'],
        ],
        sentences: [
          ['Biz bir aileyiz.', 'Біз бір отбасымыз.'],
          ['Büyükannem çok iyi.', 'Әжем өте жақсы.'],
          ['Bu bizim evimiz.', 'Бұл біздің үйіміз.'],
        ],
      },
    ],
  },
  {
    id: 'cats',
    title: 'Мысықтар',
    icon: '🐱',
    color: '#ef7d57',
    lessons: [
      {
        id: 'cats-1',
        title: 'Жануарлар',
        words: [
          ['kedi', 'мысық'],
          ['köpek', 'ит'],
          ['kuş', 'құс'],
          ['balık', 'балық'],
          ['süt', 'сүт'],
          ['at', 'жылқы'],
        ],
        sentences: [
          ['Kedi süt içiyor.', 'Мысық сүт ішіп жатыр.'],
          ['Benim bir kedim var.', 'Менің бір мысығым бар.'],
          ['Köpek çok büyük.', 'Ит өте үлкен.'],
        ],
      },
      {
        id: 'cats-2',
        title: 'Сүйкімді мысық',
        words: [
          ['küçük', 'кішкентай'],
          ['büyük', 'үлкен'],
          ['siyah', 'қара'],
          ['beyaz', 'ақ'],
          ['sevimli', 'сүйкімді'],
          ['uyumak', 'ұйықтау'],
        ],
        sentences: [
          ['Küçük kedi uyuyor.', 'Кішкентай мысық ұйықтап жатыр.'],
          ['Benim kedim siyah.', 'Менің мысығым қара.'],
          ['Kedi çok sevimli.', 'Мысық өте сүйкімді.'],
        ],
      },
    ],
  },
  {
    id: 'food',
    title: 'Тамақ',
    icon: '🍞',
    color: '#ffcd75',
    lessons: [
      {
        id: 'food-1',
        title: 'Дастарқан',
        words: [
          ['ekmek', 'нан'],
          ['su', 'су'],
          ['çay', 'шай'],
          ['kahve', 'кофе'],
          ['et', 'ет'],
          ['elma', 'алма'],
        ],
        sentences: [
          ['Bir çay, lütfen.', 'Бір шай, өтінемін.'],
          ['Ben ekmek yiyorum.', 'Мен нан жеп отырмын.'],
          ['Su içmek istiyorum.', 'Мен су ішкім келеді.'],
        ],
      },
      {
        id: 'food-2',
        title: 'Таңғы ас',
        words: [
          ['peynir', 'ірімшік'],
          ['yumurta', 'жұмыртқа'],
          ['şeker', 'қант'],
          ['kahvaltı', 'таңғы ас'],
          ['lezzetli', 'дәмді'],
          ['aç', 'аш'],
        ],
        sentences: [
          ['Yemek çok lezzetli.', 'Тамақ өте дәмді.'],
          ['Ben çok açım.', 'Мен қатты ашпын.'],
          ['Kahvaltı hazır.', 'Таңғы ас дайын.'],
        ],
      },
    ],
  },
  {
    id: 'numbers',
    title: 'Сандар',
    icon: '🔢',
    color: '#73eff7',
    lessons: [
      {
        id: 'numbers-1',
        title: '1–5',
        words: [
          ['bir', 'бір'],
          ['iki', 'екі'],
          ['üç', 'үш'],
          ['dört', 'төрт'],
          ['beş', 'бес'],
        ],
        sentences: [
          ['Bir, iki, üç!', 'Бір, екі, үш!'],
          ['İki kedim var.', 'Менің екі мысығым бар.'],
          ['Üç çay, lütfen.', 'Үш шай, өтінемін.'],
        ],
      },
      {
        id: 'numbers-2',
        title: '6–10',
        words: [
          ['altı', 'алты'],
          ['yedi', 'жеті'],
          ['sekiz', 'сегіз'],
          ['dokuz', 'тоғыз'],
          ['on', 'он'],
        ],
        sentences: [
          ['On elma var.', 'Он алма бар.'],
          ['Bir haftada yedi gün var.', 'Бір аптада жеті күн бар.'],
          ['Saat sekiz.', 'Сағат сегіз.'],
        ],
      },
    ],
  },
  {
    id: 'love',
    title: 'Махаббат',
    icon: '❤️',
    color: '#b13e53',
    lessons: [
      {
        id: 'love-1',
        title: 'Жаным',
        words: [
          ['aşk', 'махаббат'],
          ['kalp', 'жүрек'],
          ['canım', 'жаным'],
          ['mutlu', 'бақытты'],
          ['birlikte', 'бірге'],
          ['güzel', 'әдемі'],
        ],
        sentences: [
          ['Seni seviyorum.', 'Мен сені жақсы көремін.'],
          ['Birlikte öğreniyoruz.', 'Біз бірге үйреніп жатырмыз.'],
          ['Sen çok güzelsin.', 'Сен өте әдемісің.'],
          ['Çok mutluyum.', 'Мен өте бақыттымын.'],
        ],
      },
    ],
  },
]

export const ALL_LESSONS = COURSE.flatMap((u) => u.lessons.map((l) => ({ ...l, unit: u })))

export const lessonById = (id: string) => ALL_LESSONS.find((l) => l.id === id)

/** Сабақ ашық па: алдыңғы сабақ өтілген болса ғана ашылады. */
export function isUnlocked(id: string, done: Record<string, number>) {
  const i = ALL_LESSONS.findIndex((l) => l.id === id)
  return i <= 0 || (done[ALL_LESSONS[i - 1].id] ?? 0) > 0
}
