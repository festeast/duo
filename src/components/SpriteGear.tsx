// Салынған (аниме) кейіпкерлерге арналған дүкен заттары.
// Координаттар мысық суретімен бірдей: көздер (72, 98) және (128, 98), бас төбесі ≈ 38.
// Стилі суреттерге сай: жіңішке контур, градиент көлеңке, жылтыр жарық.

const LINE = '#2A1E22'

export function GearDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}gold`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFF1A8" />
        <stop offset=".45" stopColor="#F7C440" />
        <stop offset="1" stopColor="#C98A12" />
      </linearGradient>
      <linearGradient id={`${id}red`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F2596A" />
        <stop offset="1" stopColor="#B4202F" />
      </linearGradient>
      <linearGradient id={`${id}dark`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#1B1B26" />
        <stop offset=".35" stopColor="#3A3A4C" />
        <stop offset="1" stopColor="#15151E" />
      </linearGradient>
      <linearGradient id={`${id}pink`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFB3CF" />
        <stop offset="1" stopColor="#E9578F" />
      </linearGradient>
      <linearGradient id={`${id}petal`} x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#F48FB5" />
        <stop offset="1" stopColor="#FFF4F8" />
      </linearGradient>
      <linearGradient id={`${id}purple`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#B892F2" />
        <stop offset="1" stopColor="#6A3FB8" />
      </linearGradient>
      <linearGradient id={`${id}lens`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#4A4A5E" />
        <stop offset=".5" stopColor="#14141C" />
        <stop offset="1" stopColor="#2C2C3C" />
      </linearGradient>
      <radialGradient id={`${id}bell`} cx=".35" cy=".3" r=".8">
        <stop offset="0" stopColor="#FFF6C4" />
        <stop offset=".5" stopColor="#F5C23A" />
        <stop offset="1" stopColor="#B07A10" />
      </radialGradient>
    </defs>
  )
}

const g = (id: string, n: string) => `url(#${id}${n})`

/** Бастың үстіне киілетін бас киімдер (бас төбесіне отырады) */
export const HATS = new Set(['crown', 'tophat', 'fez'])

export function GearHead({ item, id }: { item?: string | null; id: string }) {
  const sw = 2.4
  switch (item) {
    case 'crown':
      return (
        <g stroke={LINE} strokeWidth={sw} strokeLinejoin="round">
          <path d="M58 46 L52 6 L74 24 L100 -4 L126 24 L148 6 L142 46 Q100 54 58 46 Z" fill={g(id, 'gold')} />
          <path d="M60 38 Q100 46 140 38" fill="none" stroke="#A86C08" strokeWidth="2" />
          <circle cx="100" cy="30" r="6.5" fill={g(id, 'red')} />
          <circle cx="76" cy="34" r="4.5" fill="#4FA3F0" />
          <circle cx="124" cy="34" r="4.5" fill="#4FA3F0" />
          {[52, 100, 148].map((x, i) => (
            <circle key={x} cx={x} cy={i === 1 ? -4 : 6} r="4" fill={g(id, 'gold')} />
          ))}
          <path d="M66 18 L70 34" stroke="#FFF8D0" strokeWidth="3" strokeLinecap="round" opacity=".8" />
          <circle cx="98" cy="28" r="1.8" fill="#fff" stroke="none" />
        </g>
      )
    case 'tophat':
      return (
        <g stroke={LINE} strokeWidth={sw} strokeLinejoin="round">
          <ellipse cx="100" cy="44" rx="54" ry="11" fill={g(id, 'dark')} />
          <path d="M68 44 L72 -8 Q100 -14 128 -8 L132 44 Q100 52 68 44 Z" fill={g(id, 'dark')} />
          <path d="M70 26 Q100 32 130 26 L131 38 Q100 45 69 38 Z" fill={g(id, 'red')} />
          <ellipse cx="100" cy="-8" rx="28" ry="6" fill="#2A2A38" />
          <path d="M80 -2 L78 22" stroke="#8C8CA8" strokeWidth="3.5" strokeLinecap="round" opacity=".55" />
        </g>
      )
    case 'fez':
      return (
        <g stroke={LINE} strokeWidth={sw} strokeLinejoin="round">
          <path d="M70 46 L80 0 Q100 -6 120 0 L130 46 Q100 54 70 46 Z" fill={g(id, 'red')} />
          <ellipse cx="100" cy="0" rx="20" ry="5" fill="#9E1C2A" />
          <path d="M84 6 L78 40" stroke="#FF9AA6" strokeWidth="3.5" strokeLinecap="round" opacity=".6" />
          <path d="M100 0 Q124 4 128 24" fill="none" stroke="#1E1E2A" strokeWidth="2.5" />
          <path d="M123 22 L133 22 L136 42 Q128 46 120 42 Z" fill={g(id, 'gold')} />
          <path d="M124 30 L124 42 M128 30 L128 43 M132 30 L132 42" stroke="#A86C08" strokeWidth="1.4" />
        </g>
      )
    case 'bow':
      return (
        <g transform="translate(50 42) rotate(-22)" stroke={LINE} strokeWidth={sw} strokeLinejoin="round">
          <path d="M0 0 C-10 -16 -30 -20 -32 -4 C-34 10 -14 14 0 0 Z" fill={g(id, 'pink')} />
          <path d="M0 0 C10 -16 30 -20 32 -4 C34 10 14 14 0 0 Z" fill={g(id, 'pink')} />
          <path d="M-4 4 L-12 24 L-4 20 L0 26 Z M4 4 L12 24 L4 20 L0 26 Z" fill="#E9578F" />
          <ellipse rx="7" ry="8" fill="#D9417A" />
          <path d="M-24 -8 Q-16 -14 -8 -6 M24 -8 Q16 -14 8 -6" fill="none" stroke="#FFE0EC" strokeWidth="2" opacity=".9" />
        </g>
      )
    case 'flower':
      return (
        <g transform="translate(150 40) rotate(12)">
          {[0, 72, 144, 216, 288].map((a) => (
            <path
              key={a}
              d="M0 0 C-9 -6 -10 -20 -3 -24 L0 -20 L3 -24 C10 -20 9 -6 0 0 Z"
              fill={g(id, 'petal')}
              stroke="#C2557F"
              strokeWidth="1.8"
              strokeLinejoin="round"
              transform={`rotate(${a})`}
            />
          ))}
          <circle r="5.5" fill={g(id, 'gold')} stroke="#A86C08" strokeWidth="1.6" />
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx="0" cy="-8.5" r="1.4" fill="#E0A21E" transform={`rotate(${a + 36})`} />
          ))}
        </g>
      )
    case 'headphones':
      return (
        <g strokeLinejoin="round">
          <path d="M24 102 C18 22 182 22 176 102" stroke={LINE} strokeWidth="13" fill="none" strokeLinecap="round" />
          <path d="M24 102 C18 22 182 22 176 102" stroke="#4A4A5E" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M40 52 C70 26 130 26 160 52" stroke="#8A8AA2" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".7" />
          {[16, 184].map((x) => (
            <g key={x} stroke={LINE} strokeWidth={2.4}>
              <rect x={x - 14} y="80" width="28" height="46" rx="12" fill={g(id, 'purple')} />
              <rect x={x - 8} y="88" width="16" height="30" rx="7" fill="#D8C4FA" opacity=".55" stroke="none" />
            </g>
          ))}
        </g>
      )
    default:
      return null
  }
}

export function GearFace({ item, id }: { item?: string | null; id: string }) {
  switch (item) {
    case 'glasses':
      return (
        <g>
          {[72, 128].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy="99" r="20" fill="#DDEEFF" opacity=".22" />
              <circle cx={cx} cy="99" r="20" fill="none" stroke="#3B2A1A" strokeWidth="3.4" />
              <circle cx={cx} cy="99" r="20" fill="none" stroke="#C9A05A" strokeWidth="1.3" />
              <path d={`M${cx - 11} ${92} Q${cx - 6} ${84} ${cx + 2} ${84}`} stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity=".85" />
            </g>
          ))}
          <path d="M92 96 Q100 89 108 96" stroke="#3B2A1A" strokeWidth="3" fill="none" />
          <path d="M52 95 L34 89 M148 95 L166 89" stroke="#3B2A1A" strokeWidth="3" strokeLinecap="round" />
        </g>
      )
    case 'shades':
      return (
        <g stroke={LINE} strokeWidth="2.6" strokeLinejoin="round">
          <path d="M44 86 L96 86 L92 106 Q72 120 52 108 Z" fill={g(id, 'lens')} />
          <path d="M156 86 L104 86 L108 106 Q128 120 148 108 Z" fill={g(id, 'lens')} />
          <path d="M40 84 L160 84" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M96 89 Q100 86 104 89" fill="none" />
          <path d="M54 92 L66 92 M58 99 L63 99" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".75" />
          <path d="M112 92 L124 92 M116 99 L121 99" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".75" />
          <path d="M40 84 L28 80 M160 84 L172 80" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      )
    default:
      return null
  }
}

export function GearNeck({ item, id }: { item?: string | null; id: string }) {
  switch (item) {
    case 'scarf':
      return (
        <g stroke={LINE} strokeWidth="2.4" strokeLinejoin="round">
          <path d="M52 146 Q100 168 148 146 L150 162 Q100 186 50 162 Z" fill={g(id, 'red')} />
          <path d="M70 160 L60 204 L84 206 L86 166 Z" fill={g(id, 'red')} />
          <path d="M62 196 L84 198" stroke="#FFD9DE" strokeWidth="3.5" opacity=".9" />
          <path d="M64 186 L85 188" stroke="#FFD9DE" strokeWidth="3.5" opacity=".9" />
          <path d="M60 204 L58 212 M66 205 L65 213 M72 205 L72 213 M78 206 L79 214" strokeWidth="2" />
          {[64, 80, 96, 112, 128, 140].map((x) => (
            <path key={x} d={`M${x} ${150 + Math.abs(100 - x) * -0.12 + 6} l2 10`} stroke="#8E1824" strokeWidth="1.6" opacity=".6" />
          ))}
        </g>
      )
    case 'bell':
      return (
        <g>
          <path d="M54 148 Q100 172 146 148" stroke={LINE} strokeWidth="11" fill="none" strokeLinecap="round" />
          <path d="M54 148 Q100 172 146 148" stroke={g(id, 'red')} strokeWidth="7" fill="none" strokeLinecap="round" />
          <g stroke={LINE} strokeWidth="2.2">
            <circle cx="100" cy="172" r="12" fill={g(id, 'bell')} />
            <path d="M89 172 L111 172" strokeWidth="1.8" />
            <circle cx="100" cy="177" r="2.4" fill={LINE} />
          </g>
          <circle cx="95" cy="166" r="2.5" fill="#fff" opacity=".9" />
        </g>
      )
    case 'bowtie':
      return (
        <g stroke={LINE} strokeWidth="2.4" strokeLinejoin="round">
          <path d="M100 160 C88 150 76 146 72 150 C68 158 68 166 72 172 C76 176 88 170 100 160 Z" fill={g(id, 'red')} />
          <path d="M100 160 C112 150 124 146 128 150 C132 158 132 166 128 172 C124 176 112 170 100 160 Z" fill={g(id, 'red')} />
          <rect x="93" y="153" width="14" height="14" rx="5" fill="#A51C2A" />
          <path d="M78 154 Q84 152 88 156 M122 154 Q116 152 112 156" fill="none" stroke="#FFC2CA" strokeWidth="2" opacity=".85" />
        </g>
      )
    default:
      return null
  }
}
