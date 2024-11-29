import React, { useEffect, useState, useContext, useRef } from 'react';
import { Box } from '@mui/material'
import { sendRequest } from '../global/DataManager';
import APIS from '../../Utils/APIS';
import AppContext from '../../components/Context/AppContext';
import CommonCard from '../../common/CommonCard';
import Translations from '../../resources/translations';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
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
export default function GeneratedBillsList(props) {
    const [billtableData, setBilltableData] = useState([]);
    const [enablePrint,setEnablePrint] = useState(false);
    const [invoiceData,setInvoiceData]= useState({});
    const appContextValue = useContext(AppContext);
    const componentRef = useRef();
    useEffect(() => {
        getBills();
    }, []);
    async function getBills(){
        let visitid = "";
        if(props && props.visitId){
            visitid = props.visitId;
        }else{
            visitid=appContextValue.selectedVisitDeatils.visitid
        }
        var payLoad = {
            method: APIS.GET_GENERATE_BILL.METHOD,
            url: APIS.GET_GENERATE_BILL.URL,
            paramas: [visitid],
        }
        let result = await sendRequest(payLoad);
        if (result && result) {
            setBilltableData(result)
        } else {
            setBilltableData([])

        }
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
            patientAddress:"",//appContextValue.selectedVisitDeatils.clientid.address.address1 + " "+appContextValue.selectedVisitDeatils.clientid.address.address2,
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
        <Box >
            <CommonCard title={Translations.BILLS_LIST.TITLE}>
                <CustomDataGrid tableHeaders={billListHeaders} tableData={billtableData} triggerEvent={(row, action) => {
                    printInvoce(row)
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
    )
}
