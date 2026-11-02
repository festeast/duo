import type { EyeId, FurId } from '../data/cat'

export type CatLook = { fur: FurId; eyes: EyeId; head?: string | null; face?: string | null; neck?: string | null }

export type Profile = {
  id: string
  name: string
  friend_code: string
  cat: CatLook
  xp: number
  coins: number
  owned: string[]
}

export type DialogSession = {
  id: string
  dialog_id: string
  host: string
  guest: string
  host_role: 'A' | 'B'
  status: 'invited' | 'active' | 'done' | 'declined'
  turns: string
  step: number
  log: { step: number; by: string; answer: string; tries: number }[]
  created_at: string
  updated_at: string
}
