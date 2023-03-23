import React from 'react'
import { Typography, Box } from '@mui/material'
import { useAtom } from 'jotai'
import { logsAtom } from '../atoms'

const LevelColor = {
    debug: '#bbbbbb',
    info: '#bbbbbb',
    warn: '#a68a0d',
    error: '#f0524f',
}

const Console = () => {
    const [logs] = useAtom(logsAtom)
    return (
        <Box
            sx={{
                backgroundColor: '#1e1f22',
                padding: '10px',
                fontFamily: '"Fira code", "Fira Mono", monospace',
                overflowY: 'scroll',
                height: '200px',
                width: '100%',
            }}>
            {logs.map((log, index) => (
                <Typography key={index} sx={{ color: LevelColor[log.level] }}>
                    {log.message}
                </Typography>
            ))}
        </Box>
    )
}

export default Console
