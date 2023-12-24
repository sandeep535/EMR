import React, { useEffect, useState, useContext,forwardRef,useImperativeHandle } from 'react';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid';
import { sendRequest } from '../global/DataManager';
import Button from '@mui/material/Button';
import APIS from '../../Utils/APIS';
import { useNavigate } from "react-router-dom";
import AppContext from '../../components/Context/AppContext';
import Container from '@mui/material/Container';
import Translations from '../../resources/translations';
import DemoPaper from '../../Utils/CustomCssUtil';
import Divider from '@mui/material/Divider';
import EMRAlert from '../../Utils/CustomAlert';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';

const Vitals = forwardRef((props, ref) => {
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [bmi, setBmi] = useState("");
    const [systolic, setSystolic] = useState("");
    const [diastolic, setDiastolic] = useState("");
    const [pulse, setPulse] = useState("");
    const [respiratoryrate, setRespiratoryrate] = useState("");
    const [temperature, setTemperature] = useState("");

    const appContextValue = useContext(AppContext);
    // async function handleSubmit(event) {
    //     event.preventDefault();
    //     var sendingObj = {
    //         visitid: appContextValue.selectedVisitDeatils.visitid,
    //         clientid: appContextValue.selectedVisitDeatils.clientid.seqid,
    //         height: height,
    //         weight: weight,
    //         bmi: bmi,
    //         systolic: systolic,
    //         diastolic: diastolic,
    //         pulse: pulse,
    //         respiratoryrate: respiratoryrate,
    //         temperature: temperature,
    //         capturedby: 1
    //     }
    //     var payLoad = {
    //         method: APIS.SAVE_VITALS.METHOD,
    //         url: APIS.SAVE_VITALS.URL,
    //         paramas: [],
    //         data: sendingObj
    //     }
    //     let result = await sendRequest(payLoad);
    //     console.log(result);
    //     if (result) {
    //         EMRAlert.alertifySuccess("Viatls Saved Succussfully");
    //     }else{
    //         EMRAlert.alertifyError("Not Saved")
    //     }

    // }
    useImperativeHandle(
        ref,
        () => {
            return {
                getFormData: () => {
                    return {
                        height,
                        weight,
                        bmi,
                        systolic,
                        diastolic,
                        pulse,
                        respiratoryrate,
                        temperature
                    }
                },
                setFormData1: (data) => {
                    setHeight(data.height);
                    setWeight(data.weight);
                    setBmi(data.bmi);
                    setDiastolic(data.systolic);
                    setSystolic(data.pulse);
                    setPulse(data);
                    setRespiratoryrate(data.respiratoryrate);
                    setTemperature(data.temperature);
                }
            }
        },
        [height, weight, bmi, systolic, diastolic, pulse, respiratoryrate, temperature],
    );

    return (
        <>
            <Divider sx={{ color: "secondary.light", fontSize: 14 }} textAlign="left">Vitals Sign</Divider>
            <DemoPaper square={false}>
                <form >
                    <Box display="grid" gap="10px">
                        <Grid container spacing={1}>
                            <Grid item xs={2} spacing={1}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    size="small"
                                    variant="outlined"
                                    label={Translations.vitalsForm.height}
                                    name="height"
                                    onChange={e => setHeight(e.target.value)}
                                    value={height}
                                />
                            </Grid>
                            <Grid item xs={2} spacing={1}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    size="small"
                                    variant="outlined"
                                    label={Translations.vitalsForm.weight}
                                    name="weight"
                                    onChange={e => setWeight(e.target.value)}
                                    value={weight}
                                />
                            </Grid>
                            <Grid item xs={2} spacing={1}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    size="small"
                                    variant="outlined"
                                    label={Translations.vitalsForm.bmi}
                                    name="bmi"
                                    onChange={e => setBmi(e.target.value)}
                                    value={bmi}
                                />
                            </Grid>
                            <Grid item xs={1} spacing={1}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    size="small"
                                    variant="outlined"
                                    label={Translations.vitalsForm.systolic}
                                    name="systolic"
                                    onChange={e => setSystolic(e.target.value)}
                                    value={systolic}
                                />
                            </Grid>
                            <Grid item xs={1} spacing={1}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    size="small"
                                    variant="outlined"
                                    label={Translations.vitalsForm.diastolic}
                                    name="diastolic"
                                    onChange={e => setDiastolic(e.target.value)}
                                    value={diastolic}
                                />
                            </Grid>
                            <Grid item xs={2} spacing={1}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    size="small"
                                    variant="outlined"
                                    label={Translations.vitalsForm.pulse}
                                    name="pulse"
                                    onChange={e => setPulse(e.target.value)}
                                    value={pulse}
                                />
                            </Grid>
                            <Grid item xs={2} spacing={1}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    size="small"
                                    variant="outlined"
                                    label={Translations.vitalsForm.respiratoryrate}
                                    name="respiratoryrate"
                                    onChange={e => setRespiratoryrate(e.target.value)}
                                    value={respiratoryrate}
                                />
                            </Grid>
                            <Grid item xs={2} spacing={1}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    size="small"
                                    variant="outlined"
                                    label={Translations.vitalsForm.temperature}
                                    name="temperature"
                                    onChange={e => setTemperature(e.target.value)}
                                    value={temperature}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    {/* <FormButtonComponent button1={"Save"} button2={"Clear"} /> */}
                </form>
            </DemoPaper >
        </>
    )
});
export default Vitals;