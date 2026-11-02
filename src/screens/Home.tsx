import { useEffect, useRef } from 'react'
import { Cat } from '../components/Cat'
import { ALL_LESSONS, COURSE, isUnlocked } from '../data/course'
import { t } from '../i18n/kk'
import { sfx } from '../lib/sound'
import { studiedToday, useStore } from '../lib/store'

// Сабақ түйіндері иректеліп орналасады
const OFFSETS = [0, 56, 84, 56, 0, -56, -84, -56]

export function Home({ onLesson }: { onLesson: (id: string) => void }) {
  const me = useStore((s) => s.profile)
  const progress = useStore((s) => s.progress)
  const days = useStore((s) => s.days)
  const currentRef = useRef<HTMLButtonElement>(null)

  // Келесі өтілетін сабаққа автоматты түрде жылжу
  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'center' })
  }, [])

  if (!me) return null
  const done = studiedToday(days)
  const current = ALL_LESSONS.find((l) => !progress[l.id] && isUnlocked(l.id, progress))?.id
  let n = 0

  return (
    <div className="screen" style={{ paddingTop: 12 }}>
      <div className="row">
        <Cat look={me.cat} size={72} mood={done ? 'happy' : 'sad'} bounce={done} />
        <div className="bubble">{done ? t.todayDone : t.todayNotDone}</div>
      </div>

      {COURSE.map((unit, ui) => {
        const doneCount = unit.lessons.filter((l) => progress[l.id]).length
        return (
          <section key={unit.id}>
            <div className="unit-head" style={{ ['--uc' as string]: unit.color }}>
              <div>
                <small>
                  {t.unit} {ui + 1} · {doneCount}/{unit.lessons.length} {t.lessonsCount}
                </small>
                <h3>{unit.title}</h3>
              </div>
              <span className="unit-icon">{unit.icon}</span>
            </div>
            <div className="path">
              {unit.lessons.map((lesson) => {
                const open = isUnlocked(lesson.id, progress)
                const stars = progress[lesson.id] ?? 0
                const x = OFFSETS[n++ % OFFSETS.length]
                const isCurrent = lesson.id === current
                return (
                  <div key={lesson.id} className="node-wrap" style={{ transform: `translateX(${x}px)` }}>
                    {isCurrent && <span className="start-tag">▶ {t.startHere}</span>}
                    <button
                      ref={isCurrent ? currentRef : undefined}
                      className={`node${isCurrent ? ' current' : ''}${stars ? ' done' : ''}`}
                      style={{ ['--c' as string]: unit.color }}
                      disabled={!open}
                      aria-label={lesson.title}
                      onClick={() => {
                        sfx.click()
                        onLesson(lesson.id)
                      }}
                    >
                      {open ? (stars ? '★' : unit.icon) : '🔒'}
                    </button>
                    {stars > 0 && (
                      <span className="stars">
                        {'★'.repeat(stars)}
                        <span className="dim">{'★'.repeat(3 - stars)}</span>
                      </span>
                    )}
                    <span className="node-label">{lesson.title}</span>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
