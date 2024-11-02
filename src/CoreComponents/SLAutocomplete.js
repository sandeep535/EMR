// components/AutocompleteField.js
import React, {  useEffect, forwardRef, useImperativeHandle } from 'react';
import { Controller } from "react-hook-form";
import { Autocomplete, TextField, FormHelperText } from "@mui/material";

import { sendRequest } from '../pages/global/DataManager';

const SLAutocomplete = ({ apiEndpoint, label ,control,name,mapvalues,
    id,
    isMultiSelect,
    onchangeEventCallBack}) => {
    const [options, setOptions] = React.useState([]);
    const [inputValue, setInputValue] = React.useState('');

    // Fetch options from the API


    useEffect(() => {
        //fetchOptions(inputValue);
    }, [inputValue, apiEndpoint]);
    async function getOptions(newInputValue) {
        var payLoad = {
            method: apiEndpoint.METHOD,
            url: apiEndpoint.URL,
            paramas: [newInputValue]
        }
        let result = await sendRequest(payLoad);
        if (result) {
            setOptions(result)
        }
    }
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) =>
                <>
                    <Autocomplete
                        size="small"
                        multiple={isMultiSelect ? isMultiSelect : false}
                        id={id}
                        options={options}
                        key={option => option[mapvalues.id]}
                        getOptionLabel={option => option[mapvalues.value] || ""}
                        value={value || null}
                        onInputChange={(event, newInputValue) => {
                            getOptions(newInputValue)
                        }}
                        onChange={(event, item) => {
                            onChange(item);
                            if (onchangeEventCallBack) {
                                onchangeEventCallBack(item);
                            }
                        }}
                        slotProps={{
                            popper: {
                                sx: {
                                    zIndex: 99999
                                }
                            }
                        }}
                        renderOption={(props, option) => {
                            return (
                                <li {...props} key={option[mapvalues.id]}>
                                    {option[mapvalues.value]}
                                </li>
                            );
                        }}
                        renderInput={(params) => <TextField {...params} label={label} error={!!error}
                            helperText={error ? error.message : ''} />}
                    />

                </>
            }
        />
    );
};

export default SLAutocomplete;