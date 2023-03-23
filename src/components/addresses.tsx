import { Button, List, Stack } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import React from 'react'
import { AddressItem } from './address'
import { AddressDialog } from './addressDialog'
import { useAtom } from 'jotai'
import { activeAddressAtom, addressCodeMapAtom, addressesAtom } from '../atoms'

export const Addresses = () => {
    const [addresses, setAddresses] = useAtom(addressesAtom)
    const [activeAddress, setActiveAddress] = useAtom(activeAddressAtom)
    const [addressCodeMap, setAddressCodeMapAtom] = useAtom(addressCodeMapAtom)
    const [dialogOpen, setDialogOpen] = React.useState(false)

    return (
        <Stack>
            <List>
                {addresses.map((address, index) => (
                    <AddressItem
                        index={index}
                        address={address}
                        onEdit={(newVal) => {
                            const oldAddress = addresses[index]
                            if (activeAddress === oldAddress) {
                                setActiveAddress(newVal)
                            }
                            if (addressCodeMap.has(oldAddress)) {
                                const o = new Map(addressCodeMap)
                                o.set(newVal, o.get(oldAddress)!)
                                o.delete(oldAddress)
                                setAddressCodeMapAtom(o)
                            }
                            setAddresses([...addresses.slice(0, index), newVal, ...addresses.slice(index + 1)])
                        }}
                        onDelete={() => {
                            let deleted = addresses[index]
                            if (activeAddress === deleted) {
                                setActiveAddress(null)
                            }
                            if (addressCodeMap.has(deleted)) {
                                const o = new Map(addressCodeMap)
                                o.delete(deleted)
                                setAddressCodeMapAtom(o)
                            }
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
