import { useEffect, useState } from "react";
import { Phrases } from "./Phrases";
import {
  COMMON_GLOSS,
  STORIES,
  glossKey,
  splitWords,
  type Story,
} from "../data/stories";
import { analyze, wordByTr } from "../data/words";
import { t } from "../i18n/kk";
import { addXp } from "../lib/api";
import { sfx } from "../lib/sound";
import { speak, speakAll, stopSpeaking } from "../lib/speech";
import { dayKey } from "../lib/store";
import { STORY_QUIZ } from "../data/storyQuiz";
import { shuffle } from "../lib/exercises";

const READ_KEY = "duo-stories-read";

function readLog(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(READ_KEY) ?? "{}") as Record<
      string,
      string
    >;
  } catch {
    return {};
  }
}

const LEVELS = ["", "A1 · Оңай", "A2", "B1", "B2", "C1"];

/** Сөз аудармасы: алдымен әңгіменің сөздігі, болмаса — жалпы сөздік (түбірі бойынша) */
function glossOf(story: Story, key: string) {
  if (story.gloss[key]) return story.gloss[key];
  if (COMMON_GLOSS[key]) return COMMON_GLOSS[key];
  const direct = wordByTr(key);
  if (direct) return direct.kk;
  const hit = analyze(key).uses[0];
  const w = hit ? wordByTr(hit) : undefined;
  return w ? `${w.kk} (${w.tr})` : "—";
}

export function Stories({ onOpen }: { onOpen: (id: string) => void }) {
  const log = readLog();
  const [tab, setTab] = useState<"stories" | "phrases">(() => {
    try {
      return localStorage.getItem("duo-read-tab") === "phrases"
        ? "phrases"
        : "stories";
    } catch {
      return "stories";
    }
  });
  const pick = (v: "stories" | "phrases") => {
    sfx.click();
    setTab(v);
    try {
      localStorage.setItem("duo-read-tab", v);
    } catch {
      /* бос */
    }
  };
  return (
    <div className="screen">
      <h2>📖 {t.storiesTitle}</h2>
      <div className="seg">
        <button
          className={tab === "stories" ? "on" : ""}
          onClick={() => pick("stories")}
        >
          📖 {t.tabStories}
        </button>
        <button
          className={tab === "phrases" ? "on" : ""}
          onClick={() => pick("phrases")}
        >
          🎬 {t.tabPhrases}
        </button>
      </div>
      {tab === "phrases" ? (
        <Phrases />
      ) : (
        <>
          <p className="muted small" style={{ margin: 0 }}>
            {t.storiesHint}
          </p>
          <div className="col">
            {STORIES.map((s) => (
              <button
                key={s.id}
                className="card story-tile"
                onClick={() => {
                  sfx.click();
                  onOpen(s.id);
                }}
              >
                <span className="story-icon">{s.icon}</span>
                <span
                  className="col"
                  style={{ gap: 2, flex: 1, alignItems: "flex-start" }}
                >
                  <b>{s.title}</b>
                  <span className={`level-tag l${Math.min(3, s.level)}`}>
                    {LEVELS[s.level]} · {s.lines.length} {t.sentences}
                  </span>
                </span>
                {log[s.id] && <span className="ok-text">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function StoryRead({ id, onBack }: { id: string; onBack: () => void }) {
  const story = STORIES.find((s) => s.id === id) as Story;
  const [showKk, setShowKk] = useState(false);
  const [popup, setPopup] = useState<{
    word: string;
    gloss: string;
    line: number;
  } | null>(null);
  const [finished, setFinished] = useState(() => readLog()[id] === dayKey());
  const quiz = STORY_QUIZ[id];
  const [quizOn, setQuizOn] = useState(false);
  useEffect(() => () => stopSpeaking(), []);

  const finish = (correct = 0) => {
    sfx.win();
    const log = readLog();
    // XP күніне бір рет беріледі (сұрақтарға дұрыс жауап — қосымша)
    if (log[id] !== dayKey()) void addXp(5 + correct * 2, 3 + correct);
    log[id] = dayKey();
    try {
      localStorage.setItem(READ_KEY, JSON.stringify(log));
    } catch {
      /* бос */
    }
    setFinished(true);
  };

  return (
    <div className="screen story">
      <div className="lesson-top">
        <button className="icon-btn" onClick={onBack} aria-label={t.cancel}>
          ←
        </button>
        <h2 style={{ flex: 1 }}>
          {story.icon} {story.title}
        </h2>
      </div>

      <div className="seg">
        <button
          className={!showKk ? "on" : ""}
          onClick={() => setShowKk(false)}
        >
          🇹🇷 {t.onlyTurkish}
        </button>
        <button className={showKk ? "on" : ""} onClick={() => setShowKk(true)}>
          🇰🇿 {t.withTranslation}
        </button>
      </div>
      <p className="muted small" style={{ margin: 0 }}>
        {t.tapWordHint}
      </p>

      <div className="col story-text">
        {story.lines.map(([tr, kk], li) => (
          <div key={li} className="story-line">
            <button
              className="line-play"
              onClick={() => speak(tr)}
              aria-label={t.tapToListen}
            >
              🔊
            </button>
            <div className="col" style={{ gap: 2 }}>
              <p className="tr-line">
                {splitWords(tr).map((w, i) => {
                  const key = glossKey(w);
                  if (!key.trim()) return <span key={i}>{w}</span>;
                  return (
                    <span
                      key={i}
                      className={`tw${popup?.line === li && popup.word === w ? " on" : ""}`}
                      onClick={() => {
                        speak(w.replace(/[“”"«»]/g, ""));
                        setPopup({
                          word: w,
                          gloss: glossOf(story, key),
                          line: li,
                        });
                      }}
                    >
                      {w}
                    </span>
                  );
                })}
              </p>
              {popup?.line === li && (
                <span className="gloss pop">
                  <b>{popup.word.replace(/[.,!?;:“”"«»]/g, "")}</b> —{" "}
                  {popup.gloss}
                </span>
              )}
              {showKk && <span className="muted small">{kk}</span>}
            </div>
          </div>
        ))}
      </div>

      <button
        className="btn blue wide"
        onClick={() => speakAll(story.lines.map((l) => l[0]))}
      >
        🔊 {t.listenAll}
      </button>
      {quizOn && quiz ? (
        <StoryQuiz
          questions={quiz}
          onDone={(n) => {
            setQuizOn(false);
            if (!finished) finish(n);
          }}
        />
      ) : finished ? (
        <>
          <p className="center ok-text">✓ {t.storyDone}</p>
          {quiz && (
            <button className="btn ghost wide" onClick={() => setQuizOn(true)}>
              ❓ {t.quizAgain}
            </button>
          )}
        </>
      ) : (
        <button
          className="btn wide"
          onClick={() => {
            stopSpeaking();
            if (quiz) setQuizOn(true);
            else finish();
          }}
        >
          {quiz ? `❓ ${t.quizStart}` : t.storyFinish}
        </button>
      )}
    </div>
  );
}

/** Әңгімеден кейінгі түсіну сұрақтары */
function StoryQuiz({
  questions,
  onDone,
}: {
  questions: { q: string; options: string[] }[];
  onDone: (correct: number) => void;
}) {
  const [i, setI] = useState(0);
  const [sel, setSel] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [opts] = useState(() => questions.map((q) => shuffle([...q.options])));
  const [over, setOver] = useState(false);
  const q = questions[i];
  const right = q.options[0];

  useEffect(() => {
    document
      .querySelector(".story-quiz")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (over)
    return (
      <div className="card col center story-quiz pop">
        <span style={{ fontSize: 44 }}>
          {score === questions.length
            ? "🏆"
            : score >= questions.length / 2
              ? "👏"
              : "📚"}
        </span>
        <h3 style={{ margin: 0 }}>{t.quizResult(score, questions.length)}</h3>
        <button className="btn wide" onClick={() => onDone(score)}>
          {t.continue}
        </button>
      </div>
    );

  return (
    <div className="card col story-quiz pop" key={i}>
      <span className="muted small">
        ❓ {t.quizTitle} · {i + 1}/{questions.length}
      </span>
      <b style={{ fontSize: 19 }}>{q.q}</b>
      <div className="col" style={{ gap: 8 }}>
        {opts[i].map((o) => {
          const cls =
            sel === null
              ? ""
              : o === right
                ? " good"
                : o === sel
                  ? " bad"
                  : " faded";
          return (
            <button
              key={o}
              className={`option${cls}`}
              disabled={sel !== null}
              onClick={() => {
                setSel(o);
                if (o === right) {
                  sfx.correct();
                  setScore((x) => x + 1);
                } else sfx.wrong();
              }}
            >
              {o}
            </button>
          );
        })}
      </div>
      {sel !== null && (
        <button
          className="btn wide"
          onClick={() => {
            sfx.click();
            setSel(null);
            if (i + 1 >= questions.length) setOver(true);
            else setI(i + 1);
          }}
        >
          {t.continue}
        </button>
      )}
    </div>
  );
}
