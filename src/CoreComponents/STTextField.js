import React from 'react';
import { useController } from 'react-hook-form';
import { TextField } from '@mui/material';

const STTextField = ({ name, control, label, rules = {}, ...props }) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue: '',
  });

  return (
    <TextField
      {...field}
      label={label}
      type="text"
      size="small"
      variant="outlined"
      fullWidth
      error={!!error}
      helperText={error ? error.message : ''}
      {...props}
    />
  );
};

export default STTextField;
