import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import SLTextField from '../../CoreComponents/SLTextField';
import { useForm } from 'react-hook-form';

const drugMasterListHeaders = [{
    name: Translations.DRUG_MASTER.DRUG_NAME, datakey: 'drugname', width: '25%'
}, {
    name: Translations.DRUG_MASTER.DRUG_CODE, datakey: 'drugcode', width: '10%'
}, {
    name: Translations.DRUG_MASTER.DRUG_TYPE, datakey: 'drugtyp.masterdatavalue', width: '10%'
}, {
    name: Translations.DRUG_MASTER.DRUG_DOSAGE, datakey: 'drugdose', width: '8%'
}, {
    name: Translations.DRUG_MASTER.DRUG_UNIT, datakey: 'drugunit.masterdatavalue', width: '10%'
}, {
    name: Translations.DRUG_MASTER.SIG, datakey: 'sig', width: '17%'
}, {
    name: Translations.DRUG_MASTER.STATUS, datakey: 'status', width: '10%',
    isChip: true, mappingData: { 1: 'Active', 2: 'In-active' }, chipColor: '#e8f5e9', chipTextColor: '#2e7d32'
}, {
    name: Translations.DIAGNOSIS_MASTER.ACTIONS, width: '5%', isActions: true,
    actions: [{ icon: 'edit', color: '#673AB7' }]
}];

export default function DrugMasterList({ openDrugEditmode }) {
    const [tableData, setTableData] = useState([]);
    const { control } = useForm({ defaultValues: { drugname: '' } });

    useEffect(() => { getDrugMasterData(''); }, []);

    async function getDrugMasterData(value) {
        const result = await sendRequest({ method: APIS.GET_DRUG_MASTER_DATA.METHOD, url: APIS.GET_DRUG_MASTER_DATA.URL, paramas: [value] });
        if (result) setTableData(result);
    }

    return (
        <Box>
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <SLTextField name="drugname" label={Translations.DRUG_MASTER.DRUG_NAME} control={control}
                            placeholder="Search by drug name..." blurEvent={(v) => getDrugMasterData(v)} />
                    </Grid>
                </Grid>
            </Box>
            <CustomDataGrid tableHeaders={drugMasterListHeaders} tableData={tableData} rowsPerPage={10} totalcount={tableData.length}
                paginationChangeEvent={() => {}} triggerEvent={(row, action) => openDrugEditmode && openDrugEditmode(row, action)} />
        </Box>
    );
}
