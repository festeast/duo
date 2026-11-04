// Деңгей тесті тапсырылды ма (әр пайдаланушыға бөлек, осы құрылғыда)
import { dayKey, getState } from './store'

export const placedKey = (uid: string) => `duo-placed-${uid}`

export function markPlaced() {
  const uid = getState().session?.user.id
  if (!uid) return
  try {
    localStorage.setItem(placedKey(uid), dayKey())
  } catch {
    /* бос */
  }
}

