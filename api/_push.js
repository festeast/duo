// Ортақ: Supabase (құпия кілтпен) және Web Push баптаулары.
// Vercel → Settings → Environment Variables:
//   SUPABASE_SECRET_KEY — Supabase → Project Settings → API Keys → Secret key
//   VAPID_PRIVATE_KEY   — хабарландыру кілті (жария кілті төменде)
//   CRON_SECRET         — кез келген ұзын сөз (кестені бөтен адам іске қоспауы үшін)
import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'

export const SUPABASE_URL = 'https://oemlkzgstceelzqvxnub.supabase.co'
export const VAPID_PUBLIC_KEY = 'BCtcy6AZ_vET-6rpAnidzLBwIaRHlBeslZIvPWtbfuvgQJO2aqLxAOKVPXpdqNIMnUBD_bfJH28LGdG9YqMtekc'

export function admin() {
  const key = process.env.SUPABASE_SECRET_KEY
  if (!key) throw new Error('SUPABASE_SECRET_KEY жоқ')
  // Жиі қате: құпия кілттің орнына жария (publishable/anon) кілт қойылады — сонда база бос болып көрінеді
  if (key.startsWith('sb_publishable')) throw new Error('SUPABASE_SECRET_KEY орнына publishable кілт қойылған — sb_secret_... кілті керек')
  if (key.startsWith('eyJ')) {
    try {
      const role = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).role
      if (role !== 'service_role') throw new Error(`SUPABASE_SECRET_KEY: бұл «${role}» кілті — service_role немесе sb_secret_... кілті керек`)
    } catch (e) {
      if (String(e.message).startsWith('SUPABASE')) throw e
    }
  }
  return createClient(process.env.SUPABASE_URL || SUPABASE_URL, key, { auth: { persistSession: false } })
}

export function initPush() {
  const priv = process.env.VAPID_PRIVATE_KEY
  if (!priv) throw new Error('VAPID_PRIVATE_KEY жоқ')
  // Apple жалған mailto-ны қабылдамауы мүмкін — сайт сілтемесін қолданамыз
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'https://duo-delta-lovat.vercel.app', process.env.VAPID_PUBLIC_KEY || VAPID_PUBLIC_KEY, priv)
}

/** Бір адамның барлық құрылғысына жіберу. Ескірген жазылымдарды өшіреді. Қайтарады: жіберілген саны */
export async function sendTo(db, subs, payload, errors = []) {
  let sent = 0
  for (const s of subs) {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, JSON.stringify(payload), { TTL: 6 * 3600 })
      sent++
    } catch (e) {
      errors.push(`${e?.statusCode ?? ''} ${String(e?.body ?? e?.message ?? e).slice(0, 160)}`.trim())
      if (e?.statusCode === 404 || e?.statusCode === 410) await db.from('push_subs').delete().eq('endpoint', s.endpoint)
      else console.error('push error', e?.statusCode, e?.body)
    }
  }
  return sent
}

/** Қазақстан уақыты (UTC+5) бойынша бүгінгі күн */
export function todayKz() {
  return new Date(Date.now() + 5 * 3600 * 1000).toISOString().slice(0, 10)
}
