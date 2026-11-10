// Интернетсіз режим:
// 1) Профиль, сөздер, күндер, достар телефонда сақталады (кэш) — интернет жоқта осыдан ашылады.
// 2) Серверге жіберілмеген өзгерістер «шығыс кезегінде» (outbox) тұрады,
//    интернет пайда болғанда өздігінен жіберіледі.
import { getState, setState, subscribeStore, toast, type State } from './store'
import type { WordState } from './srs'
import { t } from '../i18n/kk'

const CACHE = (uid: string) => `duo-cache-${uid}`
const OUTBOX = (uid: string) => `duo-outbox-${uid}`
export const LAST_UID = 'duo-last-uid'

export type Rpc = { fn: 'add_xp' | 'complete_lesson'; args: Record<string, unknown> }
type Outbox = { words: Record<string, WordState>; rpcs: Rpc[] }

/** Желі қатесі ме (сервер қатесі емес) */
export function isNetError(err: { message?: string } | null | undefined) {
  if (!err) return false
  if (typeof navigator !== 'undefined' && !navigator.onLine) return true
  return /fetch|network|load failed|timed? ?out|offline/i.test(err.message ?? '')
}

const read = <T>(k: string): T | null => {
  try {
    const v = localStorage.getItem(k)
    return v ? (JSON.parse(v) as T) : null
  } catch {
    return null
  }
}
const write = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v))
  } catch {
    /* жад толса — жай сақталмайды */
  }
}

// ---------- Кэш ----------

type Snapshot = Pick<State, 'profile' | 'progress' | 'words' | 'wordsLoaded' | 'days' | 'friends'>

export function loadSnapshot(uid: string): Snapshot | null {
  return read<Snapshot>(CACHE(uid))
}

let saveTimer: ReturnType<typeof setTimeout> | undefined
let last: Partial<Snapshot> = {}
/** Store өзгерген сайын (сәл кешіктіріп) кэшке жазамыз */
export function startSnapshotting() {
  subscribeStore(() => {
    const s = getState()
    const uid = s.session?.user.id
    if (!uid || !s.profile) return
    if (s.profile === last.profile && s.words === last.words && s.days === last.days && s.friends === last.friends && s.progress === last.progress) return
    last = s
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      const c = getState()
      write(CACHE(uid), { profile: c.profile, progress: c.progress, words: c.words, wordsLoaded: c.wordsLoaded, days: c.days, friends: c.friends })
      try {
        localStorage.setItem(LAST_UID, uid)
      } catch {
        /* бос */
      }
    }, 400)
  })
}

// ---------- Шығыс кезегі ----------

function outbox(uid: string): Outbox {
  return read<Outbox>(OUTBOX(uid)) ?? { words: {}, rpcs: [] }
}
function saveOutbox(uid: string, o: Outbox) {
  write(OUTBOX(uid), o)
  setState({ pending: Object.keys(o.words).length + o.rpcs.length })
}

export function queueWords(uid: string, updates: Record<string, WordState>) {
  const o = outbox(uid)
  Object.assign(o.words, updates)
  saveOutbox(uid, o)
}

export function queueRpc(uid: string, rpc: Rpc) {
  const o = outbox(uid)
  o.rpcs.push(rpc)
  saveOutbox(uid, o)
}

export function pendingWords(uid: string) {
  return outbox(uid).words
}

export function refreshPending(uid: string | undefined) {
  if (!uid) return setState({ pending: 0 })
  const o = outbox(uid)
  setState({ pending: Object.keys(o.words).length + o.rpcs.length })
}

/** Кезекті серверге жіберу. sender — нақты жіберуші (api.ts береді). Қайтарады: бәрі жіберілді ме */
export async function flushOutbox(
  uid: string,
  send: {
    words: (rows: Record<string, WordState>) => Promise<{ message?: string } | null>
    rpc: (r: Rpc) => Promise<{ message?: string } | null>
  },
) {
  let o = outbox(uid)
  if (Object.keys(o.words).length) {
    const err = await send.words(o.words)
    if (err) return false
    o = outbox(uid)
    o.words = {}
    saveOutbox(uid, o)
  }
  while (o.rpcs.length) {
    const err = await send.rpc(o.rpcs[0])
    // Желі қатесі — кейін қайталаймыз; басқа қате (мысалы, шектеу) — бұл жазбаны тастаймыз
    if (err && isNetError(err)) return false
    o = outbox(uid)
    o.rpcs.shift()
    saveOutbox(uid, o)
  }
  return true
}

// ---------- Желі күйі ----------

export function watchOnline(onBack: () => void) {
  const set = () => {
    const online = navigator.onLine
    const was = getState().online
    setState({ online })
    if (!online && was) toast(t.offlineOn)
    if (online && !was) onBack()
  }
  window.addEventListener('online', set)
  window.addEventListener('offline', set)
}
