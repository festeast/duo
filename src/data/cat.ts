// Пиксель мысық спрайттары. Әр әріп бір пиксель:
// . — бос, O — контур, F — жүн, L — ашық жүн, E — көз, W — көз жарқылы,
// N — мұрын, P — құлақ іші.
// Кенеп 16×20: мысық y=4-тен басталады, үстінде бас киімге орын бар.

export const CANVAS_W = 16
export const CANVAS_H = 20
export const CAT_Y = 4

const BASE = [
  '..OO........OO..',
  '.OPFO......OFPO.',
  '.OPFFOOOOOOFFPO.',
  '.OFFFFFFFFFFFFO.',
  'OFFFFFFFFFFFFFFO',
  'OFFWEFFFFFFWEFFO',
  'OFFEEFFFFFFEEFFO',
  'OFLLFFFNNFFFLLFO',
  'OFFLLLOLLOLLLFFO',
  '.OFFLLLOOLLLFFO.',
  '..OOFFFFFFFFOO..',
  '..OFFFLLLLFFFO.O',
  '.OFFFLLLLLLFFFOO',
  '.OFFFLLLLLLFFFOO',
  '.OFFFFOFFOFFFFO.',
  '..OOOO.OO.OOOO..',
]

// Мұңды мысық: көзі төмен, ауызы кері
const SAD_PATCH: Record<number, string> = {
  5: 'OFFFFFFFFFFFFFFO',
  6: 'OFFEEFFFFFFEEFFO',
  8: 'OFFLLLLOOLLLLFFO',
  9: '.OFFLLOLLOLLFFO.',
}

// Қуанышты мысық: көзі «^»
const HAPPY_PATCH: Record<number, string> = {
  5: 'OFFOOFFFFFFOOFFO',
  6: 'OFOFFOFFFFOFFOFO',
}

export type Mood = 'normal' | 'sad' | 'happy'

export function catRows(mood: Mood): string[] {
  const patch = mood === 'sad' ? SAD_PATCH : mood === 'happy' ? HAPPY_PATCH : {}
  return BASE.map((row, i) => patch[i] ?? row)
}

export const FURS = {
  ginger: { name: 'Сары', F: '#ef7d57', L: '#ffcd75', O: '#5d275d', P: '#b13e53' },
  gray: { name: 'Сұр', F: '#94b0c2', L: '#f4f4f4', O: '#333c57', P: '#ef7d57' },
  black: { name: 'Қара', F: '#333c57', L: '#566c86', O: '#1a1c2c', P: '#b13e53' },
  white: { name: 'Ақ', F: '#f4f4f4', L: '#ffffff', O: '#566c86', P: '#ef7d57' },
  brown: { name: 'Қоңыр', F: '#8a5a3c', L: '#d9a066', O: '#3b2027', P: '#ef7d57' },
} as const

export const EYES = {
  green: { name: 'Жасыл', color: '#38b764' },
  blue: { name: 'Көк', color: '#41a6f6' },
  amber: { name: 'Алтын', color: '#ffcd75' },
} as const

export type FurId = keyof typeof FURS
export type EyeId = keyof typeof EYES

// ---------- Аксессуарлар ----------
export type Slot = 'head' | 'face' | 'neck'

export type Item = {
  id: string
  name: string
  slot: Slot
  price: number
  y: number // кенептегі бастапқы жол
  rows: string[]
  colors: Record<string, string>
}

const DARK = '#1a1c2c'

export const ITEMS: Item[] = [
  {
    id: 'bow',
    name: 'Бантик',
    slot: 'head',
    price: 30,
    y: 3,
    rows: ['.KK.KK..........', '.KKOKK..........', '.KK.KK..........'],
    colors: { K: '#ff77a8', O: '#b13e53' },
  },
  {
    id: 'tophat',
    name: 'Цилиндр',
    slot: 'head',
    price: 60,
    y: 1,
    rows: [
      '.....OOOOOO.....',
      '.....OKKKKO.....',
      '.....OKKKKO.....',
      '.....ORRRRO.....',
      '...OOOOOOOOOO...',
    ],
    colors: { O: DARK, K: '#333c57', R: '#b13e53' },
  },
  {
    id: 'fez',
    name: 'Түрік фесі',
    slot: 'head',
    price: 80,
    y: 1,
    rows: [
      '.......OY.......',
      '.....OOOOY......',
      '....ORRRRRY.....',
      '....ORRRRRRY....',
      '...ORRRRRRRRO...',
    ],
    colors: { O: '#5d275d', R: '#b13e53', Y: '#ffcd75' },
  },
  {
    id: 'crown',
    name: 'Тәж',
    slot: 'head',
    price: 200,
    y: 2,
    rows: ['....Y..YY..Y....', '....YYYYYYYY....', '....YYRYYBYY....', '....YYYYYYYY....'],
    colors: { Y: '#ffcd75', R: '#b13e53', B: '#41a6f6' },
  },
  {
    id: 'glasses',
    name: 'Көзілдірік',
    slot: 'face',
    price: 40,
    y: 8,
    rows: ['..OOOO....OOOO..', '..O..OOOOOO..O..', '..O..O....O..O..', '..OOOO....OOOO..'],
    colors: { O: DARK },
  },
  {
    id: 'shades',
    name: 'Қара көзілдірік',
    slot: 'face',
    price: 70,
    y: 8,
    rows: ['..OOOO....OOOO..', '..OSSOOOOOOSSO..', '..OSSO....OSSO..', '..OOOO....OOOO..'],
    colors: { O: DARK, S: '#29366f' },
  },
  {
    id: 'scarf',
    name: 'Шарф',
    slot: 'neck',
    price: 40,
    y: 14,
    rows: [
      '..RRRRRRRRRRRR..',
      '..RWRWRWRWRWRR..',
      '...RR...........',
      '...WR...........',
    ],
    colors: { R: '#b13e53', W: '#f4f4f4' },
  },
  {
    id: 'bell',
    name: 'Қоңырау',
    slot: 'neck',
    price: 50,
    y: 14,
    rows: ['..BBBBBBBBBBBB..', '.......YY.......', '.......YY.......'],
    colors: { B: '#41a6f6', Y: '#ffcd75' },
  },
]

export const itemById = (id?: string) => ITEMS.find((i) => i.id === id)
