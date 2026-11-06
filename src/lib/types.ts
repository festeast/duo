import type { EyeId, FurId } from '../data/cat'

export type CatLook = {
  fur: FurId
  eyes: EyeId
  ear?: string | null // құлаққа
  face?: string | null // көзге
  cheek?: string | null // ұртқа
  char?: string | null
  head?: string | null // ескі заттар (енді салынбайды)
  neck?: string | null
}

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
