import { atom } from 'jotai'

export const addressesAtom = atom<string[]>([
  "0x000000000000000000000000000000000cafe111",
  "0x000000000000000000000000000000000cafe222"
])
export const activeAddressAtom = atom<string | null>(null)
export const addressCodeMapAtom = atom<Map<string, string>>(new Map())

interface Log {
    level: 'debug' | 'info' | 'warn' | 'error'
    message: string
}

export const logsAtom = atom<Array<Log>>([])
