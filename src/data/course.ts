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

const L = (id: string, title: string, words: Pair[], sentences: Pair[]): Lesson => ({ id, title, words, sentences })
const U = (id: string, title: string, icon: string, color: string, lessons: Lesson[]): Unit => ({ id, title, icon, color, lessons })

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
      L('numbers-3', 'Үлкен сандар', [['yirmi','жиырма'],['otuz','отыз'],['kırk','қырық'],['elli','елу'],['yüz','жүз'],['bin','мың']],
        [['Yirmi yaşındayım.','Мен жиырма жастамын.'],['Yüz lira, lütfen.','Жүз лира, өтінемін.'],['Bin teşekkürler!','Мың рахмет!']]),
    ],
  },

  U('colors', 'Түстер', '🎨', '#E86A92', [
    L('colors-1', 'Түстер', [['kırmızı','қызыл'],['mavi','көк'],['yeşil','жасыл'],['sarı','сары'],['mor','күлгін'],['pembe','қызғылт']],
      [['Gökyüzü mavi.','Аспан көк.'],['Elma kırmızı.','Алма қызыл.'],['En sevdiğim renk yeşil.','Менің ең жақсы көретін түсім — жасыл.']]),
    L('colors-2', 'Айнала', [['turuncu','қызғылт сары'],['gri','сұр'],['kahverengi','қоңыр'],['renk','түс'],['araba','көлік'],['çiçek','гүл']],
      [['Bu çiçek çok güzel.','Бұл гүл өте әдемі.'],['Benim arabam gri.','Менің көлігім сұр.'],['Turuncu kedi uyuyor.','Қызғылт сары мысық ұйықтап жатыр.']]),
  ]),
  U('time', 'Уақыт', '⏰', '#5C7CFA', [
    L('time-1', 'Бүгін, ертең', [['bugün','бүгін'],['yarın','ертең'],['dün','кеше'],['sabah','таңертең'],['akşam','кеш'],['gece','түн']],
      [['Bugün hava güzel.','Бүгін ауа райы жақсы.'],['Yarın görüşürüz.','Ертең кездесеміз.'],['Dün çok yorgundum.','Кеше мен қатты шаршадым.']]),
    L('time-2', 'Апта күндері', [['pazartesi','дүйсенбі'],['salı','сейсенбі'],['çarşamba','сәрсенбі'],['perşembe','бейсенбі'],['cuma','жұма'],['cumartesi','сенбі'],['pazar','жексенбі']],
      [['Bugün pazartesi.','Бүгін дүйсенбі.'],['Cuma günü sinemaya gidiyoruz.','Жұма күні киноға барамыз.'],['Pazar günü evdeyim.','Жексенбі күні үйдемін.']]),
  ]),
  U('questions', 'Сұрақтар', '❓', '#20C997', [
    L('questions-1', 'Не? Қайда?', [['ne','не'],['kim','кім'],['nerede','қайда'],['ne zaman','қашан'],['neden','неге'],['nasıl','қалай']],
      [['Bu ne?','Бұл не?'],['Sen neredesin?','Сен қайдасың?'],['Bu kim?','Бұл кім?'],['Neden gülüyorsun?','Неге күліп тұрсың?']]),
  ]),
  U('home', 'Үй', '🛋️', '#C08457', [
    L('home-1', 'Бөлмелер', [['oda','бөлме'],['mutfak','ас үй'],['kapı','есік'],['pencere','терезе'],['yatak','төсек'],['masa','үстел']],
      [['Mutfak çok temiz.','Ас үй өте таза.'],['Kapıyı aç, lütfen.','Есікті ашшы, өтінемін.'],['Kedi yatakta uyuyor.','Мысық төсекте ұйықтап жатыр.']]),
  ]),
  U('verbs', 'Етістіктер', '🏃', '#FF922B', [
    L('verbs-1', 'Күнделікті іс', [['gelmek','келу'],['gitmek','бару'],['yemek','жеу'],['içmek','ішу'],['okumak','оқу'],['konuşmak','сөйлеу']],
      [['Ben geliyorum.','Мен келе жатырмын.'],['Sen nereye gidiyorsun?','Сен қайда бара жатырсың?'],['Türkçe konuşuyorum.','Мен түрікше сөйлеймін.'],['Kitap okuyorum.','Мен кітап оқып отырмын.']]),
    L('verbs-2', 'Білемін, түсінемін', [['sevmek','жақсы көру'],['istemek','қалау'],['bilmek','білу'],['anlamak','түсіну'],['yapmak','істеу'],['öğrenmek','үйрену']],
      [['Anlamıyorum.','Түсінбеймін.'],['Bilmiyorum.','Білмеймін.'],['Türkçe öğreniyoruz.','Біз түрік тілін үйреніп жатырмыз.'],['Ne yapıyorsun?','Не істеп жатырсың?']]),
  ]),
  U('feelings', 'Сезімдер', '😊', '#FAB005', [
    L('feelings-1', 'Көңіл-күй', [['üzgün','мұңды'],['yorgun','шаршаған'],['kızgın','ашулы'],['hasta','ауру'],['iyi','жақсы'],['kötü','жаман']],
      [['Bugün çok yorgunum.','Бүгін мен қатты шаршадым.'],['Neden üzgünsün?','Неге мұңайып тұрсың?'],['Kendimi iyi hissediyorum.','Өзімді жақсы сезінемін.']]),
  ]),
  U('weather', 'Ауа райы', '☀️', '#339AF0', [
    L('weather-1', 'Күн мен жаңбыр', [['hava','ауа райы'],['güneş','күн'],['yağmur','жаңбыр'],['kar','қар'],['sıcak','ыстық'],['soğuk','суық']],
      [['Bugün hava çok sıcak.','Бүгін ауа райы өте ыстық.'],['Dışarıda yağmur yağıyor.','Сыртта жаңбыр жауып тұр.'],['Kışın kar yağar.','Қыста қар жауады.']]),
  ]),
  U('clothes', 'Киім', '👗', '#CC5DE8', [
    L('clothes-1', 'Гардероб', [['elbise','көйлек'],['gömlek','жейде'],['ayakkabı','аяқкиім'],['şapka','қалпақ'],['ceket','күрте'],['pantolon','шалбар']],
      [['Bu elbise çok güzel.','Бұл көйлек өте әдемі.'],['Ayakkabılarım nerede?','Менің аяқкиімім қайда?'],['Ceketini giy, hava soğuk.','Күртеңді ки, ауа райы суық.']]),
  ]),
  U('body', 'Дене', '🖐️', '#F06595', [
    L('body-1', 'Бас пен қол', [['baş','бас'],['göz','көз'],['el','қол'],['ayak','аяқ'],['ağız','ауыз'],['kulak','құлақ']],
      [['Başım ağrıyor.','Басым ауырып тұр.'],['Kedinin gözleri yeşil.','Мысықтың көздері жасыл.'],['Ellerini yıka.','Қолыңды жу.']]),
  ]),
  U('travel', 'Саяхат', '✈️', '#15AABF', [
    L('travel-1', 'Қалада', [['otel','қонақүй'],['havalimanı','әуежай'],['istasyon','бекет'],['sokak','көше'],['deniz','теңіз'],['müze','мұражай']],
      [['Otel nerede?','Қонақүй қайда?'],['Denize gidelim!','Теңізге барайық!'],['Havalimanına nasıl giderim?','Әуежайға қалай барамын?']]),
    L('travel-2', 'Бағыттар', [['sağ','оң'],['sol','сол'],['düz','тура'],['yakın','жақын'],['uzak','алыс'],['burada','осында']],
      [['Sağa dönün.','Оңға бұрылыңыз.'],['Müze çok yakın.','Мұражай өте жақын.'],['Düz gidin.','Тура жүріңіз.']]),
  ]),
  U('shopping', 'Дүкен', '🛒', '#51CF66', [
    L('shopping-1', 'Сатып алу', [['para','ақша'],['ucuz','арзан'],['pahalı','қымбат'],['market','дүкен'],['almak','сатып алу'],['indirim','жеңілдік']],
      [['Bu ne kadar?','Бұл қанша тұрады?'],['Çok pahalı!','Өте қымбат!'],['Ekmek almak istiyorum.','Мен нан сатып алғым келеді.']]),
  ]),
  U('restaurant', 'Мейрамхана', '🍲', '#FF6B6B', [
    L('restaurant-1', 'Тапсырыс', [['menü','мәзір'],['hesap','есепшот'],['garson','даяшы'],['tatlı','тәтті тағам'],['çorba','сорпа'],['salata','салат']],
      [['Menüyü alabilir miyim?','Мәзірді алсам бола ма?'],['Hesap, lütfen.','Есепшот, өтінемін.'],['Çorba çok sıcak.','Сорпа өте ыстық.']]),
  ]),
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
      L('love-2', 'Сағыныш', [['sarılmak','құшақтау'],['özlemek','сағыну'],['öpmek','сүю'],['hayat','өмір'],['söz','уәде'],['sonsuza dek','мәңгі']],
        [['Seni özledim.','Мен сені сағындым.'],['Sen benim hayatımsın.','Сен менің өмірімсің.'],['Sonsuza dek birlikte.','Мәңгі біргеміз.']]),
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
