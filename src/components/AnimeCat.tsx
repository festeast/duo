import { useId, type ReactNode } from 'react'
import { EYES, FURS, type EyeId, type FurId, type Mood } from '../data/cat'

// Аниме стиліндегі мысық кейіпкерлері (чиби пропорциялар: үлкен бас, жылтыр үлкен көздер).
// Координаттар: 200 × 232 (viewBox 0 -12 200 232), Cat компонентімен бірдей.

export type CharId = 'classic' | 'cool' | 'muscle' | 'smart' | 'ninja' | 'chef' | 'wizard' | 'sleepy' | 'rocker' | 'samurai'

const INK = '#2b2b36'

type P = { fur: FurId; eyes: EyeId; mood: Mood; kind: CharId }

export function AnimeCatArt({ fur, eyes, mood, kind }: P) {
  const f = FURS[fur] ?? FURS.ginger
  const eye = (EYES[eyes] ?? EYES.green).color
  const uid = useId().replace(/:/g, '')
  const sleepy = kind === 'sleepy'
  const happy = mood === 'happy' || kind === 'rocker'

  return (
    <>
      <defs>
        <linearGradient id={`iris${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a24" />
          <stop offset="45%" stopColor={eye} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity=".9" />
        </linearGradient>
        <radialGradient id={`shade${uid}`} cx="45%" cy="30%" r="75%">
          <stop offset="0%" stopColor={f.light} stopOpacity=".55" />
          <stop offset="100%" stopColor={f.fur} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Арттағы бөлшектер */}
      {kind === 'wizard' && <path d="M50 150 Q100 140 150 150 L170 215 Q100 225 30 215 Z" fill="#5b3a9e" stroke="#3a2470" strokeWidth="4" />}
      {kind === 'samurai' && (
        <g stroke={INK} strokeWidth="3">
          <rect x="140" y="95" width="8" height="70" rx="2" fill="#c9ccd6" transform="rotate(25 144 130)" />
          <rect x="146" y="78" width="9" height="26" rx="3" fill="#3a3a48" transform="rotate(25 150 90)" />
        </g>
      )}
      <Tail f={f} kind={kind} />

      {/* Дене */}
      <Body f={f} kind={kind} />

      {/* Бас */}
      <g stroke={f.line} strokeWidth="5" strokeLinejoin="round">
        <path d="M34 78 C26 44 32 14 44 8 C58 8 78 30 90 44 Z" fill={kind === 'ninja' ? '#2a2a36' : f.fur} />
        <path d="M166 78 C174 44 168 14 156 8 C142 8 122 30 110 44 Z" fill={kind === 'ninja' ? '#2a2a36' : f.fur} />
        <path d="M46 58 C43 40 46 26 51 23 C58 25 68 35 75 44 Z" fill="#f7a8b8" stroke="none" />
        <path d="M154 58 C157 40 154 26 149 23 C142 25 132 35 125 44 Z" fill="#f7a8b8" stroke="none" />
        <ellipse cx="100" cy="92" rx="74" ry="62" fill={f.fur} />
      </g>
      <ellipse cx="100" cy="90" rx="70" ry="58" fill={`url(#shade${uid})`} />
      {/* Маңдайдағы шаш шоғыры (аниме стилі) */}
      {kind !== 'ninja' && <path d="M84 34 Q92 50 88 58 Q100 46 104 30 Q108 46 116 56 Q114 42 120 34" fill={f.fur} stroke={f.line} strokeWidth="4" strokeLinejoin="round" />}

      {kind === 'ninja' && <NinjaHood />}

      {/* Бет */}
      <Face uid={uid} kind={kind} happy={happy} sad={mood === 'sad'} sleepy={sleepy} />

      {/* Бас киімдер мен алдыңғы заттар */}
      <Headwear kind={kind} />
      <Props kind={kind} f={f} />
    </>
  )
}

function Tail({ f, kind }: { f: (typeof FURS)[FurId]; kind: CharId }) {
  if (kind === 'wizard') return null
  return (
    <path
      d="M146 196 C186 190 192 140 172 126 C164 120 156 130 164 136 C176 146 170 170 142 176"
      fill={f.fur}
      stroke={f.line}
      strokeWidth="5"
      strokeLinejoin="round"
    />
  )
}

function Body({ f, kind }: { f: (typeof FURS)[FurId]; kind: CharId }) {
  const feet = (
    <g fill={f.fur} stroke={f.line} strokeWidth="5">
      <ellipse cx="78" cy="210" rx="17" ry="10" />
      <ellipse cx="122" cy="210" rx="17" ry="10" />
    </g>
  )
  if (kind === 'muscle') {
    return (
      <g strokeLinejoin="round" strokeLinecap="round">
        {feet}
        {/* Кең кеуде, V пішін */}
        <path d="M46 150 Q100 132 154 150 L138 206 Q100 216 62 206 Z" fill={f.fur} stroke={f.line} strokeWidth="5" />
        <g stroke={f.line} strokeWidth="3" fill="none" opacity=".75">
          <path d="M70 162 Q85 172 99 164" />
          <path d="M101 164 Q115 172 130 162" />
          <path d="M100 168 L100 200" />
          <path d="M88 180 Q94 183 98 180 M102 180 Q106 183 112 180" />
          <path d="M89 192 Q94 195 98 192 M102 192 Q106 195 111 192" />
        </g>
        {/* Чемпион белдігі */}
        <rect x="64" y="198" width="72" height="12" rx="4" fill="#e4505f" stroke="#9e2b39" strokeWidth="3" />
        <circle cx="100" cy="204" r="8" fill="#f6c343" stroke="#a9781a" strokeWidth="3" />
      </g>
    )
  }

  // Негізгі дене (чиби)
  const torsoFill =
    kind === 'cool' ? '#2a2a36' : kind === 'ninja' ? '#2a2a36' : kind === 'chef' ? '#ffffff' : kind === 'samurai' ? '#3d5a9e' : kind === 'wizard' ? '#7b52c4' : kind === 'sleepy' ? '#8fb8e8' : f.fur
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      {feet}
      <ellipse cx="100" cy="178" rx="44" ry="38" fill={torsoFill} stroke={f.line} strokeWidth="5" />
      {kind === 'classic' && <ellipse cx="100" cy="184" rx="26" ry="24" fill={f.light} />}
      {kind === 'cool' && (
        <g>
          <path d="M100 142 L88 214 L112 214 Z" fill={f.light} />
          <path d="M100 144 L72 154 L84 178 Z M100 144 L128 154 L116 178 Z" fill="#45455a" stroke="#14141c" strokeWidth="3" />
          <path d="M80 196 L80 206 M120 196 L120 206" stroke="#c9ccd6" strokeWidth="3" />
          <circle cx="112" cy="190" r="4" fill="#f6c343" />
        </g>
      )}
      {kind === 'chef' && (
        <g>
          <path d="M70 156 Q100 150 130 156 L134 208 Q100 214 66 208 Z" fill="#f4f1ea" stroke="#c9c2b4" strokeWidth="3" />
          <rect x="88" y="182" width="24" height="14" rx="3" fill="none" stroke="#c9c2b4" strokeWidth="3" />
          <path d="M84 148 L100 160 L116 148" fill="none" stroke="#e4505f" strokeWidth="5" />
        </g>
      )}
      {kind === 'samurai' && (
        <g>
          <path d="M80 144 L100 182 L120 144" fill="#ffffff" stroke="#c9ccd6" strokeWidth="3" />
          <rect x="58" y="186" width="84" height="10" fill="#1e2a4a" />
        </g>
      )}
      {kind === 'ninja' && <path d="M60 196 L140 196" stroke="#e4505f" strokeWidth="8" />}
      {kind === 'sleepy' && (
        <g fill="#ffffff" opacity=".8">
          <circle cx="82" cy="170" r="4" />
          <circle cx="116" cy="164" r="4" />
          <circle cx="104" cy="196" r="4" />
          <circle cx="76" cy="196" r="4" />
        </g>
      )}
      {kind === 'wizard' && <path d="M90 150 L100 166 L110 150" fill="#f6c343" stroke="#a9781a" strokeWidth="2" />}
      {/* Табандар (қолдар) */}
      {kind !== 'rocker' && kind !== 'smart' && kind !== 'sleepy' && (
        <g fill={f.fur} stroke={f.line} strokeWidth="5">
          <ellipse cx="62" cy="182" rx="12" ry="16" transform="rotate(20 62 182)" />
          <ellipse cx="138" cy="182" rx="12" ry="16" transform="rotate(-20 138 182)" />
        </g>
      )}
    </g>
  )
}

function NinjaHood() {
  return (
    <g>
      {/* Маңдай мен иекті жабатын бетперде, көздер ашық */}
      <path d="M28 92 C28 50 60 30 100 30 C140 30 172 50 172 92 L172 80 L28 80 Z" fill="#2a2a36" />
      <path d="M26 82 L174 82" stroke="#2a2a36" strokeWidth="8" />
      <path d="M30 116 L170 116 C168 140 140 154 100 154 C60 154 32 140 30 116 Z" fill="#2a2a36" />
      <rect x="76" y="56" width="48" height="18" rx="4" fill="#c9ccd6" stroke="#6b7180" strokeWidth="3" />
      <path d="M90 65 Q100 58 110 65 Q100 72 90 65" fill="none" stroke="#6b7180" strokeWidth="2.5" />
      <path d="M172 72 Q192 70 196 86 M172 76 Q186 84 186 100" stroke="#2a2a36" strokeWidth="7" fill="none" strokeLinecap="round" />
    </g>
  )
}

function Face({ uid, kind, happy, sad, sleepy }: { uid: string; kind: CharId; happy: boolean; sad: boolean; sleepy: boolean }) {
  const eyesNode: ReactNode = (() => {
    if (kind === 'cool') {
      return (
        <g>
          <path d="M44 86 L96 86 L90 108 Q70 118 52 108 Z" fill="#14141c" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
          <path d="M156 86 L104 86 L110 108 Q130 118 148 108 Z" fill="#14141c" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
          <path d="M96 90 L104 90" stroke="#000" strokeWidth="4" />
          <path d="M56 92 L70 92 M60 98 L66 98" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".85" />
          <path d="M116 92 L130 92" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".85" />
          <path d="M112 74 L140 68" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        </g>
      )
    }
    if (sleepy || happy) {
      // Жабық көздер: ұйқылы — төмен доға, қуанышты — «^»
      return (
        <g stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none">
          {sleepy ? (
            <>
              <path d="M54 100 Q70 110 86 100" />
              <path d="M114 100 Q130 110 146 100" />
            </>
          ) : (
            <>
              <path d="M54 104 Q70 82 86 104" />
              <path d="M114 104 Q130 82 146 104" />
            </>
          )}
        </g>
      )
    }
    const narrow = kind === 'ninja' || kind === 'samurai'
    return (
      <g>
        {[70, 130].map((cx) => (
          <g key={cx}>
            <ellipse cx={cx} cy="98" rx="18" ry={narrow ? 15 : 22} fill="#fff" stroke={INK} strokeWidth="2.5" />
            <ellipse cx={cx} cy={narrow ? 100 : 101} rx="15" ry={narrow ? 12 : 19} fill={`url(#iris${uid})`} />
            <ellipse cx={cx} cy={narrow ? 101 : 103} rx="7" ry={narrow ? 6 : 10} fill="#1a1a24" />
            <ellipse cx={cx - 6} cy={narrow ? 94 : 91} rx="6" ry="7" fill="#fff" />
            <circle cx={cx + 6} cy={narrow ? 106 : 111} r="3" fill="#fff" />
            {/* Жоғарғы кірпік */}
            <path
              d={`M${cx - 20} ${narrow ? 92 : 88} Q${cx} ${narrow ? 78 : 70} ${cx + 20} ${narrow ? 92 : 88}`}
              stroke={INK}
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ))}
        {sad && <path d="M150 110 q5 12 0 17 q-5 -5 0 -17" fill="#7ec8f2" />}
      </g>
    )
  })()

  const brows: ReactNode =
    kind === 'muscle' || kind === 'samurai' ? (
      <g stroke={INK} strokeWidth="5" strokeLinecap="round">
        <path d="M50 70 L86 78" />
        <path d="M150 70 L114 78" />
      </g>
    ) : kind === 'smart' ? null : sad ? (
      <g stroke={INK} strokeWidth="4" strokeLinecap="round">
        <path d="M56 70 L82 64" />
        <path d="M144 70 L118 64" />
      </g>
    ) : null

  const mouth: ReactNode =
    kind === 'ninja' ? null : kind === 'cool' ? (
      <path d="M90 124 Q102 130 112 120" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    ) : kind === 'sleepy' ? (
      <ellipse cx="100" cy="126" rx="5" ry="6" fill="#e85a71" stroke={INK} strokeWidth="2.5" />
    ) : kind === 'rocker' || happy ? (
      <path d="M88 120 Q100 140 112 120 Z" fill="#e85a71" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    ) : sad ? (
      <path d="M90 128 Q100 120 110 128" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    ) : kind === 'muscle' ? (
      <path d="M90 122 L110 122" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
    ) : (
      <path d="M90 120 Q95 127 100 120 Q105 127 110 120" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    )

  return (
    <g>
      {eyesNode}
      {brows}
      {/* Ұрт: аниме стиліндегі қызарған сызықтар */}
      {kind !== 'ninja' && (
        <g>
          <ellipse cx="48" cy="120" rx="13" ry="7" fill="#ff8fa3" opacity=".45" />
          <ellipse cx="152" cy="120" rx="13" ry="7" fill="#ff8fa3" opacity=".45" />
          <path d="M42 116 L38 124 M48 116 L44 124 M54 116 L50 124 M146 116 L142 124 M152 116 L148 124 M158 116 L154 124" stroke="#e8687f" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
      {kind !== 'ninja' && <path d="M95 112 Q100 109 105 112 Q102 117 100 117 Q98 117 95 112 Z" fill="#ff7f98" />}
      {mouth}
      {kind === 'smart' && (
        <g stroke={INK} strokeWidth="4" fill="#ffffff22">
          <circle cx="70" cy="98" r="25" />
          <circle cx="130" cy="98" r="25" />
          <path d="M95 96 Q100 90 105 96" fill="none" />
          <path d="M60 86 L66 80" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
      {kind === 'cool' && (
        <g fill="#ffd84d">
          <path d="M168 60 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z" />
        </g>
      )}
    </g>
  )
}

function Headwear({ kind }: { kind: CharId }) {
  switch (kind) {
    case 'muscle':
      return (
        <g>
          <path d="M28 66 Q100 44 172 66 L172 80 Q100 58 28 80 Z" fill="#e4505f" stroke="#9e2b39" strokeWidth="3" />
          <path d="M172 70 Q190 72 194 92 M172 74 Q182 86 178 102" stroke="#e4505f" strokeWidth="7" strokeLinecap="round" fill="none" />
        </g>
      )
    case 'smart':
      return (
        <g strokeLinejoin="round">
          <path d="M100 22 L36 36 L100 50 L164 36 Z" fill="#2a2a36" stroke="#111" strokeWidth="3" />
          <path d="M70 42 L70 56 Q100 66 130 56 L130 42" fill="#2a2a36" stroke="#111" strokeWidth="3" />
          <path d="M100 36 L154 46 L154 70" stroke="#f6c343" strokeWidth="3" fill="none" />
          <circle cx="154" cy="72" r="5" fill="#f6c343" />
        </g>
      )
    case 'chef':
      return (
        <g fill="#ffffff" stroke="#c9c2b4" strokeWidth="3">
          <rect x="66" y="22" width="68" height="26" rx="6" />
          <circle cx="74" cy="12" r="16" />
          <circle cx="100" cy="2" r="18" />
          <circle cx="126" cy="12" r="16" />
        </g>
      )
    case 'wizard':
      return (
        <g strokeLinejoin="round">
          <path d="M48 46 Q100 30 152 46 L112 -10 Q104 -14 96 -6 Z" fill="#5b3a9e" stroke="#3a2470" strokeWidth="4" />
          <ellipse cx="100" cy="46" rx="62" ry="10" fill="#7b52c4" stroke="#3a2470" strokeWidth="4" />
          <path d="M92 18 l3 7 l7 2 l-7 2 l-3 7 l-3 -7 l-7 -2 l7 -2 Z" fill="#f6c343" />
          <circle cx="116" cy="34" r="3" fill="#f6c343" />
        </g>
      )
    case 'sleepy':
      return (
        <g strokeLinejoin="round">
          <path d="M44 48 Q100 22 156 48 Q150 10 120 4 Q190 20 180 70" fill="#5b8fd6" stroke="#2f5ea8" strokeWidth="4" />
          <path d="M70 34 L76 44 M96 26 L100 38 M124 26 L122 38" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
          <circle cx="182" cy="74" r="10" fill="#ffffff" stroke="#c9ccd6" strokeWidth="3" />
          <text x="150" y="0" fontSize="22" fontWeight="900" fill="#5b8fd6">Z</text>
          <text x="172" y="-10" fontSize="16" fontWeight="900" fill="#8fb8e8">z</text>
        </g>
      )
    case 'rocker':
      return (
        <g>
          <path d="M30 70 Q100 30 170 70 L166 54 Q100 18 34 54 Z" fill="#e4505f" stroke="#9e2b39" strokeWidth="3" />
          {[52, 78, 104, 130, 152].map((x) => (
            <circle key={x} cx={x} cy={x === 52 || x === 152 ? 58 : 46} r="3" fill="#ffffff" />
          ))}
        </g>
      )
    case 'samurai':
      return (
        <g>
          <ellipse cx="100" cy="28" rx="16" ry="12" fill="#2a2a36" />
          <rect x="92" y="34" width="16" height="8" rx="2" fill="#e4505f" />
          <path d="M60 50 Q100 30 140 50" stroke="#2a2a36" strokeWidth="10" fill="none" strokeLinecap="round" />
        </g>
      )
    default:
      return null
  }
}

function Props({ kind, f }: { kind: CharId; f: (typeof FURS)[FurId] }) {
  const paw = (cx: number, cy: number) => <ellipse cx={cx} cy={cy} rx="11" ry="10" fill={f.fur} stroke={f.line} strokeWidth="4" />
  switch (kind) {
    case 'muscle':
      // Бұлшықетті қолдар (жоғары көтерілген) — бастың алдында, шетінде
      return (
        <g>
          {[1, -1].map((side) => (
            <g key={side} transform={side === -1 ? 'translate(200 0) scale(-1 1)' : undefined} fill={f.fur} stroke={f.line} strokeWidth="5">
              <ellipse cx="34" cy="160" rx="24" ry="14" transform="rotate(-25 34 160)" />
              <ellipse cx="18" cy="122" rx="12" ry="24" transform="rotate(6 18 122)" />
              <circle cx="30" cy="146" r="15" />
              <circle cx="16" cy="96" r="13" />
              <path d="M10 92 L22 92 M10 99 L22 99" stroke={f.line} strokeWidth="2.5" />
            </g>
          ))}
        </g>
      )
    case 'smart':
      return (
        <g>
          <path d="M66 160 L100 170 L134 160 L134 196 L100 206 L66 196 Z" fill="#3d9be9" stroke="#1f5fa0" strokeWidth="4" strokeLinejoin="round" />
          <path d="M100 170 L100 206" stroke="#1f5fa0" strokeWidth="3" />
          <path d="M74 172 L92 177 M74 180 L92 185 M108 177 L126 172 M108 185 L126 180" stroke="#ffffff" strokeWidth="2.5" />
          {paw(66, 178)}
          {paw(134, 178)}
        </g>
      )
    case 'chef':
      return (
        <g>
          <path d="M150 196 L172 128" stroke="#a9692e" strokeWidth="7" strokeLinecap="round" />
          <ellipse cx="174" cy="120" rx="11" ry="15" fill="#c98a4a" stroke="#7a4a1c" strokeWidth="3" transform="rotate(18 174 120)" />
        </g>
      )
    case 'wizard':
      return (
        <g>
          <path d="M146 196 L176 120" stroke="#7a4a1c" strokeWidth="6" strokeLinecap="round" />
          <path d="M178 100 l6 13 l14 2 l-10 10 l3 14 l-13 -7 l-13 7 l3 -14 l-10 -10 l14 -2 Z" fill="#f6c343" stroke="#a9781a" strokeWidth="2" />
          <g fill="#ffd84d">
            <circle cx="30" cy="40" r="3" />
            <circle cx="20" cy="120" r="2.5" />
            <circle cx="188" cy="160" r="3" />
          </g>
        </g>
      )
    case 'sleepy':
      return (
        <g>
          <rect x="62" y="164" width="76" height="40" rx="16" fill="#ffffff" stroke="#c9ccd6" strokeWidth="4" />
          {paw(64, 176)}
          {paw(136, 176)}
        </g>
      )
    case 'rocker':
      return (
        <g strokeLinejoin="round" transform="rotate(-28 100 180)">
          <rect x="96" y="96" width="9" height="74" fill="#5a3a20" stroke="#2b1a0e" strokeWidth="2" />
          <rect x="92" y="88" width="17" height="14" rx="3" fill="#2a2a36" />
          <path d="M76 168 Q70 150 86 148 Q100 140 114 148 Q130 150 124 168 Q132 186 116 196 Q100 206 84 196 Q68 186 76 168 Z" fill="#e4505f" stroke="#9e2b39" strokeWidth="4" />
          <circle cx="100" cy="176" r="7" fill="#2a2a36" />
          <path d="M100 100 L100 192" stroke="#e9e9ef" strokeWidth="1.5" />
          {paw(84, 176)}
          {paw(112, 128)}
        </g>
      )
    case 'samurai':
      return (
        <g>
          {paw(62, 182)}
          {paw(138, 182)}
        </g>
      )
    default:
      return null
  }
}
