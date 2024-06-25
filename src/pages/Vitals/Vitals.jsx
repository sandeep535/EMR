import React, { useState, useContext, forwardRef, useImperativeHandle } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import AppContext from '../../components/Context/AppContext';
import Translations from '../../resources/translations';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../global/DataManager';
import EMRAlert from '../../Utils/CustomAlert';
import CommonCard from '../../common/CommonCard';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
const schema = yup
    .object().shape({
        height: yup.string().when({
            is: (exists) => !!exists,
            then: (rule) =>
                rule.matches(/^\d+\.\d{1,2}$/g, "This field allow only numbers")
        }),
        weight: yup.string().when({
            is: (exists) => !!exists,
            then: (rule) =>
                rule.matches(/^\d+\.\d{1,2}$/g, "This field allow only numbers")
        }),
        bmi: yup.string().when({
            is: (exists) => !!exists,
            then: (rule) =>
                rule.matches(/^\d+\.\d{1,2}$/g, "This field allow only numbers")
        }),
        systolic: yup.string().when({
            is: (exists) => !!exists,
            then: (rule) =>
                rule.matches(/^\d+\.\d{1,2}$/g, "This field allow only numbers")
        }),
        diastolic: yup.string().when({
            is: (exists) => !!exists,
            then: (rule) =>
                rule.matches(/^\d+\.\d{1,2}$/g, "This field allow only numbers")
        }),
        pulse: yup.string().when({
            is: (exists) => !!exists,
            then: (rule) =>
                rule.matches(/^\d+\.\d{1,2}$/g, "This field allow only numbers")
        }),
        respiratoryrate: yup.string().when({
            is: (exists) => !!exists,
            then: (rule) =>
                rule.matches(/^\d+\.\d{1,2}$/g, "This field allow only numbers")
        }),
        temperature: yup.string().when({
            is: (exists) => !!exists,
            then: (rule) =>
                rule.matches(/^\d+\.\d{1,2}$/g, "This field allow only numbers")
        }),
    })

const Vitals = forwardRef((props, ref) => {
    const [vitalformData, setVitalformData] = useState("");
    const [vitalid, setVitalId] = useState("");
    const appContextValue = useContext(AppContext);
    const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            height: "",
            weight: "",
            bmi: "",
            systolic: "",
            diastolic: "",
            pulse: "",
            respiratoryrate: "",
            temperature: "",
        },
        mode: 'onChange',
        resolver: yupResolver(schema),
    })

    useImperativeHandle(
        ref,
        () => {
            return {
                getFormData: () => {
                    return {
                        vitalformData,
                        vitalid
                    }
                },
                setFormData: (data) => {
                    setVitalId(data.vitalid);
                    setValue("height", data.height);
                    setValue("weight", data.weight);
                    setValue("bmi", data.bmi);
                    setValue("systolic", data.systolic);
                    setValue("diastolic", data.diastolic);
                    setValue("pulse", data.pulse);
                    setValue("respiratoryrate", data.respiratoryrate);
                    setValue("temperature", data.temperature);
                },
                submitFormmData: () => {
                    handleSubmit(vitalHandle)();
                }
            }
        },
        [vitalformData],
    );

    const vitalHandle = async (data,fromWhere) => {
        if(fromWhere){
            var sendingOnj = {
                vitalid :null,
                visitid: null,
                clientid:appContextValue.selectedVisitDeatils.clientid.seqid,
                height : data.height,
                weight :data.weight,
                bmi : data.bmi,
                systolic :data.systolic,
                diastolic:data.diastolic,
                pulse:data.pulse,
                respiratoryrate : data.respiratoryrate,
                temperature : data.temperature,
                capturedby: 1
            }
            var payLoad = {
                method: APIS.SAVE_VITALS.METHOD,
                url: APIS.SAVE_VITALS.URL,
                paramas: [],
                data: sendingOnj
            }
            let result = await sendRequest(payLoad);
            if (result) {
                EMRAlert.alertifySuccess("Vital data saved succussfully");
                props.refreshVitalsList();
            } else {
                EMRAlert.alertifyError("Not created");
            }
        }else{
            setVitalformData(data);
        }
      

    }
    return (
        <> <CommonCard title={"Vitals"} >
            <form onSubmit={handleSubmit(data => vitalHandle(data, "isFrom"))}  >
                <Grid container spacing={1}>
                    <Grid item xs={2} >
                        <Controller
                            name="height"
                            control={control}
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    fullWidth
                                    type="text"
                                    size="small"
                                    variant="outlined"
                                    label={Translations.vitalsForm.height}
                                    error={errors.height?.message}
                                    helperText={errors.height?.message}
                                />
                            }
                        />
                    </Grid>
                    <Grid item xs={2} >
                        <Controller
                            name="weight"
                            control={control}
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    fullWidth
                                    type="text"
                                    size="small"
                                    variant="outlined"
                                    label={Translations.vitalsForm.weight}
                                    error={errors.weight?.message}
                                    helperText={errors.weight?.message}
                                />
                            }
                        />
                    </Grid>
                    <Grid item xs={2} >
                        <Controller
                            name="bmi"
                            control={control}
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    fullWidth
                                    type="text"
                                    size="small"
                                    variant="outlined"
                                    label={Translations.vitalsForm.bmi}
                                    error={errors.bmi?.message}
                                    helperText={errors.bmi?.message}
                                />
                            }
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Controller
                            name="systolic"
                            control={control}
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    fullWidth
                                    type="text"
                                    size="small"
                                    variant="outlined"
                                    label={Translations.vitalsForm.systolic}
                                    error={errors.systolic?.message}
                                    helperText={errors.systolic?.message}
                                />
                            }
                        />
                    </Grid>
                    <Grid item xs={2} >
                        <Controller
                            name="diastolic"
                            control={control}
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    fullWidth
                                    type="text"
                                    size="small"
                                    variant="outlined"
                                    label={Translations.vitalsForm.diastolic}
                                    error={errors.diastolic?.message}
                                    helperText={errors.diastolic?.message}
                                />
                            }
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={1}>
                    <Grid item xs={2} spacing={4}>
                        <Controller
                            name="pulse"
                            control={control}
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    fullWidth
                                    type="text"
                                    size="small"
                                    variant="outlined"
                                    label={Translations.vitalsForm.pulse}
                                    error={errors.pulse?.message}
                                    helperText={errors.pulse?.message}
                                />
                            }
                        />
                    </Grid>
                    <Grid item xs={3} spacing={4}>
                        <Controller
                            name="respiratoryrate"
                            control={control}
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    fullWidth
                                    type="text"
                                    size="small"
                                    variant="outlined"
                                    label={Translations.vitalsForm.respiratoryrate}
                                    error={errors.respiratoryrate?.message}
                                    helperText={errors.respiratoryrate?.message}
                                />
                            }
                        />
                    </Grid>
                    <Grid item xs={3} spacing={4}>
                        <Controller
                            name="temperature"
                            control={control}
                            render={({ field }) =>
                                <TextField
                                    {...field}
                                    fullWidth
                                    type="text"
                                    size="small"
                                    variant="outlined"
                                    label={Translations.vitalsForm.temperature}
                                    error={errors.temperature?.message}
                                    helperText={errors.temperature?.message}
                                />
                            }
                        />
                    </Grid>
                </Grid>
                {props.isActionButtonReq && 
                <Grid item xs={2} spacing={1}>
                    <FormButtonComponent button1={"Save"} button2={"Close"} clearFormEvent={() => {
                        // setShowAddForm(false);
                    }} />
                </Grid>
                }
                
            </form>

        </CommonCard>
        </>
    )
});
export default Vitals;