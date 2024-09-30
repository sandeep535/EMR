import React, { useState, useEffect } from 'react';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import CommonCard from '../../common/CommonCard';

const diagnosisListHeaders = [{
    name: Translations.LAB_MASTER.NAME,
    datakey: 'labname',
    width: '20%'
}, {
    name: Translations.LAB_MASTER.STATUS,
    width: '10%',
    datakey: 'status',
    mappingData: { 1: "Active", 2: "In-active" }
}, {
    name: Translations.LAB_MASTER.ACTIONS,
    width: '10%',
    isActions: true,
    actions: [{
        icon: 'edit'
    }]
}]
export default function LabMasterList(props) {
    const [tableData, setTableData] = useState([]);
    const [totalcount, settotalcount] = useState(0);

    useEffect(() => {
        getLabMasterDataList()
        return () => console.log("Cleanup..");
    }, []);

    async function getLabMasterDataList() {
        var obj = {
            pagenumber: 0,
            pagesize: 100,
            totalcount: 0,
            labMasterModel: [{
                labname: "",
                status: 1,
            }]
        }
        var payLoad = {
            method: APIS.GET_LAB_MASTER_LIST.METHOD,
            url: APIS.GET_LAB_MASTER_LIST.URL,
            paramas: [],
            data: obj
        }
        let result = await sendRequest(payLoad);
        if (result && result.labMasterModel) {
            setTableData(result.labMasterModel);
        } else {
            setTableData([]);
        }
    }
    
    return (
        <>
            <CommonCard title="Lab Master List">
                <CustomDataGrid tableHeaders={diagnosisListHeaders} tableData={tableData} totalcount={totalcount} rowsPerPage={20} paginationChangeEvent={(number) => {

                }} triggerEvent={(row, action) => {
                    props.openEditmode(row, action);
                }}></CustomDataGrid>
            </CommonCard>

        </>
    )
}