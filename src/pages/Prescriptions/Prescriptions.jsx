import React, { useEffect, forwardRef, useImperativeHandle, useContext } from 'react';
import { Box, Paper, Typography, Grid, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, IconButton, Tooltip, Chip, TextField } from '@mui/material';
import MedicationIcon from '@mui/icons-material/Medication';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { sendRequest } from '../global/DataManager';
import APIS from '../../Utils/APIS';
import AppContext from '../../components/Context/AppContext';
import Translations from '../../resources/translations';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Moment from 'react-moment';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import EMRAlert from '../../Utils/CustomAlert';
import dayjs from 'dayjs';
import moment from 'moment';
import { PrescriptionSchema } from '../../common/YupSchema/formSchema';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import SLTextField from '../../CoreComponents/SLTextField';
import SLDatePicker from '../../CoreComponents/SLDatePicker';
import SLButton from '../../CoreComponents/SLButton';

const defaultValues = {
    selectedDrugValues: null,
    startdate: dayjs(moment(new Date()).format('YYYY-MM-DD')),
    todate: dayjs(moment(new Date()).format('YYYY-MM-DD')),
    dose: '', doseunit: '', instructions: '', sig: ''
};

const Prescriptions = forwardRef((props, ref) => {
    const [drugListOptions, setDrugListOptions] = React.useState([]);
    const [prescriptionList, setPrescriptionList] = React.useState([]);
    const appContextValue = useContext(AppContext);

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(PrescriptionSchema),
    });

    useEffect(() => { getDrugMasterData('a'); }, []);

    useImperativeHandle(ref, () => ({
        getFormData: () => ({ prescriptionList }),
        setFormData: (data) => setPrescriptionList(data),
        submitFormmData: () => { handleSubmit(addPrescriptionTollist)(); }
    }));

    async function getDrugMasterData(newValue) {
        const result = await sendRequest({
            method: APIS.GET_DRUG_MASTER_DATA.METHOD,
            url: APIS.GET_DRUG_MASTER_DATA.URL,
            paramas: [newValue]
        });
        if (result) setDrugListOptions(result);
    }

    async function addPrescriptionTollist(data) {
        const obj = {
            drugid: data.selectedDrugValues?.drugid,
            drugname: data.selectedDrugValues?.drugname,
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
        };
        setPrescriptionList(prev => [...prev, obj]);
        reset(defaultValues);
    }

    async function savePrescriptions() {
        const result = await sendRequest({
            method: APIS.SAVE_PRESCRIPTIONS.METHOD,
            url: APIS.SAVE_PRESCRIPTIONS.URL,
            paramas: [],
            data: prescriptionList
        });
        if (result) { EMRAlert.alertifySuccess('Prescriptions saved successfully'); props.refreshPrescriptionList?.(); }
        else EMRAlert.alertifyError('Not saved');
    }

    return (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
                <MedicationIcon sx={{ fontSize: 18, color: '#673AB7' }} />
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary">PRESCRIPTIONS</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <form onSubmit={handleSubmit(addPrescriptionTollist)}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>
                                <AutocompleteField
                                    name="selectedDrugValues"
                                    label={Translations.Prescriptions.searchDrug}
                                    control={control}
                                    options={drugListOptions}
                                    placeholder={Translations.Prescriptions.searchDrug}
                                    mapvalues={{ id: 'drugcode', value: 'drugname' }}
                                    isMultiSelect={false}
                                    id="drug-combo"
                                    error={errors.selectedDrugValues}
                                    onchangeEventCallBack={(data) => {
                                        if (!data) return;
                                        setValue('instructions', data.defaultInstruction || '');
                                        setValue('sig', data.sig || '');
                                        setValue('doseunit', data.drugunit?.masterdatavalue || '');
                                        setValue('dose', data.drugform?.masterdatavalue || '');
                                    }}
                                    onInputChange={(data) => { if (data.length > 2) getDrugMasterData(data); }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={1}>
                                <SLTextField name="dose" label={Translations.Prescriptions.dose} control={control} placeholder={Translations.Prescriptions.dose} />
                            </Grid>
                            <Grid item xs={6} sm={1}>
                                <SLTextField name="doseunit" label={Translations.Prescriptions.doseunit} control={control} placeholder={Translations.Prescriptions.doseunit} />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <SLTextField name="sig" label={Translations.Prescriptions.sig} control={control} placeholder={Translations.Prescriptions.sig} />
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <SLDatePicker name="startdate" label={Translations.Prescriptions.startDate} control={control} error={errors.startdate} />
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <SLDatePicker name="todate" label={Translations.Prescriptions.endDate} control={control} error={errors.todate} />
                            </Grid>
                            <Grid item xs={12} sm={10}>
                                <Controller name="instructions" control={control}
                                    render={({ field }) => (
                                        <TextField {...field} fullWidth size="small" variant="outlined" multiline rows={2}
                                            label="Instructions"
                                            error={!!errors.instructions?.message}
                                            helperText={errors.instructions?.message}
                                            sx={{ '& .MuiOutlinedInput-root': { fontSize: 13, '&.Mui-focused fieldset': { borderColor: '#673AB7' } } }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <SLButton type="submit" variant="contained" fullWidth
                                    sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#673AB7', '&:hover': { bgcolor: '#512DA8' } }}>
                                    Add
                                </SLButton>
                            </Grid>
                        </Grid>
                    </form>

                    {/* Staging table */}
                    {prescriptionList.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="caption" fontWeight={600} color="text.secondary">ADDED PRESCRIPTIONS</Typography>
                                <Chip label={prescriptionList.length} size="small" sx={{ bgcolor: '#ede7f6', color: '#673AB7', fontWeight: 600 }} />
                            </Box>
                            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#673AB7' }}>
                                            {['Drug', 'Dose', 'SIG', 'Start Date', 'End Date', ''].map((h, i) => (
                                                <TableCell key={i} sx={{ color: '#fff', fontWeight: 700, fontSize: 12, py: 1 }}>{h}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {prescriptionList.map((p, i) => (
                                            <TableRow key={i} hover sx={{ bgcolor: i % 2 === 0 ? '#fff' : '#f9f6ff', '&:last-child td': { border: 0 } }}>
                                                <TableCell sx={{ fontSize: 12 }}>{p.drugname}</TableCell>
                                                <TableCell sx={{ fontSize: 12 }}>{p.dose} {p.doseunit}</TableCell>
                                                <TableCell sx={{ fontSize: 12 }}>{p.sig}</TableCell>
                                                <TableCell sx={{ fontSize: 12 }}>{p.startdate ? <Moment format="DD-MMM-YYYY">{new Date(p.startdate)}</Moment> : '-'}</TableCell>
                                                <TableCell sx={{ fontSize: 12 }}>{p.endate ? <Moment format="DD-MMM-YYYY">{new Date(p.endate)}</Moment> : '-'}</TableCell>
                                                <TableCell>
                                                    <Tooltip title="Remove">
                                                        <IconButton size="small" onClick={() => setPrescriptionList(prev => prev.filter((_, idx) => idx !== i))}>
                                                            <DeleteOutlineIcon sx={{ fontSize: 16, color: '#e53935' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                    {props.isActionButtonReq && prescriptionList.length > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                            <SLButton variant="outlined" onClick={() => setPrescriptionList([])}
                                sx={{ textTransform: 'none', borderColor: '#673AB7', color: '#673AB7' }}>Clear</SLButton>
                            <SLButton variant="contained" onClick={savePrescriptions}
                                sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#673AB7', '&:hover': { bgcolor: '#512DA8' } }}>Save</SLButton>
                        </Box>
                    )}
                </LocalizationProvider>
            </Box>
        </Paper>
    );
});

Prescriptions.displayName = 'Prescriptions';
export default Prescriptions;
