import React from 'react'
import './App.css'
import "prism-themes/themes/prism-darcula.css";
import {Stack} from "@mui/material";
import Panel from "./components/panel";
import Console from "./components/console";
import {Addresses} from "./components/addresses";
import {CodeEditor} from "./components/editor";

function App() {
  const [logs, setLogs] = React.useState([]);
  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      spacing={0}
    >
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={0}
      >
        <Stack
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
        >
          <Addresses/>
          <Panel/>
        </Stack>
        <CodeEditor/>
      </Stack>
      <Console logs={logs}/>
    </Stack>
  )
}

export default App
