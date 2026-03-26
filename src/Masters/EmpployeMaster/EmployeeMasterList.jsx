import React, { useEffect } from 'react';
import { sendRequest } from '../../pages/global/DataManager';
import APIS from '../../Utils/APIS';
import Translations from '../../resources/translations';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';

const empListHeaders = [{
    name: Translations.employeeRegistration.name,
    datakey: 'firstname,lastname',
    width: '25%'
}, {
    name: Translations.employeeRegistration.gender,
    datakey: 'gender.lookupvalue',
    width: '15%'
}, {
    name: Translations.employeeRegistration.role,
    datakey: 'role.masterdatavalue',
    width: '20%'
}, {
    name: 'Speciality',
    datakey: 'specilaity.lookupvalue',
    width: '20%'
}, {
    name: Translations.employeeRegistration.actions,
    width: '10%',
    isActions: true,
    actions: [{ icon: 'edit', color: '#673AB7' }]
}];

export default function EmployeeMasterList({ openEditmode }) {
    const [employeeList, setEmployeeList] = React.useState([]);

    useEffect(() => { getEmpData(0); }, []);

    async function getEmpData(pagenumber) {
        const result = await sendRequest({
            method: APIS.GET_EMP_ALL_DATA.METHOD,
            url: APIS.GET_EMP_ALL_DATA.URL,
            paramas: [pagenumber, 10]
        });
        if (result?.size !== 0) setEmployeeList(result || []);
    }

    return (
        <CustomDataGrid
            tableHeaders={empListHeaders}
            tableData={employeeList}
            totalcount={100}
            rowsPerPage={10}
            paginationChangeEvent={(number) => getEmpData(number)}
            triggerEvent={(row, action) => openEditmode && openEditmode(row, action)}
        />
    );
}
