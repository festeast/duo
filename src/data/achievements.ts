// Жетістіктер (төсбелгілер). Сыйлық тиыны серверде де бар (achievement_reward) — сәйкес болуы керек.
import type { LucideIcon } from 'lucide-react'
import { Award, BookCheck, Brain, Crown, Flame, Footprints, Gem, Library, MessageCircle, Mountain, Rocket, Sprout, Star, Users } from 'lucide-react'
import { Clapperboard, BookOpen } from 'lucide-react'

export type Ctx = {
  learned: number
  streak: number
  dialogs: number
  series: number // аяқталған сериал бөлімдері
  seriesTotal: number
  stories: number
  storiesTotal: number
  friends: number
  level: number
  hard: number // аяқталған қиын сөз жаттығулары
}

export type Badge = {
  id: string
  name: string
  desc: string
  icon: LucideIcon
  color: string
  reward: number
  goal: (c: Ctx) => [number, number] // [қазіргі, мақсат]
}

const g = (v: number, n: number): [number, number] => [Math.min(v, n), n]

export const BADGES: Badge[] = [
  { id: 'w10', name: 'Алғашқы қадам', desc: '10 сөз үйрен', icon: Footprints, color: '#4cc26b', reward: 10, goal: (c) => g(c.learned, 10) },
  { id: 'w50', name: 'Сөзқұмар', desc: '50 сөз үйрен', icon: Sprout, color: '#4cc26b', reward: 20, goal: (c) => g(c.learned, 50) },
  { id: 'w100', name: 'Жүз сөз', desc: '100 сөз үйрен', icon: BookCheck, color: '#4cc26b', reward: 40, goal: (c) => g(c.learned, 100) },
  { id: 'w300', name: 'Полиглот', desc: '300 сөз үйрен', icon: Library, color: '#2f9e57', reward: 80, goal: (c) => g(c.learned, 300) },
  { id: 'w500', name: 'Сөз шебері', desc: '500 сөз үйрен', icon: Gem, color: '#2f9e57', reward: 120, goal: (c) => g(c.learned, 500) },
  { id: 'w1000', name: 'Мың сөз', desc: '1000 сөз үйрен', icon: Crown, color: '#e3a514', reward: 200, goal: (c) => g(c.learned, 1000) },
  { id: 's3', name: 'Ұшқын', desc: '3 күн қатарынан оқы', icon: Flame, color: '#ff8a3d', reward: 15, goal: (c) => g(c.streak, 3) },
  { id: 's7', name: 'Бір апта', desc: '7 күн қатарынан оқы', icon: Flame, color: '#ff6a2a', reward: 30, goal: (c) => g(c.streak, 7) },
  { id: 's30', name: 'Бір ай', desc: '30 күн қатарынан оқы', icon: Flame, color: '#ef4b2b', reward: 100, goal: (c) => g(c.streak, 30) },
  { id: 's100', name: 'Темір ерік', desc: '100 күн қатарынан оқы', icon: Mountain, color: '#c9341f', reward: 300, goal: (c) => g(c.streak, 100) },
  { id: 'd1', name: 'Бірінші сұхбат', desc: '1 диалогты аяқта', icon: MessageCircle, color: '#4b9cf5', reward: 15, goal: (c) => g(c.dialogs, 1) },
  { id: 'd5', name: 'Әңгімешіл', desc: '5 диалогты аяқта', icon: MessageCircle, color: '#2f7dd6', reward: 40, goal: (c) => g(c.dialogs, 5) },
  { id: 'series', name: 'Стамбұл тұрғыны', desc: 'Сериалдың барлық бөлімін аяқта', icon: Clapperboard, color: '#9b6bdf', reward: 150, goal: (c) => g(c.series, c.seriesTotal) },
  { id: 'st1', name: 'Оқырман', desc: '1 әңгіме оқы', icon: BookOpen, color: '#d4548a', reward: 10, goal: (c) => g(c.stories, 1) },
  { id: 'st5', name: 'Кітапқұмар', desc: '5 әңгіме оқы', icon: BookOpen, color: '#d4548a', reward: 40, goal: (c) => g(c.stories, 5) },
  { id: 'stall', name: 'Кітапхана', desc: 'Барлық әңгімені оқы', icon: Library, color: '#b8326c', reward: 120, goal: (c) => g(c.stories, c.storiesTotal) },
  { id: 'f1', name: 'Серіктес', desc: 'Дос қос', icon: Users, color: '#4b9cf5', reward: 20, goal: (c) => g(c.friends, 1) },
  { id: 'hard', name: 'Қиындықтан қорықпа', desc: 'Қиын сөздер жаттығуын аяқта', icon: Brain, color: '#9b6bdf', reward: 30, goal: (c) => g(c.hard, 1) },
  { id: 'l5', name: 'Тәжірибелі', desc: '5-деңгейге жет', icon: Star, color: '#e3a514', reward: 50, goal: (c) => g(c.level, 5) },
  { id: 'l10', name: 'Шебер', desc: '10-деңгейге жет', icon: Rocket, color: '#e3a514', reward: 120, goal: (c) => g(c.level, 10) },
]

export const badgeById = (id: string) => BADGES.find((b) => b.id === id)
export { Award }
