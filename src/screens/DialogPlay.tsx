import { useEffect, useMemo, useRef, useState } from 'react'
import { Cat } from '../components/Cat'
import { Feedback, MicButton, Options, TileBuilder, type Status } from '../components/Exercises'
import { DEFAULT_NAMES, dialogById, isNamedRole, personalize, type Dialog, type Line } from '../data/dialogs'
import { t } from '../i18n/kk'
import { completeLesson, dialogQuit, dialogSay, fetchDialog, watchDialog } from '../lib/api'
import { normTr, shuffle, tokenize } from '../lib/exercises'
import { sfx } from '../lib/sound'
import { speak, stopSpeaking } from '../lib/speech'
import { levelOf, toast, useStore } from '../lib/store'
import { clearSolo, getSolo, setSolo as saveSolo } from '../lib/dialogProgress'
import type { CatLook, DialogSession } from '../lib/types'
import type { LessonResult } from './Result'
import type { DialogStart } from './Together'

const BOT = { name: 'Мысық', cat: { fur: 'cream', eyes: 'violet', char: 'sleepy', ear: 'ear-pearl', cheek: 'blush' } as CatLook }

type View = { status: DialogSession['status']; step: number; myTries: number[] }

export function DialogPlay({ start, onExit, onFinish }: { start: DialogStart; onExit: () => void; onFinish: (r: LessonResult) => void }) {
  const me = useStore((s) => s.profile)!
  const friends = useStore((s) => s.friends)
  const [session, setSession] = useState<DialogSession | null>(null)
  // Мысықпен ойнағанда — бұрынғы прогресті жалғастырамыз
  const [solo, setSolo] = useState<View>(() => {
    const saved = start.kind === 'solo' ? getSolo(start.dialogId) : null
    return saved && start.kind === 'solo' && saved.role === start.role
      ? { status: 'active', step: saved.step, myTries: saved.myTries }
      : { status: 'active', step: 0, myTries: [] }
  })
  useEffect(() => {
    if (start.kind !== 'solo') return
    if (solo.status === 'done') clearSolo(start.dialogId)
    else if (solo.step > 0) saveSolo(start.dialogId, { role: start.role, step: solo.step, myTries: solo.myTries, updated: Date.now() })
  }, [solo, start])
  useEffect(() => () => stopSpeaking(), [])

  // Онлайн: сессияны жүктеп, өзгерістерін тыңдаймыз
  useEffect(() => {
    if (start.kind !== 'online') return
    let alive = true
    void fetchDialog(start.sessionId).then((s) => alive && s && setSession(s))
    const stop = watchDialog(start.sessionId, (s) => setSession((old) => (!old || s.step >= old.step ? s : old)))
    return () => {
      alive = false
      stop()
    }
  }, [start])

  const base: Dialog | undefined = dialogById(start.kind === 'solo' ? start.dialogId : (session?.dialog_id ?? ''))
  if (!base || (start.kind === 'online' && !session)) {
    return (
      <div className="screen center" style={{ justifyContent: 'center' }}>
        <p className="muted">{t.loading}</p>
      </div>
    )
  }

  let myRole: 'A' | 'B'
  let partner: { name: string; cat: CatLook }
  let view: View
  if (start.kind === 'solo') {
    myRole = start.role
    // Мысық серіктің аты — әдепкі ат (Әділхан / Шырайлым)
    // Мысық серіктің аты — әдепкі ат (Әділхан / Шырайлым), бірақ ойыншының атымен бірдей болмауы керек
    const other = DEFAULT_NAMES[start.role === 'A' ? 'B' : 'A']
    partner = { ...BOT, name: other === me.name ? DEFAULT_NAMES[start.role] : other }
    view = solo
  } else {
    const s = session!
    const iAmHost = s.host === me.id
    myRole = iAmHost ? s.host_role : s.host_role === 'A' ? 'B' : 'A'
    const pid = iAmHost ? s.guest : s.host
    const p = friends.find((f) => f.profile.id === pid)?.profile
    partner = { name: p?.name ?? '…', cat: p?.cat ?? BOT.cat }
    view = { status: s.status, step: s.step, myTries: s.log.filter((l) => l.by === me.id).map((l) => l.tries) }
  }

  // Диалогтағы {A}/{B} орнына нақты ойыншылардың аттары қойылады
  const names = myRole === 'A' ? { A: me.name || DEFAULT_NAMES.A, B: partner.name } : { A: partner.name, B: me.name || DEFAULT_NAMES.B }
  const dialog = personalize(base, names)

  return (
    <DialogView
      key={dialog.id}
      dialog={dialog}
      myRole={myRole}
      me={{ name: me.name, cat: me.cat }}
      myXp={me.xp}
      partner={partner}
      view={view}
      solo={start.kind === 'solo'}
      onSay={async (answer, tries) => {
        if (start.kind === 'solo') {
          setSolo((v) => ({ ...v, step: v.step + 1, myTries: [...v.myTries, tries], status: v.step + 1 >= dialog.lines.length ? 'done' : 'active' }))
        } else {
          const s = await dialogSay(start.sessionId, view.step, answer, tries)
          if (s) setSession(s)
        }
      }}
      onBotSay={() => setSolo((v) => ({ ...v, step: v.step + 1, status: v.step + 1 >= dialog.lines.length ? 'done' : 'active' }))}
      onQuit={() => {
        // Шақыру әлі қабылданбаса — тоқтатамыз; басталған диалог кідіртіледі (кейін жалғастыруға болады)
        if (start.kind === 'online' && session?.status === 'invited') void dialogQuit(start.sessionId)
        else if (view.status === 'active' && view.step > 0) toast(t.dialogPaused)
        onExit()
      }}
      onFinish={onFinish}
      onExit={onExit}
    />
  )
}

function DialogView({
  dialog,
  myRole,
  me,
  myXp,
  partner,
  view,
  solo,
  onSay,
  onBotSay,
  onQuit,
  onFinish,
  onExit,
}: {
  dialog: Dialog
  myRole: 'A' | 'B'
  me: { name: string; cat: CatLook }
  myXp: number
  partner: { name: string; cat: CatLook }
  view: View
  solo: boolean
  onSay: (answer: string, tries: number) => Promise<void>
  onBotSay: () => void
  onQuit: () => void
  onFinish: (r: LessonResult) => void
  onExit: () => void
}) {
  const lines = dialog.lines
  const { step, status } = view
  const line: Line | undefined = lines[step]
  const myTurn = status === 'active' && line?.role === myRole
  const chatEnd = useRef<HTMLDivElement>(null)
  const spoken = useRef(0)
  const botSay = useRef(onBotSay)
  useEffect(() => {
    botSay.current = onBotSay
  })

  // Жаңа реплика пайда болғанда — айтып береміз және төмен жылжимыз
  useEffect(() => {
    if (step > spoken.current) {
      const said = lines[step - 1]
      if (said.role !== myRole) {
        speak(said.tr)
        sfx.match()
      }
      spoken.current = step
    }
    chatEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [step, lines, myRole])

  // Мысықпен жаттығу: мысық өз репликасын өзі айтады
  useEffect(() => {
    if (!solo || status !== 'active' || !line || line.role === myRole) return
    const id = setTimeout(() => botSay.current(), 1600)
    return () => clearTimeout(id)
  }, [solo, status, line, myRole])

  // Нәтиже бір рет есептеледі
  const finished = useRef(false)
  const result = useMemo(() => {
    if (status !== 'done') return null
    const mistakes = view.myTries.reduce((a, n) => a + Math.max(0, n - 1), 0)
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1
    const xp = 10 + dialog.level * 5 + (mistakes === 0 ? 5 : 0) // оңай 15, орта 20, қиын 25
    const mine = lines.filter((l) => l.role === myRole).length
    return {
      title: t.dialogComplete,
      stars,
      xp,
      coins: stars * 5,
      accuracy: Math.round((mine / (mine + mistakes)) * 100),
      levelUp: levelOf(myXp + xp).level > levelOf(myXp).level,
    }
  }, [status, view.myTries, lines, myRole, myXp, dialog.level])

  useEffect(() => {
    if (result && !finished.current) {
      finished.current = true
      sfx.win()
      void completeLesson(`dlg-${dialog.id}`, result.stars, result.xp, result.coins)
    }
  }, [result, dialog.id])

  const people = { [myRole]: me, [myRole === 'A' ? 'B' : 'A']: partner } as Record<'A' | 'B', { name: string; cat: CatLook }>

  return (
    <div className="screen dialog-screen">
      <div className="lesson-top">
        <button
          className="icon-btn"
          aria-label={t.quit}
          onClick={() => {
            if (status !== 'active' || step === 0 || confirm(t.pauseConfirm)) onQuit()
          }}
        >
          ✕
        </button>
        <div className="bar">
          <i style={{ width: `${(step / lines.length) * 100}%` }} />
        </div>
        <span className="dialog-badge">
          {dialog.icon} {dialog.title}
        </span>
      </div>

      <div className="cast">
        <div className="cast-person">
          <Cat look={people.A.cat} size={64} mood={line?.role === 'A' && status === 'active' ? 'happy' : 'normal'} />
          <b>{people.A.name}</b>
          {!isNamedRole(dialogById(dialog.id)!.roles.A) && <span className="muted tiny">{dialog.roles.A}</span>}
        </div>
        <span className="vs">💬</span>
        <div className="cast-person">
          <Cat look={people.B.cat} size={64} flip mood={line?.role === 'B' && status === 'active' ? 'happy' : 'normal'} />
          <b>{people.B.name}</b>
          {!isNamedRole(dialogById(dialog.id)!.roles.B) && <span className="muted tiny">{dialog.roles.B}</span>}
        </div>
      </div>

      {status === 'invited' && (
        <div className="card col center pop">
          <h3>{t.waitingFor(partner.name)}</h3>
          <div className="typing">
            <i />
            <i />
            <i />
          </div>
          <span className="muted small">{t.waitingHint}</span>
        </div>
      )}

      {status === 'declined' && (
        <div className="card col center pop">
          <h3>{t.dialogDeclined}</h3>
          <button className="btn" onClick={onExit}>
            {t.backHome}
          </button>
        </div>
      )}

      <div className="chat">
        {lines.slice(0, step).map((l, i) => (
          <div key={i} className={`msg ${l.role === myRole ? 'mine' : 'theirs'} pop`}>
            <button className="msg-bubble" onClick={() => speak(l.tr)}>
              <span className="msg-tr">{l.tr}</span>
              <span className="msg-kk">{l.kk}</span>
            </button>
          </div>
        ))}
        {status === 'active' && line && !myTurn && (
          <div className="msg theirs">
            <div className="msg-bubble typing-bubble">
              <span className="muted small">{t.typing(people[line.role].name)}</span>
              <div className="typing">
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEnd} />
      </div>

      {myTurn && line && <MyTurn key={step} line={line} lines={lines} level={dialog.level} look={me.cat} onSay={onSay} />}

      {result && (
        <div className="feedback ok slide-up">
          <div className="row">
            <Cat look={me.cat} size={56} mood="happy" />
            <div className="col" style={{ gap: 2 }}>
              <h3>{t.dialogComplete}</h3>
              <span>
                +{result.xp} XP · 🪙 +{result.coins}
              </span>
            </div>
          </div>
          <button className="btn wide" onClick={() => onFinish(result)}>
            {t.continue}
          </button>
        </div>
      )}
    </div>
  )
}

/** Менің кезегім: репликаны құрастыру немесе таңдау */
function MyTurn({ line, lines, level, look, onSay }: { line: Line; lines: Line[]; level: number; look: CatLook; onSay: (answer: string, tries: number) => Promise<void> }) {
  const tokens = useMemo(() => tokenize(line.tr), [line])
  // Қиын диалогта ұзын сөйлемдерді де сөзбе-сөз құрастырасың
  const useTiles = tokens.length <= [0, 6, 8, 10][level]
  const tiles = useMemo(() => {
    if (!useTiles) return []
    const others = lines.filter((l) => l !== line).flatMap((l) => tokenize(l.tr))
    const extra = shuffle([...new Set(others)].filter((w) => !tokens.some((x) => normTr(x) === normTr(w)))).slice(0, 3)
    return shuffle([...tokens, ...extra])
  }, [line, lines, tokens, useTiles])
  const options = useMemo(() => {
    if (useTiles) return []
    const others = shuffle(lines.filter((l) => l !== line).map((l) => l.tr)).slice(0, 2)
    return shuffle([line.tr, ...others])
  }, [line, lines, useTiles])

  const [picked, setPicked] = useState<number[]>([])
  const [sel, setSel] = useState<string | null>(null)
  const [tries, setTries] = useState(1)
  const [status, setStatus] = useState<Status>('idle')
  const [busy, setBusy] = useState(false)

  const say = async (n: number) => {
    setBusy(true)
    speak(line.tr)
    await onSay(line.tr, n)
    setBusy(false)
  }

  const check = () => {
    const ok = useTiles
      ? picked.map((i) => normTr(tiles[i])).join(' ') === tokens.map(normTr).join(' ')
      : sel === line.tr
    if (ok) {
      sfx.correct()
      void say(tries)
    } else {
      sfx.wrong()
      setStatus('no')
    }
  }

  if (status === 'no') {
    return (
      <Feedback
        ok={false}
        praise=""
        answer={line.tr}
        look={look}
        nextLabel={t.gotIt}
        onNext={() => {
          if (busy) return
          void say(tries + 1)
          setTries(tries + 1)
        }}
      />
    )
  }

  return (
    <div className="my-turn slide-up">
      <span className="muted small">{t.yourTurn}</span>
      <div className="bubble kk-bubble">{line.kk}</div>
      <MicButton
        target={line.tr}
        label={t.micAnswer}
        onResult={(ok) => {
          if (ok && !busy) void say(tries)
        }}
      />
      {useTiles ? (
        <TileBuilder tiles={tiles} picked={picked} setPicked={setPicked} locked={busy} />
      ) : (
        <Options options={options} sel={sel} setSel={setSel} status="idle" answer={line.tr} />
      )}
      <button className="btn wide" disabled={busy || (useTiles ? picked.length === 0 : !sel)} onClick={check}>
        {busy ? '…' : t.check}
      </button>
    </div>
  )
}
