// Мысықтың құлағына, көзіне, ұртына тағылатын аксессуарлар.
// Бет заттары мысық суретінің координаттарында: көздер (72, 98) және (128, 98), ұрттар ≈ (62, 124) / (138, 124).
// Құлақ заттары (0, 0) нүктесінен — құлақтың төменгі шетінен — салбырап тұрады.

import type { CatLook } from '../lib/types'

const LINE = '#2A1E22'

export type FaceAnchor = {
  eye: [number, number]
  gap: number
  tilt: number
  ears: [[number, number], [number, number]]
}

/** Қарапайым (SVG) мысықтың нүктелері */
export const SVG_CAT_ANCHOR: FaceAnchor = { eye: [100, 98], gap: 56, tilt: 0, ears: [[36, 66], [164, 66]] }

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}gold`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFF3B0" />
        <stop offset=".5" stopColor="#F5C23A" />
        <stop offset="1" stopColor="#B57B0E" />
      </linearGradient>
      <linearGradient id={`${id}silver`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset=".5" stopColor="#B9C2CF" />
        <stop offset="1" stopColor="#6D7686" />
      </linearGradient>
      <radialGradient id={`${id}pearl`} cx=".35" cy=".3" r=".8">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset=".6" stopColor="#F3E9F2" />
        <stop offset="1" stopColor="#C9B5CF" />
      </radialGradient>
      <linearGradient id={`${id}pink`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFB8D2" />
        <stop offset="1" stopColor="#E8538C" />
      </linearGradient>
      <linearGradient id={`${id}heart`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FF8FB1" stopOpacity=".85" />
        <stop offset="1" stopColor="#E0346E" stopOpacity=".9" />
      </linearGradient>
      <linearGradient id={`${id}red`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FF6B7A" />
        <stop offset="1" stopColor="#C21F35" />
      </linearGradient>
      <radialGradient id={`${id}blush`} cx=".5" cy=".5" r=".5">
        <stop offset="0" stopColor="#FF7FA0" stopOpacity=".75" />
        <stop offset="1" stopColor="#FF7FA0" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

const u = (id: string, n: string) => `url(#${id}${n})`
const star = (r: number, ri = r * 0.45) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2
    const rr = i % 2 ? ri : r
    return `${(Math.cos(a) * rr).toFixed(2)},${(Math.sin(a) * rr).toFixed(2)}`
  }).join(' ')
const heartPath = (s: number) =>
  `M0 ${s * 0.9} C${-s * 1.3} ${s * 0.1} ${-s * 1.1} ${-s * 0.9} 0 ${-s * 0.35} C${s * 1.1} ${-s * 0.9} ${s * 1.3} ${s * 0.1} 0 ${s * 0.9} Z`

// ---------- Құлақ ----------
function Ear({ item, id, side }: { item?: string | null; id: string; side: 0 | 1 }) {
  switch (item) {
    case 'ear-ring':
      return (
        <g>
          <circle cx="0" cy="13" r="12" fill="none" stroke={LINE} strokeWidth="6.5" />
          <circle cx="0" cy="13" r="12" fill="none" stroke={u(id, 'gold')} strokeWidth="4" />
          <path d="M-8 5 Q-11 10 -10 15" stroke="#FFF8D6" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </g>
      )
    case 'ear-star':
      return (
        <g stroke={LINE} strokeWidth="1.8" strokeLinejoin="round">
          <polygon points={star(8)} fill={u(id, 'gold')} />
          <path d="M0 8 L0 20" stroke="#B57B0E" strokeWidth="2" />
          <polygon points={star(9)} transform="translate(0 29)" fill={u(id, 'gold')} />
          <circle cx="-2.5" cy="27" r="1.6" fill="#fff" stroke="none" />
        </g>
      )
    case 'ear-pearl':
      return (
        <g stroke={LINE} strokeWidth="1.8">
          <circle r="4" fill={u(id, 'gold')} />
          <path d="M0 4 Q3 10 0 15" fill="none" stroke="#B57B0E" strokeWidth="2.2" />
          <ellipse cx="0" cy="24" rx="8" ry="9.5" fill={u(id, 'pearl')} />
          <circle cx="-2.5" cy="21" r="2" fill="#fff" stroke="none" />
        </g>
      )
    case 'ear-ribbon':
      // Тек бір құлаққа (сол жақ)
      return side ? null : (
        <g transform="translate(4 -14) rotate(-15)" stroke={LINE} strokeWidth="2" strokeLinejoin="round">
          <path d="M0 0 C-8 -12 -24 -14 -24 -2 C-24 8 -10 10 0 0 Z" fill={u(id, 'pink')} />
          <path d="M0 0 C8 -12 24 -14 24 -2 C24 8 10 10 0 0 Z" fill={u(id, 'pink')} />
          <path d="M-3 3 L-10 20 L-3 17 L0 22 Z M3 3 L10 20 L3 17 L0 22 Z" fill="#E8538C" />
          <ellipse rx="5.5" ry="6.5" fill="#D43F7A" />
          <path d="M-18 -6 Q-12 -10 -6 -4 M18 -6 Q12 -10 6 -4" fill="none" stroke="#FFE3EE" strokeWidth="1.6" />
        </g>
      )
    case 'ear-cuff':
      // Рокерше: бір құлаққа үш күміс сақина
      return side ? (
        <g fill="none">
          {[0, 11, 22].map((y, i) => (
            <g key={y} transform={`translate(${i * 2.5} ${-y})`}>
              <circle r="6.5" stroke={LINE} strokeWidth="5" />
              <circle r="6.5" stroke={u(id, 'silver')} strokeWidth="3" />
            </g>
          ))}
        </g>
      ) : (
        <g stroke={LINE} strokeWidth="1.6">
          <circle r="4.5" fill={u(id, 'silver')} />
        </g>
      )
    default:
      return null
  }
}

// ---------- Көз ----------
function Eyes({ item, id }: { item?: string | null; id: string }) {
  switch (item) {
    case 'monocle':
      return (
        <g>
          <circle cx="128" cy="98" r="21" fill="#DDF0FF" opacity=".25" />
          <circle cx="128" cy="98" r="21" fill="none" stroke={LINE} strokeWidth="6" />
          <circle cx="128" cy="98" r="21" fill="none" stroke={u(id, 'gold')} strokeWidth="3.6" />
          <path d="M116 88 Q121 81 129 80" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity=".9" />
          <path d="M146 110 Q160 140 150 176" stroke="#B57B0E" strokeWidth="2" fill="none" strokeDasharray="3 2.5" />
        </g>
      )
    case 'heart-glasses':
      return (
        <g stroke={LINE} strokeWidth="3" strokeLinejoin="round">
          {[72, 128].map((x) => (
            <g key={x} transform={`translate(${x} 96)`}>
              <path d={heartPath(20)} fill={u(id, 'heart')} />
              <path d="M-12 -6 Q-9 -12 -3 -10" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            </g>
          ))}
          <path d="M94 92 Q100 88 106 92" fill="none" />
          <path d="M50 92 L34 86 M150 92 L166 86" strokeLinecap="round" />
        </g>
      )
    case 'star-glasses':
      return (
        <g stroke={LINE} strokeWidth="2.6" strokeLinejoin="round">
          {[72, 128].map((x) => (
            <g key={x} transform={`translate(${x} 98)`}>
              <polygon points={star(25, 13)} fill={u(id, 'gold')} />
              <circle r="11.5" fill="#FFF7D8" opacity=".45" />
              <circle cx="-4" cy="-4" r="2.4" fill="#fff" stroke="none" />
            </g>
          ))}
          <path d="M96 94 Q100 90 104 94" fill="none" />
        </g>
      )
    case 'eyepatch':
      return (
        <g strokeLinejoin="round">
          <path d="M30 70 Q100 52 168 86" stroke={LINE} strokeWidth="4.5" fill="none" />
          <path d="M30 70 Q100 52 168 86" stroke="#4A3A36" strokeWidth="2.4" fill="none" />
          <path d="M52 86 Q72 76 92 86 Q96 106 72 118 Q50 106 52 86 Z" fill="#1E1A1E" stroke={LINE} strokeWidth="2.4" />
          <path d="M60 90 Q70 85 80 88" stroke="#5A5060" strokeWidth="2" fill="none" />
          <polygon points={star(6)} transform="translate(72 100)" fill={u(id, 'gold')} stroke="none" />
        </g>
      )
    default:
      return null
  }
}

// ---------- Ұрт ----------
function Cheeks({ item, id }: { item?: string | null; id: string }) {
  switch (item) {
    case 'blush':
      return (
        <g>
          {[60, 140].map((x) => (
            <g key={x}>
              <ellipse cx={x} cy="126" rx="17" ry="9" fill={u(id, 'blush')} />
              <path d={`M${x - 9} 129 l4 -7 M${x - 2} 129 l4 -7 M${x + 5} 129 l4 -7`} stroke="#E04A73" strokeWidth="1.8" strokeLinecap="round" opacity=".8" />
            </g>
          ))}
        </g>
      )
    case 'plaster':
      return (
        <g transform="translate(142 124) rotate(-18)" stroke="#B88A66" strokeWidth="1.6">
          <rect x="-17" y="-6.5" width="34" height="13" rx="6" fill="#F6D9B8" />
          <rect x="-6" y="-6.5" width="12" height="13" fill="#EBC59E" />
          {[-12, 9, 13].map((x) => (
            <circle key={x} cx={x} cy={x === 13 ? 2 : -2} r="0.9" fill="#B88A66" stroke="none" />
          ))}
        </g>
      )
    case 'star-paint':
      return (
        <g stroke={LINE} strokeWidth="1.4" strokeLinejoin="round">
          <polygon points={star(9)} transform="translate(56 124) rotate(-12)" fill={u(id, 'gold')} />
          <polygon points={star(5)} transform="translate(68 134) rotate(10)" fill="#FF9EC0" />
          <polygon points={star(3.5)} transform="translate(46 134)" fill="#8FD3FF" />
        </g>
      )
    case 'heart-paint':
      return (
        <g transform="translate(142 126) rotate(14)" stroke={LINE} strokeWidth="1.6">
          <path d={heartPath(9)} fill={u(id, 'red')} />
          <circle cx="-3.5" cy="-1.5" r="1.8" fill="#fff" stroke="none" />
        </g>
      )
    default:
      return null
  }
}

/** Барлық аксессуарлар: an — көз бен құлақ нүктелері (сурет координатасында) */
export function Accessories({ look, an, id, faceScale = 1.1 }: { look: CatLook; an: FaceAnchor; id: string; faceScale?: number }) {
  if (!look.ear && !look.face && !look.cheek) return null
  const k = an.gap / 56
  const faceT = `translate(${an.eye[0]} ${an.eye[1]}) rotate(${an.tilt}) scale(${k * faceScale}) translate(-100 -98)`
  const ek = k * 0.95
  return (
    <g>
      <Defs id={id} />
      {look.ear &&
        an.ears.map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${an.tilt}) scale(${i ? -ek : ek} ${ek})`}>
            <Ear item={look.ear} id={id} side={i as 0 | 1} />
          </g>
        ))}
      <g transform={faceT}>
        <Cheeks item={look.cheek} id={id} />
        <Eyes item={look.face} id={id} />
      </g>
    </g>
  )
}
