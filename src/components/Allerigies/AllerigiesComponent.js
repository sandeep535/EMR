import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from "react-hook-form";
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';


const AllerigiesComponent = (props) => {
    const [allergyTypeOptions, setAllergyTypeOptions] = useState([]);
    const [allergyInputValue, setAllergyInputValue] = useState("");


    async function getAllergiesMasterList(name) {
        let data = {
            allergyid: "",
            allergyname: name,
            status: 1,
            allergycode: null,
            allergytype: null
        }
        var mainDTO = {
            pagenumber: 0,
            pagesize: 1000,
            allergieslist: [data]
        }
        var payLoad = {
            method: APIS.GET_ALLERIES_MASTER_LIST.METHOD,
            url: APIS.GET_ALLERIES_MASTER_LIST.URL,
            paramas: [],
            data: mainDTO
        }
        let result = await sendRequest(payLoad);
        if (result && result.allergieslist.length != 0) {
            setAllergyTypeOptions(result.allergieslist);
        } else {

        }

    }
    
    return (
        <FormControl variant="outlined" fullWidth>
            <Controller
                name="selectedAllerigies"
                control={props.control}
                render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) =>
                    <Autocomplete
                        size="small"
                        multiple={props.isMultiSelect ? props.isMultiSelect : false}
                        id="Allergy-combo-box-demo"
                        options={allergyTypeOptions}
                        key={option => option.allergyid}
                        getOptionLabel={option => option.allergyname || ""}
                        value={value}
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
            />

        </FormControl>
    );
};

export default AllerigiesComponent;