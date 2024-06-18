import React, { useEffect, forwardRef, useImperativeHandle, useContext } from 'react';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid';
import { sendRequest } from '../global/DataManager';
import Button from '@mui/material/Button';
import APIS from '../../Utils/APIS';
import AppContext from '../../components/Context/AppContext';
import Translations from '../../resources/translations';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Moment from 'react-moment';
import ClearIcon from '@mui/icons-material/Clear';
import styles from './PrescriptionStyles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CommonCard from '../../common/CommonCard';

const prescriptionHeadersList = [{
    name: 'Drug Name',
    width: '30%'
}, {
    name: 'Dose',
    width: '10%'
}, {
    name: 'SIG',
    width: '30%'
}, {
    name: 'Start Date',
    width: '10%'
}, {
    name: 'End Date',
    width: '10%'
}, {
    name: 'Actions',
    width: '10%'
}]
const Prescriptions = forwardRef((props, ref) => {
    const [drugListOptions, setDrugListOptions] = React.useState([]);
    const [drugListinputValue, setDrugListinputValue] = React.useState('');

    const [selectedDrugValues, setSelectedDrugValues] = React.useState();
    const [dose, setDose] = React.useState();
    const [doseunit, setDoseunit] = React.useState();
    const [sig, setSig] = React.useState();
    const [startdate, setStartdate] = React.useState();
    const [todate, setTodate] = React.useState();
    const [instructions, setInstructions] = React.useState();

    const [prescriptionList, setPrescriptionList] = React.useState([]);
    const appContextValue = useContext(AppContext);
    useEffect(() => {
        // getDrugMasterData();
    }, []);
    useImperativeHandle(
        ref,
        () => {
            return {
                getFormData: () => {
                    return {
                        prescriptionList
                    }
                },
                setFormData1: (data) => {
                    setPrescriptionList(data)
                }
            }
        },
        [prescriptionList],
    );
    function clearPrescriptonFormData() {
        setDrugListinputValue("");
        setSelectedDrugValues("")
        setDose("")
        setDoseunit("")
        setSig("");
        setStartdate("");
        setTodate("");
        setInstructions("")

    }
    async function addPrescriptionTollist() {
        var obj = {
            drugid: selectedDrugValues.drugid,
            drugname: selectedDrugValues.drugname,
            dose: dose,
            doseunit: doseunit,
            sig: sig,
            startdate: startdate,
            endate: todate,
            status: 1,
            clientid: appContextValue.selectedVisitDeatils.clientid.seqid,
            visitid: appContextValue.selectedVisitDeatils.visitid,
            capturedby: 1,
            instructions: instructions
        }
        var copySelectedList = [...prescriptionList];
        copySelectedList.push(obj);
        setPrescriptionList(copySelectedList);
        clearPrescriptonFormData();
    }
    async function getDrugMasterData(newValue) {
        var payLoad = {
            method: APIS.GET_DRUG_MASTER_DATA.METHOD,
            url: APIS.GET_DRUG_MASTER_DATA.URL,
            paramas: [newValue]
        }
        let result = await sendRequest(payLoad);
        console.log(result);
        if (result) {
            setDrugListOptions(result);
        }
    }

    function removePrescriptionFromList(index) {
        var copyPrescriptionList = [...prescriptionList];
        copyPrescriptionList.splice(index, 1);
        setPrescriptionList(copyPrescriptionList);
    }

    return (
        <>
        <CommonCard title={"Prescriptions"}>
        <Box sx={{ m: 1 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid container spacing={1}>
                                    <Grid item xs={6} spacing={1} >
                                        <FormControl variant="outlined" fullWidth>
                                            <Autocomplete
                                                size="small"
                                                value={selectedDrugValues}
                                                onChange={(event, newValue) => {
                                                    setSelectedDrugValues(newValue);
                                                    // addServicetoList(newValue);
                                                }}
                                                key={option => option.drugcode}
                                                getOptionLabel={option => option.drugname}
                                                inputValue={drugListinputValue}
                                                onInputChange={(event, newInputValue) => {
                                                    if (newInputValue.length > 2) {
                                                        getDrugMasterData(newInputValue)
                                                    }
                                                    setDrugListinputValue(newInputValue);

                                                }}
                                                id="drug-controllable-states-demo"
                                                options={drugListOptions}
                                                //  sx={{ width: 300 }}
                                                renderInput={(params) => <TextField {...params} label="Search Drug" />}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={3} spacing={1} >
                                        <FormControl variant="outlined" fullWidth>
                                            <TextField
                                                fullWidth
                                                type="text"
                                                size="small"
                                                variant="outlined"
                                                label={Translations.Prescriptions.dose}
                                                name="Dose"
                                                onChange={e => setDose(e.target.value)}
                                                value={dose}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={3} spacing={1} >
                                        <FormControl variant="outlined" fullWidth>
                                            <TextField
                                                fullWidth
                                                type="text"
                                                size="small"
                                                variant="outlined"
                                                label={Translations.Prescriptions.doseunit}
                                                name="doseunit"
                                                onChange={e => setDoseunit(e.target.value)}
                                                value={doseunit}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6} spacing={1} >
                                        <FormControl variant="outlined" fullWidth>
                                            <TextField
                                                fullWidth
                                                type="text"
                                                size="small"
                                                variant="outlined"
                                                label={Translations.Prescriptions.sig}
                                                name="sig"
                                                onChange={e => setSig(e.target.value)}
                                                value={sig}

                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={3} spacing={1} >
                                        <FormControl variant="outlined" fullWidth>
                                            <DatePicker
                                                label={<span sx={{ marginTop: '-8px' }}>Start Date</span>}
                                                value={startdate}
                                                onChange={newValue => setStartdate(new Date(newValue))}
                                                format="DD-MM-YYYY"
                                                fullWidth
                                                size="small"
                                                InputLabelProps={{
                                                    style: { marginTop: '-8px' }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={3} spacing={1} >
                                        <FormControl variant="outlined" fullWidth>
                                            <DatePicker
                                                label="To Date"
                                                value={todate}
                                                onChange={newValue => setTodate(new Date(newValue))}
                                                format="DD-MM-YYYY"
                                                fullWidth
                                                size="small"
                                                InputLabelProps={{
                                                    style: { marginTop: '-8px' }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={10} spacing={1} >
                                        <FormControl variant="outlined" fullWidth>
                                            <TextField
                                                fullWidth
                                                type="text"
                                                size="small"
                                                variant="outlined"
                                                multiline
                                                rows={3}
                                                label={"Instructions"}
                                                name={props.label}
                                                onChange={e => setInstructions(e.target.value)}
                                                value={instructions}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2} spacing={1} >
                                        <Button variant="contained" onClick={() => {
                                            addPrescriptionTollist();
                                        }}>Add</Button>
                                    </Grid>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table" className='grid-height'>
                                        <TableHead>
                                            <TableRow>
                                                {(prescriptionHeadersList.map(header => {
                                                    return (
                                                        <TableCell width={header.width}>{header.name}</TableCell>
                                                    )
                                                }))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody >
                                            {prescriptionList && prescriptionList.map((prescription, index) => (
                                                <TableRow key={prescription.drugid}>
                                                    <TableCell>{(prescription && prescription.drugname) ? prescription.drugname : ""}</TableCell>
                                                    <TableCell>{(prescription && prescription.dose) ? prescription.dose + "" + prescription.doseunit : ""}</TableCell>
                                                    <TableCell>{(prescription && prescription.sig) ? prescription.sig : ""}</TableCell>
                                                    <TableCell>{(prescription && prescription.startdate) ? <Moment format="DD-MMM-YYYY">
                                                        {new Date(prescription.startdate)}
                                                    </Moment> : ""}</TableCell>
                                                    <TableCell>{(prescription && prescription.endate) ? <Moment format="DD-MMM-YYYY">
                                                        {new Date(prescription.endate)}
                                                    </Moment> : ""}</TableCell>
                                                    <TableCell><ClearIcon styles={styles.cursor} onClick={() => {
                                                        removePrescriptionFromList(index);
                                                    }} /></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Grid>
                            </LocalizationProvider>
                        </Box>
        </CommonCard>
           
        </>
    )
});
export default Prescriptions;