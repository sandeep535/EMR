import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
    Box, Grid, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Chip, Divider, FormControl, FormHelperText
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AppContext from '../../components/Context/AppContext';
import CommonCard from '../../common/CommonCard';
import SLTextField from '../../CoreComponents/SLTextField';
import SLButton from '../../CoreComponents/SLButton';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import { sendRequest } from '../global/DataManager';
import APIS from '../../Utils/APIS';
import EMRAlert from '../../Utils/CustomAlert';
import dayjs from 'dayjs';

const schema = yup.object({
    dischargeDate: yup.mixed().required('Discharge date & time is required'),
    dischargeRemarks: yup.string().required('Remarks are required'),
    doctor: yup.mixed().required('Doctor is required'),
});

const tableHeaders = ['Visit ID', 'Discharge Date & Time', 'Doctor', 'Remarks', 'Status'];

export default function Discharge() {
    const { selectedVisitDeatils } = useContext(AppContext);
    const patientId = selectedVisitDeatils?.clientid?.seqid;
    const visitId = selectedVisitDeatils?.visitid;

    const [dischargeList, setDischargeList] = useState([]);
    const [doctorOptions, setDoctorOptions] = useState([]);
    const [existingDischarge, setExistingDischarge] = useState(null);

    const { handleSubmit, control, reset, getValues, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { dischargeDate: dayjs(), dischargeRemarks: '', doctor: null },
    });

    useEffect(() => {
        if (patientId) fetchDischargeHistory();
        if (visitId) fetchDischargeByVisit();
    }, [patientId, visitId]);

    const getDoctorsData = async (value) => {
        if (!value) return;
        const specility = getValues('specility')?.lookupid ?? null;
        const result = await sendRequest({
            method: APIS.GET_EMPLOYES_BASED_ON_NAME.METHOD,
            url: APIS.GET_EMPLOYES_BASED_ON_NAME.URL,
            paramas: [value],
        });
        if (result) setDoctorOptions(result);
    };

    const fetchDischargeHistory = async () => {
        const result = await sendRequest({
            method: APIS.GET_DISCHARGE_BY_PATIENT.METHOD,
            url: APIS.GET_DISCHARGE_BY_PATIENT.URL,
            paramas: [patientId],
        });
        if (result) setDischargeList(result);
    };

    const fetchDischargeByVisit = async () => {
        const result = await sendRequest({
            method: APIS.GET_DISCHARGE_BY_VISIT.METHOD,
            url: APIS.GET_DISCHARGE_BY_VISIT.URL,
            paramas: [visitId],
        });
        if (result) {
            setExistingDischarge(result);
            reset({
                dischargeDate: result.dischargeDate ? dayjs(result.dischargeDate) : dayjs(),
                dischargeRemarks: result.dischargeRemarks || '',
                doctor: result.doctor || null,
            });
        }
    };

    const onSubmit = async (data) => {
        const payload = {
            patientId,
            visitId,
            dischargeDate: data.dischargeDate ? new Date(data.dischargeDate).toISOString() : null,
            dischargeByDoctorId: data.doctor?.id,
            dischargeBy: patientId,
            dischargeRemarks: data.dischargeRemarks,
        };
        const result = await sendRequest({
            method: APIS.SAVE_DISCHARGE.METHOD,
            url: APIS.SAVE_DISCHARGE.URL,
            paramas: [],
            data: payload,
        });
        if (result) {
            EMRAlert.alertifySuccess('Discharge saved successfully');
            fetchDischargeHistory();
            fetchDischargeByVisit();
        } else {
            EMRAlert.alertifyError('Failed to save discharge');
        }
    };

    const handleClear = useCallback(() => {
        reset({ dischargeDate: dayjs(), dischargeRemarks: '', doctor: null });
        setExistingDischarge(null);
    }, [reset]);

    return (
        <Box sx={{ m: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Discharge Form */}
            <CommonCard title="Discharge">
                {existingDischarge && (
                    <Chip label="Already Discharged" color="warning" size="small" sx={{ mb: 2 }} />
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>

                        {/* Discharge Date Time */}
                        <Grid item xs={12} sm={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <FormControl fullWidth error={!!errors.dischargeDate}>
                                    <Controller
                                        name="dischargeDate"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <DateTimePicker
                                                label="Discharge Date & Time *"
                                                value={value}
                                                onChange={onChange}
                                                format="DD-MM-YYYY HH:mm"
                                                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                            />
                                        )}
                                    />
                                    {errors.dischargeDate && (
                                        <FormHelperText>{errors.dischargeDate.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </LocalizationProvider>
                        </Grid>

                        {/* Doctor Autocomplete — same pattern as VisitCreation */}
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <AutocompleteField
                                    name="doctor"
                                    label="Discharge Doctor *"
                                    control={control}
                                    options={doctorOptions}
                                    mapvalues={{ id: 'id', value: ['firstname', 'lastname'] }}
                                    isMultiSelect={false}
                                    id="discharge-doctor-combo"
                                    onInputChange={(data) => getDoctorsData(data)}
                                    error={errors.doctor}
                                />
                            </FormControl>
                        </Grid>

                        {/* Remarks */}
                        <Grid item xs={12} sm={4}>
                            <SLTextField
                                name="dischargeRemarks"
                                label="Remarks *"
                                control={control}
                                fullWidth
                                error={errors.dischargeRemarks}
                            />
                        </Grid>

                        <Grid item xs={12} display="flex" justifyContent="flex-end" gap={1}>
                            <SLButton variant="outlined" onClick={handleClear}>Clear</SLButton>
                            <SLButton type="submit" variant="contained">
                                {existingDischarge ? 'Update Discharge' : 'Save Discharge'}
                            </SLButton>
                        </Grid>
                    </Grid>
                </form>
            </CommonCard>

            <Divider />

            {/* Discharge History */}
            <CommonCard title="Discharge History">
                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                        <TableHead sx={{ bgcolor: 'primary.main' }}>
                            <TableRow>
                                {tableHeaders.map((h) => (
                                    <TableCell key={h} sx={{ color: 'white' }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dischargeList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography variant="body2" color="text.secondary" py={2}>
                                            No discharge records found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                dischargeList.map((row, i) => (
                                    <TableRow key={i} hover>
                                        <TableCell>{row.visitId}</TableCell>
                                        <TableCell>
                                            {row.dischargeDate
                                                ? dayjs(row.dischargeDate).format('DD-MM-YYYY HH:mm')
                                                : '-'}
                                        </TableCell>
                                        <TableCell>
                                            {row.doctorName || `${row.doctorFirstname || ''} ${row.doctorLastname || ''}`.trim() || row.dischargeByDoctorId}
                                        </TableCell>
                                        <TableCell>{row.dischargeRemarks}</TableCell>
                                        <TableCell>
                                            <Chip label="Discharged" color="success" size="small" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CommonCard>
        </Box>
    );
}
