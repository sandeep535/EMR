import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, FormControl } from '@mui/material';
import BiotechIcon from '@mui/icons-material/Biotech';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import Translations from '../../resources/translations';
import { LabordersSchema } from '../../common/YupSchema/formSchema';

const LabOrder = forwardRef((props, ref) => {
    const [description, setDescription] = useState('');
    const [labOrderMasterData, setLabOrderMasterData] = useState(props.data || []);

    const { control, handleSubmit, setValue, watch } = useForm({
        mode: 'onChange',
        defaultValues: { selectedLabOrder: [] },
        resolver: yupResolver(LabordersSchema),
    });

    useEffect(() => {
        if (props.data) setLabOrderMasterData(props.data);
    }, [props.data]);

    async function getLabOrderMasterData() {
        const result = await sendRequest({
            method: APIS.GET_LAB_MASTER_LIST.METHOD,
            url: APIS.GET_LAB_MASTER_LIST.URL,
            paramas: [],
            data: { pagenumber: 0, pagesize: 100, totalcount: 0, labMasterModel: [{ labname: '', status: 1 }] }
        });
        if (result?.labMasterModel) setLabOrderMasterData(result.labMasterModel);
        else setLabOrderMasterData([]);
    }

    useImperativeHandle(ref, () => ({
        getFormData: () => ({ description }),
        setFormData: (data) => {
            setLabOrderMasterData(data);
            setValue('selectedLabOrder', data, { shouldTouch: true, shouldDirty: true });
        },
        submitFormmData: () => { handleSubmit(labOrderisHandle)(); }
    }), [description]);

    const labOrderisHandle = (data) => {
        setDescription(data.selectedLabOrder);
        if (props.sendDataToParent) props.sendDataToParent(data);
    };

    return (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
                <BiotechIcon sx={{ fontSize: 18, color: '#673AB7' }} />
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                    {props.label || 'LAB ORDERS'}
                </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
                <form onSubmit={handleSubmit(labOrderisHandle)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <AutocompleteField
                                    name="selectedLabOrder"
                                    label={Translations.LAB_ORDER.TITLE}
                                    control={control}
                                    isMultiSelect={true}
                                    options={labOrderMasterData}
                                    placeholder={Translations.LAB_ORDER.TITLE}
                                    mapvalues={{ id: 'labid', value: 'labname' }}
                                    id="lab-combo"
                                    onInputChange={(data) => { if (data?.length > 1) getLabOrderMasterData(data); }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Paper>
    );
});

LabOrder.displayName = 'LabOrder';
export default LabOrder;
