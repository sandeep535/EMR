import React from 'react';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';

const SLCheckbox = ({ name, options, control, error: externalError, value: standaloneValue = [], onChange: standaloneOnChange, helperText: standaloneHelperText }) => {
  const renderGroup = (value = [], onChange, error) => (
    <>
      <FormGroup>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                value={option.value}
                checked={Array.isArray(value) ? value.includes(option.value) : !!value}
                onChange={(e) => {
                  const checked = e.target.checked;
                  let newValue;
                  if (Array.isArray(value)) {
                    newValue = checked ? [...value, option.value] : value.filter((val) => val !== option.value);
                  } else {
                    newValue = checked;
                  }
                  if (onChange) onChange(newValue);
                }}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
      {(error || externalError) && <FormHelperText>{(error || externalError)?.message || standaloneHelperText}</FormHelperText>}
    </>
  );

  return (
    <FormControl component="fieldset" error={!!externalError}>
      {control && name ? (
        <Controller
          name={name}
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => renderGroup(value, onChange, error)}
        />
      ) : (
        renderGroup(standaloneValue, standaloneOnChange, undefined)
      )}
    </FormControl>
  );
};

export default SLCheckbox;
