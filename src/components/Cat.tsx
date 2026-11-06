import { memo, useId } from 'react'
import { EYES, FURS, type Mood } from '../data/cat'
import type { CatLook } from '../lib/types'
import { AnimeCatArt, type CharId } from './AnimeCat'
import { CHARACTERS } from '../data/characters'

type Props = {
  look: CatLook
  size?: number
  mood?: Mood
  bounce?: boolean
  flip?: boolean
  className?: string
}

// Мысық 200×232 координаталар жүйесінде салынады.
function CatInner({ look, size = 96, mood = 'normal', bounce, flip, className = '' }: Props) {
  const f = FURS[look.fur] ?? FURS.ginger
  const eye = (EYES[look.eyes] ?? EYES.green).color
  const uid = useId().replace(/:/g, '')
  const sw = 5 // контур қалыңдығы

  // Аниме кейіпкері таңдалса — соны саламыз
  if (look.char && CHARACTERS.some((c) => c.id === look.char)) {
    return (
      <svg
        viewBox="0 -12 200 232"
        width={size}
        height={(size * 232) / 200}
        className={`cat ${bounce ? 'bounce' : ''} ${className}`}
        style={flip ? { transform: 'scaleX(-1)' } : undefined}
        aria-hidden
      >
        <AnimeCatArt fur={look.fur} eyes={look.eyes} mood={mood} kind={look.char as CharId} />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 -12 200 232"
      width={size}
      height={(size * 232) / 200}
      className={`cat ${bounce ? 'bounce' : ''} ${className}`}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden
    >
      <defs>
        <radialGradient id={`g${uid}`} cx="45%" cy="35%" r="70%">
          <stop offset="0%" stopColor={f.light} stopOpacity=".35" />
          <stop offset="100%" stopColor={f.fur} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g stroke={f.line} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round">
        {/* Құйрық */}
        <path className="cat-tail" d="M150 190 C190 185 196 140 176 128 C168 124 162 132 170 138 C182 148 176 172 146 176" fill={f.fur} />
        {/* Дене */}
        <ellipse cx="100" cy="168" rx="58" ry="46" fill={f.fur} />
        <ellipse cx="100" cy="176" rx="32" ry="30" fill={f.light} stroke="none" />
        {/* Табандар */}
        <ellipse cx="78" cy="208" rx="17" ry="10" fill={f.fur} />
        <ellipse cx="122" cy="208" rx="17" ry="10" fill={f.fur} />
      </g>

      <Neck item={look.neck} />

      <g stroke={f.line} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round">
        {/* Құлақтар */}
        <path d="M38 78 C30 46 34 22 44 16 C56 14 76 36 88 50 Z" fill={f.fur} />
        <path d="M162 78 C170 46 166 22 156 16 C144 14 124 36 112 50 Z" fill={f.fur} />
        <path d="M50 60 C47 44 48 32 52 29 C58 30 68 40 74 48 Z" fill="#F7A8B8" stroke="none" />
        <path d="M150 60 C153 44 152 32 148 29 C142 30 132 40 126 48 Z" fill="#F7A8B8" stroke="none" />
        {/* Бас */}
        <ellipse cx="100" cy="96" rx="74" ry="62" fill={f.fur} />
      </g>
      <ellipse cx="100" cy="96" rx="70" ry="58" fill={`url(#g${uid})`} />

      {f.stripes && (
        <g stroke={f.line} strokeWidth="4" strokeLinecap="round" opacity=".45" fill="none">
          <path d="M100 38 L100 54" />
          <path d="M84 41 L87 55" />
          <path d="M116 41 L113 55" />
        </g>
      )}

      {/* Ұрт */}
      <ellipse cx="60" cy="118" rx="12" ry="7" fill="#FF8FA3" opacity=".45" />
      <ellipse cx="140" cy="118" rx="12" ry="7" fill="#FF8FA3" opacity=".45" />

      {/* Көздер */}
      {mood === 'happy' ? (
        <g stroke="#2B2B36" strokeWidth="6" strokeLinecap="round" fill="none">
          <path d="M60 100 Q72 84 84 100" />
          <path d="M116 100 Q128 84 140 100" />
        </g>
      ) : (
        <g className="cat-eyes">
          {[72, 128].map((cx) => (
            <g key={cx}>
              <ellipse cx={cx} cy="98" rx="13" ry="16" fill="#2B2B36" />
              <ellipse cx={cx} cy="100" rx="10" ry="13" fill={eye} />
              <ellipse cx={cx} cy="101" rx="5" ry="9" fill="#1A1A22" />
              <circle cx={cx + 4} cy="92" r="4.5" fill="#fff" />
              <circle cx={cx - 4} cy="106" r="2" fill="#fff" opacity=".8" />
            </g>
          ))}
        </g>
      )}

      {mood === 'sad' && (
        <g stroke="#2B2B36" strokeWidth="4" strokeLinecap="round">
          <path d="M58 76 L82 82" />
          <path d="M142 76 L118 82" />
          <path d="M140 116 q4 10 0 14 q-4 -4 0 -14" fill="#7EC8F2" stroke="none" />
        </g>
      )}

      {/* Мұрын, ауыз, мұрт */}
      <path d="M93 112 Q100 108 107 112 Q104 119 100 120 Q96 119 93 112 Z" fill="#FF7F98" stroke="#C4566C" strokeWidth="2" strokeLinejoin="round" />
      <g stroke="#2B2B36" strokeWidth="3.5" strokeLinecap="round" fill="none">
        {mood === 'sad' ? (
          <path d="M88 134 Q100 124 112 134" />
        ) : (
          <>
            <path d="M100 120 Q98 130 88 128" />
            <path d="M100 120 Q102 130 112 128" />
          </>
        )}
        {mood === 'happy' && <path d="M92 130 Q100 142 108 130" fill="#E85A71" stroke="#2B2B36" />}
      </g>
      <g stroke={f.line} strokeWidth="2.5" strokeLinecap="round" opacity=".6">
        <path d="M44 112 L18 106" />
        <path d="M44 120 L18 122" />
        <path d="M156 112 L182 106" />
        <path d="M156 120 L182 122" />
      </g>

      <Face item={look.face} />
      <Head item={look.head} />
    </svg>
  )
}

function Neck({ item }: { item?: string | null }) {
  switch (item) {
    case 'scarf':
      return (
        <g strokeLinejoin="round">
          <path d="M44 140 Q100 168 156 140 L158 156 Q100 184 42 156 Z" fill="#E4505F" stroke="#9E2B39" strokeWidth="4" />
          <path d="M60 156 L52 196 L74 196 L76 160 Z" fill="#E4505F" stroke="#9E2B39" strokeWidth="4" />
          <path d="M56 182 L72 182" stroke="#fff" strokeWidth="4" opacity=".7" />
          <path d="M70 152 Q100 166 130 152" stroke="#fff" strokeWidth="4" fill="none" opacity=".6" />
        </g>
      )
    case 'bell':
      return (
        <g>
          <path d="M50 146 Q100 168 150 146" stroke="#3D7BD9" strokeWidth="10" fill="none" strokeLinecap="round" />
          <circle cx="100" cy="166" r="13" fill="#F6C343" stroke="#A9781A" strokeWidth="4" />
          <path d="M92 168 L108 168" stroke="#A9781A" strokeWidth="3" />
          <circle cx="100" cy="173" r="2.5" fill="#A9781A" />
        </g>
      )
    case 'bowtie':
      return (
        <g stroke="#1E1E2A" strokeWidth="4" strokeLinejoin="round">
          <path d="M100 160 L72 146 L72 176 Z" fill="#E4505F" />
          <path d="M100 160 L128 146 L128 176 Z" fill="#E4505F" />
          <circle cx="100" cy="160" r="8" fill="#B8323F" />
        </g>
      )
    default:
      return null
  }
}

function Face({ item }: { item?: string | null }) {
  switch (item) {
    case 'glasses':
      return (
        <g stroke="#2B2B36" strokeWidth="5" fill="#ffffff22">
          <circle cx="72" cy="99" r="22" />
          <circle cx="128" cy="99" r="22" />
          <path d="M94 96 Q100 90 106 96" fill="none" />
          <path d="M50 94 L34 88 M150 94 L166 88" />
        </g>
      )
    case 'shades':
      return (
        <g stroke="#111" strokeWidth="4" strokeLinejoin="round">
          <path d="M48 86 L96 86 L92 108 Q72 120 54 108 Z" fill="#1E1E2A" />
          <path d="M152 86 L104 86 L108 108 Q128 120 146 108 Z" fill="#1E1E2A" />
          <path d="M96 90 L104 90" />
          <path d="M58 92 L68 92" stroke="#fff" strokeWidth="4" opacity=".6" />
          <path d="M112 92 L122 92" stroke="#fff" strokeWidth="4" opacity=".6" />
        </g>
      )
    default:
      return null
  }
}

function Head({ item }: { item?: string | null }) {
  switch (item) {
    case 'bow':
      return (
        <g transform="translate(46 34) rotate(-20)" stroke="#C2406A" strokeWidth="4" strokeLinejoin="round">
          <path d="M0 0 L-24 -14 L-24 14 Z" fill="#FF7BAC" />
          <path d="M0 0 L24 -14 L24 14 Z" fill="#FF7BAC" />
          <circle r="7" fill="#E05590" />
        </g>
      )
    case 'flower':
      return (
        <g transform="translate(150 36)">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-12" rx="8" ry="12" fill="#FFFFFF" stroke="#E7A6C2" strokeWidth="3" transform={`rotate(${a})`} />
          ))}
          <circle r="7" fill="#F6C343" stroke="#C99A1E" strokeWidth="3" />
        </g>
      )
    case 'tophat':
      return (
        <g stroke="#111" strokeWidth="4" strokeLinejoin="round">
          <rect x="70" y="-6" width="60" height="48" rx="6" fill="#2A2A36" />
          <rect x="70" y="26" width="60" height="10" fill="#C83E4D" />
          <ellipse cx="100" cy="42" rx="48" ry="10" fill="#2A2A36" />
        </g>
      )
    case 'fez':
      return (
        <g strokeLinejoin="round">
          <path d="M72 44 L80 2 L120 2 L128 44 Z" fill="#C8303F" stroke="#7E1A24" strokeWidth="4" />
          <ellipse cx="100" cy="3" rx="20" ry="5" fill="#A8222F" stroke="#7E1A24" strokeWidth="3" />
          <path d="M100 3 Q124 8 128 30" stroke="#1E1E2A" strokeWidth="3" fill="none" />
          <path d="M124 28 L132 28 L134 44 L122 44 Z" fill="#F6C343" stroke="#A9781A" strokeWidth="2" />
        </g>
      )
    case 'crown':
      return (
        <g stroke="#A9781A" strokeWidth="4" strokeLinejoin="round">
          <path d="M64 44 L60 6 L82 26 L100 0 L118 26 L140 6 L136 44 Z" fill="#F6C343" />
          <circle cx="100" cy="30" r="6" fill="#E4505F" />
          <circle cx="78" cy="34" r="4" fill="#3D9BE9" />
          <circle cx="122" cy="34" r="4" fill="#3D9BE9" />
        </g>
      )
    case 'headphones':
      return (
        <g strokeLinejoin="round">
          <path d="M28 100 C24 30 176 30 172 100" stroke="#2A2A36" strokeWidth="10" fill="none" strokeLinecap="round" />
          <rect x="14" y="84" width="24" height="40" rx="10" fill="#9B6BDF" stroke="#4E2E86" strokeWidth="4" />
          <rect x="162" y="84" width="24" height="40" rx="10" fill="#9B6BDF" stroke="#4E2E86" strokeWidth="4" />
        </g>
      )
    default:
      return null
  }
}

export const Cat = memo(CatInner)
