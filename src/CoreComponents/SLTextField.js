import React from 'react';
import { useController } from 'react-hook-form';
import { TextField } from '@mui/material';

const SLTextField = ({ name, control, label, rules = {}, type,...props }) => {
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
      type={(type)?type:"text"}
      size="small"
      variant="outlined"
      fullWidth
      error={!!error}
      helperText={error ? error.message : ''}
      {...props}
      onBlur={(item,value) => {
       if(props.blurEvent){
         props.blurEvent(item.target.value)
       }
    }}
    />
  );
};

export default SLTextField;
