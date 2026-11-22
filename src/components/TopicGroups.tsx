import { useMemo, useState } from 'react'
import { WORD_LIST, type Word } from '../data/words'
import { t } from '../i18n/kk'
import { isLearned, dueLabel } from '../lib/srs'
import { speak } from '../lib/speech'
import { dayKey, useStore } from '../lib/store'
import { CheckCircle2, ChevronDown, ChevronUp, Coin, Target } from './Icon'
import { TopicPic, WordPic } from './Pictos'

export type Topic = { name: string; words: Word[] }

/** Сөздер тақырыптар бойынша (сөздік ретімен) */
export const TOPICS: Topic[] = (() => {
  const map = new Map<string, Word[]>()
  for (const w of WORD_LIST) (map.get(w.topic) ?? map.set(w.topic, []).get(w.topic)!).push(w)
  return [...map.entries()].map(([name, words]) => ({ name, words }))
})()

/** «Үйренген сөздерім» — тақырыптар бойынша топтар, әр топта тест */
export function TopicGroups({ onWord, onTest }: { onWord: (tr: string) => void; onTest: (topic: string) => void }) {
  const words = useStore((s) => s.words)
  const tests = useStore((s) => s.topicTests)
  const [open, setOpen] = useState<string | null>(null)
  const [all, setAll] = useState(false)
  const rows = useMemo(
    () => TOPICS.map((tp) => ({ ...tp, learned: tp.words.filter((w) => isLearned(words[w.tr])).length })),
    [words],
  )
  const started = rows.filter((r) => r.learned > 0)
  const shown = all ? rows : started
  const total = rows.reduce((n, r) => n + r.learned, 0)

  return (
    <section className="col">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>{t.learnedWords}</h3>
        <span className="muted small">
          {total}/{WORD_LIST.length}
        </span>
      </div>
      {started.length === 0 && <p className="muted small">{t.learnedEmpty}</p>}
      <div className="col" style={{ gap: 8 }}>
        {shown.map((r) => {
          const isOpen = open === r.name
          const passed = tests?.passed.includes(r.name)
          const pct = r.learned / r.words.length
          return (
            <div key={r.name} className={`card topic${isOpen ? ' open' : ''}`}>
              <button className="topic-head" onClick={() => setOpen(isOpen ? null : r.name)}>
                <TopicPic topic={r.name} size={42} color={passed ? 'var(--green-dark)' : 'var(--blue)'} />
                <span className="col" style={{ gap: 4, flex: 1, minWidth: 0, alignItems: 'flex-start' }}>
                  <b className="ellipsis" style={{ maxWidth: '100%' }}>{r.name}</b>
                  <span className="topic-bar">
                    <i style={{ width: `${pct * 100}%` }} />
                  </span>
                </span>
                <span className="col" style={{ alignItems: 'flex-end', gap: 2 }}>
                  <b className="small">
                    {r.learned}/{r.words.length}
                  </b>
                  {passed && (
                    <span className="ok-text tiny ih" style={{ gap: 3 }}>
                      <CheckCircle2 size={12} /> {t.topicMastered}
                    </span>
                  )}
                </span>
                {isOpen ? <ChevronUp size={18} className="muted" /> : <ChevronDown size={18} className="muted" />}
              </button>
              {isOpen && (
                <div className="col pop" style={{ gap: 6 }}>
                  {r.words.map((w) => {
                    const st = words[w.tr]
                    const on = isLearned(st)
                    return (
                      <button
                        key={w.tr}
                        className={`topic-word${on ? '' : ' off'}`}
                        onClick={() => {
                          speak(w.tr)
                          onWord(w.tr)
                        }}
                      >
                        <WordPic w={w} size={30} />
                        <b>{w.tr}</b>
                        <span className="muted small" style={{ flex: 1 }}>
                          {w.kk}
                        </span>
                        {on && <span className={`due tiny ${st.due_on <= dayKey() ? 'now' : ''}`}>{dueLabel(st.due_on)}</span>}
                      </button>
                    )
                  })}
                  {!passed && tests && (
                    <div className="topic-test">
                      <span className="small">{t.topicTestHint}</span>
                      <button className="btn purple wide" onClick={() => onTest(r.name)}>
                        <Target size={18} /> {t.topicTest}
                        <span className="topic-price">
                          {tests.freeLeft ? (
                            t.topicFree
                          ) : (
                            <>
                              <Coin size={15} /> 30
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <button className="link-btn" onClick={() => setAll(!all)}>
        {all ? t.topicsMine : t.topicsAll(rows.length)}
      </button>
    </section>
  )
}
