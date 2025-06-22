import React, { useState, useContext, forwardRef, useImperativeHandle } from 'react';
import Grid from '@mui/material/Grid';
import AppContext from '../../components/Context/AppContext';
import Translations from '../../resources/translations';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../global/DataManager';
import EMRAlert from '../../Utils/CustomAlert';
import CommonCard from '../../common/CommonCard';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import { VitalsSchema } from '../../common/YupSchema/formSchema';
import SLTextField from '../../CoreComponents/SLTextField';

const Vitals = forwardRef((props, ref) => {
    const [vitalformData, setVitalformData] = useState("");
    const [vitalid, setVitalId] = useState("");
    const appContextValue = useContext(AppContext);
    const { control, handleSubmit, setValue, getValues, watch, reset, formState: { errors } } = useForm({
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
        resolver: yupResolver(VitalsSchema),
    })
    const watchheight = watch("height");
    const watchweight = watch("weight")
    React.useEffect(() => {
        if (watchweight && watchheight) {
            bmical();
        }
    }, [watchweight, watchheight])
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
    function bmical() {
        const weight = getValues("weight");
        const height = getValues("height")
        let BMI = (weight) / (height * height);
        setValue("bmi", BMI.toFixed(2));
    }
    const vitalHandle = async (data, fromWhere) => {
        if (fromWhere) {
            var sendingOnj = {
                vitalid: null,
                visitid: null,
                clientid: appContextValue.selectedVisitDeatils.clientid.seqid,
                height: data.height,
                weight: data.weight,
                bmi: data.bmi,
                systolic: data.systolic,
                diastolic: data.diastolic,
                pulse: data.pulse,
                respiratoryrate: data.respiratoryrate,
                temperature: data.temperature,
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
        } else {
            setVitalformData(data);
        }
    }
    return (
        <> <CommonCard title={"Vitals"} >
            <form onSubmit={handleSubmit(data => vitalHandle(data, "isFrom"))}  >
                <Grid container spacing={1}>
                    <Grid item xs={2} >
                        <SLTextField
                            name="height"
                            label={Translations.vitalsForm.height}
                            control={control}
                            placeholder={Translations.vitalsForm.height}
                        />

                    </Grid>
                    <Grid item xs={2} >
                        <SLTextField
                            name="weight"
                            label={Translations.vitalsForm.weight}
                            control={control}
                            placeholder={Translations.vitalsForm.weight}
                        />

                    </Grid>
                    <Grid item xs={2} >
                        <SLTextField
                            name="bmi"
                            label={Translations.vitalsForm.bmi}
                            control={control}
                            placeholder={Translations.vitalsForm.bmi}
                        />

                    </Grid>
                    <Grid item xs={2}>
                        <SLTextField
                            name="systolic"
                            label={Translations.vitalsForm.systolic}
                            control={control}
                            placeholder={Translations.vitalsForm.systolic}
                        />

                    </Grid>
                    <Grid item xs={2} >
                        <SLTextField
                            name="diastolic"
                            label={Translations.vitalsForm.diastolic}
                            control={control}
                            placeholder={Translations.vitalsForm.diastolic}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={2} spacing={4}>
                        <SLTextField
                            name="pulse"
                            label={Translations.vitalsForm.pulse}
                            control={control}
                            placeholder={Translations.vitalsForm.pulse}
                        />
                    </Grid>
                    <Grid item xs={3} spacing={4}>
                        <SLTextField
                            name="respiratoryrate"
                            label={Translations.vitalsForm.respiratoryrate}
                            control={control}
                            placeholder={Translations.vitalsForm.respiratoryrate}
                        />
                    </Grid>
                    <Grid item xs={3} spacing={4}>
                        <SLTextField
                            name="temperature"
                            label={Translations.vitalsForm.temperature}
                            control={control}
                            placeholder={Translations.vitalsForm.temperature}
                        />

                    </Grid>
                </Grid>
                {props.isActionButtonReq &&
                    <Grid item xs={2} spacing={1}>
                        <FormButtonComponent button1={"Save"} button2={"Close"} clearFormEvent={() => {
                            
                        }} />
                    </Grid>
                }

            </form>

        </CommonCard>
        </>
    )
});
Vitals.displayName ="Vitals";
export default Vitals;