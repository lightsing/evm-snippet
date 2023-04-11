import { ListItem, ListItemButton, ListItemText } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import React from 'react'
import { AddressDialog } from './addressDialog'
import {  Account } from '../atoms'

interface AddressItemProps {
    index: number
    address: string
    onEdit: (_: Account) => void
    onDelete: () => void
}

export const AddressItem = ({ index, address, onDelete, onEdit }: AddressItemProps) => {
    const [dialogOpen, setDialogOpen] = React.useState(false)

    return (
        <ListItem key={index}>
            <ListItemText
                primary={address}
                primaryTypographyProps={{
                    sx: {
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        textAlign: 'left',
                    },
                }}
            />
            <ListItemButton>
                <EditIcon
                    onClick={() => {
                        setDialogOpen(true)
                    }}
                />
            </ListItemButton>
            <ListItemButton>
                <DeleteIcon onClick={onDelete} />
            </ListItemButton>
            <AddressDialog
                open={dialogOpen}
                initialValue={address}
                onSave={onEdit}
                onClose={() => setDialogOpen(false)}
            />
        </ListItem>
    )
}
