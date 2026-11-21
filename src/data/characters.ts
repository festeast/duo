// Аниме кейіпкерлері (Профильде таңдалады). Бағасы — тиынмен.
import type { CharId } from '../components/AnimeCat'

export type Character = { id: CharId; name: string; desc: string; price: number }

export const CHARACTERS: Character[] = [
  { id: 'classic', name: 'Қарапайым мысық', desc: 'Жолақ худи киген сары мысық', price: 0 },
  { id: 'smart', name: 'Ақылды мысық', desc: 'Көзілдірік, кітап, магистр бөркі', price: 80 },
  { id: 'sleepy', name: 'Ұйқышыл мысық', desc: 'Түнгі бөрік пен жастық', price: 80 },
  { id: 'chef', name: 'Аспаз мысық', desc: 'Палау пісіруге дайын', price: 120 },
  { id: 'cool', name: 'Сәнді мысық', desc: 'Қара көзілдірік, былғары күрте', price: 150 },
  { id: 'muscle', name: 'Балуан мысық', desc: 'Бұлшықеттер мен чемпион белдігі', price: 200 },
  { id: 'ninja', name: 'Ниндзя мысық', desc: 'Үнсіз, жылдам, көзге көрінбейді', price: 250 },
  { id: 'rocker', name: 'Рокер мысық', desc: 'Электрогитара және ән', price: 250 },
  { id: 'wizard', name: 'Сиқыршы мысық', desc: 'Жұлдызды бөрік пен сиқырлы таяқша', price: 300 },
  { id: 'samurai', name: 'Самурай мысық', desc: 'Катана және жауынгер рухы', price: 400 },
]

export const charOwnedId = (id: string) => `char-${id}`

// Салынған суреттер (public/sprites/<id>/<mood>.webp) — scripts/sprites.py жасайды.
// Жоқ көңіл-күй → normal. Суреті жоқ кейіпкерлер SVG-мен салынады.
import SPRITE_META from './sprites.json'

export type SpriteMeta = { w: number; h: number; face: number[]; moods: string[]; v?: string }
export const SPRITES = SPRITE_META as Record<string, SpriteMeta>

export function spriteUrl(id: string, mood: string) {
  const meta = SPRITES[id]
  if (!meta) return null
  const m = meta.moods.includes(mood) ? mood : 'normal'
  return `/sprites/${id}/${m}.webp${meta.v ? `?v=${meta.v}` : ''}`
}
