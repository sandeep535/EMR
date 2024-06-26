import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

export default function CustomAlert(props) {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity={props.type}>
        <AlertTitle>Success</AlertTitle>
        This is a success alert — <strong>check it out!</strong>
      </Alert>
    </Stack>
  );
}
      