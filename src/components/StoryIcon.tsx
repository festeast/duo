// Әңгімелердің минималистік белгішелері (эмодзи орнына)
import type { LucideIcon } from 'lucide-react'
import { BookOpen, Briefcase, Building2, Cat, Clock, Coffee, Feather, GraduationCap, House, Landmark, Leaf, Mountain, PartyPopper, ShoppingBasket, Sun } from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  mia: Cat,
  sunday: Sun,
  market: ShoppingBasket,
  istanbul: Landmark,
  grandma: House,
  apartment: Building2,
  ourday: Clock,
  cappadocia: Mountain,
  teaculture: Coffee,
  firstday: Briefcase,
  villagewedding: PartyPopper,
  climate: Leaf,
  farabi: Feather,
  learning: GraduationCap,
}

// Деңгейге қарай түс — деңгей жазуымен бірдей: A1 жасыл, A2 қызғылт сары, B1+ қызыл
const COLORS = ['', 'var(--green-dark)', 'var(--orange)', 'var(--red)']

export function StoryIcon({ id, level, size = 46 }: { id: string; level: number; size?: number }) {
  const I = ICONS[id] ?? BookOpen
  const c = COLORS[Math.min(3, Math.max(1, level))]
  return (
    <span className="story-ico" style={{ width: size, height: size, color: c, background: `color-mix(in srgb, ${c} 13%, transparent)` }}>
      <I size={size * 0.5} strokeWidth={1.9} />
    </span>
  )
}
