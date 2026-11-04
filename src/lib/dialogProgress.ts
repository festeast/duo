// Мысықпен ойналған диалогтың прогресі (осы құрылғыда): шығып кетсең, кейін жалғастыруға болады.

export type SoloProgress = { role: 'A' | 'B'; step: number; myTries: number[]; updated: number }

const key = (dialogId: string) => `duo-solo-${dialogId}`

export function getSolo(dialogId: string): SoloProgress | null {
  try {
    return JSON.parse(localStorage.getItem(key(dialogId)) ?? 'null') as SoloProgress | null
  } catch {
    return null
  }
}

export function setSolo(dialogId: string, p: SoloProgress) {
  try {
    localStorage.setItem(key(dialogId), JSON.stringify(p))
  } catch {
    /* бос */
  }
}

export function clearSolo(dialogId: string) {
  try {
    localStorage.removeItem(key(dialogId))
  } catch {
    /* бос */
  }
}
