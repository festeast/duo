import { COURSE, isUnlocked } from '../data/course'
import { t } from '../i18n/kk'
import { sfx } from '../lib/sound'
import { activePlayer, studiedToday, useStore } from '../lib/store'
import { PixelCat } from '../components/PixelCat'

// Сабақ түйіндері иректеліп орналасады
const OFFSETS = [0, 60, 90, 60, 0, -60, -90, -60]

export function Home({ onLesson }: { onLesson: (id: string) => void }) {
  const me = useStore(activePlayer)
  if (!me) return null
  const done = studiedToday(me)
  let n = 0

  return (
    <div className="screen" style={{ paddingTop: 8 }}>
      <div className="row">
        <PixelCat look={me.cat} size={64} mood={done ? 'happy' : 'sad'} bounce={done} />
        <div className="bubble">{done ? t.todayDone : t.todayNotDone}</div>
      </div>

      {COURSE.map((unit, ui) => (
        <section key={unit.id}>
          <div className="unit-head" style={{ background: unit.color }}>
            <small>
              {t.unit} {ui + 1}
            </small>
            <h3>
              {unit.icon} {unit.title}
            </h3>
          </div>
          <div className="path">
            {unit.lessons.map((lesson) => {
              const open = isUnlocked(lesson.id, me.lessons)
              const stars = me.lessons[lesson.id] ?? 0
              const x = OFFSETS[n++ % OFFSETS.length]
              return (
                <div key={lesson.id} className="col" style={{ alignItems: 'center', gap: 0, transform: `translateX(${x}px)` }}>
                  <button
                    className="node"
                    style={{ ['--c' as string]: unit.color }}
                    disabled={!open}
                    aria-label={lesson.title}
                    onClick={() => {
                      sfx.click()
                      onLesson(lesson.id)
                    }}
                  >
                    {open ? (stars ? '★' : '▶') : '🔒'}
                    {stars > 0 && <span className="stars">{'★'.repeat(stars)}{'☆'.repeat(3 - stars)}</span>}
                  </button>
                  <span className="node-label" style={{ marginTop: stars ? 26 : 10 }}>
                    {lesson.title}
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
