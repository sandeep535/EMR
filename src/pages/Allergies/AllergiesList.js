import React, { useState, useEffect, useContext } from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../global/DataManager';
import Translations from '../../resources/translations';
import AppContext from '../../components/Context/AppContext';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';

const allergiesListHeaders = [{
    name: Translations.ALLERGY.ALLERGYNAME,
    datakey: 'allergy',
    width: '25%'
}, {
    name: Translations.ALLERGY.SERVERITY,
    width: '15%',
    datakey: 'severity.lookupvalue'
}, {
    name: Translations.ALLERGY.INDICATIONS,
    width: '35%',
    datakey: 'indications'
}, {
    name: Translations.ALLERGY.STATUS,
    width: '15%',
    datakey: 'status',
    isChip: true,
    mappingData: { 1: 'Active', 2: 'In-active' },
    chipColor: '#e8f5e9',
    chipTextColor: '#2e7d32',
}, {
    name: Translations.ALLERGY_MASTER.ACTIONS,
    width: '10%',
    isActions: true,
    actions: [{ icon: 'edit', color: '#673AB7' }]
}];

export default function AllergiesList({ isRefresh, selectedRecord }) {
    const appContextValue = useContext(AppContext);
    const [tableData, setTableData] = useState([]);

    useEffect(() => { getAllerigies(); }, []);
    useEffect(() => { if (isRefresh) getAllerigies(); }, [isRefresh]);

    async function getAllerigies() {
        const result = await sendRequest({
            method: APIS.GET_ALLERIGIES_DATA.METHOD,
            url: APIS.GET_ALLERIGIES_DATA.URL,
            paramas: [],
            data: {
                pagenumber: 0, pagesize: 1,
                visitid: null,
                clientid: appContextValue.selectedVisitDeatils.clientid.seqid,
                allergy: '', status: -999, severity: null
            }
        });
        if (result?.allergieslist?.length) setTableData(result.allergieslist);
    }

    return (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', width: '100%' }}>
            <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningAmberIcon sx={{ fontSize: 18, color: '#673AB7' }} />
                    <Typography variant="subtitle2" fontWeight={600} color="text.secondary">ALLERGIES LIST</Typography>
                </Box>
                {tableData.length > 0 && (
                    <Chip label={`${tableData.length} record(s)`} size="small"
                        sx={{ bgcolor: '#ede7f6', color: '#673AB7', fontWeight: 600, fontSize: 11 }} />
                )}
            </Box>
            <CustomDataGrid
                tableHeaders={allergiesListHeaders}
                tableData={tableData}
                triggerEvent={(row, action) => selectedRecord && selectedRecord(row, action)}
            />
        </Paper>
    );
}
