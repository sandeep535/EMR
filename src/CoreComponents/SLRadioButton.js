import React from 'react';
import { Controller } from 'react-hook-form';
import { RadioGroup, FormControl, FormControlLabel, Radio, FormLabel, FormHelperText } from '@mui/material';

const SLRadioButton = ({
    name,
    control,
    label,
    options = [],
    rules = {},
    row = true,
    // standalone
    value: standaloneValue,
    onChange: standaloneOnChange,
    error: standaloneError,
    helperText: standaloneHelperText,
    ...props
}) => {
    const renderGroup = (value, onChange, error) => (
        <>
            <FormLabel component="legend">{label}</FormLabel>
            <RadioGroup value={value ?? ''} onChange={(e) => onChange && onChange(e.target.value)} row={row} {...props}>
                {options.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.id}
                    />
                ))}
            </RadioGroup>
            {error && <FormHelperText>{error.message || standaloneHelperText}</FormHelperText>}
        </>
    );

    return (
        <FormControl component="fieldset" error={!!(standaloneError)} fullWidth sx={{ display: 'flex', flexDirection: "row" }}>
            {control && name ? (
                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    render={({ field: { onChange, value }, fieldState: { error } }) => renderGroup(value, onChange, error)}
                />
            ) : (
                renderGroup(standaloneValue, standaloneOnChange, standaloneError)
            )}
        </FormControl>
    );
};

export default SLRadioButton;
