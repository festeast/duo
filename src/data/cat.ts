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

export type Slot = 'ear' | 'face' | 'cheek'

export type Item = { id: string; name: string; slot: Slot; price: number }

export const ITEMS: Item[] = [
  { id: 'ear-ring', name: 'Алтын сырға', slot: 'ear', price: 40 },
  { id: 'ear-pearl', name: 'Інжу сырға', slot: 'ear', price: 60 },
  { id: 'ear-star', name: 'Жұлдыз сырға', slot: 'ear', price: 80 },
  { id: 'ear-ribbon', name: 'Құлақ лентасы', slot: 'ear', price: 50 },
  { id: 'ear-cuff', name: 'Рокер сақиналары', slot: 'ear', price: 90 },
  { id: 'monocle', name: 'Монокль', slot: 'face', price: 120 },
  { id: 'heart-glasses', name: 'Жүрек көзілдірік', slot: 'face', price: 100 },
  { id: 'star-glasses', name: 'Жұлдыз көзілдірік', slot: 'face', price: 150 },
  { id: 'eyepatch', name: 'Көз таңғыш', slot: 'face', price: 70 },
  { id: 'blush', name: 'Қызарған ұрт', slot: 'cheek', price: 30 },
  { id: 'plaster', name: 'Пластырь', slot: 'cheek', price: 30 },
  { id: 'star-paint', name: 'Жұлдыз бояу', slot: 'cheek', price: 50 },
  { id: 'heart-paint', name: 'Жүрек бояу', slot: 'cheek', price: 50 },
]

export const itemById = (id?: string | null) => ITEMS.find((i) => i.id === id)
