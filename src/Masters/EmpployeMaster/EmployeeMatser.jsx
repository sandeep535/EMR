import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, FormControl, Chip } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import ListAltIcon from '@mui/icons-material/ListAlt';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import RegistrationInformation from '../../components/RegistrationInformation/RegistrationInformation';
import Translations from '../../resources/translations';
import EMRAlert from '../../Utils/CustomAlert';
import EmployeeMasterList from './EmployeeMasterList';
import { useForm } from 'react-hook-form';
import { EmployeeCreationSchema } from '../../common/YupSchema/formSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import SLTextField from '../../CoreComponents/SLTextField';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import SLRadioButton from '../../CoreComponents/SLRadioButton';
import SLButton from '../../CoreComponents/SLButton';
import CommonConst from '../../Utils/CommonConst';
import dayjs from 'dayjs';
import moment from 'moment';

export default function EmployeeMaster() {
    const [rolesList, setRolesList] = useState([]);
    const [specialityListOptions, setSpecialityListOptions] = useState([]);
    const [isEdit, setIsEdit] = useState(false);

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: { status: '1' },
        resolver: yupResolver(EmployeeCreationSchema),
    });

    useEffect(() => { getRoleMasterData(); getLookUpDetails(); }, []);

    async function getRoleMasterData() {
        const result = await sendRequest({ method: APIS.GET_MASTER_DATA_BASED_ON_CODE.METHOD, url: APIS.GET_MASTER_DATA_BASED_ON_CODE.URL, paramas: ['ROLE'] });
        if (result) setRolesList(result);
    }

    async function getLookUpDetails() {
        const result = await sendRequest({ method: APIS.LOOKUP.METHOD, url: APIS.LOOKUP.URL, paramas: ['SPECILAITY'] });
        if (result?.SPECILAITY) setSpecialityListOptions(result.SPECILAITY);
    }

    async function saveData(data) {
        const result = await sendRequest({ method: APIS.EMP_REGISTRATION.METHOD, url: APIS.EMP_REGISTRATION.URL, paramas: [], data });
        if (result) {
            EMRAlert.alertifySuccess('Employee saved successfully');
            reset({ status: '1' });
            setIsEdit(false);
        } else {
            EMRAlert.alertifyError('Not saved');
        }
    }

    const onSubmit = (data) => {
        saveData({
            id: data.id || null,
            firstname: data.firstname, lastname: data.lastname,
            username: data.username, password: data.password,
            title: data.title, designation: data.designation,
            gender: data.gender, role: data.role,
            age: data.age, dob: new Date(data.dob),
            mail: data.email, mobilenumber: data.contact,
            specilaity: data.specilaity,
        });
    };

    function setDatatoEditMode(row) {
        row.dob = dayjs(moment(new Date()).format('YYYY-MM-DD'));
        row.contact = row.mobilenumber;
        row.email = row.mail;
        reset(row);
        setIsEdit(true);
    }

    function handleClear() {
        reset({ status: '1' });
        setIsEdit(false);
    }

    return (
        <Box sx={{ m: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Form */}
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BadgeIcon sx={{ fontSize: 18, color: '#673AB7' }} />
                    <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                        {isEdit ? 'EDIT EMPLOYEE' : 'ADD EMPLOYEE'}
                    </Typography>
                    {isEdit && <Chip label="Editing" size="small" sx={{ bgcolor: '#ede7f6', color: '#673AB7', fontWeight: 600, fontSize: 11 }} />}
                </Box>
                <Box sx={{ p: 2 }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            {/* Patient info fields */}
                            <Grid item xs={12}>
                                <RegistrationInformation control={control} errors={errors} setValue={setValue} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <SLTextField name="username" label={Translations.employeeRegistration.username} control={control} placeholder={Translations.employeeRegistration.username} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <SLTextField name="password" type="password" label={Translations.employeeRegistration.password} control={control} placeholder={Translations.employeeRegistration.password} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <AutocompleteField name="role" label={Translations.employeeRegistration.role} control={control}
                                        options={rolesList} placeholder={Translations.employeeRegistration.role}
                                        mapvalues={{ id: 'id', value: 'masterdatavalue' }} isMultiSelect={false} id="role-combo"
                                        error={errors.role} />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <AutocompleteField name="specilaity" label={Translations.employeeRegistration.speciality} control={control}
                                        options={specialityListOptions} placeholder={Translations.employeeRegistration.speciality}
                                        mapvalues={{ id: 'lookupid', value: 'lookupvalue' }} isMultiSelect={false} id="speciality-combo"
                                        error={errors.specilaity} />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <SLRadioButton name="status" label="Status" control={control}
                                    options={CommonConst.activeRadioButtonOptions} error={errors.status} />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <SLButton variant="outlined" onClick={handleClear}
                                    sx={{ textTransform: 'none', borderColor: '#673AB7', color: '#673AB7' }}>Clear</SLButton>
                                <SLButton type="submit" variant="contained"
                                    sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#673AB7', '&:hover': { bgcolor: '#512DA8' } }}>
                                    {isEdit ? 'Update' : 'Register'}
                                </SLButton>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Paper>

            {/* List */}
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ListAltIcon sx={{ fontSize: 18, color: '#673AB7' }} />
                    <Typography variant="subtitle2" fontWeight={600} color="text.secondary">EMPLOYEE LIST</Typography>
                </Box>
                <EmployeeMasterList openEditmode={(row) => setDatatoEditMode(row)} />
            </Paper>

        </Box>
    );
}
