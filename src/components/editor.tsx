import Editor from 'react-simple-code-editor'
import { Grammar, highlight, Token, tokenize } from 'prismjs'
import { bytecodeGrammar, excludeTokens } from '../lang'
import { Button, Stack } from '@mui/material'
import React from 'react'
import { invoke } from '@tauri-apps/api/tauri'

export const CodeEditor = () => {
    const [code, setCode] = React.useState('')
    return (
        <Stack>
            <Editor
                id="editor"
                value={code}
                onValueChange={(code) => setCode(code)}
                highlight={(code) => highlight(code, bytecodeGrammar, 'bytecode')}
                padding={10}
            />
            <Button variant="contained" onClick={() => runCode(code)}>
                {' '}
                Save & Validate{' '}
            </Button>
        </Stack>
    )
}

const safeTokenize = (code: string, grammar: Grammar): Token[] => {
    const tokens = tokenize(code, grammar)
        .map((v) => {
            if (typeof v === 'string') {
                return new Token('unexpected', v)
            }
            return v
        })
        .filter((v) => !excludeTokens.includes(v.type))
    console.debug(tokens)
    return tokens
}

const runCode = async (code: string) => {
    await invoke('set_code', { tokens: safeTokenize(code, bytecodeGrammar) })
}
