// Түрік телехикаяларында жиі естілетін ауызекі тіркестер.
// Әр тіркеске — сериал стиліндегі шағын сахна (өзіміз жаздық).
// cast: [есімі, дауысы 'f' (әйел) | 'm' (ер)]; lines: [кейіпкер индексі, түрікше, қазақша]

export type Voice = 'f' | 'm'
export type Scene = { place: string; cast: [string, Voice][]; lines: [number, string, string][] }
export type Phrase = { tr: string; kk: string; note: string; emoji: string; scene: Scene }

export const PHRASES: Phrase[] = [
  {
    tr: 'Kolay gelsin.',
    kk: 'Жұмысыңа сәт! / Қолыңа күш!',
    note: 'Жұмыс істеп жатқан адамға айтылады: сатушыға, даяшыға, үй жинап жатқан жұбайыңа.',
    emoji: '💪',
    scene: {
      place: 'Маһалладағы шағын дүкен. Мурат таңертең нан алуға кірді.',
      cast: [['Murat', 'm'], ['Hasan Amca', 'm']],
      lines: [
        [0, 'Günaydın Hasan Amca, kolay gelsin!', 'Қайырлы таң, Хасан аға, жұмысыңызға сәт!'],
        [1, 'Sağ ol evladım. Erken kalkmışsın bugün.', 'Рақмет, балам. Бүгін ерте тұрыпсың.'],
        [0, 'İki ekmek alayım, bir de gazete.', 'Екі нан алайын, бір газет те.'],
        [1, 'Al bakalım. Annene selam söyle.', 'Мә, ала ғой. Анаңа сәлем айт.'],
      ],
    },
  },
  {
    tr: 'Afiyet olsun.',
    kk: 'Ас болсын!',
    note: 'Біреу тамақ ішіп отырғанда немесе тамақ ұсынғанда айтылады.',
    emoji: '🍽️',
    scene: {
      place: 'Кешкі ас. Айше апай дастарқанға мантысын қойды.',
      cast: [['Ayşe Teyze', 'f'], ['Can', 'm']],
      lines: [
        [0, 'Hadi çocuklar, sofraya! Mantı soğumasın.', 'Ал балалар, дастарқанға! Манты суып қалмасын.'],
        [1, 'Kokusu nefis! Ben başlıyorum.', 'Иісі керемет! Мен бастадым.'],
        [0, 'Afiyet olsun oğlum, yoğurdunu da koy.', 'Ас болсын, балам, айранын да қос.'],
        [1, 'Sağ ol anne, sen de otur artık.', 'Рақмет, апа, сен де енді отыр.'],
      ],
    },
  },
  {
    tr: 'Eline sağlık.',
    kk: 'Қолыңа рақмет! (дәмді тамақ үшін)',
    note: 'Тамақ пісірген немесе бір нәрсе жасаған адамға алғыс. Жауабы: «Afiyet olsun».',
    emoji: '👩‍🍳',
    scene: {
      place: 'Тамақтан кейін. Зейнеп күйеуі пісірген палауды мақтап отыр.',
      cast: [['Zeynep', 'f'], ['Emre', 'm']],
      lines: [
        [0, 'Emre, bu pilav harika olmuş! Eline sağlık.', 'Эмре, бұл палау керемет болыпты! Қолыңа рақмет.'],
        [1, 'Afiyet olsun canım. Annemin tarifi.', 'Ас болсын, жаным. Анамның рецепті.'],
        [0, 'Bundan sonra yemekleri sen yapıyorsun!', 'Бұдан былай тамақты сен пісіресің!'],
        [1, 'Olmaz, bir kere oldu o iş.', 'Жоқ, ол бір рет қана болды.'],
      ],
    },
  },
  {
    tr: 'Geçmiş olsun.',
    kk: 'Тез жазыл! / Жаман болыпты-ау!',
    note: 'Біреу ауырғанда немесе басына қиындық түскенде жанашырлық білдіру.',
    emoji: '🤒',
    scene: {
      place: 'Аурухана дәлізі. Элиф досының аяғы сынғанын естіп келді.',
      cast: [['Elif', 'f'], ['Selin', 'f']],
      lines: [
        [0, 'Selin! Ne oldu sana böyle?', 'Селин! Саған не болды?'],
        [1, 'Merdivenden düştüm, ayağım kırıldı.', 'Баспалдақтан құладым, аяғым сынды.'],
        [0, 'Çok geçmiş olsun canım. Ağrın var mı?', 'Тезірек жазыл, жаным. Ауырып тұр ма?'],
        [1, 'Biraz. Ama sen gelince iyi oldum.', 'Сәл. Бірақ сен келгенде жақсы болдым.'],
      ],
    },
  },
  {
    tr: 'Hayırlı olsun.',
    kk: 'Құтты болсын!',
    note: 'Жаңа үй, жаңа көлік, жаңа жұмыс алған адамды құттықтау.',
    emoji: '🎉',
    scene: {
      place: 'Подъезд алдында. Көрші Фатма апай жаңа көліктің қасына келді.',
      cast: [['Fatma Teyze', 'f'], ['Kemal', 'm']],
      lines: [
        [0, 'Kemal, bu araba senin mi?', 'Кемал, бұл көлік сенікі ме?'],
        [1, 'Evet teyzeciğim, dün aldım.', 'Иә, апатай, кеше алдым.'],
        [0, 'Maşallah, hayırlı olsun! Güle güle kullan.', 'Машалла, құтты болсын! Жақсылықпен мін.'],
        [1, 'Sağ olun. Sizi de bir gün gezdiririm.', 'Рақмет. Бір күні сізді де қыдыртамын.'],
      ],
    },
  },
  {
    tr: 'Gözün aydın!',
    kk: 'Көзайым болсын!',
    note: 'Ұзақ күткен қуанышты жаңалыққа: біреу келсе, бала туса, жақсы хабар келсе.',
    emoji: '🥹',
    scene: {
      place: 'Есік қағылды. Хатидже апайдың ұлы әскерден оралды.',
      cast: [['Hatice', 'f'], ['Komşu Nermin', 'f']],
      lines: [
        [1, 'Hatice abla, kapıdaki Ali mi?', 'Хатидже апай, есік алдындағы Әли ме?'],
        [0, 'Evet! Oğlum askerden döndü!', 'Иә! Ұлым әскерден оралды!'],
        [1, 'Gözün aydın abla! Ne mutlu sana.', 'Көзайым болсын, апай! Қандай бақыт.'],
        [0, 'Sağ ol Nermin. Akşam yemeğe gel.', 'Рақмет, Нермин. Кешке тамаққа кел.'],
      ],
    },
  },
  {
    tr: 'Kusura bakma.',
    kk: 'Кешір, айыпқа бұйырма.',
    note: 'Кешіккенде, бір нәрсені ұмытқанда немесе мазалағанда айтылады.',
    emoji: '🙏',
    scene: {
      place: 'Кафе. Мерт кездесуге жарты сағат кешікті.',
      cast: [['Mert', 'm'], ['Deniz', 'f']],
      lines: [
        [0, 'Kusura bakma, trafik berbattı.', 'Кешір, кептеліс сұмдық болды.'],
        [1, 'Yarım saattir bekliyorum Mert.', 'Жарты сағаттан бері күтіп отырмын, Мерт.'],
        [0, 'Biliyorum. Kahveler benden, tamam mı?', 'Білемін. Кофе менен, жарай ма?'],
        [1, 'Peki, bu seferlik affettim.', 'Жарайды, бұл жолы кешірдім.'],
      ],
    },
  },
  {
    tr: 'Boş ver.',
    kk: 'Қойшы, мән берме.',
    note: 'Ренжіген немесе уайымдаған адамды жұбату.',
    emoji: '🤷',
    scene: {
      place: 'Кеңседен шыққан екі әріптес. Бурак бастықтан сөгіс естіді.',
      cast: [['Burak', 'm'], ['Ece', 'f']],
      lines: [
        [0, 'Müdür herkesin önünde bana bağırdı.', 'Директор бәрінің алдында маған айқайлады.'],
        [1, 'Boş ver Burak, o herkese bağırıyor.', 'Мән берме, Бурак, ол бәріне айқайлайды.'],
        [0, 'Ama çok utandım.', 'Бірақ қатты ұялдым.'],
        [1, 'Hadi, sana bir çay ısmarlayayım.', 'Жүр, саған шай алып берейін.'],
      ],
    },
  },
  {
    tr: 'Aynen.',
    kk: 'Дәл солай. / Иә, келісемін.',
    note: 'Жастар жиі айтады. Әңгімелесушімен толық келіскенде.',
    emoji: '👌',
    scene: {
      place: 'Жатақхана. Екі студент кешегі серияны талқылап отыр.',
      cast: [['Ali', 'm'], ['Berk', 'm']],
      lines: [
        [0, 'Dünkü bölümün sonu çok iyiydi.', 'Кешегі серияның соңы өте жақсы болды.'],
        [1, 'Aynen! Hiç beklemiyordum.', 'Дәл солай! Мүлдем күтпедім.'],
        [0, 'Bence gelecek hafta kötü adam ölecek.', 'Менің ойымша, келесі аптада зұлым кейіпкер өледі.'],
        [1, 'Aynen öyle, ben de öyle düşünüyorum.', 'Дәл солай, мен де солай ойлаймын.'],
      ],
    },
  },
  {
    tr: 'Hadi ya!',
    kk: 'Қойшы! Шын ба?!',
    note: 'Таңғалғанда немесе сенбегенде айтылады.',
    emoji: '😲',
    scene: {
      place: 'Телефон әңгімесі. Гизем құрбысына үлкен жаңалық айтады.',
      cast: [['Gizem', 'f'], ['Buse', 'f']],
      lines: [
        [0, 'Haberin var mı? Ali ile Zeynep evleniyor!', 'Естідің бе? Әли мен Зейнеп үйленгелі жатыр!'],
        [1, 'Hadi ya! Ne zaman?', 'Қойшы! Қашан?'],
        [0, 'Gelecek ay. Düğün Kapadokya’da olacak.', 'Келесі айда. Той Каппадокияда болады.'],
        [1, 'Hadi ya, inanamıyorum!', 'Шын ба, сене алмай тұрмын!'],
      ],
    },
  },
  {
    tr: 'Yok artık!',
    kk: 'Болмас! Мүмкін емес!',
    note: 'Қатты таңғалғанда немесе бір нәрсеге наразы болғанда.',
    emoji: '🤯',
    scene: {
      place: 'Сауда орталығы. Ерлі-зайыпты аяқкиім бағасын көрді.',
      cast: [['Selim', 'm'], ['Aslı', 'f']],
      lines: [
        [1, 'Şu ayakkabıya bak, ne güzel!', 'Мына аяқкиімге қарашы, қандай әдемі!'],
        [0, 'Fiyatı ne kadar?', 'Бағасы қанша?'],
        [1, 'Beş bin lira.', 'Бес мың лира.'],
        [0, 'Yok artık! Bu fiyata araba alınır!', 'Болмас! Бұл ақшаға көлік алуға болады!'],
      ],
    },
  },
  {
    tr: 'Ciddi misin?',
    kk: 'Шын айтасың ба?',
    note: 'Естігенге сенбегенде нақтылау үшін.',
    emoji: '🧐',
    scene: {
      place: 'Үйде, кеш. Күйеуі әйеліне тосын сый жасады.',
      cast: [['Ozan', 'm'], ['Melis', 'f']],
      lines: [
        [0, 'Çantanı hazırla, yarın İstanbul’a uçuyoruz.', 'Сөмкеңді дайында, ертең Стамбұлға ұшамыз.'],
        [1, 'Ciddi misin?', 'Шын айтасың ба?'],
        [0, 'Çok ciddiyim. Biletler cebimde.', 'Шын айтамын. Билеттер қалтамда.'],
        [1, 'Seni çok seviyorum!', 'Сені қатты жақсы көремін!'],
      ],
    },
  },
  {
    tr: 'Allah Allah!',
    kk: 'Апырай! / Бұл не деген?!',
    note: 'Түсініксіз немесе таңғаларлық жағдайда. Телехикаяларда өте жиі.',
    emoji: '😳',
    scene: {
      place: 'Ескі үй, түн. Есік өздігінен сықырлап ашылды.',
      cast: [['Nihan', 'f'], ['Kerem', 'm']],
      lines: [
        [0, 'Kerem, kapı kendi kendine açıldı!', 'Керем, есік өздігінен ашылды!'],
        [1, 'Allah Allah! Kilitlememiş miydik?', 'Апырай! Құлыптамап па едік?'],
        [0, 'Kilitledik tabii. Kim var orada?', 'Құлыптадық қой. Онда кім бар?'],
        [1, 'Sakin ol, ben bakarım.', 'Сабыр ет, мен қараймын.'],
      ],
    },
  },
  {
    tr: 'Maşallah!',
    kk: 'Машалла! Тіл-көз тимесін!',
    note: 'Біреуді не бір нәрсені мақтағанда, көз тимесін деп.',
    emoji: '🧿',
    scene: {
      place: 'Мейрам. Қонақтар жас ананың сәбиін көруге келді.',
      cast: [['Sevim Hanım', 'f'], ['Derya', 'f']],
      lines: [
        [1, 'Bu da bizim kızımız, Elif.', 'Бұл біздің қызымыз, Элиф.'],
        [0, 'Maşallah, maşallah! Ne kadar tatlı!', 'Машалла, машалла! Қандай сүйкімді!'],
        [1, 'Gözleri babasına benziyor.', 'Көздері әкесіне ұқсайды.'],
        [0, 'Allah analı babalı büyütsün.', 'Құдай ата-анасымен бірге өсірсін.'],
      ],
    },
  },
  {
    tr: 'İnşallah.',
    kk: 'Құдай қаласа. / Иншалла.',
    note: 'Болашақтағы бір нәрсеге үміт білдіргенде.',
    emoji: '🤲',
    scene: {
      place: 'Емтихан алдындағы кеш. Әкесі қызын жұбатып отыр.',
      cast: [['Baba', 'm'], ['Ceren', 'f']],
      lines: [
        [0, 'Yarın sınav var değil mi kızım?', 'Ертең емтихан бар, иә қызым?'],
        [1, 'Evet baba, çok heyecanlıyım.', 'Иә, әке, қатты толқып жүрмін.'],
        [0, 'Çok çalıştın, geçeceksin.', 'Көп оқыдың, өтесің.'],
        [1, 'İnşallah baba. Dua et bana.', 'Құдай қаласа, әке. Мен үшін дұға қыл.'],
      ],
    },
  },
  {
    tr: 'Çok yaşa!',
    kk: 'Жәрекімалла! / Сау бол!',
    note: 'Біреу түшкіргенде айтылады. Жауабы: «Sen de gör» (Сен де көр).',
    emoji: '🤧',
    scene: {
      place: 'Кеңсе. Жиналыс кезінде Барыш қатты түшкірді.',
      cast: [['Barış', 'm'], ['Pınar', 'f']],
      lines: [
        [0, 'Hapşu!', 'Апчхи!'],
        [1, 'Çok yaşa!', 'Сау бол!'],
        [0, 'Sen de gör. Sanırım üşüttüm.', 'Сен де көр. Тұмауратып қалған сияқтымын.'],
        [1, 'Ihlamur iç, iyi gelir.', 'Липа шайын іш, көмектеседі.'],
      ],
    },
  },
  {
    tr: 'Hoş geldin.',
    kk: 'Қош келдің!',
    note: 'Қонақ келгенде. Жауабы әрқашан: «Hoş bulduk» (Қош көрдік).',
    emoji: '🏠',
    scene: {
      place: 'Мейрам күні. Немересі әжесінің үйіне келді.',
      cast: [['Babaanne', 'f'], ['Yusuf', 'm']],
      lines: [
        [0, 'Yusuf’um! Hoş geldin, gel içeri!', 'Жүсібім! Қош келдің, үйге кір!'],
        [1, 'Hoş bulduk babaanne! Elini öpeyim.', 'Қош көрдік, әже! Қолыңызды сүйейін.'],
        [0, 'Ne kadar da büyümüşsün!', 'Қалай өсіп кеткенсің!'],
        [1, 'Sen hiç değişmemişsin ama.', 'Ал сіз мүлдем өзгермепсіз.'],
      ],
    },
  },
  {
    tr: 'Ne haber?',
    kk: 'Не жаңалық? Қалайсың?',
    note: 'Достар арасындағы бейресми сәлемдесу.',
    emoji: '👋',
    scene: {
      place: 'Көшеде екі ескі дос кездейсоқ кездесті.',
      cast: [['Tolga', 'm'], ['Serkan', 'm']],
      lines: [
        [0, 'Serkan! Oğlum, ne haber?', 'Серкан! Досым, не жаңалық?'],
        [1, 'İyilik Tolga, senden ne haber?', 'Жақсылық, Толга, сенде не жаңалық?'],
        [0, 'Bildiğin gibi. İş, ev, iş.', 'Бұрынғыдай. Жұмыс, үй, жұмыс.'],
        [1, 'Hadi bir çay içelim, anlat bakalım.', 'Жүр, шай ішейік, айтып бер.'],
      ],
    },
  },
  {
    tr: 'Hayırdır?',
    kk: 'Не болды? Тыныштық па?',
    note: 'Біреу күтпеген жерден келсе немесе таңғалып қараса.',
    emoji: '❓',
    scene: {
      place: 'Түн ортасы. Телефон шырылдады.',
      cast: [['Leyla', 'f'], ['Kardeşi Ömer', 'm']],
      lines: [
        [0, 'Ömer? Gecenin üçünde neden arıyorsun? Hayırdır?', 'Өмер? Түнгі үште неге қоңырау шалып тұрсың? Тыныштық па?'],
        [1, 'Merak etme abla, her şey yolunda.', 'Уайымдама, апа, бәрі жақсы.'],
        [1, 'Sadece... baba oldum!', 'Жай... әке болдым!'],
        [0, 'Ne? Gözün aydın kardeşim!', 'Не? Көзайым болсын, бауырым!'],
      ],
    },
  },
  {
    tr: 'Ne alaka?',
    kk: 'Оның не қатысы бар?',
    note: 'Әңгімеге қатысы жоқ нәрсе айтылғанда.',
    emoji: '🙄',
    scene: {
      place: 'Ас үй. Ерлі-зайыптылар таңертең кофе ішіп отыр.',
      cast: [['Hakan', 'm'], ['Nazlı', 'f']],
      lines: [
        [0, 'Üçüncü kahveni içiyorsun. Bana kızgın mısın?', 'Үшінші кофеңді ішіп отырсың. Маған ренжулісің бе?'],
        [1, 'Ne alaka? Sadece uykusuzum.', 'Оның не қатысы бар? Жай ұйқым қанбаған.'],
        [0, 'Emin misin?', 'Сенімдісің бе?'],
        [1, 'Hakan, lütfen. Kahvemi içeyim.', 'Хакан, өтінемін. Кофемді ішейін.'],
      ],
    },
  },
  {
    tr: 'Bana ne!',
    kk: 'Маған бәрібір! / Менің шаруам жоқ!',
    note: 'Ашуланғанда немесе бір нәрсеге мән бергісі келмегенде (сәл дөрекі).',
    emoji: '😤',
    scene: {
      place: 'Отбасылық драма. Кіші сіңлісі ағасына ашуланып тұр.',
      cast: [['Kerem', 'm'], ['Damla', 'f']],
      lines: [
        [0, 'Damla, annem seni arıyor.', 'Дамла, анам сені іздеп жүр.'],
        [1, 'Bana ne! Kimseyle konuşmak istemiyorum.', 'Маған бәрібір! Ешкіммен сөйлескім келмейді.'],
        [0, 'Yine ne oldu?', 'Тағы не болды?'],
        [1, 'Hiçbir şey. Kapıyı kapat!', 'Ештеңе. Есікті жап!'],
      ],
    },
  },
  {
    tr: 'Off ya!',
    kk: 'Уһ! Ығыр болдым!',
    note: 'Шаршағанда, жалыққанда немесе ашуланғанда.',
    emoji: '😩',
    scene: {
      place: 'Аялдама, жаңбыр. Автобус тағы кешікті.',
      cast: [['Sude', 'f'], ['Arda', 'm']],
      lines: [
        [0, 'Otobüs yine gecikti. Off ya!', 'Автобус тағы кешікті. Уһ, ығыр болдым!'],
        [1, 'Yirmi dakikadır bekliyoruz.', 'Жиырма минуттан бері күтіп тұрмыз.'],
        [0, 'Hep böyle oluyor, her gün!', 'Үнемі осылай, күн сайын!'],
        [1, 'Hadi taksiye binelim, ben öderim.', 'Жүр, таксиге отырайық, мен төлеймін.'],
      ],
    },
  },
  {
    tr: 'Kafayı yedim!',
    kk: 'Есімнен танып қалдым! / Жынданып кеттім!',
    note: 'Әзілмен: бір нәрседен қатты шаршағанда немесе басы қатқанда.',
    emoji: '🤪',
    scene: {
      place: 'Кеш, үй. Күйеуі жұмыстан шаршап келді.',
      cast: [['Onur', 'm'], ['İpek', 'f']],
      lines: [
        [1, 'Nasıl geçti günün?', 'Күнің қалай өтті?'],
        [0, 'Bütün gün rapor yazdım. Kafayı yedim!', 'Күні бойы есеп жаздым. Есімнен танып қалдым!'],
        [1, 'Gel otur, sana çay koyayım.', 'Кел, отыр, саған шай құяйын.'],
        [0, 'Sen olmasan ne yapardım?', 'Сен болмасаң не істер едім?'],
      ],
    },
  },
  {
    tr: 'Olur mu öyle şey?',
    kk: 'Солай да бола ма?',
    note: 'Біреу орынсыз нәрсе ұсынғанда немесе әділетсіздікке наразылық.',
    emoji: '🙅',
    scene: {
      place: 'Мейрамхана. Екі дос есепті кім төлейтінін таласып жатыр.',
      cast: [['Cem', 'm'], ['Volkan', 'm']],
      lines: [
        [0, 'Garson, hesabı alabilir miyiz?', 'Даяшы, есепті әкеле аласыз ба?'],
        [1, 'Bu sefer ben ödeyeyim.', 'Бұл жолы мен төлейін.'],
        [0, 'Olur mu öyle şey? Bugün benden!', 'Солай да бола ма? Бүгін менен!'],
        [1, 'Peki, ama bir dahaki sefere ben.', 'Жарайды, бірақ келесі жолы мен.'],
      ],
    },
  },
  {
    tr: 'Canım benim.',
    kk: 'Жаным менің.',
    note: 'Жақын адамға, жұбайға, балаға еркелетіп айтылады.',
    emoji: '❤️',
    scene: {
      place: 'Әуежай. Ұзақ сапардан кейін ерлі-зайыптылар кездесті.',
      cast: [['Aylin', 'f'], ['Tarık', 'm']],
      lines: [
        [1, 'Aylin! Buradayım!', 'Айлин! Мен мұндамын!'],
        [0, 'Tarık! Seni çok özledim.', 'Тарық! Сені қатты сағындым.'],
        [1, 'Ben de seni, canım benim.', 'Мен де сені, жаным менің.'],
        [0, 'Bir daha bu kadar uzun gitme, tamam mı?', 'Енді бұлай ұзаққа кетпе, жарай ма?'],
      ],
    },
  },
  {
    tr: 'Ağzına sağlık.',
    kk: 'Аузыңа май! (жақсы сөзің үшін рақмет)',
    note: 'Біреу әдемі сөз, ән немесе жақсы жаңалық айтқанда.',
    emoji: '😊',
    scene: {
      place: 'Отбасылық кеш. Немересі әжесіне ән айтып берді.',
      cast: [['Dede', 'm'], ['Asya', 'f']],
      lines: [
        [1, 'Dede, bu şarkı senin için.', 'Ата, бұл ән сіз үшін.'],
        [0, 'Ağzına sağlık kızım, çok güzel söyledin.', 'Аузыңа май, қызым, өте әдемі айттың.'],
        [1, 'Gerçekten beğendin mi?', 'Шынымен ұнады ма?'],
        [0, 'Sesin aynı rahmetli anneanneninki gibi.', 'Дауысың марқұм әжеңдікі сияқты.'],
      ],
    },
  },
  {
    tr: 'Bak sen!',
    kk: 'Қарай гөр! / Мұны қара!',
    note: 'Таңғалғанда, кейде әжуалап.',
    emoji: '👀',
    scene: {
      place: 'Көрші әйелдер балконнан сөйлесіп тұр.',
      cast: [['Gülten', 'f'], ['Saadet', 'f']],
      lines: [
        [0, 'Duydun mu? Üst kattaki Mehmet her sabah koşuyormuş.', 'Естідің бе? Жоғарғы қабаттағы Мехмет күнде таңертең жүгіреді екен.'],
        [1, 'Bak sen! Geçen yıl merdiveni bile zor çıkıyordu.', 'Қарай гөр! Былтыр баспалдақпен әрең көтерілетін.'],
        [0, 'Doktor uyarmış galiba.', 'Дәрігер ескерткен шығар.'],
        [1, 'İyi yapmış, helal olsun.', 'Дұрыс істеген, жарайсың.'],
      ],
    },
  },
  {
    tr: 'Rica ederim.',
    kk: 'Оқасы жоқ. / Әрқашан.',
    note: '«Teşekkür ederim» деген алғысқа сыпайы жауап.',
    emoji: '🙂',
    scene: {
      place: 'Метро. Жас жігіт қарт әйелге орнын берді.',
      cast: [['Yaşlı Kadın', 'f'], ['Efe', 'm']],
      lines: [
        [1, 'Buyurun teyze, oturun.', 'Мархабат, апай, отырыңыз.'],
        [0, 'Çok teşekkür ederim evladım.', 'Көп рақмет, балам.'],
        [1, 'Rica ederim, ne demek.', 'Оқасы жоқ, не дегеніңіз.'],
        [0, 'Allah senden razı olsun.', 'Алла сенен разы болсын.'],
      ],
    },
  },
  {
    tr: 'Görüşürüz.',
    kk: 'Кездескенше! / Көріскенше!',
    note: 'Қоштасқанда айтылатын ең жиі сөз.',
    emoji: '👋',
    scene: {
      place: 'Жұмыс күнінің соңы. Әріптестер қоштасып жатыр.',
      cast: [['Kaan', 'm'], ['Esra', 'f']],
      lines: [
        [0, 'Ben çıkıyorum, iyi akşamlar.', 'Мен кеттім, қайырлы кеш.'],
        [1, 'İyi akşamlar Kaan. Yarın toplantı var, unutma.', 'Қайырлы кеш, Каан. Ертең жиналыс бар, ұмытпа.'],
        [0, 'Unutmam. Görüşürüz!', 'Ұмытпаймын. Кездескенше!'],
        [1, 'Görüşürüz, dikkatli git.', 'Көріскенше, абайлап жүр.'],
      ],
    },
  },
  {
    tr: 'Kendine iyi bak.',
    kk: 'Өзіңе жақсы қара.',
    note: 'Қоштасқанда қамқорлық білдіру.',
    emoji: '🫶',
    scene: {
      place: 'Автовокзал. Анасы ұлын басқа қалаға оқуға шығарып салып тұр.',
      cast: [['Anne', 'f'], ['Eren', 'm']],
      lines: [
        [0, 'Yemeklerini düzenli ye, tamam mı?', 'Тамағыңды уақытында іш, жарай ма?'],
        [1, 'Tamam anne, merak etme.', 'Жарайды, апа, уайымдама.'],
        [0, 'Varınca hemen ara. Kendine iyi bak oğlum.', 'Жеткен соң бірден хабарлас. Өзіңе жақсы қара, балам.'],
        [1, 'Sen de kendine iyi bak anneciğim.', 'Сен де өзіңе жақсы қара, анашым.'],
      ],
    },
  },
]
