// Күнделікті еске салу: Vercel Cron күнде 16:00 UTC (Қазақстанда 21:00) іске қосады.
// Бүгін сабақ оқымаған адамдарға хабарлама жібереді.
import { admin, initPush, sendTo, todayKz } from './_push.js'

const pick = (a) => a[Math.floor(Math.random() * a.length)]

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET
  if (secret && req.headers.authorization !== `Bearer ${secret}`) return res.status(401).json({ error: 'unauthorized' })
  try {
    initPush()
    const db = admin()
    const today = todayKz()
    const { data: subs, error } = await db.from('push_subs').select('endpoint, user_id, p256dh, auth')
    if (error) throw error
    const users = [...new Set(subs.map((s) => s.user_id))]
    if (!users.length) return res.json({ users: 0, sent: 0 })

    const [{ data: act }, { data: profs }, { data: friends }] = await Promise.all([
      db.from('activity').select('user_id').eq('day', today),
      db.from('profiles').select('id, name'),
      db.from('friendships').select('requester, addressee, status').eq('status', 'accepted'),
    ])
    const studied = new Set((act ?? []).map((a) => a.user_id))
    const nameOf = Object.fromEntries((profs ?? []).map((p) => [p.id, p.name]))

    let sent = 0
    for (const uid of users) {
      if (studied.has(uid)) continue // бүгін оқыған — мазаламаймыз
      const { count } = await db
        .from('word_progress')
        .select('word', { count: 'exact', head: true })
        .eq('user_id', uid)
        .gte('stage', 1)
        .lte('due_on', today)
      const buddy = (friends ?? [])
        .map((f) => (f.requester === uid ? f.addressee : f.addressee === uid ? f.requester : null))
        .find((id) => id && studied.has(id))
      const body = buddy
        ? `${nameOf[buddy] ?? 'Досың'} бүгін оқып қойды. Сен де қосыл! 💞`
        : count
          ? `Бүгін ${count} сөзді қайталау керек. 5 минут жетеді! ⏱️`
          : pick(['Бүгін бірнеше жаңа сөз үйренейік! ✨', 'Отың сөнбесін — бүгінгі сабақты өт! 🔥', 'Мысығың сені күтіп отыр 🐱'])
      sent += await sendTo(
        db,
        subs.filter((s) => s.user_id === uid),
        { title: `${nameOf[uid] ?? ''}, Türkçe zamanı! 🇹🇷`.trim(), body, url: '/' },
      )
    }
    res.json({ users: users.length, sent })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: String(e?.message ?? e) })
  }
}
