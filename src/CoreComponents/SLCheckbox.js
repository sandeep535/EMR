import React from 'react';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';

const SLCheckbox = ({ name, options, control, error }) => {
  return (
    <FormControl component="fieldset" error={!!error}>
      <FormGroup>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Controller
                name={name}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    value={option.value}
                    checked={field.value?.includes(option.value)}
                    onChange={(e) => {
                      const { checked } = e.target;
                      const newValue = checked
                        ? [...(field.value || []), option.value]
                        : field.value.filter((val) => val !== option.value);
                      field.onChange(newValue);
                    }}
                  />
                )}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
};

export default SLCheckbox;
