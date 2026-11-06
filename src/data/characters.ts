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

// Салынған суреттер (public/sprites/<id>/<mood>.webp) — scripts/sprites.py жасайды.
// Жоқ көңіл-күй → normal. Суреті жоқ кейіпкерлер SVG-мен салынады.
import SPRITE_META from './sprites.json'

export type SpriteMeta = { w: number; h: number; face: number[]; moods: string[] }
export const SPRITES = SPRITE_META as Record<string, SpriteMeta>

/** Дүкен заттарын суретке тағу үшін нүктелер (900 биіктіктегі сурет пикселі):
 *  eye — екі көздің ортасы, gap — көздердің арасы, tilt — бастың қисаюы (градус),
 *  top — бас төбесі (бөрік осы жерге отырады), neck — мойын ортасы */
export type Anchor = { eye: [number, number]; gap: number; tilt: number; top: number; neck: [number, number] }
export const ANCHORS: Record<string, Anchor> = {
  classic: { eye: [125, 97], gap: 50, tilt: -11, top: 22, neck: [122, 168] },
  smart: { eye: [151, 127], gap: 62, tilt: -13, top: 8, neck: [160, 205] },
  muscle: { eye: [270, 86], gap: 50, tilt: 8, top: 28, neck: [280, 150] },
  samurai: { eye: [205, 78], gap: 40, tilt: 0, top: 22, neck: [200, 132] },
  sleepy: { eye: [262, 133], gap: 70, tilt: -13, top: 50, neck: [215, 212] },
  chef: { eye: [200, 158], gap: 58, tilt: -3, top: 4, neck: [200, 235] },
  rocker: { eye: [246, 91], gap: 52, tilt: -8, top: 28, neck: [255, 160] },
}

export function spriteUrl(id: string, mood: string) {
  const meta = SPRITES[id]
  if (!meta) return null
  const m = meta.moods.includes(mood) ? mood : 'normal'
  return `/sprites/${id}/${m}.webp`
}
