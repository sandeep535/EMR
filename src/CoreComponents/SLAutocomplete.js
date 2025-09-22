// components/AutocompleteField.js
import React, { useEffect } from 'react';
import { Controller } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";

import { sendRequest } from '../pages/global/DataManager';

const SLAutocomplete = ({ apiEndpoint, label, control, name, mapvalues,
  id,
  isMultiSelect,
  onchangeEventCallBack,
  // standalone
  value: standaloneValue,
  onChange: standaloneOnChange,
  error: standaloneError,
  helperText: standaloneHelperText,
  ...props
}) => {
  const [options, setOptions] = React.useState([]);

  async function getOptions(newInputValue) {
    const payLoad = {
      method: apiEndpoint?.METHOD,
      url: apiEndpoint?.URL,
      paramas: [newInputValue]
    };
    try {
      const result = await sendRequest(payLoad);
      if (result) setOptions(result);
    } catch (e) {
      // ignore
    }
  }

  const renderAuto = (fieldValue, fieldOnChange, error, helperText) => (
    <Autocomplete
      size="small"
      multiple={!!isMultiSelect}
      id={id}
      options={options}
      getOptionLabel={(option) => (option ? option[mapvalues?.value] || "" : "")}
      value={fieldValue ?? null}
      onInputChange={(event, newInputValue) => {
        getOptions(newInputValue);
      }}
      onChange={(event, item) => {
        if (fieldOnChange) fieldOnChange(item);
        if (onchangeEventCallBack) onchangeEventCallBack(item);
      }}
      slotProps={{ popper: { sx: { zIndex: 99999 } }, textField: { size: 'small' } }}
      renderOption={(propsOpt, option) => (
        <li {...propsOpt} key={option[mapvalues?.id]}>
          {option[mapvalues?.value]}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label={label} error={!!error} helperText={error ? error.message || helperText : helperText || ''} />
      )}
      {...props}
    />
  );

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => renderAuto(value, onChange, error, undefined)}
      />
    );
  }

  return renderAuto(standaloneValue, standaloneOnChange, standaloneError, standaloneHelperText);
};

export default SLAutocomplete;