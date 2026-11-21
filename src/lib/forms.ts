// Сөздің мәтіндерде кездесетін түрлері (ev → evde, evim, eve...) — нақты сөйлемдерден жиналады.
import { SENTENCE_BANK, analyze } from '../data/words'

export type Form = { form: string; label: string | null; ex: { tr: string; kk: string } }

const cache = new Map<string, Form[]>()
const low = (s: string) => s.toLocaleLowerCase('tr')

// Жиі жалғаулар (зат есім). Тек анық жағдайда ғана белгі қоямыз.
const LABELS: [RegExp, string][] = [
  [/^l[ae]r$/, 'көпше'],
  [/^[dt][ae]$/, '-да/-де (қайда?)'],
  [/^[dt][ae]n$/, '-дан/-ден (қайдан?)'],
  [/^(y|n)?[ae]$/, '-ға/-ге (қайда?)'],
  [/^[ıiuü]?m$/, 'менің'],
  [/^[ıiuü]?m[ıiuü]z$/, 'біздің'],
  [/^[ıiuü]?n[ıiuü]z$/, 'сіздің'],
  [/^(y)?l[ae]$/, '-мен (бірге)'],
  [/^l[ae]r[dt][ae]$/, 'көпше + -да'],
  [/^l[ae]r[ıi]$/, 'олардың / көпше'],
  [/^[dt][ıiuü]$/, 'ол ...-ды (өткен шақ)'],
  [/^[ıiuü]?yorum$/, 'мен ...-п жатырмын'],
  [/^[ıiuü]?yorsun$/, 'сен ...-п жатырсың'],
  [/^[ıiuü]?yoruz$/, 'біз ...-п жатырмыз'],
  [/^[ıiuü]?yorsunuz$/, 'сіз ...-п жатырсыз'],
  [/^[ıiuü]?yorlar$/, 'олар ...-п жатыр'],
  [/^[ıiuü]?yor$/, 'ол ...-п жатыр'],
  [/^[dt][ıiuü]m$/, 'мен ...-дым (өткен шақ)'],
  [/^[dt][ıiuü]k$/, 'біз ...-дық (өткен шақ)'],
  [/^[dt][ıiuü]n$/, 'сен ...-дың (өткен шақ)'],
  [/^m[ae]$/, '-у (етістік зат есім)'],
  [/^m[ıiuü]yor/, 'болымсыз (-майды)'],
]

function labelOf(word: string, form: string) {
  const w = low(word).replace(/m[ae]k$/, '')
  const f = low(form)
  // Соңғы дауыссыз жұмсаруы мүмкін: kitap → kitabı, ağaç → ağacı
  for (const base of [w, w.slice(0, -1)]) {
    if (base.length < 2 || !f.startsWith(base)) continue
    const rest = f.slice(base.length + (base === w ? 0 : 1))
    for (const [re, l] of LABELS) if (re.test(rest)) return l
  }
  return null
}

/** Сөздің түрлері (ең көбі 8), әрқайсысына мысал сөйлем */
export function formsOf(tr: string): Form[] {
  const hit = cache.get(tr)
  if (hit) return hit
  const map = new Map<string, Form>()
  const base = low(tr)
  for (const s of SENTENCE_BANK) {
    if (!s.uses.includes(tr)) continue
    analyze(s.tr, (w, form) => {
      if (w !== tr) return
      const f = low(form)
      if (f === base || map.has(f)) return
      map.set(f, { form: f, label: labelOf(tr, f), ex: { tr: s.tr, kk: s.kk } })
    })
    if (map.size >= 12) break
  }
  // Белгісі барлар бірінші, сосын қысқалары
  const list = [...map.values()].sort((a, b) => Number(!!b.label) - Number(!!a.label) || a.form.length - b.form.length).slice(0, 8)
  cache.set(tr, list)
  return list
}
