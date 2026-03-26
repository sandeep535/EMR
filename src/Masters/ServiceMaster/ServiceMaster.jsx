import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, Chip } from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ListAltIcon from '@mui/icons-material/ListAlt';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';
import EMRAlert from '../../Utils/CustomAlert';
import ServiceMasterList from './ServiceMasterList';
import { ServiceCreationSchema } from '../../common/YupSchema/formSchema';
import SLTextField from '../../CoreComponents/SLTextField';
import SLRadioButton from '../../CoreComponents/SLRadioButton';
import SLButton from '../../CoreComponents/SLButton';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CommonConst from '../../Utils/CommonConst';

export default function ServiceMaster() {
    const [isEdit, setIsEdit] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { active: '1', gst: 0 },
        resolver: yupResolver(ServiceCreationSchema),
    });

    const onSubmit = async (data) => {
        const result = await sendRequest({
            method: APIS.SAVE_MASTER_DATA.METHOD,
            url: APIS.SAVE_MASTER_DATA.URL,
            paramas: [],
            data: {
                serviceid: data.serviceid || null,
                servicename: data.servicename,
                price: data.price,
                active: data.active,
                gst: data.gst,
            }
        });
        if (result) {
            EMRAlert.alertifySuccess('Service saved successfully');
            reset({ active: '1', gst: 0 });
            setIsEdit(false);
            setRefreshKey(k => k + 1);
        } else {
            EMRAlert.alertifyError('Not saved');
        }
    };

    function handleClear() {
        reset({ active: '1', gst: 0 });
        setIsEdit(false);
    }

    function openServiceEditmode(row) {
        reset(row);
        setIsEdit(true);
    }

    return (
        <Box sx={{ m: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Form */}
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MedicalServicesIcon sx={{ fontSize: 18, color: '#673AB7' }} />
                    <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                        {isEdit ? 'EDIT SERVICE' : 'ADD SERVICE'}
                    </Typography>
                    {isEdit && <Chip label="Editing" size="small" sx={{ bgcolor: '#ede7f6', color: '#673AB7', fontWeight: 600, fontSize: 11 }} />}
                </Box>
                <Box sx={{ p: 2 }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={3}>
                                <SLTextField name="servicename" label={Translations.SERVICE_MASTER.SERVICE_NAME}
                                    control={control} placeholder={Translations.SERVICE_MASTER.SERVICE_NAME}
                                    error={errors.servicename} />
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <SLTextField name="price" label={Translations.SERVICE_MASTER.PRICE}
                                    control={control} placeholder={Translations.SERVICE_MASTER.PRICE}
                                    error={errors.price} />
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <SLTextField name="gst" label={Translations.SERVICE_MASTER.GST}
                                    control={control} placeholder={Translations.SERVICE_MASTER.GST}
                                    error={errors.gst} />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <SLRadioButton name="active" label="Status" control={control}
                                    options={CommonConst.activeRadioButtonOptions} error={errors.active} />
                            </Grid>
                            <Grid item xs={12} sm={2} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                <SLButton variant="outlined" onClick={handleClear}
                                    sx={{ textTransform: 'none', borderColor: '#673AB7', color: '#673AB7' }}>Clear</SLButton>
                                <SLButton type="submit" variant="contained"
                                    sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#673AB7', '&:hover': { bgcolor: '#512DA8' } }}>
                                    {isEdit ? 'Update' : 'Save'}
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
                    <Typography variant="subtitle2" fontWeight={600} color="text.secondary">SERVICE LIST</Typography>
                </Box>
                <ServiceMasterList key={refreshKey} openServiceEditmode={(row) => openServiceEditmode(row)} />
            </Paper>

        </Box>
    );
}
