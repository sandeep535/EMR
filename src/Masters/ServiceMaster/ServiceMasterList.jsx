import React, { useState, useEffect } from 'react';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';

const serviceListHeaders = [{
    name: Translations.SERVICE_MASTER.SERVICE_NAME,
    datakey: 'servicename',
    width: '30%'
}, {
    name: Translations.SERVICE_MASTER.PRICE,
    datakey: 'price',
    width: '15%'
}, {
    name: Translations.SERVICE_MASTER.GST,
    datakey: 'gst',
    width: '10%'
}, {
    name: Translations.SERVICE_MASTER.STATUS,
    datakey: 'active',
    width: '15%',
    isChip: true,
    mappingData: { 1: 'Active', 2: 'In-active' },
    chipColor: '#e8f5e9',
    chipTextColor: '#2e7d32',
}, {
    name: Translations.SERVICE_MASTER.ACTIONS,
    width: '10%',
    isActions: true,
    actions: [{ icon: 'edit', color: '#673AB7' }]
}];

export default function ServiceMasterList({ openServiceEditmode }) {
    const [serviceMasterList, setServiceMasterList] = useState([]);

    useEffect(() => { getAllMasterData(0); }, []);

    async function getAllMasterData(number) {
        const result = await sendRequest({
            method: APIS.GET_ALL_SERVICE_MASTER_DATA.METHOD,
            url: APIS.GET_ALL_SERVICE_MASTER_DATA.URL,
            paramas: [number, 10]
        });
        if (result) setServiceMasterList(result);
    }

    return (
        <CustomDataGrid
            tableHeaders={serviceListHeaders}
            tableData={serviceMasterList}
            totalcount={100}
            rowsPerPage={10}
            paginationChangeEvent={(number) => getAllMasterData(number)}
            triggerEvent={(row, action) => openServiceEditmode && openServiceEditmode(row, action)}
        />
    );
}
