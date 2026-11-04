// Бірге ойнайтын рөлдік диалогтар.
// Әр ойыншы өз рөлін алады да, өз репликасын түрікше құрастырады.

export type Line = { role: 'A' | 'B'; tr: string; kk: string }

export type Level = 1 | 2 | 3 // 1 — оңай, 2 — орта, 3 — қиын

export type Dialog = {
  id: string
  title: string
  icon: string
  level: Level
  series?: { name: string; episode: number } // сериал бөлімі
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
      A('Ben de memnun oldum. Nerelisin?', 'Мен де қуаныштымын. Қай жақтансың?'),
      B('Kazakistanlıyım. Ya sen?', 'Қазақстанданмын. Ал сен ше?'),
      A('Ben de! Burada ne yapıyorsun?', 'Мен де! Мұнда не істеп жүрсің?'),
      B('Türkçe öğreniyorum. Sen?', 'Түрік тілін үйреніп жүрмін. Сен ше?'),
      A('Ben de. Birlikte çalışalım mı?', 'Мен де. Бірге оқиық па?'),
      B('Harika fikir! Görüşürüz.', 'Керемет ой! Кездескенше.'),
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
      B('Kartla ödeyebilir miyim?', 'Картамен төлесем бола ма?'),
      A('Elbette. Çay nasıldı?', 'Әрине. Шай қалай болды?'),
      B('Çok güzeldi, teşekkürler.', 'Өте жақсы болды, рахмет.'),
      A('Yine bekleriz. İyi günler!', 'Тағы келіңіздер. Күніңіз сәтті болсын!'),
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
      A('Buzdolabında ne var?', 'Тоңазытқышта не бар?'),
      B('Tavuk, pirinç ve biraz sebze var.', 'Тауық, күріш және аздап көкөніс бар.'),
      A('O zaman tavuklu pilav yapalım.', 'Онда тауықты палау жасайық.'),
      B('Tamam, ben sebzeleri doğrarım.', 'Жарайды, мен көкөністерді турап берейін.'),
      A('Ben de pirinci yıkarım.', 'Мен күрішті жуайын.'),
      B('Birlikte yemek yapmak çok güzel.', 'Бірге тамақ пісіру өте жақсы.'),
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
      A('Başka bir şey ister misiniz?', 'Тағы бірдеңе керек пе?'),
      B('Bu elbiseye uygun bir çanta var mı?', 'Бұл көйлекке сай сөмке бар ма?'),
      A('Evet, şu siyah çanta çok yakışır.', 'Иә, анау қара сөмке өте жарасады.'),
      B('Güzelmiş. İkisini birlikte alıyorum.', 'Әдемі екен. Екеуін бірге аламын.'),
      A('Nakit mi, kartla mı ödeyeceksiniz?', 'Қолма-қол төлейсіз бе, картамен бе?'),
      B('Kartla, lütfen.', 'Картамен, өтінемін.'),
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
      A('Bavullarınız çok ağır mı?', 'Чемодандарыңыз ауыр ма?'),
      B('Evet, biraz ağır.', 'Иә, сәл ауыр.'),
      A('Ben yardım ederim. Geldik!', 'Мен көмектесейін. Келдік!'),
      B('Ne kadar tutuyor?', 'Қанша болды?'),
      A('Üç yüz lira.', 'Үш жүз лира.'),
      B('Buyurun, üstü kalsın.', 'Мархабат, қалғаны өзіңізде болсын.'),
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
      B('Odada internet var mı?', 'Бөлмеде интернет бар ма?'),
      A('Evet, şifre kartın üzerinde yazıyor.', 'Иә, құпиясөз картаның үстінде жазылған.'),
      B('Asansör nerede?', 'Лифт қайда?'),
      A('Sağ tarafta. İyi tatiller!', 'Оң жақта. Демалыстарыңыз жақсы өтсін!'),
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
      B('Çok isterim!', 'Қуана-қуана!'),
      A('Hangi filmi izleyelim?', 'Қай фильмді көрейік?'),
      B('Komik bir film olsun.', 'Күлкілі фильм болсын.'),
      A('Filmden sonra yemek yiyelim mi?', 'Фильмнен кейін тамақтанайық па?'),
      B('Olur! Ben pizza istiyorum.', 'Болады! Мен пицца қалаймын.'),
      A('O zaman saat yedide sinemanın önündeyim.', 'Онда сағат жетіде кинотеатр алдында боламын.'),
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


// ---------- Сериал: «Стамбұлдағы өміріміз» ----------
// Бөлімдер ретімен ашылады; әр бөлім алдыңғысының жалғасы.
const SERIES = 'Стамбұлдағы өміріміз'
const ep = (n: number, title: string, icon: string, level: Level, roles: { A: string; B: string }, lines: Line[]): Dialog => ({
  id: `ist-${n}`,
  title,
  icon,
  level,
  roles,
  lines,
  series: { name: SERIES, episode: n },
})

export const EPISODES: Dialog[] = [
  ep(1, 'Стамбұлға келдік', '✈️', 1, { A: '{A}', B: '{B}' }, [
    A('Sonunda İstanbul’dayız!', 'Ақыры Стамбұлдамыз!'),
    B('İnanamıyorum! Çok heyecanlıyım.', 'Сенбей тұрмын! Қатты толқып тұрмын.'),
    A('Bavullar nerede?', 'Чемодандар қайда?'),
    B('Şurada, mavi olanlar bizim.', 'Анау жерде, көктері біздікі.'),
    A('Tamam, ben alırım. Taksi mi, metro mu?', 'Жарайды, мен алайын. Такси ме, метро ма?'),
    B('Taksi daha rahat ama metro daha ucuz.', 'Такси ыңғайлырақ, бірақ метро арзанырақ.'),
    A('İlk gün taksiyle gidelim.', 'Бірінші күні таксимен барайық.'),
    B('Tamam. Otelin adresi telefonumda.', 'Жарайды. Қонақүйдің мекенжайы телефонымда.'),
    A('Bak, deniz görünüyor!', 'Қара, теңіз көрініп тұр!'),
    B('Ne kadar güzel! Burada çok mutlu olacağız.', 'Қандай әдемі! Мұнда өте бақытты боламыз.'),
  ]),
  ep(2, 'Пәтер іздеу', '🔑', 2, { A: 'Үй иесі', B: '{B}' }, [
    A('Hoş geldiniz! Daireyi görmek ister misiniz?', 'Қош келдіңіз! Пәтерді көргіңіз келе ме?'),
    B('Evet, lütfen. Kaç oda var?', 'Иә, өтінемін. Неше бөлме бар?'),
    A('İki oda ve bir salon var.', 'Екі бөлме және бір қонақ бөлмесі бар.'),
    B('Mutfak büyük mü?', 'Ас үй үлкен бе?'),
    A('Çok büyük değil ama çok aydınlık.', 'Онша үлкен емес, бірақ өте жарық.'),
    B('Kira ne kadar?', 'Жалдау ақысы қанша?'),
    A('Aylık on beş bin lira.', 'Айына он бес мың лира.'),
    B('Biraz pahalı. İndirim yapabilir misiniz?', 'Сәл қымбат. Жеңілдік жасай аласыз ба?'),
    A('Kedi besleyecek misiniz?', 'Мысық бағасыздар ма?'),
    B('Evet, küçük ve çok sessiz bir kedimiz var.', 'Иә, кішкентай әрі өте тыныш мысығымыз бар.'),
    A('Tamam, on dört bin olsun.', 'Жарайды, он төрт мың болсын.'),
    B('Anlaştık! Sözleşmeyi ne zaman imzalarız?', 'Келістік! Келісімшартқа қашан қол қоямыз?'),
  ]),
  ep(3, 'Алғашқы базар', '🧺', 2, { A: 'Сатушы', B: '{B}' }, [
    A('Buyurun abla, taze domates var!', 'Келіңіз, апа, балғын қызанақ бар!'),
    B('Domatesin kilosu ne kadar?', 'Қызанақтың келісі қанша?'),
    A('Kırk lira. Çok tatlı, deneyin!', 'Қырық лира. Өте тәтті, татып көріңіз!'),
    B('Gerçekten güzelmiş. İki kilo alayım.', 'Шынымен жақсы екен. Екі келі алайын.'),
    A('Başka ne istersiniz?', 'Тағы не қалайсыз?'),
    B('Biraz salatalık ve biber.', 'Аздап қияр мен бұрыш.'),
    A('Biber acı mı olsun, tatlı mı?', 'Бұрыш ащы болсын ба, тәтті ме?'),
    B('Tatlı olsun, acıyı sevmiyoruz.', 'Тәтті болсын, ащыны жақсы көрмейміз.'),
    A('Toplam yüz yirmi lira.', 'Барлығы жүз жиырма лира.'),
    B('Buyurun. Siz her hafta burada mısınız?', 'Мархабат. Сіз әр апта осында боласыз ба?'),
    A('Her cumartesi buradayım. Yine bekleriz!', 'Әр сенбі осындамын. Тағы келіңіз!'),
  ]),
  ep(4, 'Көршімен танысу', '🏘️', 2, { A: 'Көрші Айше', B: '{B}' }, [
    A('Merhaba! Yeni komşumuz musunuz?', 'Сәлеметсіз бе! Жаңа көршіміз сіз бе?'),
    B('Evet, geçen hafta taşındık. Ben {B}.', 'Иә, өткен аптада көштік. Мен {B}.'),
    A('Ben Ayşe. Hoş geldiniz!', 'Мен Айше. Қош келдіңіздер!'),
    B('Çok teşekkürler. Siz çok kibar birisiniz.', 'Көп рахмет. Сіз өте сыпайы екенсіз.'),
    A('Size ev yapımı börek getirdim.', 'Сіздерге үйде пісірілген бөрек әкелдім.'),
    B('Ne kadar naziksiniz! İçeri buyurun, çay içelim.', 'Қандай мейірімдісіз! Ішке кіріңіз, шай ішейік.'),
    A('Memnuniyetle! Nerelisiniz?', 'Қуана-қуана! Қай жақтансыздар?'),
    B('Kazakistan’dan geldik.', 'Қазақстаннан келдік.'),
    A('Kazakça ve Türkçe çok benziyor, değil mi?', 'Қазақша мен түрікше өте ұқсас, солай ма?'),
    B('Evet, birçok kelime aynı. Ama hâlâ öğreniyoruz.', 'Иә, көп сөз бірдей. Бірақ әлі үйреніп жүрміз.'),
    A('Bir şeye ihtiyacınız olursa kapımı çalın.', 'Бір нәрсе керек болса, есігімді қағыңыз.'),
    B('Çok sağ olun, Ayşe Hanım.', 'Көп рахмет, Айше ханым.'),
  ]),
  ep(5, 'Жұмыс сұхбаты', '💼', 3, { A: 'Жұмыс беруші', B: '{B}' }, [
    A('Hoş geldiniz. Lütfen oturun.', 'Қош келдіңіз. Отырыңыз.'),
    B('Teşekkür ederim.', 'Рахмет.'),
    A('Bize biraz kendinizden bahseder misiniz?', 'Өзіңіз туралы аздап айтып бересіз бе?'),
    B('Kazakistan’da beş yıl mühendis olarak çalıştım.', 'Қазақстанда бес жыл инженер болып жұмыс істедім.'),
    A('Türkçeniz çok iyi. Nerede öğrendiniz?', 'Түрікшеңіз өте жақсы. Қайда үйрендіңіз?'),
    B('Eşimle birlikte her gün çalışıyoruz.', 'Жұбайыммен бірге күн сайын оқимыз.'),
    A('Neden şirketimizde çalışmak istiyorsunuz?', 'Неге біздің компанияда жұмыс істегіңіз келеді?'),
    B('Projeleriniz çok ilginç ve yenilikçi.', 'Жобаларыңыз өте қызықты әрі жаңашыл.'),
    A('En büyük zayıf yönünüz nedir?', 'Ең әлсіз тұсыңыз қандай?'),
    B('Bazen çok mükemmeliyetçiyim, ama bunu kontrol ediyorum.', 'Кейде тым мінсіздікке ұмтыламын, бірақ мұны бақылаймын.'),
    A('Anlıyorum. Ne zaman başlayabilirsiniz?', 'Түсінікті. Қашан бастай аласыз?'),
    B('Gelecek pazartesi başlayabilirim.', 'Келесі дүйсенбіде бастай аламын.'),
    A('Harika. Size bu hafta haber vereceğiz.', 'Керемет. Сізге осы аптада хабар береміз.'),
  ]),
  ep(6, 'Бірінші апта', '☕', 2, { A: '{A}', B: '{B}' }, [
    A('İlk haftamız nasıl geçti sence?', 'Сенің ойыңша, бірінші аптамыз қалай өтті?'),
    B('Biraz yorucu ama çok güzel.', 'Сәл шаршатты, бірақ өте жақсы.'),
    A('İş görüşmesi iyi geçti, galiba beni alacaklar.', 'Сұхбат жақсы өтті, шамасы, мені алады.'),
    B('Çok sevindim! Seninle gurur duyuyorum.', 'Қатты қуандым! Сені мақтан тұтамын.'),
    A('Sen nasılsın? Kurs başladı mı?', 'Сен қалайсың? Курс басталды ма?'),
    B('Evet, yarın Türkçe kursuna başlıyorum.', 'Иә, ертең түрік тілі курсына барамын.'),
    A('Mia da yeni evine alıştı.', 'Миа да жаңа үйіне үйренді.'),
    B('Evet, bütün gün balkonda martıları izliyor.', 'Иә, күні бойы балконда шағалаларды бақылайды.'),
    A('Hafta sonu ne yapalım?', 'Демалыс күндері не істейміз?'),
    B('Boğaz’da yürüyüş yapalım mı?', 'Босфор жағасында серуендейік пе?'),
    A('Harika fikir! Simit ve çay alırız.', 'Керемет ой! Симит пен шай аламыз.'),
  ]),
  ep(7, 'Босфорда серуен', '🌉', 3, { A: '{A}', B: '{B}' }, [
    A('Şu manzaraya bak, inanılmaz!', 'Мына көрініске қара, ақылға сыймайды!'),
    B('Bir tarafta Avrupa, bir tarafta Asya.', 'Бір жағы — Еуропа, бір жағы — Азия.'),
    A('İki kıta arasında yaşıyoruz artık.', 'Енді екі құрлықтың арасында тұрамыз.'),
    B('Vapura binelim mi? Karşıya geçelim.', 'Паромға мінейік пе? Арғы бетке өтейік.'),
    A('Olur. Martılara simit atalım.', 'Болады. Шағалаларға симит лақтырайық.'),
    B('Dikkat et, simidini kapacaklar!', 'Абай бол, симитіңді іліп әкетеді!'),
    A('Çok geç, biri aldı bile!', 'Кеш, біреуі алып та кетті!'),
    B('Ha ha! Martılar çok cesur.', 'Ха-ха! Шағалалар өте батыл.'),
    A('Bu anı hiç unutmayacağım.', 'Бұл сәтті ешқашан ұмытпаймын.'),
    B('Ben de. Bir fotoğraf çekelim mi?', 'Мен де. Суретке түсейік пе?'),
    A('Tabii, gülümse!', 'Әрине, күлімде!'),
  ]),
  ep(8, 'Түрік тілі курсында', '🏫', 3, { A: 'Мұғалім', B: '{B}' }, [
    A('Günaydın! Bugün geçmiş zamanı öğreneceğiz.', 'Қайырлы таң! Бүгін өткен шақты үйренеміз.'),
    B('Hocam, geçmiş zaman zor mu?', 'Ұстаз, өткен шақ қиын ба?'),
    A('Hiç değil. Kazakçadaki “-ды, -ді” gibi.', 'Мүлде емес. Қазақшадағы «-ды, -ді» сияқты.'),
    B('Gerçekten mi? “Geldim” — “келдім”!', 'Шынымен бе? «Geldim» — «келдім»!'),
    A('Aynen öyle! Çok iyi.', 'Дәл солай! Өте жақсы.'),
    B('Peki “gidiyordum” ne demek?', 'Ал «gidiyordum» деген не?'),
    A('“Бара жатқан едім” demek.', '«Бара жатқан едім» дегенді білдіреді.'),
    B('Türkçe ve Kazakça gerçekten kardeş diller.', 'Түрікше мен қазақша шынымен туыс тілдер.'),
    A('Evet, aynı kökten geliyorlar.', 'Иә, бір түбірден шыққан.'),
    B('Ödevimiz ne, hocam?', 'Үй тапсырмамыз қандай, ұстаз?'),
    A('Dün yaptıklarınızı anlatan beş cümle yazın.', 'Кеше не істегендеріңіз туралы бес сөйлем жазыңыз.'),
  ]),
  ep(9, 'Мейрам', '🍬', 3, { A: 'Көрші Айше', B: '{B}' }, [
    A('Bayramınız mübarek olsun!', 'Айтыңыз мүбәрак болсын!'),
    B('Sizin de bayramınız mübarek olsun, Ayşe Hanım!', 'Сіздің де айтыңыз мүбәрак болсын, Айше ханым!'),
    A('Size bayram tatlısı getirdim, baklava.', 'Сіздерге мейрам тәттісін — пахлава әкелдім.'),
    B('Çok teşekkürler! Biz de size bir şey hazırladık.', 'Көп рахмет! Біз де сізге бір нәрсе дайындадық.'),
    A('Gerçekten mi? Nedir bu?', 'Шынымен бе? Бұл не?'),
    B('Bu Kazak bauırsağı. Bayramda mutlaka yapılır.', 'Бұл — қазақтың бауырсағы. Мейрамда міндетті түрде пісіріледі.'),
    A('Çok lezzetli! Tarifini verir misiniz?', 'Өте дәмді! Рецептін бересіз бе?'),
    B('Tabii. Un, süt, maya ve biraz şeker.', 'Әрине. Ұн, сүт, ашытқы және аздап қант.'),
    A('Bizde bayramda büyüklerin eli öpülür.', 'Бізде айтта үлкендердің қолы сүйіледі.'),
    B('Bizde de büyüklere selam verilir, hayır dua alınır.', 'Бізде де үлкендерге сәлем беріліп, бата алынады.'),
    A('Gelenekler ne kadar benziyor!', 'Дәстүрлер қаншалықты ұқсас!'),
    B('Evet, aslında bir aileyiz.', 'Иә, шын мәнінде біз бір отбасымыз.'),
  ]),
  ep(10, 'Үлкен жаңалық', '🎉', 3, { A: '{A}', B: '{B}' }, [
    A('Sana büyük bir haberim var!', 'Саған үлкен жаңалығым бар!'),
    B('Ne oldu? Çok merak ettim!', 'Не болды? Қатты қызығып кеттім!'),
    A('İşe kabul edildim!', 'Жұмысқа қабылдандым!'),
    B('İnanmıyorum! Tebrik ederim, canım!', 'Сенбеймін! Құттықтаймын, жаным!'),
    A('Pazartesi başlıyorum.', 'Дүйсенбіде бастаймын.'),
    B('Bunu kutlamalıyız!', 'Мұны тойлауымыз керек!'),
    A('Ayşe Hanım’ı da davet edelim mi?', 'Айше ханымды да шақырайық па?'),
    B('Tabii! Ben de bir haber vereyim.', 'Әрине! Мен де бір жаңалық айтайын.'),
    A('Ne haberi?', 'Қандай жаңалық?'),
    B('Kursta sınavı geçtim, artık B1 seviyesindeyim!', 'Курста емтиханнан өттім, енді B1 деңгейіндемін!'),
    A('Harika! İkimiz de başardık.', 'Керемет! Екеуміз де қол жеткіздік.'),
    B('Bu daha başlangıç. Devamı gelecek!', 'Бұл тек бастамасы. Жалғасы бар!'),
  ]),
]

export const dialogById = (id: string) => DIALOGS.find((d) => d.id === id) ?? EPISODES.find((d) => d.id === id)

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
