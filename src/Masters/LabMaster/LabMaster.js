import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Chip } from '@mui/material';
import BiotechIcon from '@mui/icons-material/Biotech';
import ListAltIcon from '@mui/icons-material/ListAlt';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';
import EMRAlert from '../../Utils/CustomAlert';
import SLTextField from '../../CoreComponents/SLTextField';
import SLRadioButton from '../../CoreComponents/SLRadioButton';
import SLButton from '../../CoreComponents/SLButton';
import LabMasterList from './LabMasterList';
import CommonConst from '../../Utils/CommonConst';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({ labname: yup.string().required('Lab name is required') }).required();
const defaultobj = { labname: '', status: '1' };

export default function LabMaster() {
    const [selectedData, setSelectedData] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: defaultobj,
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        if (selectedData) data.labid = selectedData.labid;
        const result = await sendRequest({ method: APIS.SAVE_LAB_MASTER.METHOD, url: APIS.SAVE_LAB_MASTER.URL, paramas: [], data });
        if (result) {
            EMRAlert.alertifySuccess('Lab saved successfully');
            reset(defaultobj); setSelectedData(null); setRefreshKey(k => k + 1);
        } else EMRAlert.alertifyError('Not saved');
    };

    function setDataToform(row) {
        setValue('labname', row.labname, { shouldTouch: true, shouldDirty: true });
        setValue('status', String(row.status), { shouldTouch: true, shouldDirty: true });
        setSelectedData(row);
    }

    return (
        <Box sx={{ m: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BiotechIcon sx={{ fontSize: 18, color: '#673AB7' }} />
                    <Typography variant="subtitle2" fontWeight={600} color="text.secondary">{selectedData ? 'EDIT LAB' : 'ADD LAB'}</Typography>
                    {selectedData && <Chip label="Editing" size="small" sx={{ bgcolor: '#ede7f6', color: '#673AB7', fontWeight: 600, fontSize: 11 }} />}
                </Box>
                <Box sx={{ p: 2 }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={4}>
                                <SLTextField name="labname" label={Translations.LAB_MASTER.NAME} control={control}
                                    placeholder={Translations.LAB_MASTER.NAME} error={errors.labname} />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <SLRadioButton name="status" label="Status" control={control} options={CommonConst.activeRadioButtonOptions} />
                            </Grid>
                            <Grid item xs={12} sm={3} sx={{ display: 'flex', gap: 1 }}>
                                <SLButton variant="outlined" onClick={() => { reset(defaultobj); setSelectedData(null); }}
                                    sx={{ textTransform: 'none', borderColor: '#673AB7', color: '#673AB7' }}>Clear</SLButton>
                                <SLButton type="submit" variant="contained"
                                    sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#673AB7', '&:hover': { bgcolor: '#512DA8' } }}>
                                    {selectedData ? 'Update' : 'Save'}
                                </SLButton>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Paper>
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ListAltIcon sx={{ fontSize: 18, color: '#673AB7' }} />
                    <Typography variant="subtitle2" fontWeight={600} color="text.secondary">LAB LIST</Typography>
                </Box>
                <LabMasterList key={refreshKey} openEditmode={(row) => setDataToform(row)} />
            </Paper>
        </Box>
    );
}
