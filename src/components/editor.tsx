import Editor from 'react-simple-code-editor'
import { highlight } from 'prismjs'
import { bytecodeGrammar } from '../lang'
import { Button, Stack } from '@mui/material'
import React from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { useAtom } from 'jotai'
import { activeAddressAtom, addressCodeMapAtom, logsAtom } from '../atoms'
import { safeTokenize } from '../util'

export const CodeEditor = () => {
    const [, setLogs] = useAtom(logsAtom)
    const [activeAddress] = useAtom(activeAddressAtom)
    const [addressCodeMap, setAddressCodeMapAtom] = useAtom(addressCodeMapAtom)
    const [currentEditingAddress, setCurrentEditingAddress] = React.useState<string | null>(null)
    const [code, setCode] = React.useState('')

    React.useEffect(() => {
        if (activeAddress !== currentEditingAddress) {
            if (activeAddress !== null) {
                setCode(addressCodeMap.get(activeAddress) ?? '')
            } else {
                setCode('')
            }
            setCurrentEditingAddress(activeAddress)
            setLogs([])
        }
    }, [activeAddress, currentEditingAddress])

    const runCode = async (code: string) => {
        try {
            await invoke('validate_code', { tokens: safeTokenize(code, bytecodeGrammar) })
            setAddressCodeMapAtom((old) => old.set(activeAddress!!, code))
            setLogs((old) => [...old, { level: 'info', message: 'Success' }])
        } catch (e) {
            setLogs((old) => [...old, { level: 'error', message: e as string }])
        }
    }

    return (
        <Stack>
            <Editor
                id="editor"
                value={code}
                onValueChange={(code) => setCode(code)}
                highlight={(code) => highlight(code, bytecodeGrammar, 'bytecode')}
                padding={10}
                disabled={currentEditingAddress === null}
                style={{
                    color: '#bababa',
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                }}
            />
            <Button variant="contained" onClick={() => runCode(code)} disabled={currentEditingAddress === null}>
                Save & Validate
            </Button>
        </Stack>
    )
}
