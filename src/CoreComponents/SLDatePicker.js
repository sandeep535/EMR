import React from 'react';
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, FormControl, FormHelperText } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const SLDatePicker = ({ name, control, label, rules = {}, error: externalError, value: standaloneValue, onChange: standaloneOnChange, helperText: standaloneHelperText, ...props }) => {
  const renderPicker = (value, onChange, error) => (
    <>
      <DatePicker
        label={label}
        value={value}
        onChange={(date) => {
          if (onChange) onChange(date);
          if (props.onChange) props.onChange(date);
        }}
        renderInput={(params) => (
          <TextField {...params} fullWidth variant="outlined" />
        )}
        {...props}
        format="DD-MM-YYYY"
        fullWidth
        slotProps={{ textField: { size: 'small' } }}
      />
      {(error || externalError) && <FormHelperText>{(error || externalError)?.message || standaloneHelperText}</FormHelperText>}
    </>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} >
      <FormControl fullWidth error={!!externalError}>
        {control && name ? (
          <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { onChange, value }, fieldState: { error } }) => renderPicker(value, onChange, error)}
          />
        ) : (
          renderPicker(standaloneValue, standaloneOnChange, undefined)
        )}
      </FormControl>
    </LocalizationProvider>
  );
};

export default SLDatePicker;
