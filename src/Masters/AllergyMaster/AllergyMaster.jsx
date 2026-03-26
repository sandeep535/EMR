import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, FormControl, Chip, Tooltip, IconButton } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';
import EMRAlert from '../../Utils/CustomAlert';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import SLTextField from '../../CoreComponents/SLTextField';
import SLRadioButton from '../../CoreComponents/SLRadioButton';
import SLButton from '../../CoreComponents/SLButton';
import { AllergyNewMasterSchema, AllergySearchMasterSchema } from '../../common/YupSchema/formSchema';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CommonConst from '../../Utils/CommonConst';

const allergiesListHeaders = [{
    name: Translations.ALLERGY_MASTER.ALLERGY_TYPE, datakey: 'allergytype.lookupvalue', width: '20%'
}, {
    name: Translations.ALLERGY_MASTER.ALLERGY_CODE, datakey: 'allergycode', width: '20%'
}, {
    name: Translations.ALLERGY_MASTER.ALLERGY_NAME, datakey: 'allergyname', width: '35%'
}, {
    name: Translations.ALLERGY_MASTER.STATUS, datakey: 'status', width: '10%',
    isChip: true, mappingData: { 1: 'Active', 2: 'In-active' }, chipColor: '#e8f5e9', chipTextColor: '#2e7d32'
}, {
    name: Translations.ALLERGY_MASTER.ACTIONS, width: '10%', isActions: true,
    actions: [{ icon: 'edit', color: '#673AB7' }]
}];

export default function AllergyMaster() {
    const [allergiesTypeCombo, setAllergiesTypeCombo] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [totalcount, setTotalcount] = useState(0);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editMode, setEditMode] = useState(null);

    const { control: sc, handleSubmit: hss, reset: sr } = useForm({ defaultValues: { status: '1' }, resolver: yupResolver(AllergySearchMasterSchema) });
    const { control: ac, handleSubmit: has, reset: ar, formState: { errors: ae } } = useForm({ defaultValues: { status: '1' }, resolver: yupResolver(AllergyNewMasterSchema) });

    useEffect(() => { getLookUpDetails(); getAllergiesList(); }, []);

    async function getLookUpDetails() {
        const result = await sendRequest({ method: APIS.LOOKUP.METHOD, url: APIS.LOOKUP.URL, paramas: ['ALLERGY_TYPE'] });
        if (result?.ALLERGY_TYPE) setAllergiesTypeCombo(result.ALLERGY_TYPE);
    }

    async function getAllergiesList(data) {
        const result = await sendRequest({
            method: APIS.GET_ALLERIES_MASTER_LIST.METHOD, url: APIS.GET_ALLERIES_MASTER_LIST.URL, paramas: [],
            data: { pagenumber: 0, pagesize: 20, allergieslist: [{ allergyid: data?.allergyid || '', allergyname: data?.allergyname || '', status: data?.status || 1, allergycode: data?.allergycode || null, allergytype: null }] }
        });
        if (result?.allergieslist?.length) { setTableData(result.allergieslist); setTotalcount(result.totalcount); }
        else setTableData([]);
    }

    async function onAddSubmit(data) {
        const result = await sendRequest({
            method: APIS.SAVE_ALLERIES_MASTER.METHOD, url: APIS.SAVE_ALLERIES_MASTER.URL, paramas: [],
            data: { allergyid: editMode?.allergyid || '', allergyname: data.allergyname, status: data.status, allergycode: data.allergycode, allergytype: data.allergytype }
        });
        if (result) {
            EMRAlert.alertifySuccess('Allergy saved successfully');
            ar({ status: '1' }); setShowAddForm(false); setEditMode(null); getAllergiesList();
        } else EMRAlert.alertifyError('Not saved');
    }

    function openEditmode(row) {
        setEditMode(row); setShowAddForm(true);
        ar({ allergytype: row.allergytype, allergycode: row.allergycode, allergyname: row.allergyname, status: row.status });
    }

    return (
        <Box sx={{ m: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Add/Edit Form */}
            {showAddForm && (
                <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WarningAmberIcon sx={{ fontSize: 18, color: '#673AB7' }} />
                        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">{editMode ? 'EDIT ALLERGY' : 'ADD ALLERGY'}</Typography>
                        {editMode && <Chip label="Editing" size="small" sx={{ bgcolor: '#ede7f6', color: '#673AB7', fontWeight: 600, fontSize: 11 }} />}
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <form onSubmit={has(onAddSubmit)}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={3}>
                                    <FormControl fullWidth>
                                        <AutocompleteField name="allergytype" label={Translations.ALLERGY_MASTER.ALLERGY_TYPE} control={ac}
                                            options={allergiesTypeCombo} placeholder={Translations.ALLERGY_MASTER.ALLERGY_TYPE}
                                            mapvalues={{ id: 'lookupid', value: 'lookupvalue' }} isMultiSelect={false} id="allergytype-combo" error={ae.allergytype} />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sm={2}>
                                    <SLTextField name="allergycode" label={Translations.ALLERGY_MASTER.ALLERGY_CODE} control={ac} placeholder={Translations.ALLERGY_MASTER.ALLERGY_CODE} error={ae.allergycode} />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <SLTextField name="allergyname" label={Translations.ALLERGY_MASTER.ALLERGY_NAME} control={ac} placeholder={Translations.ALLERGY_MASTER.ALLERGY_NAME} error={ae.allergyname} />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <SLRadioButton name="status" label="Status" control={ac} options={CommonConst.activeRadioButtonOptions} />
                                </Grid>
                                <Grid item xs={12} sm={2} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                    <SLButton variant="outlined" onClick={() => { ar({ status: '1' }); setShowAddForm(false); setEditMode(null); }}
                                        sx={{ textTransform: 'none', borderColor: '#673AB7', color: '#673AB7' }}>Cancel</SLButton>
                                    <SLButton type="submit" variant="contained"
                                        sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#673AB7', '&:hover': { bgcolor: '#512DA8' } }}>
                                        {editMode ? 'Update' : 'Save'}
                                    </SLButton>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Paper>
            )}

            {/* List with search */}
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ListAltIcon sx={{ fontSize: 18, color: '#673AB7' }} />
                        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">ALLERGY LIST</Typography>
                    </Box>
                    <Tooltip title="Add Allergy">
                        <IconButton size="small" onClick={() => setShowAddForm(true)} sx={{ bgcolor: '#ede7f6', color: '#673AB7' }}>
                            <AddCircleOutlineIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                    <form onSubmit={hss(getAllergiesList)}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth>
                                    <AutocompleteField name="allergyType" label={Translations.ALLERGY_MASTER.ALLERGY_TYPE} control={sc}
                                        options={allergiesTypeCombo} placeholder={Translations.ALLERGY_MASTER.ALLERGY_TYPE}
                                        mapvalues={{ id: 'lookupid', value: 'lookupvalue' }} isMultiSelect={false} id="search-allergytype-combo" />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <SLTextField name="allergycode" label={Translations.ALLERGY_MASTER.ALLERGY_CODE} control={sc} placeholder={Translations.ALLERGY_MASTER.ALLERGY_CODE} />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <SLTextField name="allergyname" label={Translations.ALLERGY_MASTER.ALLERGY_NAME} control={sc} placeholder={Translations.ALLERGY_MASTER.ALLERGY_NAME} />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <SLRadioButton name="status" label="Status" control={sc} options={CommonConst.activeRadioButtonOptions} />
                            </Grid>
                            <Grid item xs={12} sm={2} sx={{ display: 'flex', gap: 1 }}>
                                <SLButton type="submit" variant="contained" startIcon={<SearchIcon />}
                                    sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#673AB7', '&:hover': { bgcolor: '#512DA8' } }}>Search</SLButton>
                                <SLButton variant="outlined" onClick={() => { sr({ status: '1' }); getAllergiesList(); }}
                                    sx={{ textTransform: 'none', borderColor: '#673AB7', color: '#673AB7' }}>Clear</SLButton>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
                <CustomDataGrid tableHeaders={allergiesListHeaders} tableData={tableData} totalcount={totalcount}
                    rowsPerPage={20} paginationChangeEvent={() => {}}
                    triggerEvent={(row) => openEditmode(row)} />
            </Paper>
        </Box>
    );
}
