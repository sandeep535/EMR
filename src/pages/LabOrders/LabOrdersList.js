import React, { useRef, useContext, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import AppContext from '../../components/Context/AppContext';
import LabOrder from './LabOrder';
import SLButton from '../../CoreComponents/SLButton';
import EMRAlert from '../../Utils/CustomAlert';
import CommonCard from '../../common/CommonCard';

const labOrdersListHeaders = [{
    name: Translations.LAB_ORDER.LAB_NAME,
    datakey: 'labname',
    width: '30%'
}, {
    name: Translations.LAB_ORDER.STATUS,
    datakey: 'status',
    width: '20%'
}];

export default function LabOrdersList() {
    const [tableData, setTableData] = useState([]);
    const [totalcount, setTotalcount] = useState(0);
    const appContextValue = useContext(AppContext);
    const labRef = useRef();

    useEffect(() => { getLabData(); }, []);

    async function getLabData() {
        const result = await sendRequest({
            method: APIS.GET_LAB_LIST_BASED_ON_VISITID_CLIENT_ID.METHOD,
            url: APIS.GET_LAB_LIST_BASED_ON_VISITID_CLIENT_ID.URL,
            paramas: [0, appContextValue.selectedVisitDeatils.clientid.seqid],
        });
        if (result) { setTableData(result); setTotalcount(result.length); }
    }

    async function saveLabOrders(data) {
        const finaldata = data.selectedLabOrder.map(item => ({
            labtransid: '',
            labname: item.labname,
            status: 1,
            visitid: appContextValue.selectedVisitDeatils.visitid,
            clientid: appContextValue.selectedVisitDeatils.clientid.seqid,
            labmasterid: item
        }));
        const result = await sendRequest({
            method: APIS.SAVE_LAB_ORDERS.METHOD,
            url: APIS.SAVE_LAB_ORDERS.URL,
            paramas: [], data: finaldata
        });
        if (result) {
            EMRAlert.alertifySuccess('Lab orders saved successfully');
            labRef.current.setFormData([]);
            getLabData();
        } else {
            EMRAlert.alertifyError('Not saved');
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, m: 1 }}>

            {/* Lab Order input + Save button */}
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
                <Box sx={{ flex: 1 }}>
                    <LabOrder
                        sendDataToParent={saveLabOrders}
                        label={Translations.LAB_ORDER.LAB_TITLE}
                        data={[]}
                        ref={labRef}
                    />
                </Box>
                <SLButton
                    variant="contained"
                    onClick={() => labRef.current.submitFormmData()}
                    sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#673AB7', '&:hover': { bgcolor: '#512DA8' }, mb: 0.2 }}>
                    {Translations.LAB_ORDER.ADD}
                </SLButton>
            </Box>

            {/* Lab Orders List */}
            <Box sx={{ width: '100%' }}>
                <CommonCard title={Translations.LAB_ORDER.ORDER_LIST_TITLE}>
                    <CustomDataGrid
                        tableHeaders={labOrdersListHeaders}
                        tableData={tableData}
                        totalcount={totalcount}
                        rowsPerPage={20}
                        paginationChangeEvent={() => {}}
                    />
                </CommonCard>
            </Box>

        </Box>
    );
}
