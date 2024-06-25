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
import CommonCard from '../../common/CommonCard';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import EMRAlert from '../../Utils/CustomAlert';

const schema = yup
    .object({
        selectedDrugValues: yup.object().required("Select Drug"),
        dose: yup.string().required("Select Dose"),
        doseunit: yup.string().required("Select Unit"),
        sig: yup.string().required("Select SIG"),
    })
    .required()
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
    const [prescriptionList, setPrescriptionList] = React.useState([]);
    const appContextValue = useContext(AppContext);

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {},
        mode: 'onChange',
        resolver: yupResolver(schema),
    })
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
                setFormData: (data) => {
                    setPrescriptionList(data)
                },
                submitFormmData: () => {
                    handleSubmit(addPrescriptionTollist)();
                }
            }
        },
        [prescriptionList],
    );

    // const prescriptionHandle = async (data) => {


    // }
    function clearPrescriptonFormData() {
        reset();
    }
    async function addPrescriptionTollist(data) {
        var obj = {
            drugid: data.selectedDrugValues.drugid,
            drugname: data.selectedDrugValues.drugname,
            dose: data.dose,
            doseunit: data.doseunit,
            sig: data.sig,
            startdate: data.startdate ? new Date(data.startdate) : null,
            endate: data.todate ? new Date(data.todate) : null,
            status: 1,
            clientid: appContextValue.selectedVisitDeatils.clientid.seqid,
            visitid: appContextValue.selectedVisitDeatils.visitid,
            capturedby: 1,
            instructions: data.instructions
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
    async function savePrescriptions() {
        var payLoad = {
            method: APIS.SAVE_PRESCRIPTIONS.METHOD,
            url: APIS.SAVE_PRESCRIPTIONS.URL,
            paramas: [],
            data: prescriptionList
        }
        let result = await sendRequest(payLoad);
        console.log(result);
        if (result) {
            EMRAlert.alertifySuccess("Vital data saved succussfully");
            props.refreshPrescriptionList();
        } else {
            EMRAlert.alertifyError("Not created");
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
                <form onSubmit={handleSubmit(data => addPrescriptionTollist(data, "isFrom"))} >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid container spacing={1}>
                            <Grid item xs={3} spacing={1} >
                                <FormControl variant="outlined" fullWidth>
                                    <Controller
                                        name="selectedDrugValues"
                                        control={control}
                                        render={({ field: { onChange } }) =>
                                            <Autocomplete
                                                size="small"
                                                onChange={(event, item) => {
                                                    onChange(item);
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
                                                renderInput={(params) => <TextField {...params} error={errors.selectedDrugValues?.message}
                                                    helperText={errors.selectedDrugValues?.message} label="Search Drug" />}
                                            />
                                        }
                                    />

                                </FormControl>

                            </Grid>
                            <Grid item xs={1} spacing={1} >
                                <Controller
                                    name="dose"
                                    control={control}
                                    render={({ field }) =>
                                        <TextField
                                            {...field}
                                            fullWidth
                                            type="text"
                                            size="small"
                                            variant="outlined"
                                            label={Translations.Prescriptions.dose}
                                            error={errors.dose?.message}
                                            helperText={errors.dose?.message}
                                        />
                                    }
                                />

                            </Grid>
                            <Grid item xs={1} spacing={1} >
                                <Controller
                                    name="doseunit"
                                    control={control}
                                    render={({ field }) =>
                                        <TextField
                                            {...field}
                                            fullWidth
                                            type="text"
                                            size="small"
                                            variant="outlined"
                                            label={Translations.Prescriptions.doseunit}
                                            error={errors.doseunit?.message}
                                            helperText={errors.doseunit?.message}
                                        />
                                    }
                                />
                            </Grid>
                            <Grid item xs={3} spacing={1} >
                                <Controller
                                    name="sig"
                                    control={control}
                                    render={({ field }) =>
                                        <TextField
                                            {...field}
                                            fullWidth
                                            type="text"
                                            size="small"
                                            variant="outlined"
                                            label={Translations.Prescriptions.sig}
                                            error={errors.sig?.message}
                                            helperText={errors.sig?.message}
                                        />
                                    }
                                />
                            </Grid>
                            <Grid item xs={2} spacing={1} >
                                <Controller
                                    name="startdate"
                                    control={control}
                                    render={({ field }) =>
                                        <DatePicker
                                            {...field}
                                            label={<span sx={{ marginTop: '-8px' }}>Start Date</span>}
                                            format="DD-MM-YYYY"
                                            fullWidth
                                            slotProps={{ textField: { size: 'small' } }}
                                            InputLabelProps={{
                                                style: { marginTop: '-8px' }
                                            }}
                                        />

                                    }
                                />
                            </Grid>
                            <Grid item xs={2} spacing={1} >
                                <Controller
                                    name="todate"
                                    control={control}
                                    render={({ field }) =>
                                        <DatePicker
                                            {...field}
                                            label="To Date"

                                            format="DD-MM-YYYY"
                                            fullWidth
                                            size="small"
                                            slotProps={{ textField: { size: 'small' } }}
                                            InputLabelProps={{
                                                style: { marginTop: '-8px' }
                                            }}
                                        />

                                    }
                                />

                            </Grid>
                            <Grid item xs={10} spacing={1} >
                                <Controller
                                    name="instructions"
                                    control={control}
                                    render={({ field }) =>
                                        <TextField
                                            {...field}
                                            fullWidth
                                            type="text"
                                            size="small"
                                            variant="outlined"
                                            multiline
                                            rows={3}
                                            label={"Instructions"}
                                            name={props.label}
                                            error={errors.instructions?.message}
                                            helperText={errors.instructions?.message}
                                        />
                                    }
                                />
                            </Grid>
                            <Grid item xs={2} spacing={1} >
                                <Button type="submit" color="primary" variant="contained">
                                    Add
                                </Button>
                            </Grid>
                            <Table size="small" aria-label="simple table" className='grid-height'>
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

                </form>
                {props.isActionButtonReq &&
                    <Box display="flex" justifyContent="flex-end" marginTop="5px" borderTop="2px solid #dee2e6;" >
                        <Box marginTop="5px"  >
                            <Button color="primary" variant="contained" onClick={() => { savePrescriptions() }}>
                                {"Save"}
                            </Button>
                            <Button color="secondary" variant="contained" onClick={() => { console.log("ss") }}>
                                {"Clear"}
                            </Button>
                        </Box>
                    </Box>
                }
            </CommonCard>

        </>
    )
});
export default Prescriptions;