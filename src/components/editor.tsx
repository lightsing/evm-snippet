import Editor from 'react-simple-code-editor'
import { highlight } from 'prismjs'
import { bytecodeGrammar } from '../lang'
import { Button, Stack } from '@mui/material'
import React from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { useAtom } from 'jotai'
import { logsAtom } from '../atoms'
import { safeTokenize } from '../util'

interface AddressItemProps {
    address?: string
    onSave: (_: string) => void
    initialValue: string
}

export const CodeEditor = ({ onSave, initialValue }: AddressItemProps) => {
    const [, setLogs] = useAtom(logsAtom)
    const [code, setCode] = React.useState(initialValue)

    const runCode = async (code: string) => {
        try {
            await invoke('validate_code', { tokens: safeTokenize(code, bytecodeGrammar) })
            onSave(code)
            setLogs((old) => [...old, { level: 'info', message: 'Success', id: new Date().getTime() }])
        } catch (e) {
            setLogs((old) => [...old, { level: 'error', message: e as string, id: new Date().getTime() }])
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
                style={{
                    color: '#bababa',
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                }}
            />
            <Button variant="contained" onClick={() => runCode(code)}>
                Validate
            </Button>
        </Stack>
    )
}
