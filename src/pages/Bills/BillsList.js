import React, { useEffect, useState, useContext, useRef } from 'react';
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { sendRequest } from '../global/DataManager';
import Typography from '@mui/material/Typography';
import APIS from '../../Utils/APIS';
import {generateBill} from '../../Utils/UtilService';
import { useNavigate } from "react-router-dom";
import AppContext from '../../components/Context/AppContext';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import CommonCard from '../../common/CommonCard';
import Translations from '../../resources/translations';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import SLButton from '../../CoreComponents/SLButton';
import Invoice from '../../components/Invoice/Invoice';
import { useReactToPrint } from 'react-to-print';
import { FunctionalComponentToPrint } from '../../components/Print/ComponentToPrint';

const billListHeaders = [{
    name: Translations.BILLS_LIST.BILLNO,
    datakey: 'billNumber',
    width: '20%'
}, {
    name: Translations.BILLS_LIST.BILLDATE,
    width: '20%',
    datakey: 'billDate',
    isDateFiled: true
}, {
    name: Translations.BILLS_LIST.BILLAMOUNT,
    width: '20%',
    datakey: 'billAmount',
  
}, {
    name: Translations.BILLS_LIST.TOTALAMOUNT,
    width: '10%',
    datakey: 'billAmountBeforeDiscount',
},
{
    name: Translations.BILLS_LIST.DISCOUNTINPERCENTAGE,
    width: '10%',
    datakey: 'visitDiscountPercentage',
   
},{
    name: Translations.BILLS_LIST.DISCOUNTAMOUNT,
    width: '10%',
    datakey: 'visitDiscount',
},{
    name: Translations.DIAGNOSIS_MASTER.ACTIONS,
    width: '10%',
    isActions: true,
    actions: [{
        icon: 'print'
    }]
}]

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
    const [billtableData, setBilltableData] = useState([]);
    const [pendingbilltableData, setpendingbilltableData] = useState([]);
    const [enablePrint,setEnablePrint] = useState(false);
    const [invoiceData,setInvoiceData]= useState({});

    const componentRef = useRef();

    const appContextValue = useContext(AppContext);
    useEffect(() => {
        getBills();
        getPendingBills();
    }, []);

    async function getBills(){
        var payLoad = {
            method: APIS.GET_GENERATE_BILL.METHOD,
            url: APIS.GET_GENERATE_BILL.URL,
            paramas: [appContextValue.selectedVisitDeatils.visitid],
            
        }
        let result = await sendRequest(payLoad);
        if (result && result) {
            setBilltableData(result)
        } else {
            setBilltableData([])

        }
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
    function clickgenerateBill(){
        let result = generateBill(appContextValue.selectedVisitDeatils.visitid,appContextValue.selectedVisitDeatils.clientid.seqid);
    }
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        onAfterPrint: () => {
            setEnablePrint(false);
        },
        onBeforeGetContent: () => {
        }
    });
    function printInvoce(selectedRow){
        var object = {
            patientName:appContextValue.selectedVisitDeatils.clientid.firstname + " " + appContextValue.selectedVisitDeatils.clientid.lastname,
            patientId:appContextValue.selectedVisitDeatils.clientid.seqid,
            date: new Date().toLocaleDateString(),
            phoneNumber:appContextValue.selectedVisitDeatils.clientid.contact,
            doctorName:appContextValue.selectedVisitDeatils.doctor.firstname + " "+ appContextValue.selectedVisitDeatils.doctor.lastname,
            invoiceNumber:selectedRow.billNumber,
            patientAddress:appContextValue.selectedVisitDeatils.clientid.address.address1 + " "+appContextValue.selectedVisitDeatils.clientid.address.address2,
            services:selectedRow.services,
            totalAmount:selectedRow.billAmount,
        }
        setInvoiceData(object);
        setEnablePrint(true)
        setTimeout(function () {
            handlePrint();
        }, 100)
    }
    return (
        <>
            <Box sx={{ flexGrow: 1, m: 1 }}>
                <CommonCard title={Translations.BILLS_LIST.TITLE}>
                    <CustomDataGrid tableHeaders={billListHeaders} tableData={billtableData} triggerEvent={(row, action) => {
                        printInvoce(row)
                      
                    }}></CustomDataGrid>
                </CommonCard>
                <SLButton variant="outlined" color="success" onClick={()=>{clickgenerateBill()}}>{Translations.BILLS_LIST.GENRATE_BILL}</SLButton>
                <CommonCard title={Translations.BILLS_LIST.PENDING_BILLS}>
                    <CustomDataGrid tableHeaders={pendingbillListHeaders} tableData={pendingbilltableData} triggerEvent={(row, action) => {
                        //openEditmode(row, action);
                    }}></CustomDataGrid>
                </CommonCard>
                {enablePrint && (
                <FunctionalComponentToPrint ref={componentRef} >
                    <Box sx={{ width: '100%' }}>
                       <Invoice invoiceData = {invoiceData}/>
                    </Box>
                </FunctionalComponentToPrint>
            )}
            </Box>
        </>
    )
}