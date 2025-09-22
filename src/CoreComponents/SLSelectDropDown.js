// CommonSelect.js
import React from 'react';
import { Controller } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

const SLSelectDropDown = ({
  name,
  control,
  label,
  options = [],
  rules = {},
  error: externalError,
  mapvalues,
  onchangeEventCallBack,
  // standalone
  value: standaloneValue,
  onChange: standaloneOnChange,
  helperText: standaloneHelperText,
  ...props
}) => {
  const renderSelect = (value, onChange, error) => (
    <>
      <InputLabel size="small">{label}</InputLabel>
      <Select
        value={value ?? ''}
        size="small"
        onChange={(e) => {
          const val = e.target.value;
          if (onChange) onChange(val);
          if (onchangeEventCallBack) onchangeEventCallBack(val);
        }}
        renderValue={() => {
          if (!value) return '';
          const option = value;
          if (mapvalues) return option[mapvalues.value] || '';
          return String(option.label ?? option.value ?? '');
        }}
        label={label}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={mapvalues ? option[mapvalues.id] : option.value} value={option}>
            {mapvalues ? option[mapvalues.value] : (option.label ?? option.value)}
          </MenuItem>
        ))}
      </Select>
      {(error || externalError) && (
        <FormHelperText>{(error || externalError)?.message || standaloneHelperText}</FormHelperText>
      )}
    </>
  );

  return (
    <FormControl fullWidth error={!!(externalError)}>
      {control && name ? (
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field: { onChange, value }, fieldState: { error } }) => renderSelect(value, onChange, error)}
        />
      ) : (
        renderSelect(standaloneValue, standaloneOnChange, undefined)
      )}
    </FormControl>
  );
};

export default SLSelectDropDown;
