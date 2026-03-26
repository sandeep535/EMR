import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, Chip } from '@mui/material';
import MedicationIcon from '@mui/icons-material/Medication';
import ListAltIcon from '@mui/icons-material/ListAlt';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';
import EMRAlert from '../../Utils/CustomAlert';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import SLTextField from '../../CoreComponents/SLTextField';
import SLRadioButton from '../../CoreComponents/SLRadioButton';
import SLButton from '../../CoreComponents/SLButton';
import DrugMasterList from './DrugMasterList';
import CommonConst from '../../Utils/CommonConst';
import { yupResolver } from '@hookform/resolvers/yup';
import { DrugMasterSchema } from '../../common/YupSchema/formSchema';
import { useForm } from 'react-hook-form';

const defaultobj = { drugType: '', drugname: '', status: '1' };

export default function DrugMaster() {
    const [drugTypeListOptions, setDrugTypeListOptions] = useState([]);
    const [drugAlerListOptions, setDrugAlerListOptions] = useState([]);
    const [drugFormListOptions, setDrugFormListOptions] = useState([]);
    const [drugDoseUnitListOptions, setDrugDoseUnitListOptions] = useState([]);
    const [duplicatecheck, setDuplicatecheck] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: defaultobj,
        resolver: yupResolver(DrugMasterSchema),
    });

    useEffect(() => {
        getDrugtypeMastersData(); getDrugFormMastersData();
        getDrugAlertsMastersData(); getDrugUnitMastersData();
    }, []);

    async function getMasterData(code, setter) {
        const result = await sendRequest({ method: APIS.GET_MASTER_DATA_BASED_ON_CODE.METHOD, url: APIS.GET_MASTER_DATA_BASED_ON_CODE.URL, paramas: [code] });
        if (result) setter(result);
    }
    const getDrugtypeMastersData = () => getMasterData('DRUG_TYPE', setDrugTypeListOptions);
    const getDrugAlertsMastersData = () => getMasterData('DRUG_ALERTS', setDrugAlerListOptions);
    const getDrugFormMastersData = () => getMasterData('DRUG_FORM', setDrugFormListOptions);
    const getDrugUnitMastersData = () => getMasterData('DRUG_DOSE_UNIT', setDrugDoseUnitListOptions);

    async function checkDuplicate(value, api) {
        if (!value) return;
        const result = await sendRequest({ method: api.METHOD, url: api.URL, paramas: [value.trim()] });
        if (result?.drugid) { EMRAlert.alertifySuccess('Already exists'); setDuplicatecheck(true); }
        else setDuplicatecheck(false);
    }

    const onSubmit = async (data) => {
        if (duplicatecheck) { EMRAlert.alertifySuccess('Please check drug name or drug code'); return; }
        const result = await sendRequest({
            method: APIS.SAVE_DRUG_MASTER.METHOD, url: APIS.SAVE_DRUG_MASTER.URL, paramas: [],
            data: { drugid: data.drugid || null, drugname: data.drugname, status: data.status, drugcode: data.drugcode, drugtype: data.drugtype, drugform: data.drugform, drugalert: data.drugalert, drugdose: data.drugdose, drugunit: data.drugunit, defaultduration: data.defaultduration ? Number(data.defaultduration) : '', defaultInstruction: data.defaultInstruction, sig: data.sig }
        });
        if (result) { EMRAlert.alertifySuccess('Drug saved successfully'); reset({ status: '1' }); setIsEdit(false); }
        else EMRAlert.alertifyError('Not saved');
    };

    const autoField = (name, label, options, id) => (
        <AutocompleteField name={name} label={label} control={control} options={options} placeholder={label}
            mapvalues={{ id: 'id', value: 'masterdatavalue' }} isMultiSelect={false} id={id} />
    );

    return (
        <Box sx={{ m: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MedicationIcon sx={{ fontSize: 18, color: '#673AB7' }} />
                    <Typography variant="subtitle2" fontWeight={600} color="text.secondary">{isEdit ? 'EDIT DRUG' : 'ADD DRUG'}</Typography>
                    {isEdit && <Chip label="Editing" size="small" sx={{ bgcolor: '#ede7f6', color: '#673AB7', fontWeight: 600, fontSize: 11 }} />}
                </Box>
                <Box sx={{ p: 2 }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>{autoField('drugtype', Translations.DRUG_MASTER.DRUG_TYPE, drugTypeListOptions, 'drugtype-combo')}</Grid>
                            <Grid item xs={12} sm={3}>
                                <SLTextField name="drugname" label={Translations.DRUG_MASTER.DRUG_NAME} control={control}
                                    placeholder={Translations.DRUG_MASTER.DRUG_NAME} error={errors.drugname}
                                    blurEvent={(v) => checkDuplicate(v, APIS.CHECK_DUPLICATE_DRUG_NAME)} />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <SLTextField name="drugcode" label={Translations.DRUG_MASTER.DRUG_CODE} control={control}
                                    placeholder={Translations.DRUG_MASTER.DRUG_CODE} error={errors.drugcode}
                                    blurEvent={(v) => checkDuplicate(v, APIS.CHECK_DUPLICATE_DRUG_CODE)} />
                            </Grid>
                            <Grid item xs={12} sm={3}>{autoField('drugalert', Translations.DRUG_MASTER.DRUG_ALERT, drugAlerListOptions, 'drugalert-combo')}</Grid>
                            <Grid item xs={12} sm={3}>{autoField('drugform', Translations.DRUG_MASTER.DRUG_FORM, drugFormListOptions, 'drugform-combo')}</Grid>
                            <Grid item xs={12} sm={3}>
                                <SLTextField name="sig" label={Translations.DRUG_MASTER.SIG} control={control} placeholder={Translations.DRUG_MASTER.SIG} />
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <SLTextField name="drugdose" label={Translations.DRUG_MASTER.DRUG_DOSAGE} control={control} placeholder={Translations.DRUG_MASTER.DRUG_DOSAGE} />
                            </Grid>
                            <Grid item xs={6} sm={2}>{autoField('drugunit', Translations.DRUG_MASTER.DRUG_UNIT, drugDoseUnitListOptions, 'drugunit-combo')}</Grid>
                            <Grid item xs={6} sm={2}>
                                <SLTextField name="defaultduration" label={Translations.DRUG_MASTER.DURATION} control={control} placeholder={Translations.DRUG_MASTER.DURATION} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <SLTextField name="defaultInstruction" label={Translations.DRUG_MASTER.INSTRUCTIONS} control={control} placeholder={Translations.DRUG_MASTER.INSTRUCTIONS} />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <SLRadioButton name="status" label="Status" control={control} options={CommonConst.activeRadioButtonOptions} error={errors.status} />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <SLButton variant="outlined" onClick={() => { reset({ status: '1' }); setIsEdit(false); }}
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
                    <Typography variant="subtitle2" fontWeight={600} color="text.secondary">DRUG LIST</Typography>
                </Box>
                <DrugMasterList openDrugEditmode={(row) => { reset(row); setIsEdit(true); }} />
            </Paper>
        </Box>
    );
}
