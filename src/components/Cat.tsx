import { memo, useId } from 'react'
import { EYES, FURS, type Mood } from '../data/cat'
import type { CatLook } from '../lib/types'
import { AnimeCatArt, type CharId } from './AnimeCat'
import { Accessories, SVG_CAT_ANCHOR } from './Accessories'
import { ANCHORS, CHARACTERS, SPRITES, spriteUrl } from '../data/characters'

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

  // Салынған суреті бар кейіпкер: үлкенде — бойы толық, кішіде — беті.
  // Дүкен заттары суреттің үстіне бас пен мойынның орнына қарай тағылады.
  // Кейіпкер таңдалмаса — қарапайым мысық (classic)
  const charId = look.char && SPRITES[look.char] ? look.char : 'classic'
  const sprite = spriteUrl(charId, mood)
  if (sprite) {
    const meta = SPRITES[charId]
    const an = ANCHORS[charId]
    const full = size >= 120
    const [fx, fy, fs] = meta.face
    const vb = full ? [0, 0, meta.w, meta.h] : [fx, fy, fs, fs]
    const w = full ? (size * 1.55 * meta.w) / meta.h : size
    const h = full ? size * 1.55 : size
    // Мысық суретінің координаттары: көздер ортасы (100, 98), арасы 56, төбесі ≈ 38
    const fa = an ? (an.moods?.[mood] ?? an) : null
    return (
      <svg
        viewBox={vb.join(' ')}
        width={w}
        height={h}
        className={`cat ${full ? 'cat-sprite' : 'cat-face'} ${bounce ? 'bounce' : ''} ${className}`}
        style={{ overflow: full ? 'visible' : 'hidden', ...(flip ? { transform: 'scaleX(-1)' } : null) }}
        aria-hidden
      >
        {!full && (
          <defs>
            <clipPath id={`c${uid}`}>
              <circle cx={fx + fs / 2} cy={fy + fs / 2} r={fs / 2} />
            </clipPath>
          </defs>
        )}
        <g clipPath={full ? undefined : `url(#c${uid})`}>
          {!full && <circle cx={fx + fs / 2} cy={fy + fs / 2} r={fs / 2} className="cat-face-bg" />}
          <image href={sprite} width={meta.w} height={meta.h} />
          {fa && <Accessories look={look} an={fa} id={`a${uid}`} />}
        </g>
      </svg>
    )
  }

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

      <Accessories look={look} an={SVG_CAT_ANCHOR} id={`a${uid}`} faceScale={1} />
    </svg>
  )
}

export const Cat = memo(CatInner)
