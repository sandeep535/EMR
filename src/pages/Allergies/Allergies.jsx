import React, { useState, useEffect, forwardRef, useImperativeHandle, useContext } from 'react';
import { Box, Grid, Paper, Typography, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Tooltip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../global/DataManager';
import Translations from '../../resources/translations';
import AppContext from '../../components/Context/AppContext';
import EMRAlert from '../../Utils/CustomAlert';
import AllergiesList from './AllergiesList';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import SLTextField from '../../CoreComponents/SLTextField';
import SLRadioButton from '../../CoreComponents/SLRadioButton';
import SLSelectDropDown from '../../CoreComponents/SLSelectDropDown';
import SLButton from '../../CoreComponents/SLButton';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AllergiesScreenSchema } from '../../common/YupSchema/formSchema';
import CommonConst from '../../Utils/CommonConst';

const defaultobj = { allergy: '', indications: '', severity: {}, status: '1' };

const Allergies = forwardRef((props, ref) => {
    const [severityList, setSeverityList] = useState([]);
    const [allergiesList, setAllergiesList] = useState([]);
    const [allergyTypeOptions, setAllergyTypeOptions] = useState([]);
    const [isRefreshData, setisRefreshData] = useState(false);
    const [mode, setMode] = useState('new');
    const [selectedRow, setSelectedRow] = useState('');
    const appContextValue = useContext(AppContext);

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: defaultobj,
        resolver: yupResolver(AllergiesScreenSchema),
    });

    useEffect(() => { getLookUpDetails(); getAllergiesMasterList(); }, []);

    useImperativeHandle(ref, () => ({
        getFormData: () => ({ allergiesList }),
        setFormData1: (data) => setAllergiesList(data),
    }), [allergiesList]);

    async function getAllergiesMasterList(name) {
        const result = await sendRequest({
            method: APIS.GET_ALLERIES_MASTER_LIST.METHOD,
            url: APIS.GET_ALLERIES_MASTER_LIST.URL,
            paramas: [],
            data: { pagenumber: 0, pagesize: 1000, allergieslist: [{ allergyid: '', allergyname: name, status: 1, allergycode: null, allergytype: null }] }
        });
        if (result?.allergieslist?.length) setAllergyTypeOptions(result.allergieslist);
    }

    async function getLookUpDetails() {
        const result = await sendRequest({ method: APIS.LOOKUP.METHOD, url: APIS.LOOKUP.URL, paramas: ['ALLERGY_SEVERITY'] });
        if (result?.ALLERGY_SEVERITY) setSeverityList(result.ALLERGY_SEVERITY);
    }

    async function addAllergiestoGrid(data) {
        const obj = {
            allergy: data.allergy.allergyname,
            status: data.status,
            indications: data.indications,
            severity: data.severity,
            visitid: appContextValue.selectedVisitDeatils.visitid,
            clientid: appContextValue.selectedVisitDeatils.clientid.seqid,
            allergymaster: { allergyid: data.allergy.allergyid, allergyname: data.allergy.allergyname }
        };
        if (mode === 'edit') { obj.allergyid = selectedRow.allergyid; obj.visitid = selectedRow.visitid; }

        if (props.isSaveDirect) {
            setisRefreshData(false);
            const result = await sendRequest({ method: APIS.SAVE_ALLERIES.METHOD, url: APIS.SAVE_ALLERIES.URL, paramas: [], data: [obj] });
            if (result) { setisRefreshData(true); EMRAlert.alertifySuccess('Allergy Saved Successfully'); }
            else EMRAlert.alertifyError('Not Saved');
        } else {
            setAllergiesList(prev => [...prev, obj]);
        }
        reset(defaultobj);
        setMode('new');
    }

    function setDatatoForm(row) {
        reset({ allergy: row.allergymaster, severity: row.severity, status: row.status, indications: row.indications });
        setMode('edit');
        setSelectedRow(row);
    }

    return (
        <Box sx={{ m: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Add / Edit Form */}
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningAmberIcon sx={{ fontSize: 18, color: '#673AB7' }} />
                    <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                        {mode === 'edit' ? 'EDIT ALLERGY' : 'ADD ALLERGY'}
                    </Typography>
                    {mode === 'edit' && (
                        <Chip label="Editing" size="small" sx={{ bgcolor: '#ede7f6', color: '#673AB7', fontWeight: 600, fontSize: 11 }} />
                    )}
                </Box>
                <Box sx={{ p: 2 }}>
                    <form onSubmit={handleSubmit(addAllergiestoGrid)}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth>
                                    <AutocompleteField
                                        name="allergy"
                                        label={Translations.ALLERGY.ALLERGYNAME}
                                        control={control}
                                        options={allergyTypeOptions}
                                        placeholder={Translations.ALLERGY.ALLERGYNAME}
                                        mapvalues={{ id: 'allergyid', value: 'allergyname' }}
                                        isMultiSelect={false}
                                        id="allergy-combo-box"
                                        onInputChange={(data) => { if (data.length > 1) getAllergiesMasterList(data); }}
                                        error={errors.allergy}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <SLSelectDropDown
                                    name="severity"
                                    label={Translations.ALLERGY.SERVERITY}
                                    control={control}
                                    options={severityList}
                                    error={errors.severity}
                                    mapvalues={{ id: 'lookupid', value: 'lookupvalue' }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <SLTextField
                                    name="indications"
                                    label={Translations.ALLERGY.INDICATIONS}
                                    control={control}
                                    placeholder={Translations.ALLERGY.INDICATIONS}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <SLRadioButton
                                    name="status"
                                    label="Status"
                                    control={control}
                                    options={CommonConst.activeRadioButtonOptions}
                                    error={errors.status}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SLButton type="submit" variant="contained" startIcon={<AddCircleOutlineIcon />}
                                    sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#673AB7', '&:hover': { bgcolor: '#512DA8' } }}>
                                    {mode === 'edit' ? 'Update' : 'Add'}
                                </SLButton>
                                <SLButton variant="outlined" onClick={() => { reset(defaultobj); setMode('new'); }}
                                    sx={{ textTransform: 'none', borderColor: '#673AB7', color: '#673AB7' }}>
                                    Clear
                                </SLButton>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Paper>

            {/* Inline staging grid (non-direct save mode) */}
            {!props.isSaveDirect && allergiesList.length > 0 && (
                <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">ADDED ALLERGIES</Typography>
                        <Chip label={allergiesList.length} size="small" sx={{ bgcolor: '#ede7f6', color: '#673AB7', fontWeight: 600 }} />
                    </Box>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#673AB7' }}>
                                    {['Allergy', 'Severity', 'Status', 'Indications', ''].map((h, i) => (
                                        <TableCell key={i} sx={{ color: '#fff', fontWeight: 700, fontSize: 12, py: 1 }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allergiesList.map((a, i) => (
                                    <TableRow key={i} hover sx={{ '&:last-child td': { border: 0 }, bgcolor: i % 2 === 0 ? '#fff' : '#f9f6ff' }}>
                                        <TableCell sx={{ fontSize: 12 }}>{a.allergy || '-'}</TableCell>
                                        <TableCell sx={{ fontSize: 12 }}>{a.severity?.lookupvalue || '-'}</TableCell>
                                        <TableCell sx={{ fontSize: 12 }}>
                                            <Chip label={a.status === '1' || a.status === 1 ? 'Active' : 'In-active'} size="small"
                                                sx={{ bgcolor: a.status === '1' || a.status === 1 ? '#e8f5e9' : '#fce4ec', color: a.status === '1' || a.status === 1 ? '#2e7d32' : '#c62828', fontSize: 11 }} />
                                        </TableCell>
                                        <TableCell sx={{ fontSize: 12 }}>{a.indications || '-'}</TableCell>
                                        <TableCell>
                                            <Tooltip title="Remove">
                                                <IconButton size="small" onClick={() => setAllergiesList(prev => prev.filter((_, idx) => idx !== i))}>
                                                    <DeleteOutlineIcon sx={{ fontSize: 16, color: '#e53935' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* Saved allergies list */}
            <AllergiesList isRefresh={isRefreshData} selectedRecord={(row) => setDatatoForm(row)} />
        </Box>
    );
});

Allergies.displayName = 'Allergies';
export default Allergies;
