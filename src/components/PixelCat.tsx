import { memo, type ReactElement } from 'react'
import { CANVAS_H, CANVAS_W, CAT_Y, EYES, FURS, catRows, itemById, type Mood } from '../data/cat'
import type { CatLook } from '../lib/store'

type Props = {
  look: CatLook
  size?: number
  mood?: Mood
  bounce?: boolean
  flip?: boolean
}

function PixelCatInner({ look, size = 96, mood = 'normal', bounce, flip }: Props) {
  const fur = FURS[look.fur] ?? FURS.ginger
  const eye = (EYES[look.eyes] ?? EYES.green).color
  const palette: Record<string, string> = {
    O: fur.O,
    F: fur.F,
    L: fur.L,
    P: fur.P,
    E: eye,
    W: '#f4f4f4',
    N: '#ff77a8',
  }

  const rects: ReactElement[] = []
  catRows(mood).forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const c = palette[row[x]]
      if (c) rects.push(<rect key={`c${x}-${y}`} x={x} y={y + CAT_Y} width={1.02} height={1.02} fill={c} />)
    }
  })

  for (const slot of ['neck', 'face', 'head'] as const) {
    const item = itemById(look[slot])
    if (!item) continue
    item.rows.forEach((row, dy) => {
      for (let x = 0; x < row.length; x++) {
        const c = item.colors[row[x]]
        if (c) rects.push(<rect key={`${slot}${x}-${dy}`} x={x} y={item.y + dy} width={1.02} height={1.02} fill={c} />)
      }
    })
  }

  return (
    <svg
      className={`pixel-cat${bounce ? ' bounce' : ''}`}
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      width={size}
      height={(size * CANVAS_H) / CANVAS_W}
      shapeRendering="crispEdges"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden
    >
      {rects}
    </svg>
  )
}

export const PixelCat = memo(PixelCatInner)
