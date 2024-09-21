// CommonSelect.js
import React from 'react';
import { Controller } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

const SPSelectDropDown = ({
    name,
    control,
    label,
    options = [],
    rules = {},
    error,
    mapvalues,
    ...props
}) => {
    return (
        <FormControl fullWidth error={!!error}>
            <InputLabel size="small">{label}</InputLabel>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                        <Select
                            value={() => value?.value || ''}
                            size="small"
                            onChange={onChange}
                            renderValue={(o) => {
                                return value[mapvalues.value] || '';
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

export default SPSelectDropDown;
