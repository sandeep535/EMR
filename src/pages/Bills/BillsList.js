import React, { useEffect, useState, useContext, useRef } from 'react';
import { Box } from '@mui/material'
import {generateBill} from '../../Utils/UtilService';
import AppContext from '../../components/Context/AppContext';
import CommonCard from '../../common/CommonCard';
import Translations from '../../resources/translations';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import SLButton from '../../CoreComponents/SLButton';
import GeneratedBillsList from './GeneratedBillsList';

const pendingbillListHeaders = [{
    name: Translations.BILLS_LIST.SERVICENAME,
    width: '20%',
    datakey: 'serviceid.servicename',
},
{
    name: Translations.BILLS_LIST.PRICE,
    width: '10%',
    datakey: 'serviceprice',
},{
    name: Translations.BILLS_LIST.QUANTITY,
    width: '10%',
    datakey: 'quantity',
    
},{
    name: Translations.BILLS_LIST.SERVICE_DISCOUNT,
    width: '10%',
    datakey: 'servicediscount',
   
}]
export default function BillsList(props) {
  
    const [pendingbilltableData, setpendingbilltableData] = useState([]);
    const [isRefresh,setisRefresh] = useState(false);
    const appContextValue = useContext(AppContext);

    useEffect(() => {
        setisRefresh(true);
        getPendingBills();
    }, []);

    
function updateBillsIdtoContextAndRefresh(resData){
    let copyVisitDeatils = {...appContextValue.selectedVisitDeatils};
        copyVisitDeatils.services.forEach(service => {
            if(!service.billId){
                service.billId =resData;
            }
        });
        appContextValue.setSelectedVisitDeatils(copyVisitDeatils);
        getPendingBills();
        setisRefresh(prevCount => !prevCount);
        
}
    function getPendingBills(){
        let copyVisitDeatils = {...appContextValue.selectedVisitDeatils};
        let peningBills = [];
        copyVisitDeatils.services.forEach(service => {
            if(!service.billId){
                peningBills.push(service);
            }
        });
        setpendingbilltableData(peningBills);
    }
    async function clickgenerateBill(){
        let result = await generateBill(appContextValue.selectedVisitDeatils.visitid,appContextValue.selectedVisitDeatils.clientid.seqid);
        if(result.status == "succuss"){
            updateBillsIdtoContextAndRefresh(result.result);
        }
    }
   
    return (
        <>
            <Box sx={{ flexGrow: 1, m: 1 }}>
                {isRefresh && <GeneratedBillsList/>}
                {/* <SLButton variant="outlined" color="success" onClick={()=>{clickgenerateBill()}}>{Translations.BILLS_LIST.GENRATE_BILL}</SLButton> */}
                <CommonCard title={Translations.BILLS_LIST.PENDING_BILLS} iconsList={[{icon:"credit_card"}]} catchCliedEvent = {()=>{clickgenerateBill()}}>
                    <CustomDataGrid tableHeaders={pendingbillListHeaders} tableData={pendingbilltableData} triggerEvent={(row, action) => {
                        //openEditmode(row, action);
                    }}></CustomDataGrid>
                </CommonCard>
                
            </Box>
        </>
    )
}