import { Button, List, Stack } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import React from 'react'
import { AddressItem } from './address'
import { AddressDialog } from './addressDialog'
import { useAtom } from 'jotai'
import { addressesAtom } from '../atoms'

export const Addresses = () => {
    const [addresses, setAddresses] = useAtom(addressesAtom)
    const [dialogOpen, setDialogOpen] = React.useState(false)

    return (
        <Stack>
            <List>
                {addresses.map((address, index) => (
                    <AddressItem
                        index={index}
                        address={address}
                        onEdit={(newVal) => {
                            setAddresses([...addresses.slice(0, index), newVal, ...addresses.slice(index + 1)])
                        }}
                        onDelete={() => {
                            setAddresses(addresses.slice(0, index).concat(addresses.slice(index + 1)))
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
                onSave={(address) => {
                    setAddresses([...addresses, address])
                    setDialogOpen(false)
                }}
                onClose={() => setDialogOpen(false)}
                clearOnSave
            />
        </Stack>
    )
}
