import React, { useState, ChangeEvent } from 'react'
import { Button, Grid, MenuItem, TextField } from '@mui/material'
import { useAtom } from 'jotai'
import { accountsAtom, logsAtom } from '../atoms'
import { invoke } from '@tauri-apps/api'
import { safeTokenize } from '../util'
import { bytecodeGrammar } from '../lang'
import web3 from 'web3'
import { Token } from 'prismjs'

type KeyValuePair = {
    key: string;
    value: string;
  };

const Panel = () => {
    const [, setLogs] = useAtom(logsAtom)
    const [accounts] = useAtom(accountsAtom)
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
            const formattedAccounts = accounts.map(({ address, code, nonce, balance, storage }) => {
                return {
                    address: address,
                    code: code ? safeTokenize(code, bytecodeGrammar) : [],
                    nonce,
                    balance: balance ? web3.utils.toWei(balance!) : '',
                    storage: storage.map((item:KeyValuePair) => [item.key, item.value]),
                }
            })

            console.log({
                accounts: formattedAccounts,
                from: txFrom,
                to: txTo,
                gas: gas,
                value: value,
                calldata: calldata,
            })

            try {
                const traces = await invoke('execute', {
                    args: {
                        accounts: formattedAccounts,
                        from: txFrom,
                        to: txTo,
                        gas: gas,
                        value: value,
                        calldata: calldata,
                    },
                })
                setLogs([
                    {
                        level: 'info',
                        message: JSON.stringify(traces, null, 2),
                        id: new Date().getTime(),
                    },
                ])
            } catch (e) {
                console.log('error', e)
                setLogs((old) => [...old, { level: 'error', message: e as string, id: new Date().getTime() }])
            }
        }
        inner()
    }

    return (
        <Grid container spacing={2} style={{ maxWidth: '1000px' }}>
            <Grid item xs={6}>
                <TextField
                    select
                    label="Tx From"
                    value={txFrom}
                    onChange={(e) => setTxFrom(e.target.value)}
                    fullWidth
                    InputProps={{ sx: { fontFamily: '"Fira code", "Fira Mono", monospace' } }}>
                    {accounts.map((account, index) => (
                        <MenuItem key={index} value={account.address}>
                            {account.address}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    select
                    label="Tx To"
                    value={txTo}
                    onChange={(e) => setTxTo(e.target.value)}
                    fullWidth
                    InputProps={{ sx: { fontFamily: '"Fira code", "Fira Mono", monospace' } }}>
                    {accounts.map((account, index) => (
                        <MenuItem key={index} value={account.address}>
                            {account.address}
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
