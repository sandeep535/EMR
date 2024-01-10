import * as React from 'react';
import Stack from '@mui/material/Stack';

export default function ErrorMessage(props) {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <p className={props.type}>{props.message}</p>
    </Stack>
  );
}