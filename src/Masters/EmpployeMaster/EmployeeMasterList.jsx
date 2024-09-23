import React, { useEffect, useState, useContext } from 'react';
import { sendRequest } from '../../pages/global/DataManager';
import APIS from '../../Utils/APIS';
import Translations from '../../resources/translations';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import CommonCard from '../../common/CommonCard';


const empListHeaders = [{
    name: Translations.employeeRegistration.name,
    datakey: 'firstname',
    width: '20%'
}, {
    name: Translations.employeeRegistration.gender,
    datakey: 'gender.lookupvalue',
    width: '10%'
}, {
    name: Translations.employeeRegistration.role,
    datakey: 'role.masterdatavalue',
    width: '10%'
}]
export default function EmployeeMasterList() {
    const [employeeList, setEmployeeList] = React.useState([]);

    useEffect(() => {
        getEmpData(0);
    }, []);

    async function getEmpData(pagenumber) {
        var payLoad = {
            method: APIS.GET_EMP_ALL_DATA.METHOD,
            url: APIS.GET_EMP_ALL_DATA.URL,
            paramas: [pagenumber, 5]
        }
        let result = await sendRequest(payLoad);
        if (result && result.size != 0) {
            setEmployeeList(result);
        }
    }
    return (
        <CommonCard title={Translations.employeeRegistration.empList}>
            <CustomDataGrid tableHeaders={empListHeaders} tableData={employeeList} totalcount={'100'} rowsPerPage={10} paginationChangeEvent={(number) => {
                getEmpData(number)
            }} triggerEvent={(row, action) => {
                //openEditmode(row, action);
            }}></CustomDataGrid>
        </CommonCard>
    );
}