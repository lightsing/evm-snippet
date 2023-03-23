import { Button, Dialog, DialogTitle, IconButton, TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import React from 'react'

interface AddressDialogProps {
    open: boolean
    initialValue: string
    onSave: (_: string) => void
    clearOnSave?: boolean
    onClose: () => void
}

export interface DialogTitleProps {
    onClose: () => void
}

const AddressDialogTitle = (props: DialogTitleProps) => {
    const { onClose } = props

    return (
        <DialogTitle sx={{ m: 0, p: 2 }}>
            Address
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                }}>
                <CloseIcon />
            </IconButton>
        </DialogTitle>
    )
}

export const AddressDialog = ({ open, initialValue, onSave, clearOnSave, onClose }: AddressDialogProps) => {
    const [dialogValue, setDialogValue] = React.useState(initialValue)

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="sm">
            <AddressDialogTitle onClose={onClose} />
            <TextField
                autoFocus
                margin="normal"
                label="Address"
                variant="outlined"
                value={dialogValue}
                onChange={(e) => setDialogValue(e.target.value)}
                inputProps={{ sx: { fontFamily: '"Fira code", "Fira Mono", monospace' } }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    onSave(dialogValue)
                    onClose()
                    if (clearOnSave) {
                        setDialogValue('')
                    }
                }}>
                Save
            </Button>
        </Dialog>
    )
}
