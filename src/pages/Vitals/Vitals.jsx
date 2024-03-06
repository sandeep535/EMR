import React, { useState, useContext, forwardRef, useImperativeHandle } from 'react';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid';
import AppContext from '../../components/Context/AppContext';
import Translations from '../../resources/translations';
import DemoPaper from '../../Utils/CustomCssUtil';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const Vitals = forwardRef((props, ref) => {
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [bmi, setBmi] = useState("");
    const [systolic, setSystolic] = useState("");
    const [diastolic, setDiastolic] = useState("");
    const [pulse, setPulse] = useState("");
    const [respiratoryrate, setRespiratoryrate] = useState("");
    const [temperature, setTemperature] = useState("");
    const [vitalid, setVitalId] = useState("");

    const appContextValue = useContext(AppContext);

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
                        temperature,
                        vitalid
                    }
                },
                setFormData1: (data) => {
                    setHeight(data.height);
                    setWeight(data.weight);
                    setBmi(data.bmi);
                    setDiastolic(data.diastolic);
                    setSystolic(data.systolic);
                    setPulse(data.pulse);
                    setRespiratoryrate(data.respiratoryrate);
                    setTemperature(data.temperature);
                    setVitalId(data.vitalid);
                }
            }
        },
        [height, weight, bmi, systolic, diastolic, pulse, respiratoryrate, temperature],
    );

    return (
        <>
            {/* <Divider sx={{ color: "secondary.light", fontSize: 14 }} textAlign="left">Vitals Sign</Divider>
            <DemoPaper square={false}>
                <form >*/}
            <Box display="grid" gap="10px">
                <Card variant="outlined">
                    <CardContent>
                        <Typography sx={{ fontSize: 16 }} className='card-header' >
                            Vitals
                        </Typography>
                        <Box sx={{ m: 1 }}>
                            <Grid container spacing={1}>
                                <Grid item xs={6} spacing={4}>
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
                                <Grid item xs={6} spacing={4}>
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
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={6} spacing={4}>
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
                                <Grid item xs={3} spacing={4}>
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
                                <Grid item xs={3} spacing={4}>
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
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={6} spacing={4}>
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
                                <Grid item xs={6} spacing={4}>
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
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={6} spacing={4}>
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
                    </CardContent>
                </Card>
            </Box>
            {/* <FormButtonComponent button1={"Save"} button2={"Clear"} /> */}
            {/* </form>
            </DemoPaper >*/}
        </>
    )
});
export default Vitals;