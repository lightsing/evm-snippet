import React, { useState } from 'react'
import { Button, Grid, MenuItem, TextField } from '@mui/material'
import { useAtom } from 'jotai'
import { addressCodeMapAtom, addressesAtom, logsAtom } from '../atoms'
import { invoke } from '@tauri-apps/api'
import { safeTokenize } from '../util'
import { bytecodeGrammar } from '../lang'
import { Token } from 'prismjs'

const Panel = () => {
    const [, setLogs] = useAtom(logsAtom)
    const [addresses] = useAtom(addressesAtom)
    const [addressCodeMap] = useAtom(addressCodeMapAtom)
    const [txFrom, setTxFrom] = useState('')
    const [txTo, setTxTo] = useState('')
    const [gas, setGas] = useState('')
    const [value, setValue] = useState('')
    const [calldata, setCalldata] = useState('')

    const resetAll = () => {
        setTxFrom('')
        setTxTo('')
        setGas('')
        setValue('')
        setCalldata('')
    }

    const execute = () => {
        const inner = async () => {

            const accounts = addresses.map((address) => {
                if (addressCodeMap.has(address)) {
                    return {
                        address: address,
                        code: safeTokenize(addressCodeMap.get(address)!, bytecodeGrammar)
                    }
                } else {
                    return {
                        address: address,
                        code: []
                    }
                }
            });

            console.log(accounts);

            try {
                const traces = await invoke(
                    'execute',
                    {
                        accounts: accounts,
                        from: txFrom,
                        to: txTo,
                        gas: gas,
                        value: value,
                        calldata: calldata,
                    }
                );
                setLogs(
                  [
                    {
                      level: 'info',
                      message: JSON.stringify(traces, null, 2)
                    }
                  ]
                )
            } catch (e) {
                setLogs((old) => [...old, { level: 'error', message: e as string }])
            }
        };
        inner()
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    select
                    label="Tx From"
                    value={txFrom}
                    onChange={(e) => setTxFrom(e.target.value)}
                    fullWidth
                    InputProps={{ sx: { fontFamily: '"Fira code", "Fira Mono", monospace' } }}>
                    {addresses.map((address, index) => (
                        <MenuItem key={index} value={address}>
                            {address}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    select
                    label="Tx To"
                    value={txTo}
                    onChange={(e) => setTxTo(e.target.value)}
                    fullWidth
                    InputProps={{ sx: { fontFamily: '"Fira code", "Fira Mono", monospace' } }}>
                    {addresses.map((address, index) => (
                        <MenuItem key={index} value={address}>
                            {address}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Gas"
                    value={gas}
                    onChange={(e) => setGas(e.target.value)}
                    fullWidth
                    InputProps={{ sx: { fontFamily: '"Fira code", "Fira Mono", monospace' } }}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    fullWidth
                    InputProps={{ sx: { fontFamily: '"Fira code", "Fira Mono", monospace' } }}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Call Data"
                    value={calldata}
                    onChange={(e) => setCalldata(e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                    InputProps={{ sx: { fontFamily: '"Fira code", "Fira Mono", monospace' } }}
                />
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" onClick={resetAll}>
                    Reset All
                </Button>
                <Button variant="contained" onClick={execute} style={{ marginLeft: '10px' }}>
                    Execute
                </Button>
            </Grid>
        </Grid>
    )
}

export default Panel
