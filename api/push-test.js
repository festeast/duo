// «Тексеру хабарламасы»: кірген адамның өз құрылғыларына бірден жібереді.
import { admin, initPush, sendTo } from './_push.js'

export default async function handler(req, res) {
  try {
    const token = (req.headers.authorization || '').replace(/^Bearer /, '')
    if (!token) return res.status(401).json({ error: 'no token' })
    const db = admin()
    const { data: u, error } = await db.auth.getUser(token)
    if (error || !u?.user) return res.status(401).json({ error: 'bad token' })
    initPush()
    const { data: subs } = await db.from('push_subs').select('endpoint, user_id, p256dh, auth').eq('user_id', u.user.id)
    const errors = []
    const sent = await sendTo(db, subs ?? [], { title: 'Дуо 🐱', body: 'Хабарландыру жұмыс істеп тұр! Кешке еске саламын.', url: '/' }, errors)
    res.json({ subs: (subs ?? []).length, sent, errors })
  } catch (e) {
    res.status(500).json({ error: String(e?.message ?? e) })
  }
}
