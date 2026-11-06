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
import type { FaceAnchor } from '../components/Accessories'

export type SpriteMeta = { w: number; h: number; face: number[]; moods: string[]; v?: string }
export const SPRITES = SPRITE_META as Record<string, SpriteMeta>

/** Аксессуарлар үшін нүктелер (900 биіктіктегі сурет пикселі):
 *  eye — екі көздің ортасы, gap — көздердің арасы, tilt — бастың қисаюы (градус),
 *  ears — құлақтардың төменгі сыртқы шеті (сырға осы жерден салбырайды).
 *  Мұңды суретте құлақтар салбырап, бет жылжиды — сондықтан moods ішінде бөлек. */
export type Anchor = FaceAnchor & { moods?: Partial<Record<string, FaceAnchor>> }
export const ANCHORS: Record<string, Anchor> = {
  classic: {
    eye: [125, 97], gap: 50, tilt: -11, ears: [[56, 54], [196, 48]],
    moods: { sad: { eye: [117, 106], gap: 50, tilt: -2, ears: [[36, 100], [208, 95]] } },
  },
  smart: {
    eye: [151, 127], gap: 62, tilt: -13, ears: [[76, 100], [236, 88]],
    moods: { sad: { eye: [153, 128], gap: 62, tilt: 3, ears: [[68, 130], [254, 120]] } },
  },
  muscle: {
    eye: [270, 86], gap: 50, tilt: 8, ears: [[188, 55], [320, 50]],
    moods: { sad: { eye: [266, 89], gap: 52, tilt: 2, ears: [[166, 75], [338, 82]] } },
  },
  samurai: {
    eye: [205, 78], gap: 40, tilt: 0, ears: [[143, 55], [250, 55]],
    moods: { sad: { eye: [205, 82], gap: 40, tilt: 0, ears: [[101, 90], [280, 92]] } },
  },
  sleepy: { eye: [262, 133], gap: 70, tilt: -13, ears: [[143, 125], [345, 85]] },
  chef: { eye: [200, 158], gap: 58, tilt: -3, ears: [[107, 150], [265, 132]] },
  rocker: { eye: [246, 91], gap: 52, tilt: -8, ears: [[160, 75], [310, 55]] },
  ninja: { eye: [231, 135], gap: 62, tilt: -2, ears: [[165, 80], [325, 75]] },
  cool: { eye: [247, 106], gap: 62, tilt: -2, ears: [[160, 60], [297, 70]] },
  wizard: {
    eye: [287, 168], gap: 66, tilt: 10, ears: [[210, 115], [368, 150]],
    moods: { sad: { eye: [285, 180], gap: 66, tilt: 4, ears: [[166, 185], [395, 210]] } },
  },
}

export function spriteUrl(id: string, mood: string) {
  const meta = SPRITES[id]
  if (!meta) return null
  const m = meta.moods.includes(mood) ? mood : 'normal'
  return `/sprites/${id}/${m}.webp${meta.v ? `?v=${meta.v}` : ''}`
}
