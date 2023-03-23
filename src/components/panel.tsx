import React, { useState } from 'react';
import { Button, Grid, MenuItem, TextField, Typography } from '@mui/material';

const Panel = () => {
  const [txFrom, setTxFrom] = useState('');
  const [txTo, setTxTo] = useState('');
  const [gas, setGas] = useState('');
  const [value, setValue] = useState('');
  const [callData, setCallData] = useState('');

  const resetAll = () => {
    setTxFrom('');
    setTxTo('');
    setGas('');
    setValue('');
    setCallData('');
  };

  const execute = () => {
    // Add your execution logic here
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          select
          label="Tx From"
          value={txFrom}
          onChange={(e) => setTxFrom(e.target.value)}
          fullWidth
          InputProps={{sx: {fontFamily: '"Fira code", "Fira Mono", monospace'}}}
        >
          {/* Add your options here */}
          <MenuItem value="option1">Option 1</MenuItem>
          <MenuItem value="option2">Option 2</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <TextField
          select
          label="Tx To"
          value={txTo}
          onChange={(e) => setTxTo(e.target.value)}
          fullWidth
          InputProps={{sx: {fontFamily: '"Fira code", "Fira Mono", monospace'}}}
        >
          {/* Add your options here */}
          <MenuItem value="option1">Option 1</MenuItem>
          <MenuItem value="option2">Option 2</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Gas"
          value={gas}
          onChange={(e) => setGas(e.target.value)}
          fullWidth
          InputProps={{sx: {fontFamily: '"Fira code", "Fira Mono", monospace'}}}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          fullWidth
          InputProps={{sx: {fontFamily: '"Fira code", "Fira Mono", monospace'}}}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Call Data"
          value={callData}
          onChange={(e) => setCallData(e.target.value)}
          multiline
          rows={4}
          fullWidth
          InputProps={{sx: {fontFamily: '"Fira code", "Fira Mono", monospace'}}}
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" onClick={resetAll}>
          Reset All
        </Button>
        <Button variant="contained" onClick={execute} style={{ marginLeft: '10px' }}>
          Execute
        </Button>
      </Grid>
    </Grid>
  );
};

export default Panel;
