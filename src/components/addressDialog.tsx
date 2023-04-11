import { Button, Dialog, DialogTitle, IconButton, TextField, Grid } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import React, { useState, ChangeEvent, useEffect } from 'react'
import { Box } from '@mui/system'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { CodeEditor } from '../components/editor'
import { Account } from '../atoms'

import { useAtom } from 'jotai'
import { accountsAtom } from '../atoms'

interface AddressDialogProps {
    open: boolean
    initialValue: string
    onSave: (_: Account) => void
    clearOnSave?: boolean
    onClose: () => void
}

interface InputField {
    key: string
    value: string
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
    const [inputFields, setInputFields] = useState<InputField[]>([{ key: '', value: '' }])
    const [balance, setBalance] = useState('')
    const [nonce, setNonce] = useState('0')
    const [code, setCode] = useState('')
    const [accounts] = useAtom(accountsAtom)

    useEffect(() => {
        if (initialValue) {
            const account = accounts.find((account) => account.address === initialValue)
            setInputFields(account?.storage)
            setBalance(account?.balance || '')
            setNonce(account?.nonce || '')
            setCode(account?.code || '')
        }
    }, [initialValue])

    const handleAddFields = () => {
        setInputFields([...inputFields, { key: '', value: '' }])
    }

    const handleRemoveFields = (index: number) => {
        const newInputFields = [...inputFields]
        newInputFields.splice(index, 1)
        setInputFields(newInputFields)
    }

    const handleChange = (index: number, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newInputFields = [...inputFields]
        //@ts-ignore
        newInputFields[index][event.target.name] = event.target.value
        setInputFields(newInputFields)
    }

    const updateCode = (code: string) => {
        setCode(code)
    }

    const handleSave = () => {
        const account: Account = {
            address: dialogValue,
            code,
            storage: inputFields,
            balance,
            nonce,
        }
        onSave(account)
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="md">
            <Box sx={{ p: 2 }} display="flex" flexDirection="column">
                <AddressDialogTitle onClose={onClose} />
                <Grid container spacing={2} style={{ maxWidth: '1000px' }}>
                    <Grid item xs={12}>
                        <TextField
                            autoFocus
                            fullWidth
                            margin="normal"
                            label="Address"
                            variant="outlined"
                            value={dialogValue}
                            onChange={(e) => setDialogValue(e.target.value)}
                            inputProps={{ sx: { fontFamily: '"Fira code", "Fira Mono", monospace' } }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Balance"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            fullWidth
                            InputProps={{ sx: { fontFamily: '"Fira code", "Fira Mono", monospace' } }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Nonce"
                            value={nonce}
                            onChange={(e) => setNonce(e.target.value)}
                            fullWidth
                            InputProps={{ sx: { fontFamily: '"Fira code", "Fira Mono", monospace' } }}
                        />
                    </Grid>

                    {inputFields.map((inputField, index) => (
                        <>
                            <Grid item xs={6}>
                                <TextField
                                    name="key"
                                    label="Storage Key"
                                    fullWidth
                                    value={inputField.key}
                                    onChange={(event) => handleChange(index, event)}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    name="value"
                                    label="Storage Value"
                                    fullWidth
                                    value={inputField.value}
                                    onChange={(event) => handleChange(index, event)}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton onClick={handleAddFields} color="primary">
                                    <AddCircleOutlineIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={1}>
                                {inputFields.length > 1 && (
                                    <IconButton onClick={() => handleRemoveFields(index)} color="secondary">
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                )}
                            </Grid>
                        </>
                    ))}

                    <Grid item xs={12}>
                        <CodeEditor address={initialValue} onSave={updateCode} initialValue={code} />
                    </Grid>
                </Grid>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 4 }}
                    onClick={() => {
                        handleSave()
                        onClose()
                        if (clearOnSave) {
                            setDialogValue('')
                        }
                    }}>
                    Save
                </Button>
            </Box>
        </Dialog>
    )
}
