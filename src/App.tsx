import React from 'react'
import './App.css'
import Editor from "react-simple-code-editor";
import {Grammar, highlight, Token, tokenize} from "prismjs";
import {bytecodeGrammar} from "./lang";
import "prism-themes/themes/prism-darcula.css";
import {invoke} from "@tauri-apps/api/tauri";

const safeTokenize = (code: string, grammar: Grammar): Token[] => {
  return tokenize(code, grammar).filter(v => typeof v !== "string") as Token[]
}

const runCode = async (code: string) => {
  await invoke('run_code', { tokens: safeTokenize(code, bytecodeGrammar)});
}

function App() {
  const [code, setCode] = React.useState("");
  return (
    <div className="App">
      <Editor
        value={code}
        onValueChange={code => setCode(code)}
        highlight={code => highlight(code, bytecodeGrammar, 'bytecode')}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          minHeight: '300px',
        }}
      />
      <button onClick={() => runCode(code)}>Run</button>
    </div>
  )
}

export default App
