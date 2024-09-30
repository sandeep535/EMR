import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Controller } from "react-hook-form";
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';


const DiagnosisComponent = (props) => {
    const [diagnosisMasterData, setDiagnosisMasterData] = useState([]);
    const [diagnosisinputValue, setDiagnosisinputValue] = useState("");


    async function getDiagnosisMasterData(newInputValue) {
        var obj = {
            pagenumber: 0,
            pagesize: 100,
            totalcount: 0,
            diagnosisMasterModel: [{
                dignosiscodeset: null,
                dignosiscode: null,
                dignosisname: newInputValue,
                status: 1
            }]
        }
        var payLoad = {
            method: APIS.GET_DIADNOSIS_MASTER.METHOD,
            url: APIS.GET_DIADNOSIS_MASTER.URL,
            paramas: [],
            data: obj
        }
        let result = await sendRequest(payLoad);
        if (result && result.diagnosisMasterModel) {
            setDiagnosisMasterData(result.diagnosisMasterModel)
        } else {
            setDiagnosisMasterData([])
        }
    }

    return (
        <FormControl variant="outlined" fullWidth>
            <Controller
                name="selectedDiagnosisValues"
                control={props.control}
                render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) =>
                    <Autocomplete
                        size="small"
                        onChange={(event, item) => {
                            onChange(item);
                        }}
                        value={value}
                        key={option => option.dignosisid}
                        multiple={props.isMultiSelect ? props.isMultiSelect : false}
                        getOptionLabel={option => option.dignosisname}
                        inputValue={diagnosisinputValue}
                        onInputChange={(event, newInputValue) => {
                            if (event != null) {
                                if (newInputValue && newInputValue.length > 1) {
                                    getDiagnosisMasterData(newInputValue)
                                }
                                setDiagnosisinputValue(newInputValue);
                            }
                        }}
                        id="drug-controllable-states-demo"
                        options={diagnosisMasterData}
                        renderInput={(params) => <TextField {...params} error={props.errors.selectedDiagnosisValues?.message}
                            helperText={props.errors.selectedDiagnosisValues?.message} label="Search Daignosis" />}
                    />
                }
            />

        </FormControl>
    );
};

export default DiagnosisComponent;