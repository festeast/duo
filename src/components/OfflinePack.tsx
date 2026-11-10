import { useEffect, useRef, useState } from 'react'
import manifest from '../data/audio-manifest.json'
import { t } from '../i18n/kk'
import { getVoiceUri } from '../lib/speech'
import { sfx } from '../lib/sound'
import { toast } from '../lib/store'
import { Download, Trash2, WifiOff, X } from './Icon'

// Service worker аудионы осы кэштен береді (vite.config.ts → runtimeCaching)
const CACHE = 'duo-audio'
const KEYS: string[] = manifest.keys
const MB_PER_VOICE = 65
type Dir = 'female' | 'male'

async function countCached(): Promise<Record<Dir, number>> {
  const c = await caches.open(CACHE)
  const reqs = await c.keys()
  const n = { female: 0, male: 0 }
  for (const r of reqs) {
    const p = new URL(r.url).pathname
    if (p.startsWith('/audio/female/')) n.female++
    else if (p.startsWith('/audio/male/')) n.male++
  }
  return n
}

/** Профильдегі «Интернетсіз оқу»: аудионы алдын ала жүктеу */
export function OfflinePack() {
  const supported = typeof caches !== 'undefined' && 'serviceWorker' in navigator
  const [have, setHave] = useState<Record<Dir, number> | null>(null)
  const [prog, setProg] = useState<{ done: number; all: number } | null>(null)
  const stop = useRef(false)

  useEffect(() => {
    if (supported) void countCached().then(setHave)
  }, [supported])

  if (!supported)
    return (
      <div className="card col">
        <span className="muted small ih">
          <WifiOff size={16} /> {t.packTitle}
        </span>
        <span className="small muted">{t.packNoSupport}</span>
      </div>
    )

  const chosen: Dir = getVoiceUri() === 'g:male' ? 'male' : 'female'

  const download = async (dirs: Dir[]) => {
    sfx.click()
    stop.current = false
    // Жүйе кэшті өздігінен өшірмеуін сұраймыз
    try {
      await navigator.storage?.persist?.()
    } catch {
      /* бос */
    }
    const c = await caches.open(CACHE)
    const existing = new Set((await c.keys()).map((r) => new URL(r.url).pathname))
    const todo = dirs.flatMap((d) => KEYS.map((k) => `/audio/${d}/${k}.mp3`)).filter((u) => !existing.has(u))
    const all = todo.length
    let done = 0
    setProg({ done, all })
    let failed = 0
    let i = 0
    const worker = async () => {
      while (i < todo.length && !stop.current) {
        const url = todo[i++]
        try {
          const res = await fetch(url, { cache: 'no-store' })
          if (res.ok) await c.put(url, res)
          else failed++
        } catch {
          failed++
          if (!navigator.onLine) stop.current = true
        }
        done++
        if (done % 20 === 0 || done === all) setProg({ done, all })
      }
    }
    await Promise.all(Array.from({ length: 8 }, worker))
    setProg(null)
    setHave(await countCached())
    if (!stop.current && failed === 0) {
      sfx.win()
      toast(t.packDone)
    } else if (failed) toast(t.errNetwork)
  }

  const remove = async () => {
    if (!confirm(t.packDeleteConfirm)) return
    await caches.delete(CACHE)
    setHave({ female: 0, male: 0 })
  }

  const total = KEYS.length
  const full = (d: Dir) => !!have && have[d] >= total

  return (
    <div className="card col">
      <span className="muted small ih">
        <WifiOff size={16} /> {t.packTitle}
      </span>
      <span className="small">{t.packHint}</span>
      {have && <span className="tiny muted">{t.packStatus(have.female, have.male, total)}</span>}
      {prog ? (
        <>
          <div className="bar">
            <i style={{ width: `${(prog.done / Math.max(1, prog.all)) * 100}%` }} />
          </div>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="small muted">{t.packProgress(prog.done, prog.all)}</span>
            <button className="btn ghost small" onClick={() => (stop.current = true)}>
              <X size={16} /> {t.packStop}
            </button>
          </div>
        </>
      ) : (
        <>
          {!full(chosen) && (
            <button className="btn blue wide" onClick={() => download([chosen])}>
              <Download size={18} /> {t.packOne(MB_PER_VOICE)}
            </button>
          )}
          {!(full('female') && full('male')) && (
            <button className="btn ghost wide" onClick={() => download(['female', 'male'])}>
              <Download size={18} /> {t.packBoth(MB_PER_VOICE * 2)}
            </button>
          )}
          {full(chosen) && <span className="ok-text small">{t.packDone}</span>}
          {have && have.female + have.male > 0 && (
            <button className="link-btn danger" onClick={remove}>
              <Trash2 size={16} /> {t.packDelete}
            </button>
          )}
        </>
      )}
    </div>
  )
}
