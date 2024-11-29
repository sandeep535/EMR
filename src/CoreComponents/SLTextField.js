import React from 'react';
import { useController } from 'react-hook-form';
import { TextField } from '@mui/material';

const SLTextField = ({ name, control, label,disable, rules = {},multiline,rows, type,...props }) => {
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
      disabled  = {disable ? disable: false}
      label={label}
      type={(type)?type:"text"}
      size="small"
      variant="outlined"
      fullWidth
      error={!!error}
      multiline = {multiline ? multiline : false}
      rows={rows ?rows :1} // Number of visible rows
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
