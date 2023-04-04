import React from 'react'
import './App.css'
import 'prism-themes/themes/prism-darcula.css'
import { Stack } from '@mui/material'
import Panel from './components/panel'
import AutoDismissAlert from './components/autoDismissAlert'
import { Addresses } from './components/addresses'
import { Tabs, Tab, Typography, Box } from '@mui/material'

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

function App() {
    const [value, setValue] = React.useState(0)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }
    return (
        <Stack direction="column" justifyContent="space-between" alignItems="center" spacing={0}>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={0}>
                <Stack direction="column" justifyContent="space-between" alignItems="center" spacing={0}>
                    <Tabs value={value} onChange={handleChange} sx={{my: 6}}>
                        <Tab label="Addresses" />
                        <Tab label="Panel" />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        <Addresses />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Panel />
                    </TabPanel>
                </Stack>
            </Stack>
            <AutoDismissAlert />
        </Stack>
    )
}

export default App
