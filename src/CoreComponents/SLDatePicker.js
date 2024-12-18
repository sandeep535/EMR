import React from 'react';
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, FormControl, FormHelperText } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const SLDatePicker = ({ name, control, label, rules = {}, error, ...props }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} >
    <FormControl fullWidth error={!!error}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <DatePicker
              label={label}
              value={value}
              onChange={(date) => {
                onChange(date);
                if(props.onChange){
                  props.onChange(date)
                } // Update form state with the selected date
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth variant="outlined" />
              )}
              {...props}
              format="DD-MM-YYYY"
              fullWidth
              slotProps={{ textField: { size: 'small' } }}
            />
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </>
        )}
      />
    </FormControl>
    </LocalizationProvider>
  );
};

export default SLDatePicker;
