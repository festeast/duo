import type { RealtimeChannel, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { dayKey, daysAgo, getState, setState, toast, type Friend } from './store'
import type { CatLook, DialogSession, Profile } from './types'
import { t } from '../i18n/kk'

// ---------- Кіру / тіркелу ----------

export async function signUp(name: string, email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
  if (error) return translateAuthError(error.message)
  // Supabase-те «Confirm email» қосулы болса, сессия бірден ашылмайды
  if (!data.session) return t.checkEmail
  return null
}

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return error ? translateAuthError(error.message) : null
}

export async function signOut() {
  await supabase.auth.signOut()
}

function translateAuthError(msg: string) {
  if (/fetch|network/i.test(msg)) return t.errNetwork
  if (/invalid login/i.test(msg)) return t.errLogin
  if (/already registered|already exists/i.test(msg)) return t.errExists
  if (/password/i.test(msg)) return t.errPassword
  if (/email/i.test(msg)) return t.errEmail
  return msg
}

// ---------- Жүктеу ----------

export async function loadMe() {
  const uid = getState().session?.user.id
  if (!uid) return
  const [p, prog, act] = await Promise.all([
    supabase.from('profiles').select().eq('id', uid).single(),
    supabase.from('lesson_progress').select('lesson_id, stars').eq('user_id', uid),
    supabase.from('activity').select('day, xp').eq('user_id', uid).gte('day', daysAgo(400)),
  ])
  setState({
    profile: (p.data as Profile) ?? null,
    progress: Object.fromEntries((prog.data ?? []).map((r) => [r.lesson_id, r.stars])),
    days: Object.fromEntries((act.data ?? []).map((r) => [r.day, r.xp])),
  })
}

export async function loadFriends() {
  const uid = getState().session?.user.id
  if (!uid) return
  const { data } = await supabase
    .from('friendships')
    .select('id, status, requester, addressee, req:profiles!friendships_requester_fkey(*), adr:profiles!friendships_addressee_fkey(*)')
  const rows = (data ?? []) as unknown as {
    id: number
    status: 'pending' | 'accepted'
    requester: string
    req: Profile
    adr: Profile
  }[]

  const ids = rows.filter((r) => r.status === 'accepted').map((r) => (r.requester === uid ? r.adr.id : r.req.id))
  const [act, prog] = ids.length
    ? await Promise.all([
        supabase.from('activity').select('user_id, day, xp').in('user_id', ids).gte('day', daysAgo(400)),
        supabase.from('lesson_progress').select('user_id').in('user_id', ids),
      ])
    : [{ data: [] }, { data: [] }]

  const friends: Friend[] = rows.map((r) => {
    const profile = r.requester === uid ? r.adr : r.req
    const days: Record<string, number> = {}
    for (const a of (act.data ?? []) as { user_id: string; day: string; xp: number }[]) if (a.user_id === profile.id) days[a.day] = a.xp
    return {
      friendshipId: r.id,
      status: r.status,
      incoming: r.status === 'pending' && r.requester !== uid,
      profile,
      days,
      lessonsDone: ((prog.data ?? []) as { user_id: string }[]).filter((x) => x.user_id === profile.id).length,
    }
  })
  setState({ friends })
}

export async function loadInvites() {
  const uid = getState().session?.user.id
  if (!uid) return
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { data } = await supabase
    .from('dialog_sessions')
    .select()
    .eq('guest', uid)
    .eq('status', 'invited')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
  setState({ invites: (data ?? []) as DialogSession[] })
}

// ---------- Realtime ----------

let channel: RealtimeChannel | null = null
let seq = 0 // арна аттары бірегей болуы керек (бір атпен қайта ашылған арна жабылып қалады)
let friendsTimer: ReturnType<typeof setTimeout> | undefined

const refreshFriendsSoon = () => {
  clearTimeout(friendsTimer)
  friendsTimer = setTimeout(() => void loadFriends(), 300)
}

export function startRealtime() {
  stopRealtime()
  const uid = getState().session?.user.id
  if (!uid) return
  channel = supabase
    .channel(`duo-${uid}-${++seq}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'friendships' }, refreshFriendsSoon)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'activity' }, refreshFriendsSoon)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'dialog_sessions', filter: `guest=eq.${uid}` }, () => void loadInvites())
    .subscribe((status) => {
      // Байланыс үзілсе — біраздан соң қайта қосыламыз
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') setTimeout(() => getState().session && startRealtime(), 5000)
    })

  // iPhone фонда тұрғанда байланыс үзіледі, сондықтан қосымшаға оралғанда және
  // әр 15 секунд сайын жаңартып тұрамыз
  if (!pollTimer) {
    pollTimer = setInterval(refreshAll, 15000)
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', refreshAll)
  }
}

let pollTimer: ReturnType<typeof setInterval> | undefined

function refreshAll() {
  if (!getState().session || document.visibilityState === 'hidden') return
  void loadFriends()
  void loadInvites()
}

function onVisible() {
  if (document.visibilityState === 'visible') refreshAll()
}

export function stopRealtime() {
  if (channel) void supabase.removeChannel(channel)
  channel = null
}

function stopPolling() {
  clearInterval(pollTimer)
  pollTimer = undefined
  document.removeEventListener('visibilitychange', onVisible)
  window.removeEventListener('focus', refreshAll)
}

// ---------- Профиль ----------

export async function saveProfile(patch: { name?: string; cat?: CatLook }) {
  const uid = getState().session?.user.id
  if (!uid) return
  const { data, error } = await supabase.from('profiles').update(patch).eq('id', uid).select().single()
  if (error) return toast(t.errNetwork)
  setState({ profile: data as Profile })
}

export async function completeLesson(lessonId: string, stars: number, xp: number, coins: number) {
  const day = dayKey()
  // Оптимистік жаңарту: интернет баяу болса да бірден көрінеді
  setState((s) => ({
    progress: { ...s.progress, [lessonId]: Math.max(stars, s.progress[lessonId] ?? 0) },
    days: { ...s.days, [day]: (s.days[day] ?? 0) + xp },
    profile: s.profile ? { ...s.profile, xp: s.profile.xp + xp, coins: s.profile.coins + coins } : s.profile,
  }))
  const { data, error } = await supabase.rpc('complete_lesson', { p_lesson: lessonId, p_stars: stars, p_xp: xp, p_coins: coins, p_day: day })
  if (error) toast(t.errNetwork)
  else setState({ profile: data as Profile })
}

export async function buyItem(id: string, price: number) {
  const { data, error } = await supabase.rpc('buy_item', { p_item: id, p_price: price })
  if (error) return toast(t.notEnough)
  setState({ profile: data as Profile })
  return true
}

// ---------- Достар ----------

export async function addFriend(code: string) {
  const { data, error } = await supabase.rpc('add_friend', { p_code: code })
  if (error) return toast(t.errNetwork)
  const msg: Record<string, string> = {
    sent: t.friendSent,
    accepted: t.friendAccepted,
    already: t.friendAlready,
    not_found: t.friendNotFound,
    self: t.friendSelf,
  }
  toast(msg[data as string] ?? String(data))
  await loadFriends()
  return data as string
}

export async function acceptFriend(id: number) {
  await supabase.rpc('accept_friend', { p_id: id })
  await loadFriends()
}

export async function removeFriend(id: number) {
  await supabase.from('friendships').delete().eq('id', id)
  await loadFriends()
}

// ---------- Бірге диалог ----------

export async function inviteDialog(dialogId: string, friendId: string, hostRole: 'A' | 'B', turns: string) {
  const uid = getState().session?.user.id
  const { data, error } = await supabase
    .from('dialog_sessions')
    .insert({ dialog_id: dialogId, host: uid, guest: friendId, host_role: hostRole, turns })
    .select()
    .single()
  if (error) {
    toast(t.errNetwork)
    return null
  }
  return data as DialogSession
}

export async function respondDialog(id: string, accept: boolean) {
  await supabase.rpc('respond_dialog', { p_id: id, p_accept: accept })
  setState((s) => ({ invites: s.invites.filter((i) => i.id !== id) }))
}

export async function fetchDialog(id: string) {
  const { data } = await supabase.from('dialog_sessions').select().eq('id', id).single()
  return (data as DialogSession) ?? null
}

export async function dialogSay(id: string, step: number, answer: string, tries: number) {
  const { data, error } = await supabase.rpc('dialog_say', { p_id: id, p_step: step, p_answer: answer, p_tries: tries })
  if (error) toast(t.errNetwork)
  return (data as DialogSession) ?? null
}

export async function dialogQuit(id: string) {
  await supabase.rpc('dialog_quit', { p_id: id })
}

export function watchDialog(id: string, onChange: (s: DialogSession) => void) {
  const ch = supabase
    .channel(`dialog-${id}-${++seq}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'dialog_sessions', filter: `id=eq.${id}` }, (p) =>
      onChange(p.new as DialogSession),
    )
    .subscribe()
  // Realtime үзілсе де жұмыс істеуі үшін — қосымша сұрау
  const poll = setInterval(async () => {
    const s = await fetchDialog(id)
    if (s) onChange(s)
  }, 4000)
  return () => {
    clearInterval(poll)
    void supabase.removeChannel(ch)
  }
}

// ---------- Бастау ----------

let authStarted = false

export function initAuth() {
  if (authStarted) return
  authStarted = true
  void supabase.auth.getSession().then(({ data }) => handleSession(data.session))
  supabase.auth.onAuthStateChange((_e, session) => {
    if (session?.user.id !== getState().session?.user.id) void handleSession(session)
    else setState({ session })
  })
}

async function handleSession(session: Session | null) {
  setState({ session })
  if (!session) {
    stopRealtime()
    stopPolling()
    setState({ ready: true, profile: null, friends: [], invites: [], progress: {}, days: {} })
    return
  }
  await Promise.all([loadMe(), loadFriends(), loadInvites()])
  startRealtime()
  setState({ ready: true })
}
