// components/AutocompleteField.js
import React from "react";
import { Controller } from "react-hook-form";
import { Autocomplete, TextField, FormHelperText } from "@mui/material";

const AutocompleteField = ({
  name,
  control,
  options,
  label,
  placeholder,
  getOptionLabel = (option) => option,
  mapvalues,
  id,
  isMultiSelect,
  onInputChange,
  onchangeEventCallBack
}) => {
  return (
    <>

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
                if(onInputChange){
                  onInputChange(newInputValue)
                }
                
              }}
              onChange={(event, item) => {
                onChange(item);
                if(onchangeEventCallBack){
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
    </>
  );
};

export default AutocompleteField;
