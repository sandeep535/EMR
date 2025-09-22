// components/AutocompleteField.js
import React from "react";
import { Controller } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";

const AutocompleteField = ({
  name,
  control,
  options = [],
  label,
  placeholder,
  getOptionLabel = (option) => option,
  mapvalues,
  id,
  isMultiSelect,
  onInputChange,
  onchangeEventCallBack,
  // standalone props
  value: standaloneValue,
  onChange: standaloneOnChange,
  error: standaloneError,
  helperText: standaloneHelperText,
  ...props
}) => {
  const renderAuto = (fieldValue, fieldOnChange, error, helperText) => (
    <Autocomplete
      size="small"
      multiple={!!isMultiSelect}
      id={id}
      options={options}
      getOptionLabel={(option) => {
        if (!option) return "";
        if (mapvalues) {
          if (Array.isArray(mapvalues.value)) {
            return mapvalues.value.map((field) => option[field]).join(" ") || "";
          }
          return option[mapvalues.value] || "";
        }
        return getOptionLabel(option);
      }}
      value={fieldValue ?? null}
      onInputChange={(event, newInputValue) => {
        if (onInputChange) onInputChange(newInputValue);
      }}
      onChange={(event, item) => {
        if (fieldOnChange) fieldOnChange(item);
        if (onchangeEventCallBack) onchangeEventCallBack(item);
      }}
      slotProps={{
        popper: { sx: { zIndex: 99999 } },
        textField: { size: "small" },
      }}
      renderOption={(propsOpt, option) => (
        <li {...propsOpt} key={mapvalues ? option[mapvalues.id] : getOptionLabel(option)}>
          {mapvalues
            ? Array.isArray(mapvalues.value)
              ? mapvalues.value.map((field) => option[field]).join(" ")
              : option[mapvalues.value]
            : getOptionLabel(option)}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={!!error}
          helperText={error ? error.message || helperText : helperText || ""}
        />
      )}
      {...props}
    />
  );

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) =>
          renderAuto(value, onChange, error, undefined)
        }
      />
    );
  }

  return renderAuto(standaloneValue, standaloneOnChange, standaloneError, standaloneHelperText);
};

export default AutocompleteField;
