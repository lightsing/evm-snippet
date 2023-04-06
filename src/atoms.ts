import { atom } from 'jotai'
import { loadState } from './util'

const initialAccounts = [
  {
    address: '0x000000000000000000000000000000000cafe111',
    code: '',
    storage: [{ key: '', value: '' }]
  },
  {
    address: '0x000000000000000000000000000000000cafe222',
    code: '',
    storage: [{ key: '', value: '' }]
  }
]

export interface  Account {
  address: string,
  nonce?: string,
  balance?: string,
  code: string,
  storage: any,
}

console.log(loadState('ACCOUNT_ATOM') || initialAccounts)

export const accountsAtom = atom<Account[]>(loadState('ACCOUNT_ATOM') as Account[] || initialAccounts)
export interface Log {
    level: 'success' | 'info' | 'warning' | 'error'
    message: string
    id: number
}

export const logsAtom = atom<Array<Log>>([])
