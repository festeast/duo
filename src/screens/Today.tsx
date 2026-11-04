import { useMemo, useState } from 'react'
import { Cat } from '../components/Cat'
import { CognateBadge } from '../components/Exercises'
import { tipOfDay } from '../data/grammar'
import { WORD_LIST } from '../data/words'
import { t } from '../i18n/kk'
import { sfx } from '../lib/sound'
import { speak } from '../lib/speech'
import { MAX_STAGE, dueLabel, getNewPerDay, todayPlan, type Plan } from '../lib/srs'
import { placedKey } from '../lib/placement'
import { dayKey, studiedToday, useStore } from '../lib/store'

const EXTRA_KEY = 'duo-extra-new'

function readExtra() {
  try {
    const raw = JSON.parse(localStorage.getItem(EXTRA_KEY) ?? 'null') as { day: string; n: number } | null
    return raw?.day === dayKey() ? raw.n : 0
  } catch {
    return 0
  }
}

export function Today({ onStart, onPlacement }: { onStart: (plan: Plan) => void; onPlacement: () => void }) {
  const me = useStore((s) => s.profile)
  const words = useStore((s) => s.words)
  const wordsLoaded = useStore((s) => s.wordsLoaded)
  const days = useStore((s) => s.days)
  const uid = useStore((s) => s.session?.user.id)
  const [skipTest, setSkipTest] = useState(false)
  const [extra, setExtra] = useState(readExtra)
  const [showAll, setShowAll] = useState(false)
  const plan = useMemo(() => todayPlan(words, extra), [words, extra])
  const tip = useMemo(() => tipOfDay(), [])

  const learned = useMemo(
    () =>
      WORD_LIST.filter((w) => words[w.tr]).sort(
        (a, b) => words[a.tr].due_on.localeCompare(words[b.tr].due_on) || a.order - b.order,
      ),
    [words],
  )
  if (!me) return null

  const todo = plan.review.length + plan.fresh.length
  const goal = Math.max(getNewPerDay(), plan.doneToday + todo)
  const finished = todo === 0
  const done = studiedToday(days)
  const tomorrow = learned.filter((w) => words[w.tr].due_on === dayKeyPlus(1)).length

  const moreWords = () => {
    sfx.click()
    const n = extra + 5
    setExtra(n)
    try {
      localStorage.setItem(EXTRA_KEY, JSON.stringify({ day: dayKey(), n }))
    } catch {
      /* бос */
    }
  }

  return (
    <div className="screen" style={{ paddingTop: 12 }}>
      {!wordsLoaded && <div className="card warn">{t.needMigration}</div>}

      {wordsLoaded && learned.length === 0 && !skipTest && !hasPlaced(uid) && (
        <section className="card place-card pop">
          <h2>🎯 {t.placeAskTitle}</h2>
          <p className="muted" style={{ margin: 0 }}>
            {t.placeAskText}
          </p>
          <button className="btn wide" onClick={onPlacement}>
            {t.placeAskYes}
          </button>
          <button
            className="btn ghost wide"
            onClick={() => {
              try {
                if (uid) localStorage.setItem(placedKey(uid), dayKey())
              } catch {
                /* бос */
              }
              setSkipTest(true)
            }}
          >
            {t.placeAskNo}
          </button>
        </section>
      )}

      {/* ---------- Бүгінге не бар? ---------- */}
      <section className="today card">
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div className="col" style={{ gap: 4, flex: 1 }}>
            <h2>📅 {t.todayTitle}</h2>
            <span className="muted small">
              {finished ? t.todayAllDone : t.todayCounts(plan.fresh.length, plan.review.length)}
            </span>
          </div>
          <Cat look={me.cat} size={64} mood={finished || done ? 'happy' : 'normal'} bounce={finished} />
        </div>

        <div className="today-progress">
          <div className="bar">
            <i style={{ width: `${(plan.doneToday / goal) * 100}%` }} />
          </div>
          <b>
            {plan.doneToday}/{goal}
          </b>
        </div>

        {!finished && (
          <>
            <div className="chips">
              {plan.review.map((w) => (
                <span key={w.tr} className="chip-word review">
                  🔁 {w.tr}
                </span>
              ))}
              {plan.fresh.map((w) => (
                <span key={w.tr} className="chip-word fresh">
                  ✨ {w.emoji ? `${w.emoji} ` : ''}
                  {w.tr}
                </span>
              ))}
            </div>
            <button
              className="btn wide"
              onClick={() => {
                sfx.click()
                onStart(plan)
              }}
            >
              {plan.doneToday > 0 ? t.continueToday : t.startToday}
            </button>
          </>
        )}

        {finished && (
          <>
            <p className="done-text">✅ {t.todayDoneText}</p>
            {tomorrow > 0 && <span className="muted small">{t.tomorrowReview(tomorrow)}</span>}
            {plan.dueTotal === 0 && WORD_LIST.some((w) => !words[w.tr]) && (
              <button className="btn ghost wide" onClick={moreWords}>
                ✨ {t.moreWords}
              </button>
            )}
          </>
        )}
      </section>

      {/* ---------- Бүгінгі кеңес ---------- */}
      <section className="card tip">
        <span className="muted small">💡 {t.tipTitle}</span>
        <h3>{tip.title}</h3>
        <p>{tip.text}</p>
        <div className="tip-examples">
          {tip.examples.map(([tr, kk]) => (
            <button key={tr} className="tip-ex" onClick={() => speak(tr)}>
              <b>{tr}</b>
              <span>{kk}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ---------- Үйренген сөздер ---------- */}
      <section className="col">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h3>📚 {t.learnedWords}</h3>
          <span className="muted small">
            {learned.length}/{WORD_LIST.length}
          </span>
        </div>
        {learned.length === 0 && <p className="muted small">{t.learnedEmpty}</p>}
        <div className="word-list">
          {(showAll ? learned : learned.slice(0, 15)).map((w) => {
            const st = words[w.tr]
            return (
              <button key={w.tr} className="word-row" onClick={() => speak(w.tr)}>
                <span className="wr-emoji">{w.emoji ?? '•'}</span>
                <span className="wr-main">
                  <b>
                    {w.tr} {w.cognate && <CognateBadge c={w.cognate} compact />}
                  </b>
                  <span className="muted small">{w.kk}</span>
                </span>
                <span className="wr-side">
                  <span className="dots" aria-label={`${st.stage}/${MAX_STAGE}`}>
                    {Array.from({ length: MAX_STAGE }, (_, i) => (
                      <i key={i} className={i < st.stage ? 'on' : ''} />
                    ))}
                  </span>
                  <span className={`due ${st.due_on <= dayKey() ? 'now' : ''}`}>🔁 {dueLabel(st.due_on)}</span>
                </span>
              </button>
            )
          })}
        </div>
        {learned.length > 15 && (
          <button className="link-btn" onClick={() => setShowAll(!showAll)}>
            {showAll ? t.showLess : t.showAll(learned.length)}
          </button>
        )}
      </section>
    </div>
  )
}

function hasPlaced(uid?: string) {
  try {
    return !!uid && !!localStorage.getItem(placedKey(uid))
  } catch {
    return false
  }
}

function dayKeyPlus(n: number) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return dayKey(d)
}
