// Аниме кейіпкерлері (Профильде таңдалады). Бағасы — тиынмен.
import type { CharId } from '../components/AnimeCat'

export type Character = { id: CharId; name: string; desc: string; price: number }

export const CHARACTERS: Character[] = [
  { id: 'classic', name: 'Аниме мысық', desc: 'Үлкен жылтыр көздер, сүйкімді күлкі', price: 0 },
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

// Салынған суреттер (public/sprites/<id>/<mood>.webp). Жоқ көңіл-күй → normal.
// Суреті жоқ кейіпкерлер SVG-мен салынады.
export const SPRITES: Record<string, string[]> = {
  classic: ['normal', 'happy', 'sad'],
  smart: ['normal', 'happy', 'sad'],
  muscle: ['normal', 'happy', 'sad'],
  samurai: ['normal', 'happy', 'sad'],
  sleepy: ['normal'],
  chef: ['normal'],
  rocker: ['normal'],
}

export function spriteUrl(id: string, mood: string, face: boolean) {
  const moods = SPRITES[id]
  if (!moods) return null
  const m = moods.includes(mood) ? mood : 'normal'
  return `/sprites/${id}/${m}${face ? '-face' : ''}.webp`
}
