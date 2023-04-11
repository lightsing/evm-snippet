import { Button, List, Stack } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import React from 'react'
import { AddressItem } from './address'
import { AddressDialog } from './addressDialog'
import { useAtom } from 'jotai'
import { accountsAtom } from '../atoms'
import { saveState } from '../util'

const ACCOUNT_ATOM = 'ACCOUNT_ATOM'

export const Addresses = () => {
    const [accounts, setAccounts] = useAtom(accountsAtom)
    const [dialogOpen, setDialogOpen] = React.useState(false)

    return (
        <Stack>
            <List>
                {accounts.map((account, index) => (
                    <AddressItem
                        index={index}
                        key={index}
                        address={account.address}
                        onEdit={(newVal) => {
                            const data = [...accounts.slice(0, index), newVal, ...accounts.slice(index + 1)]
                            setAccounts(data)
                            saveState(ACCOUNT_ATOM,data)
                        }}
                        onDelete={() => {
                            const data = accounts.slice(0, index).concat(accounts.slice(index + 1))
                            setAccounts(data)
                            saveState(ACCOUNT_ATOM,data)

                        }}
                    />
                ))}
            </List>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
                Add New Address
            </Button>
            <AddressDialog
                open={dialogOpen}
                initialValue=""
                onSave={(account) => {
                    const data = [...accounts, account]
                    setAccounts(data)
                    saveState(ACCOUNT_ATOM,data)
                    setDialogOpen(false)
                }}
                onClose={() => setDialogOpen(false)}
                clearOnSave
            />
        </Stack>
    )
}
