import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from "react-hook-form";
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';


const PrescriptionsComponent = (props) => {
    const [drugListOptions, setDrugListOptions] = React.useState([]);
    const [drugListinputValue, setDrugListinputValue] = React.useState('');


    async function getDrugMasterData(newValue) {
        var payLoad = {
            method: APIS.GET_DRUG_MASTER_DATA.METHOD,
            url: APIS.GET_DRUG_MASTER_DATA.URL,
            paramas: [newValue]
        }
        let result = await sendRequest(payLoad);
        if (result) {
            setDrugListOptions(result);
        }
    }

    return (
        <FormControl variant="outlined" fullWidth>
            <Controller
                name="selectedDrugValues"
                control={props.control}
                render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) =>
                    <Autocomplete
                        size="small"
                        onChange={(event, item) => {
                            onChange(item);
                        }}
                        key={option => option.drugcode}
                        multiple={props.isMultiSelect ? props.isMultiSelect : false}
                        getOptionLabel={option => option.drugname}
                        inputValue={drugListinputValue}
                        value={value}
                        onInputChange={(event, newInputValue) => {
                            if (newInputValue.length > 2) {
                                getDrugMasterData(newInputValue)
                            }
                            setDrugListinputValue(newInputValue);

                        }}
                        id="drug-controllable-states-demo"
                        options={drugListOptions}
                        renderInput={(params) => <TextField {...params} error={props.errors.selectedDrugValues?.message}
                            helperText={props.errors.selectedDrugValues?.message} label="Search Drug" />}
                    />
                }
            />

        </FormControl>
    );
};

export default PrescriptionsComponent;