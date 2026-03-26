import React, { useState, useEffect } from 'react';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';

const labListHeaders = [{
    name: Translations.LAB_MASTER.NAME, datakey: 'labname', width: '60%'
}, {
    name: Translations.LAB_MASTER.STATUS, datakey: 'status', width: '20%',
    isChip: true, mappingData: { 1: 'Active', 2: 'In-active' }, chipColor: '#e8f5e9', chipTextColor: '#2e7d32'
}, {
    name: Translations.LAB_MASTER.ACTIONS, width: '10%', isActions: true,
    actions: [{ icon: 'edit', color: '#673AB7' }]
}];

export default function LabMasterList({ openEditmode }) {
    const [tableData, setTableData] = useState([]);
    const [totalcount, setTotalcount] = useState(0);

    useEffect(() => { getLabMasterDataList(); }, []);

    async function getLabMasterDataList() {
        const result = await sendRequest({
            method: APIS.GET_LAB_MASTER_LIST.METHOD, url: APIS.GET_LAB_MASTER_LIST.URL, paramas: [],
            data: { pagenumber: 0, pagesize: 100, totalcount: 0, labMasterModel: [{ labname: '', status: 1 }] }
        });
        if (result?.labMasterModel) { setTableData(result.labMasterModel); setTotalcount(result.totalcount || result.labMasterModel.length); }
        else setTableData([]);
    }

    return (
        <CustomDataGrid tableHeaders={labListHeaders} tableData={tableData} totalcount={totalcount}
            rowsPerPage={20} paginationChangeEvent={() => {}}
            triggerEvent={(row) => openEditmode && openEditmode(row)} />
    );
}
