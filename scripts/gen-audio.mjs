// Барлық түрікше фразаларды Google Text-to-Speech арқылы бір рет дыбыстап,
// public/audio/<дауыс>/<хэш>.mp3 етіп сақтайды.
// Іске қосу: GOOGLE_TTS_KEY=AIza... node scripts/gen-audio.mjs
// Бар файлдар қайта жасалмайды — жаңа сабақ қосқанда қайта іске қоса бер.

import { createServer } from 'vite'
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs'
import { execFileSync } from 'child_process'

const KEY = process.env.GOOGLE_TTS_KEY
if (!KEY) throw new Error('GOOGLE_TTS_KEY керек')

export const VOICES = { female: 'tr-TR-Chirp3-HD-Aoede', male: 'tr-TR-Chirp3-HD-Charon' }
// Chirp3 сәтсіз болса — сенімді WaveNet дауысы
const FALLBACK = { female: 'tr-TR-Wavenet-C', male: 'tr-TR-Wavenet-E' }
const VERIFY = process.argv.includes('--verify')

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const load = (p) => server.ssrLoadModule(p)
const { WORD_LIST, SENTENCE_BANK } = await load('/src/data/words.ts')
const { STORIES } = await load('/src/data/stories.ts')
const { TIPS } = await load('/src/data/grammar.ts')
const { DIALOGS, EPISODES, personalize } = await load('/src/data/dialogs.ts')
const { audioKey } = await load('/src/lib/audioKey.ts')
const { PHRASES } = await load('/src/data/phrases.ts')
await server.close()

const phrases = [
  ...WORD_LIST.map((w) => w.tr),
  ...SENTENCE_BANK.map((s) => s.tr), // курс, мысалдар, байланыстырушы сөйлемдер, диалогтар, әңгімелер
  ...STORIES.flatMap((s) => s.lines.map((l) => l[0])),
  ...TIPS.flatMap((t) => t.examples.map((e) => e[0])),
  ...PHRASES.flatMap((p) => [p.tr, ...p.scene.lines.map((l) => l[1])]), // телехикая сахналары
  'Merhaba! Birlikte Türkçe öğreniyoruz.',
]

// Сөйлемдегі әр сөз түрі (плиткаларды басқанда, әңгімедегі сөзді басқанда айтылады)
const norm = (t) => t.toLocaleLowerCase('tr').replace(/[.,!?;:“”"«»—…()]/g, '').trim()
const tokens = new Set()
for (const t of [...SENTENCE_BANK.map((x) => x.tr), ...STORIES.flatMap((x) => x.lines.map((l) => l[0]))])
  for (const w of t.split(/\s+/)) if (norm(w)) tokens.add(norm(w))
phrases.push(...tokens)

// Есімдері бар диалог репликалары (Әділхан мен Шырайлым үшін, екі рөлде де)
for (const names of [{ A: 'Әділхан', B: 'Шырайлым' }, { A: 'Шырайлым', B: 'Әділхан' }])
  for (const d of [...DIALOGS, ...EPISODES]) for (const l of personalize(d, names).lines) phrases.push(l.tr)
const unique = [...new Map(phrases.map((p) => [audioKey(p), p])).entries()]

// Chirp3-HD бір сөзді (ay, ev, o…) жеке жібергенде кейде «ақ шу» қайтарады.
// Сондықтан қысқа мәтінді бас әріппен және нүктемен жібереміз: «Ay.»
const ttsText = (t) => (/[.!?…]$/.test(t) ? t : t[0].toLocaleUpperCase('tr') + t.slice(1) + '.')

async function synth(text, voice) {
  for (let attempt = 1; attempt <= 8; attempt++) {
    const res = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': KEY },
      body: JSON.stringify({ input: { text: ttsText(text) }, voice: { languageCode: 'tr-TR', name: voice }, audioConfig: { audioEncoding: 'MP3' } }),
    })
    const data = await res.json()
    if (data.audioContent) return Buffer.from(data.audioContent, 'base64')
    if (attempt === 8) throw new Error(`${text}: ${data.error?.message}`)
    // Минуттық лимитке жетсе — бір минут күтеміз
    const quota = data.error?.status === 'RESOURCE_EXHAUSTED'
    await new Promise((r) => setTimeout(r, quota ? 61000 : 1000 * 2 ** attempt))
  }
}

/** Аудио ұзақтығы (секунд) — ffprobe арқылы */
function duration(file) {
  try {
    return Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString().trim())
  } catch {
    return 0
  }
}

/** «Ақ шу» белгісі: қысқа мәтінге тым қысқа (≤0.4 с) дыбыс */
const suspicious = (file) => duration(file) < 0.45

/** Файлды жасап, тексереді; шу болса — қайталайды, ақырында WaveNet дауысына ауысады */
async function makeGood(file, text, id) {
  for (let attempt = 0; attempt < 5; attempt++) {
    writeFileSync(file, await synth(text, VOICES[id]))
    if (!suspicious(file)) return
  }
  writeFileSync(file, await synth(text, FALLBACK[id]))
}

let made = 0
let chars = 0
// Манифест: әйел дауысының файлы бар фразалар (жұмыс барысында жаңарып отырады)
const writeManifest = () => {
  const keys = unique.map(([k]) => k).filter((k) => existsSync(`public/audio/female/${k}.mp3`)).sort()
  writeFileSync('src/data/audio-manifest.json', JSON.stringify({ voices: VOICES, keys }) + '\n')
}
for (const [id, voice] of Object.entries(VOICES)) {
  const dir = `public/audio/${id}`
  mkdirSync(dir, { recursive: true })
  // --verify: бар файлдарды тексеріп, шу болғандарын қайта жасаймыз
  if (VERIFY) {
    const bad = unique.filter(([k]) => existsSync(`${dir}/${k}.mp3`) && suspicious(`${dir}/${k}.mp3`))
    console.log(`${id}: тексеруде ${bad.length} күдікті файл`)
    for (const [k] of bad) unlinkSync(`${dir}/${k}.mp3`)
  }
  const todo = unique.filter(([k]) => !existsSync(`${dir}/${k}.mp3`))
  // 4 сұрау қатар
  for (let i = 0; i < todo.length; i += 4) {
    await Promise.all(
      todo.slice(i, i + 4).map(async ([k, text]) => {
        await makeGood(`${dir}/${k}.mp3`, text, id)
        made++
        chars += text.length
      }),
    )
    process.stdout.write(`\r${id}: ${Math.min(i + 4, todo.length)}/${todo.length}`)
    if (i % 100 === 0) writeManifest()
  }
  process.stdout.write('\n')
}

writeManifest()
console.log(`Дайын: ${made} жаңа файл, ${chars} таңба. Барлығы: ${unique.length} фраза.`)
