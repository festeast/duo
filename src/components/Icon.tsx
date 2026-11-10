// Единый набор иконок интерфейса (вместо системных эмодзи).
// Линейные иконки — Lucide; монета и огонь — свои, в цветах приложения.
import { useId } from 'react'
export {
  BookOpen,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Clapperboard,
  Ear,
  Gift,
  Heart,
  HeartHandshake,
  Lightbulb,
  Link2,
  Lock,
  Medal,
  MessageCircle,
  Mic,
  Monitor,
  Moon,
  Palette,
  Pause,
  Download,
  WifiOff,
  CloudUpload,
  Play,
  Square,
  PenLine,
  Repeat,
  Search,
  Settings,
  ShoppingBag,
  Smartphone,
  Snail,
  Sparkles,
  Sun,
  Target,
  Trash2,
  Trophy,
  TriangleAlert,
  User,
  Bell,
  Volume2,
  VolumeX,
  X,
  Speech,
  BookMarked,
  PartyPopper,
  Drama,
  Cat as CatIcon,
} from 'lucide-react'

/** Золотая монета */
export function Coin({ size = 18 }: { size?: number }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className="ico-coin">
      <defs>
        <linearGradient id={`c${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE07A" />
          <stop offset="1" stopColor="#F2A81D" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10.5" fill={`url(#c${id})`} stroke="#C98612" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="6.8" fill="none" stroke="#E0961A" strokeWidth="1.3" />
      <path d="M8.6 7.6 Q9.6 6.4 11.2 6" stroke="#FFF6CF" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M12 8.3l1.1 2.3 2.5.3-1.8 1.7.5 2.5-2.3-1.2-2.3 1.2.5-2.5-1.8-1.7 2.5-.3Z" fill="#E39A18" />
    </svg>
  )
}

/** Пламя серии (серое, если серии нет) */
export function Flame({ size = 18, off }: { size?: number; off?: boolean }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className="ico-flame">
      <defs>
        <linearGradient id={`f${id}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={off ? '#B9B2BF' : '#FF5A2A'} />
          <stop offset="1" stopColor={off ? '#D8D3DC' : '#FFB23E'} />
        </linearGradient>
      </defs>
      <path
        d="M12 2.2c.6 3-1.2 4.6-2.8 6.3C7.6 10.2 6 12 6 14.8 6 18.4 8.7 21.5 12 21.5s6-3.1 6-6.7c0-2.6-1.3-4.6-2.6-5.9-.2 1.4-.9 2.5-2 3.1.4-3.6-.4-7-1.4-8.8Z"
        fill={`url(#f${id})`}
      />
      <path d="M12 21.5c-1.9 0-3.3-1.5-3.3-3.4 0-1.9 1.4-2.9 2.3-4.2.4 1 1.2 1.7 2 2 .1-.8.4-1.4.9-1.9.9.9 1.4 2.2 1.4 3.4 0 2.3-1.5 4.1-3.3 4.1Z" fill={off ? '#F1EEF3' : '#FFE08A'} />
    </svg>
  )
}
