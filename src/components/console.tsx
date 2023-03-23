import React from 'react'
import { Typography, Box } from '@mui/material'

interface Log {
    level: 'debug' | 'info' | 'warn' | 'error'
    message: string
}

interface ConsoleProps {
    logs: Array<Log>
}

const LevelColor = {
    debug: '#bbbbbb',
    info: '#bbbbbb',
    warn: '#a68a0d',
    error: '#f0524f',
}

const Console = ({ logs }: ConsoleProps) => {
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
