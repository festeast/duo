// Барлық түрікше фразаларды Google Text-to-Speech арқылы бір рет дыбыстап,
// public/audio/<дауыс>/<хэш>.mp3 етіп сақтайды.
// Іске қосу: GOOGLE_TTS_KEY=AIza... node scripts/gen-audio.mjs
// Бар файлдар қайта жасалмайды — жаңа сабақ қосқанда қайта іске қоса бер.

import { createServer } from 'vite'
import { existsSync, mkdirSync, writeFileSync } from 'fs'

const KEY = process.env.GOOGLE_TTS_KEY
if (!KEY) throw new Error('GOOGLE_TTS_KEY керек')

export const VOICES = { female: 'tr-TR-Chirp3-HD-Aoede', male: 'tr-TR-Chirp3-HD-Charon' }

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const load = (p) => server.ssrLoadModule(p)
const { WORD_LIST, SENTENCE_BANK } = await load('/src/data/words.ts')
const { STORIES } = await load('/src/data/stories.ts')
const { TIPS } = await load('/src/data/grammar.ts')
const { audioKey } = await load('/src/lib/audioKey.ts')
await server.close()

const phrases = [
  ...WORD_LIST.map((w) => w.tr),
  ...SENTENCE_BANK.map((s) => s.tr), // курс, мысалдар, байланыстырушы сөйлемдер, диалогтар, әңгімелер
  ...STORIES.flatMap((s) => s.lines.map((l) => l[0])),
  ...TIPS.flatMap((t) => t.examples.map((e) => e[0])),
  'Merhaba! Birlikte Türkçe öğreniyoruz.',
]
const unique = [...new Map(phrases.map((p) => [audioKey(p), p])).entries()]

async function synth(text, voice) {
  for (let attempt = 1; attempt <= 8; attempt++) {
    const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: { text }, voice: { languageCode: 'tr-TR', name: voice }, audioConfig: { audioEncoding: 'MP3' } }),
    })
    const data = await res.json()
    if (data.audioContent) return Buffer.from(data.audioContent, 'base64')
    if (attempt === 8) throw new Error(`${text}: ${data.error?.message}`)
    // Минуттық лимитке жетсе — бір минут күтеміз
    const quota = data.error?.status === 'RESOURCE_EXHAUSTED'
    await new Promise((r) => setTimeout(r, quota ? 61000 : 1000 * 2 ** attempt))
  }
}

let made = 0
let chars = 0
for (const [id, voice] of Object.entries(VOICES)) {
  const dir = `public/audio/${id}`
  mkdirSync(dir, { recursive: true })
  const todo = unique.filter(([k]) => !existsSync(`${dir}/${k}.mp3`))
  // 4 сұрау қатар
  for (let i = 0; i < todo.length; i += 4) {
    await Promise.all(
      todo.slice(i, i + 4).map(async ([k, text]) => {
        writeFileSync(`${dir}/${k}.mp3`, await synth(text, voice))
        made++
        chars += text.length
      }),
    )
    process.stdout.write(`\r${id}: ${Math.min(i + 4, todo.length)}/${todo.length}`)
  }
  process.stdout.write('\n')
}

writeFileSync('src/data/audio-manifest.json', JSON.stringify({ voices: VOICES, keys: unique.map(([k]) => k).sort() }) + '\n')
console.log(`Дайын: ${made} жаңа файл, ${chars} таңба. Барлығы: ${unique.length} фраза.`)
