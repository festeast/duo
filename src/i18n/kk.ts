// Интерфейстің барлық қазақша мәтіндері осында.
// Сөзді өзгерту керек болса — тек осы файлды түзетсеңіз жеткілікті.

export const t = {
  appName: 'ДУО',
  tagline: 'Түрік тілін бірге үйренейік!',
  pressStart: 'БАСТАУ',
  tapToStart: 'бастау үшін бас',

  // Ойыншы жасау
  newPlayer: 'Жаңа ойыншы',
  editPlayer: 'Мысығымды өзгерту',
  yourName: 'Атың',
  namePlaceholder: 'Мысалы: Айша',
  fur: 'Жүн түсі',
  eyes: 'Көз түсі',
  ready: 'Дайын!',
  cancel: 'Артқа',

  // Басты бет
  level: 'Деңгей',
  coins: 'тиын',
  streakTogether: 'Бірге',
  days: 'күн',
  unit: 'Бөлім',
  locked: 'Жабық',
  todayDone: 'Бүгінгі сабақ өтілді ✓',
  todayNotDone: 'Бүгін әлі сабақ өтпедің',
  partnerDone: 'Бүгін сабақ өтті ✓',
  partnerNotDone: 'Бүгін әлі сабақ өтпеді',
  addPartner: 'Серігіңді қос',
  addPartnerHint: 'Жұбайыңның мысығын жаса — бірге стрик жинаңдар!',

  // Мәзір
  tabLearn: 'Сабақ',
  tabDuo: 'Дуо',
  tabShop: 'Дүкен',

  // Сабақ
  chooseTranslation: 'Аудармасын таңда',
  chooseTurkish: 'Түрікшесін таңда',
  buildSentence: 'Сөйлемді түрікше құрастыр',
  matchPairs: 'Жұптарын тап',
  whatHeard: 'Не естідің?',
  tapToListen: 'Тыңдау',
  slow: 'Баяу',
  check: 'Тексеру',
  continue: 'Жалғастыру',
  correct: ['Дұрыс!', 'Керемет!', 'Жарайсың!', 'Тамаша!', 'Мияу! Дұрыс!'],
  wrong: 'Қате',
  correctAnswer: 'Дұрыс жауап:',
  quit: 'Шығу',
  quitConfirm: 'Сабақтан шығасың ба? Прогресс сақталмайды.',

  // Нәтиже
  lessonComplete: 'Сабақ аяқталды!',
  accuracy: 'Дәлдік',
  levelUp: 'Жаңа деңгей!',

  // Дуо
  duoTitle: 'Біздің дуо',
  weekXp: 'Осы аптадағы XP',
  totalXp: 'Барлық XP',
  lessonsDone: 'Өтілген сабақ',
  switchTo: 'Ойыншыны ауыстыру',
  playingAs: 'Қазір ойнап жатқан:',
  leading: 'алда келеді!',
  tie: 'Тең түсіп тұрсыңдар!',
  syncNote: 'Екі телефон арасында синхрондау келесі нұсқада қосылады.',
  sound: 'Дыбыс',
  on: 'қосулы',
  off: 'өшірулі',

  // Дүкен
  shopTitle: 'Мысық дүкені',
  buy: 'Сатып алу',
  wear: 'Кию',
  takeOff: 'Шешу',
  notEnough: 'Тиын жетпейді',
  slots: { head: 'Бас киім', face: 'Бет', neck: 'Мойын' },
}

export const randomPraise = () => t.correct[Math.floor(Math.random() * t.correct.length)]
