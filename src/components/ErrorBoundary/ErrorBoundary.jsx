import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorBoundary = ({ error, onRetry }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "background.default",
        gap: 3,
        padding: 3
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main' }} />
      
      <Typography variant="h4" color="error.main" gutterBottom>
        Something went wrong
      </Typography>
      
      <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth={400}>
        {error || "An unexpected error occurred. Please try again."}
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={onRetry || (() => window.location.reload())}
        sx={{ mt: 2 }}
      >
        Retry
      </Button>
    </Box>
  );
};

export default ErrorBoundary; 