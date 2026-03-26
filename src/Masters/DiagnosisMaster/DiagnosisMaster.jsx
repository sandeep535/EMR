import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, FormControl, Chip } from '@mui/material';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import ListAltIcon from '@mui/icons-material/ListAlt';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';
import EMRAlert from '../../Utils/CustomAlert';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import SLTextField from '../../CoreComponents/SLTextField';
import SLRadioButton from '../../CoreComponents/SLRadioButton';
import SLButton from '../../CoreComponents/SLButton';
import { DiagnosisMasterSchema } from '../../common/YupSchema/formSchema';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CommonConst from '../../Utils/CommonConst';

const diagnosisListHeaders = [{
    name: Translations.DIAGNOSIS_MASTER.CODE_SET, datakey: 'dignosiscodeset.lookupvalue', width: '20%'
}, {
    name: Translations.DIAGNOSIS_MASTER.CODE, datakey: 'dignosiscode', width: '20%'
}, {
    name: Translations.DIAGNOSIS_MASTER.NAME, datakey: 'dignosisname', width: '35%'
}, {
    name: Translations.DIAGNOSIS_MASTER.STATUS, datakey: 'status', width: '10%',
    isChip: true, mappingData: { 1: 'Active', 2: 'In-active' }, chipColor: '#e8f5e9', chipTextColor: '#2e7d32'
}, {
    name: Translations.DIAGNOSIS_MASTER.ACTIONS, width: '10%', isActions: true,
    actions: [{ icon: 'edit', color: '#673AB7' }]
}];

const defaultobj = { name: '', code: '', codeset: {}, status: '1' };

export default function DiagnosisMaster() {
    const [codeSetOptions, setCodeSetOptions] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [totalcount, setTotalcount] = useState(0);
    const [isEdit, setIsEdit] = useState(false);

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: defaultobj,
        resolver: yupResolver(DiagnosisMasterSchema),
    });

    useEffect(() => { getLookUpDetails(); getMasterDataList(); }, []);

    async function getLookUpDetails() {
        const result = await sendRequest({ method: APIS.LOOKUP.METHOD, url: APIS.LOOKUP.URL, paramas: ['DIAGNOSISMASTERCODESET'] });
        if (result?.DIAGNOSISMASTERCODESET) setCodeSetOptions(result.DIAGNOSISMASTERCODESET);
    }

    async function getMasterDataList() {
        const result = await sendRequest({
            method: APIS.GET_DIADNOSIS_MASTER.METHOD, url: APIS.GET_DIADNOSIS_MASTER.URL, paramas: [],
            data: { pagenumber: 0, pagesize: 100, totalcount: 0, diagnosisMasterModel: [{ dignosiscodeset: null, dignosiscode: null, dignosisname: '', status: 1 }] }
        });
        setTableData(result?.diagnosisMasterModel || []);
        setTotalcount(result?.totalcount || 0);
    }

    const onSubmit = async (data) => {
        const result = await sendRequest({
            method: APIS.SAVE_DIADNOSIS_MASTER.METHOD, url: APIS.SAVE_DIADNOSIS_MASTER.URL, paramas: [],
            data: { dignosisid: null, dignosisname: data.name, status: data.status, dignosiscode: data.code, dignosiscodeset: data.codeset }
        });
        if (result) { EMRAlert.alertifySuccess('Diagnosis saved successfully'); reset(defaultobj); setIsEdit(false); getMasterDataList(); }
        else EMRAlert.alertifyError('Not saved');
    };

    return (
        <Box sx={{ m: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CoronavirusIcon sx={{ fontSize: 18, color: '#673AB7' }} />
                    <Typography variant="subtitle2" fontWeight={600} color="text.secondary">{isEdit ? 'EDIT DIAGNOSIS' : 'ADD DIAGNOSIS'}</Typography>
                    {isEdit && <Chip label="Editing" size="small" sx={{ bgcolor: '#ede7f6', color: '#673AB7', fontWeight: 600, fontSize: 11 }} />}
                </Box>
                <Box sx={{ p: 2 }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth>
                                    <AutocompleteField name="codeset" label={Translations.DIAGNOSIS_MASTER.CODE_SET} control={control}
                                        options={codeSetOptions} placeholder={Translations.DIAGNOSIS_MASTER.CODE_SET}
                                        mapvalues={{ id: 'lookupid', value: 'lookupvalue' }} isMultiSelect={false} id="codeset-combo" />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <SLTextField name="code" label={Translations.DIAGNOSIS_MASTER.CODE} control={control} placeholder={Translations.DIAGNOSIS_MASTER.CODE} error={errors.code} />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <SLTextField name="name" label={Translations.DIAGNOSIS_MASTER.NAME} control={control} placeholder={Translations.DIAGNOSIS_MASTER.NAME} error={errors.name} />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <SLRadioButton name="status" label="Status" control={control} options={CommonConst.activeRadioButtonOptions} error={errors.status} />
                            </Grid>
                            <Grid item xs={12} sm={2} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                <SLButton variant="outlined" onClick={() => { reset(defaultobj); setIsEdit(false); }}
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
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ListAltIcon sx={{ fontSize: 18, color: '#673AB7' }} />
                    <Typography variant="subtitle2" fontWeight={600} color="text.secondary">DIAGNOSIS LIST</Typography>
                    {tableData.length > 0 && <Chip label={tableData.length} size="small" sx={{ bgcolor: '#ede7f6', color: '#673AB7', fontWeight: 600 }} />}
                </Box>
                <CustomDataGrid tableHeaders={diagnosisListHeaders} tableData={tableData} totalcount={totalcount}
                    rowsPerPage={20} paginationChangeEvent={() => {}} triggerEvent={() => {}} />
            </Paper>
        </Box>
    );
}
