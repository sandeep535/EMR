import React, { useState, useContext, forwardRef, useImperativeHandle } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import AppContext from '../../components/Context/AppContext';
import Translations from '../../resources/translations';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../global/DataManager';
import EMRAlert from '../../Utils/CustomAlert';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { VitalsSchema } from '../../common/YupSchema/formSchema';
import SLTextField from '../../CoreComponents/SLTextField';
import SLButton from '../../CoreComponents/SLButton';

const defaultValues = { height: '', weight: '', bmi: '', systolic: '', diastolic: '', pulse: '', respiratoryrate: '', temperature: '' };

const Vitals = forwardRef((props, ref) => {
    const [vitalformData, setVitalformData] = useState('');
    const [vitalid, setVitalId] = useState('');
    const appContextValue = useContext(AppContext);

    const { control, handleSubmit, setValue, getValues, watch, reset, formState: { errors } } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(VitalsSchema),
    });

    const watchheight = watch('height');
    const watchweight = watch('weight');

    React.useEffect(() => {
        if (watchweight && watchheight) {
            const bmi = (watchweight / (watchheight * watchheight)).toFixed(2);
            setValue('bmi', bmi);
        }
    }, [watchweight, watchheight]);

    useImperativeHandle(ref, () => ({
        getFormData: () => ({ vitalformData, vitalid }),
        setFormData: (data) => {
            setVitalId(data.vitalid);
            Object.keys(defaultValues).forEach(k => setValue(k, data[k]));
        },
        submitFormmData: () => { handleSubmit(vitalHandle)(); }
    }));

    const vitalHandle = async (data) => {
        setVitalformData(data);
        if (!props.isActionButtonReq) return; // VisitActivity collects via getFormData
        const payload = {
            vitalid: vitalid || null,
            visitid: appContextValue.selectedVisitDeatils.visitid,
            clientid: appContextValue.selectedVisitDeatils.clientid.seqid,
            ...data, capturedby: 1
        };
        const result = await sendRequest({ method: APIS.SAVE_VITALS.METHOD, url: APIS.SAVE_VITALS.URL, paramas: [], data: payload });
        if (result) { EMRAlert.alertifySuccess('Vitals saved successfully'); props.refreshVitalsList?.(); }
        else EMRAlert.alertifyError('Not saved');
    };

    const fields = [
        { name: 'height', label: Translations.vitalsForm.height, xs: 2 },
        { name: 'weight', label: Translations.vitalsForm.weight, xs: 2 },
        { name: 'bmi', label: Translations.vitalsForm.bmi, xs: 2 },
        { name: 'systolic', label: Translations.vitalsForm.systolic, xs: 2 },
        { name: 'diastolic', label: Translations.vitalsForm.diastolic, xs: 2 },
        { name: 'pulse', label: Translations.vitalsForm.pulse, xs: 2 },
        { name: 'respiratoryrate', label: Translations.vitalsForm.respiratoryrate, xs: 3 },
        { name: 'temperature', label: Translations.vitalsForm.temperature, xs: 2 },
    ];

    return (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
                <MonitorHeartIcon sx={{ fontSize: 18, color: '#673AB7' }} />
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary">VITALS</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
                <form onSubmit={handleSubmit(vitalHandle)}>
                    <Grid container spacing={2}>
                        {fields.map(f => (
                            <Grid item xs={12} sm={f.xs} key={f.name}>
                                <SLTextField name={f.name} label={f.label} control={control} placeholder={f.label} error={errors[f.name]} />
                            </Grid>
                        ))}
                        {props.isActionButtonReq && (
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                                <SLButton variant="outlined" onClick={() => reset(defaultValues)}
                                    sx={{ textTransform: 'none', borderColor: '#673AB7', color: '#673AB7' }}>Clear</SLButton>
                                <SLButton type="submit" variant="contained"
                                    sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#673AB7', '&:hover': { bgcolor: '#512DA8' } }}>Save</SLButton>
                            </Grid>
                        )}
                    </Grid>
                </form>
            </Box>
        </Paper>
    );
});

Vitals.displayName = 'Vitals';
export default Vitals;
