import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, FormControl } from '@mui/material';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import Translations from '../../resources/translations';
import { DiagnosisSchema } from '../../common/YupSchema/formSchema';

const Diagnosis = forwardRef((props, ref) => {
    const [description, setDescription] = useState('');
    const data1 = props.data?.dignosismasterid;
    const [diagnosisMasterData, setDiagnosisMasterData] = useState(data1 ? [data1] : []);

    const { control, handleSubmit, setValue } = useForm({
        mode: 'onChange',
        defaultValues: { selectedDiagnosisValues: '' },
        resolver: yupResolver(DiagnosisSchema),
    });

    useEffect(() => {
        if (data1) setDiagnosisMasterData([data1]);
    }, [props.data]);

    async function getDiagnosisMasterData(newInputValue) {
        const result = await sendRequest({
            method: APIS.GET_DIADNOSIS_MASTER.METHOD,
            url: APIS.GET_DIADNOSIS_MASTER.URL,
            paramas: [],
            data: {
                pagenumber: 0, pagesize: 100, totalcount: 0,
                diagnosisMasterModel: [{ dignosiscodeset: null, dignosiscode: null, dignosisname: newInputValue, status: 1 }]
            }
        });
        setDiagnosisMasterData(result?.diagnosisMasterModel || []);
    }

    useImperativeHandle(ref, () => ({
        getFormData: () => ({ description }),
        setFormData: (data) => {
            if (data) setValue('selectedDiagnosisValues', data, { shouldTouch: true, shouldDirty: true });
        },
        submitFormmData: () => { handleSubmit(diagnosisHandle)(); }
    }), [description]);

    const diagnosisHandle = (data) => setDescription(data.selectedDiagnosisValues);

    return (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
                <CoronavirusIcon sx={{ fontSize: 18, color: '#673AB7' }} />
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                    {props.label || 'DIAGNOSIS'}
                </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
                <form onSubmit={handleSubmit(diagnosisHandle)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <AutocompleteField
                                    name="selectedDiagnosisValues"
                                    label={Translations.LAB_ORDER.DID_TITLE}
                                    control={control}
                                    isMultiSelect={false}
                                    options={diagnosisMasterData}
                                    placeholder={Translations.LAB_ORDER.DID_TITLE}
                                    mapvalues={{ id: 'dignosisid', value: 'dignosisname' }}
                                    id="diagnosis-combo"
                                    onInputChange={(data) => { if (data?.length > 1) getDiagnosisMasterData(data); }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Paper>
    );
});

Diagnosis.displayName = 'Diagnosis';
export default Diagnosis;
