// components/AutocompleteField.js
import React from "react";
import { Controller } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";

const AutocompleteField = ({
    name,
    control,
    options,
    label,
    placeholder,
    getOptionLabel = (option) => option,
    optionKey
}) => {
    return (
        <>

            {/* <Controller
                name="selectedLabOrder"
                control={control}
                render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) =>
                    <Autocomplete
                        size="small"
                        multiple={props.isMultiSelect ? props.isMultiSelect : false}
                        id="Allergy-combo-box-demo"
                        options={options}
                        key={option => option.allergyid}
                        getOptionLabel={option => option[optionKey] || ""}
                        value={value || null}
                        inputValue={allergyInputValue}
                        onInputChange={(event, newInputValue) => {
                            if (newInputValue.length > 1) {
                                getAllergiesMasterList(newInputValue)
                            }
                            setAllergyInputValue(newInputValue);
                        }}
                        onChange={(event, item) => {
                            onChange(item);
                        }}
                        // onChange={(event, newValue) => {
                        //     setAllergy(newValue);
                        // }}
                        renderOption={(props, option) => {
                            return (
                                <li {...props} key={option.allergyid}>
                                    {option.allergyname}
                                </li>
                            );
                        }}
                        renderInput={(params) => <TextField {...params} label={Translations.ALLERGY.ALLERGYNAME} />}
                    />
                }
            /> */}
        </>
    );
};

export default AutocompleteField;
