import React, { forwardRef, useImperativeHandle, useEffect,useState } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import CommonCard from '../../common/CommonCard';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';

const schema = yup
    .object({
        selectedDiagnosisValues: yup.object().required("Select Diagnosis")
    })
    .required()
const Diagnosis = forwardRef((props, ref) => {
    const [description, setDescription] = useState("");
    const data1 = props.data && props.data.dignosismasterid;
    const [diagnosisMasterData,setDiagnosisMasterData] =useState(data1 ? data1:[]);
   
    console.log("props.dataprops.dataprops.data",props.data);
    const [diagnosisinputValue,setDiagnosisinputValue] = useState(""); 
    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        mode: 'onChange',
        defaultValues: { selectedDiagnosisValues: ""},
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if(data1){
            setDiagnosisMasterData([data1]);
        }
      
      //getDiagnosisMasterData();
    }, [props.data]);

   async function getDiagnosisMasterData(newInputValue){
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
    useImperativeHandle(
        ref,
        () => {
            return {
                getFormData: () => {
                    return {
                        description
                    }
                },
                setFormData: (data) => {
                    setDiagnosisinputValue(data.dignosisname);
                    setValue("selectedDiagnosisValues", data, { shouldTouch: true, shouldDirty: true });
                },
                submitFormmData: () => {
                    handleSubmit(diagnosisHandle)();
                }
            }
        },
        [description],
    );
    const diagnosisHandle = async (data) => {
        setDescription(data.selectedDiagnosisValues);
    }
   
    return (
        <>
            <CommonCard title={props.label}>
                <form onSubmit={handleSubmit(diagnosisHandle)}  >
                    <Grid container spacing={1}>
                        <Grid item xs={12} >
                            <FormControl variant="outlined" fullWidth>
                                <Controller
                                    name="selectedDiagnosisValues"
                                    control={control}
                                    render={({ field: { onChange } }) =>
                                        <Autocomplete
                                            size="small"
                                            onChange={(event, item) => {
                                                onChange(item);
                                            }}
                                            defaultValue={diagnosisMasterData.length !=0 && diagnosisMasterData[0]}
                                            key={option => option.dignosisid}
                                            getOptionLabel={option => option.dignosisname}
                                            inputValue={diagnosisinputValue}
                                            onInputChange={(event, newInputValue) => {
                                                console.log(diagnosisMasterData);
                                                if(event != null){
                                                    if (newInputValue && newInputValue.length > 1) {
                                                        getDiagnosisMasterData(newInputValue)
                                                    }
                                                    setDiagnosisinputValue(newInputValue);
                                                }
                                                

                                            }}
                                            id="drug-controllable-states-demo"
                                            options={diagnosisMasterData}
                                            renderInput={(params) => <TextField {...params} error={errors.selectedDiagnosisValues?.message}
                                                helperText={errors.selectedDiagnosisValues?.message} label="Search Daignosis" />}
                                        />
                                    }
                                />

                            </FormControl>
                        </Grid>
                        
                    </Grid>
                </form>
            </CommonCard>

        </>
    )
});
export default Diagnosis;