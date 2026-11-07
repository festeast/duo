// Еске салу хабарландырулары (Web Push).
// iPhone-да тек «Үй экранына қосылған» қосымшада жұмыс істейді (iOS 16.4+).
import { supabase } from './supabase'

export const VAPID_PUBLIC_KEY = 'BCtcy6AZ_vET-6rpAnidzLBwIaRHlBeslZIvPWtbfuvgQJO2aqLxAOKVPXpdqNIMnUBD_bfJH28LGdG9YqMtekc'

export type PushState = 'unsupported' | 'needs-install' | 'denied' | 'off' | 'on'

const isIos = () => /iPhone|iPad|iPod/.test(navigator.userAgent)
const standalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true

function b64ToBytes(b64: string) {
  const pad = '='.repeat((4 - (b64.length % 4)) % 4)
  const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from(raw, (c) => c.charCodeAt(0))
}

async function registration() {
  if (!('serviceWorker' in navigator)) return null
  return (await navigator.serviceWorker.getRegistration()) ?? (await navigator.serviceWorker.ready)
}

export async function pushState(): Promise<PushState> {
  if (isIos() && !standalone()) return 'needs-install'
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return 'unsupported'
  if (Notification.permission === 'denied') return 'denied'
  const reg = await registration()
  const sub = await reg?.pushManager.getSubscription()
  return sub && Notification.permission === 'granted' ? 'on' : 'off'
}

/** Қосу: рұқсат сұрап, жазылымды базаға сақтаймыз */
export async function enablePush(userId: string): Promise<PushState> {
  const perm = await Notification.requestPermission()
  if (perm !== 'granted') return perm === 'denied' ? 'denied' : 'off'
  const reg = await registration()
  if (!reg) return 'unsupported'
  const sub =
    (await reg.pushManager.getSubscription()) ??
    (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(VAPID_PUBLIC_KEY) }))
  const j = sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } }
  const { error } = await supabase
    .from('push_subs')
    .upsert({ endpoint: j.endpoint, user_id: userId, p256dh: j.keys.p256dh, auth: j.keys.auth })
  if (error) throw error
  return 'on'
}

export async function disablePush(): Promise<PushState> {
  const reg = await registration()
  const sub = await reg?.pushManager.getSubscription()
  if (sub) {
    await supabase.from('push_subs').delete().eq('endpoint', sub.endpoint)
    await sub.unsubscribe()
  }
  return 'off'
}

/** Тексеру хабарламасын жіберу (Vercel функциясы арқылы) */
export async function testPush() {
  const { data } = await supabase.auth.getSession()
  const res = await fetch('/api/push-test', { method: 'POST', headers: { Authorization: `Bearer ${data.session?.access_token ?? ''}` } })
  const j = (await res.json().catch(() => ({}))) as { sent?: number; error?: string }
  if (!res.ok) throw new Error(j.error ?? String(res.status))
  return j.sent ?? 0
}
