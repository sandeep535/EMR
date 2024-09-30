import React, { useEffect} from 'react';
import { sendRequest } from '../../pages/global/DataManager';
import APIS from '../../Utils/APIS';
import Translations from '../../resources/translations';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import CommonCard from '../../common/CommonCard';


const empListHeaders = [{
    name: Translations.employeeRegistration.name,
    datakey: 'firstname,lastname',
    width: '20%'
}, {
    name: Translations.employeeRegistration.gender,
    datakey: 'gender.lookupvalue',
    width: '10%'
}, {
    name: Translations.employeeRegistration.role,
    datakey: 'role.masterdatavalue',
    width: '10%'
},{
    name: Translations.employeeRegistration.actions,
    width: '10%',
    isActions: true,
    actions: [{
        icon: 'edit'
    }]
}
]
export default function EmployeeMasterList(props) {
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
    function openEditmode(row, action){
        props.openEditmode(row, action);
    }
    return (
        <CommonCard title={Translations.employeeRegistration.empList}>
            <CustomDataGrid tableHeaders={empListHeaders} tableData={employeeList} totalcount={'100'} rowsPerPage={10} paginationChangeEvent={(number) => {
                getEmpData(number)
            }} triggerEvent={(row, action) => {
                openEditmode(row, action);
            }}></CustomDataGrid>
        </CommonCard>
    );
}