import React from 'react'
import './App.css'
import 'prism-themes/themes/prism-darcula.css'
import { Stack } from '@mui/material'
import Panel from './components/panel'
import Console from './components/console'
import { Addresses } from './components/addresses'
import { CodeEditor } from './components/editor'

const Store = new Map()

function App() {
    const [logs, setLogs] = React.useState([])
    const [addresses, setAddresses] = React.useState<readonly string[]>(['0x000000000000000000000000000000000cafe001'])

    return (
        <Stack direction="column" justifyContent="space-between" alignItems="center" spacing={0}>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={0}>
                <Stack direction="column" justifyContent="space-between" alignItems="center" spacing={0}>
                    <Addresses />
                    <Panel />
                </Stack>
                <CodeEditor />
            </Stack>
            <Console logs={logs} />
        </Stack>
    )
}

export default App
