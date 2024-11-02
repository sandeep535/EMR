import React, { useEffect, forwardRef, useImperativeHandle, useContext } from 'react';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid';
import { sendRequest } from '../global/DataManager';
import Button from '@mui/material/Button';
import APIS from '../../Utils/APIS';
import AppContext from '../../components/Context/AppContext';
import Translations from '../../resources/translations';
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
import EMRAlert from '../../Utils/CustomAlert';
import dayjs from 'dayjs';
import moment from 'moment';
import { PrescriptionSchema } from '../../common/YupSchema/formSchema';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import SLTextField from '../../CoreComponents/SLTextField';
import SLDatePicker from '../../CoreComponents/SLDatePicker';


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
    const [prescriptionList, setPrescriptionList] = React.useState([]);
    const appContextValue = useContext(AppContext);

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            startdate: dayjs(moment(new Date()).format("YYYY-MM-DD")),
            todate: dayjs(moment(new Date()).format("YYYY-MM-DD")),
            dose: ' ',
            doseunit: ' ',
            instructions: ' ',
            sig: ' '
        },
        mode: 'onChange',
        resolver: yupResolver(PrescriptionSchema),
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
                                <AutocompleteField
                                    name="selectedDrugValues"
                                    label={Translations.Prescriptions.searchDrug}
                                    control={control}
                                    options={drugListOptions}
                                    placeholder={Translations.Prescriptions.searchDrug}
                                    mapvalues={{ id: "drugcode", value: 'drugname' }}
                                    isMultiSelect={false}
                                    id={"drug-controllable-states-demo"}
                                    onchangeEventCallBack={(data) => {
                                        setValue("instructions", data.defaultInstruction);
                                        setValue("sig", data.sig)
                                        setValue("doseunit", data.drugunit ? data.drugunit.masterdatavalue:"", { shouldTouch: true, shouldDirty: true });
                                        setValue("dose", data.drugform ? data.drugform.masterdatavalue:'', { shouldTouch: true, shouldDirty: true });
                                    }}
                                    onInputChange={(data) => {
                                        if (data.length > 2) {
                                            getDrugMasterData(data)
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={1} spacing={1} >
                                <SLTextField
                                    name="dose"
                                    label={Translations.Prescriptions.dose}
                                    control={control}
                                    placeholder={Translations.Prescriptions.dose}
                                />
                            </Grid>
                            <Grid item xs={1} spacing={1} >
                                <SLTextField
                                    name="doseunit"
                                    label={Translations.Prescriptions.doseunit}
                                    control={control}
                                    placeholder={Translations.Prescriptions.doseunit}
                                />
                            </Grid>
                            <Grid item xs={3} spacing={1} >
                                <SLTextField
                                    name="sig"
                                    label={Translations.Prescriptions.sig}
                                    control={control}
                                    placeholder={Translations.Prescriptions.sig}
                                />
                            </Grid>
                            <Grid item xs={2} spacing={1} >
                                <SLDatePicker
                                    name="startdate"
                                    label={Translations.Prescriptions.startDate}
                                    control={control}
                                    error={errors.startdate}
                                />

                            </Grid>
                            <Grid item xs={2} spacing={1} >
                                <SLDatePicker
                                    name="todate"
                                    label={Translations.Prescriptions.endDate}
                                    control={control}
                                    error={errors.todate}
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
                                                <TableCell key ={Math.random()} width={header.width}>{header.name}</TableCell>
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
                            <Button color="secondary" variant="contained" >
                                {"Clear"}
                            </Button>
                        </Box>
                    </Box>
                }
            </CommonCard>

        </>
    )
});
Prescriptions.displayName="Prescriptions";
export default Prescriptions;