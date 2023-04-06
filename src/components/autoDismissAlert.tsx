import React, { useState, useEffect } from 'react';
import { Button, Alert, Stack } from '@mui/material';
import { useAtom } from 'jotai'
import { logsAtom } from '../atoms'

export default function VerticalAlerts() {
  const [logs, setLogs] = useAtom(logsAtom)

  const handleClose = (id: number) => {
    setLogs((prevLogs) => prevLogs.filter((log) => log.id !== id));
  };

  useEffect(() => {
    // const timer = setTimeout(() => {
    //   const logLength = logs.length
    //   if(logLength) {
    //     setLogs((prevLogs) => prevLogs.slice(1, logLength));
    //   }
    // }, 5 * 1000); 
    // return () => {
    //   clearTimeout(timer);
    // };
  },[logs])
  

  return (
      <Stack
        spacing={2}
        sx={{
          position: 'fixed',
          bottom: '36px',
          left: '60px',
          zIndex: 99999999999,
          maxWidth: 'calc(100vw - 120px)'
        }}
      >
        {logs.map((logData) => (
          <Alert
            key={logData.id}
            severity={logData.level}
            onClose={() => handleClose(logData.id)}
            sx={{ width: '100%' }}
          >
            {logData.message}
          </Alert>
        ))}
      </Stack>
  );
}
