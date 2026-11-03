// Фразаның аудиофайл аты: мәтіннен шығатын қысқа хэш (FNV-1a).
// Бұл функцияны scripts/gen-audio.mjs те қолданады — екеуі бірдей болуы керек.

export function audioKey(text: string) {
  const s = text.normalize('NFC').trim()
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(16).padStart(8, '0')
}
