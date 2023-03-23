import React from 'react'
import './App.css'
import Editor from "react-simple-code-editor";
import {Grammar, highlight, Token, tokenize} from "prismjs";
import {bytecodeGrammar, excludeTokens} from "./lang";
import "prism-themes/themes/prism-darcula.css";
import {invoke} from "@tauri-apps/api/tauri";
import {Button, Grid, Stack} from "@mui/material";

const safeTokenize = (code: string, grammar: Grammar): Token[] => {
    const tokens = tokenize(code, grammar)
        .map(v => {
            if (typeof v === "string") {
                return new Token("unexpected", v)
            }
            return v;
        })
        .filter(v => !excludeTokens.includes(v.type));
    console.debug(tokens);
    return tokens
}

const runCode = async (code: string) => {
  await invoke('set_code', { tokens: safeTokenize(code, bytecodeGrammar)});
}

function App() {
  const [code, setCode] = React.useState("");
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
        <Stack>
          <div className="address-book">

          </div>
        </Stack>
        <Stack>
          <Editor
            id="editor"
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => highlight(code, bytecodeGrammar, 'bytecode')}
            padding={10}
          />
          <Button variant="contained"> Save & Validate </Button>
        </Stack>
      </Stack>
      <div className="console">

      </div>
    </Stack>
  )
}

export default App
