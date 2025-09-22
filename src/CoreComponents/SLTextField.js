import React from 'react';
import { useController } from 'react-hook-form';
import { TextField } from '@mui/material';

const SLTextField = ({ name, control, label, disable, rules = {}, multiline, rows, type, value: standaloneValue, onChange: standaloneOnChange, error: standaloneError, helperText: standaloneHelperText, blurEvent, ...props }) => {
  const usingRHF = !!(control && name);

  let field = undefined;
  let error = undefined;

  if (usingRHF) {
    const rhf = useController({ name, control, rules, defaultValue: '' });
    field = rhf.field;
    error = rhf.fieldState.error;
  }

  return (
    <TextField
      {...(usingRHF ? field : { value: standaloneValue ?? '', onChange: standaloneOnChange })}
      disabled={disable ? disable : false}
      label={label}
      type={type ? type : 'text'}
      size="small"
      variant="outlined"
      fullWidth
      error={usingRHF ? !!error : !!standaloneError}
      multiline={multiline ? multiline : false}
      rows={rows ? rows : 1}
      helperText={usingRHF ? (error ? error.message : '') : (standaloneHelperText || '')}
      {...props}
      onBlur={(item) => {
        if (blurEvent) {
          blurEvent(item.target.value);
        }
      }}
    />
  );
};

export default SLTextField;
