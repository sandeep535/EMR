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
    ...props
}) => {
    return (
        <FormControl component="fieldset" error={!!props.error} fullWidth sx={{ display: 'flex', flexDirection: "row" }}>
            <FormLabel component="legend">{label}</FormLabel>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                        <RadioGroup value={value || ''} onChange={onChange} row={row} {...props}>
                            {options.map((option) => (
                                <FormControlLabel
                                    key={option.value}
                                    value={option.value}
                                    control={<Radio />}
                                    label={option.label}
                                />
                            ))}
                        </RadioGroup>
                        {error && <FormHelperText>{error.message}</FormHelperText>}
                    </>
                )}
            />
        </FormControl>
    );
};

export default SLRadioButton;
