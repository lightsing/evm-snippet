import { Button, Dialog, ListItem, ListItemButton, ListItemText, TextField } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import FileOpenIcon from '@mui/icons-material/FileOpen'
import DeleteIcon from '@mui/icons-material/Delete'
import React from 'react'
import { AddressDialog } from './addressDialog'

interface AddressItemProps {
    index: number
    address: string

    onEdit: (_: string) => void
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
                <EditIcon onClick={() => setDialogOpen(true)} />
            </ListItemButton>
            <ListItemButton>
                <FileOpenIcon />
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
