import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import EMRAlert from '../../Utils/CustomAlert';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import CommonCard from '../../common/CommonCard';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LabMasterList from './LabMasterList';


const schema = yup
    .object({
        labname: yup.string().required("Lab name is required")
    })
    .required()

export default function LabMaster(props) {
    const [selectedData, setSelectedData] = useState(null);
    const defaultobj = {
        labname: "",
        status: "1"
    }
    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: defaultobj,
        resolver: yupResolver(schema),
    })
    useEffect(() => {
        return () => console.log("Cleanup..");
    }, []);


    const labMasterhandleSubmit = async (data) => {
        if (selectedData) {
            data.labid = selectedData.labid
        }
        var payLoad = {
            method: APIS.SAVE_LAB_MASTER.METHOD,
            url: APIS.SAVE_LAB_MASTER.URL,
            paramas: [],
            data: data
        }
        let result = await sendRequest(payLoad);
        if (result) {
            EMRAlert.alertifySuccess("Lab Saved Succussfully");
            reset();
            setSelectedData(null);
        } else {
            EMRAlert.alertifyError("Not Saved");
        }
    }

    function setDataToform(row, action) {
        setValue("labname", row.labname, { shouldTouch: true, shouldDirty: true });
        setValue("status", row.status, { shouldTouch: true, shouldDirty: true });
        setSelectedData(row);
    }
    return (
        <>
            <CommonCard title="Lab Master">
                <form onSubmit={handleSubmit(labMasterhandleSubmit)} >
                    <Grid xs={12} container spacing={1}>
                        <Grid item xs={2} spacing={1}>
                            <Controller
                                name="labname"
                                control={control}
                                render={({ field }) =>
                                    <TextField
                                        {...field}
                                        fullWidth
                                        type="text"
                                        size="small"
                                        variant="outlined"
                                        label={Translations.LAB_MASTER.NAME}
                                        error={errors.labname?.message}
                                        helperText={errors.labname?.message}
                                    />
                                }
                            />

                        </Grid>

                        <Grid item xs={3} spacing={1}>
                            <FormControl style={{ display: 'row', flexDirection: 'row' }}>
                                <FormLabel id="demo-row-radio-buttons-group-label" style={{ paddingRight: '8px', paddingTop: '8px' }}>{Translations.DIAGNOSIS_MASTER.STATUS}</FormLabel>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) =>
                                        <RadioGroup
                                            {...field}
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                        >
                                            <FormControlLabel value="1" control={<Radio />} label="Active" />
                                            <FormControlLabel value="2" control={<Radio />} label="Inactive" />
                                        </RadioGroup>}
                                />

                            </FormControl>
                        </Grid>
                        <Grid item xs={3} spacing={1}>
                            <FormButtonComponent button1={"Save"} button2={"Close"} clearFormEvent={() => {
                                reset(defaultobj,
                                    {
                                        keepErrors: true,
                                        keepDirty: true,
                                    });
                            }} />
                        </Grid>


                    </Grid>

                </form>
            </CommonCard>
            <LabMasterList openEditmode={(row, action) => {
                setDataToform(row, action);
            }} />
        </>
    )
}