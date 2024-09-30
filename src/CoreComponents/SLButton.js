
import React from 'react';
import { Button } from '@mui/material';

const SLButton = ({ variant = 'contained', color = 'primary', onClick, children }) => {
  return (
    <Button variant={variant} color={color} onClick={onClick}>
      {children}
    </Button>
  );
};

export default SLButton;
