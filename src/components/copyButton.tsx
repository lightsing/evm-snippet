import React, { useState } from 'react';
import { Button, Snackbar, Alert, Box } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';

interface CopyButtonProps {
  textToCopy: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  return (
    <div>
      <Box
        onClick={handleCopyClick}
        sx={{ position: 'absolute', right: '60px', top: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center'}}
      >
       <FileCopyIcon /> Copy
      </Box>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}      
        >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Text copied!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CopyButton;
