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
    error,
    mapvalues,
    onchangeEventCallBack,
    ...props
}) => {
    return (
        <FormControl fullWidth error={!!error}>
            <InputLabel size="small">{label}</InputLabel>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { onChange,onFormChange, value }, fieldState: { error } }) => (
                    <>
                        <Select
                            value={() => value?.value || ''}
                            size="small"
                            onChange={(e) => {
                                onChange(e); // React Hook Form's change handler
                                if (onchangeEventCallBack) {
                                    onchangeEventCallBack(e.target.value); // Custom change handler
                                }
                              }}
                            renderValue={(o) => {
                                return (value && value[mapvalues.value]) || '';
                            }}
                            label={label}
                            {...props}>
                            {options.map((option) => (
                                <MenuItem key={option[mapvalues.id]} value={option}>
                                    {option[mapvalues.value]}
                                </MenuItem>
                            ))}
                        </Select>
                        {error && <FormHelperText>{error.message}</FormHelperText>}
                    </>
                )}
            />
        </FormControl>
    );
};

export default SLSelectDropDown;
