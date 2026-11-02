// Мысық түстері мен аксессуарлары (сурет — components/Cat.tsx ішінде)

export type Mood = 'normal' | 'sad' | 'happy'

export const FURS = {
  ginger: { name: 'Сары', fur: '#F4A259', light: '#FCE3C4', line: '#8A4B1B', stripes: true },
  gray: { name: 'Сұр', fur: '#A9B4C2', light: '#EEF1F5', line: '#4A5566', stripes: true },
  black: { name: 'Қара', fur: '#3A3A48', light: '#5B5B6E', line: '#15151C', stripes: false },
  white: { name: 'Ақ', fur: '#FBFBFB', light: '#FFFFFF', line: '#8B93A1', stripes: false },
  brown: { name: 'Қоңыр', fur: '#9C6B4A', light: '#E2C2A2', line: '#4B2E1C', stripes: true },
  cream: { name: 'Кілегей', fur: '#F2DDB8', light: '#FFF6E6', line: '#9A7B52', stripes: false },
} as const

export const EYES = {
  green: { name: 'Жасыл', color: '#4CAF50' },
  blue: { name: 'Көк', color: '#3D9BE9' },
  amber: { name: 'Алтын', color: '#F2B233' },
  violet: { name: 'Күлгін', color: '#9B6BDF' },
} as const

export type FurId = keyof typeof FURS
export type EyeId = keyof typeof EYES

export type Slot = 'head' | 'face' | 'neck'

export type Item = { id: string; name: string; slot: Slot; price: number }

export const ITEMS: Item[] = [
  { id: 'bow', name: 'Бантик', slot: 'head', price: 30 },
  { id: 'flower', name: 'Гүл', slot: 'head', price: 40 },
  { id: 'tophat', name: 'Цилиндр', slot: 'head', price: 60 },
  { id: 'fez', name: 'Түрік фесі', slot: 'head', price: 80 },
  { id: 'headphones', name: 'Құлаққап', slot: 'head', price: 90 },
  { id: 'crown', name: 'Тәж', slot: 'head', price: 200 },
  { id: 'glasses', name: 'Көзілдірік', slot: 'face', price: 40 },
  { id: 'shades', name: 'Қара көзілдірік', slot: 'face', price: 70 },
  { id: 'scarf', name: 'Шарф', slot: 'neck', price: 40 },
  { id: 'bell', name: 'Қоңырау', slot: 'neck', price: 50 },
  { id: 'bowtie', name: 'Көбелек галстук', slot: 'neck', price: 60 },
]

export const itemById = (id?: string | null) => ITEMS.find((i) => i.id === id)
