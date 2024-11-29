import React, { useEffect, useState, useContext, useRef } from 'react';
import { Box } from '@mui/material'
import AppContext from '../../components/Context/AppContext';
import CommonCard from '../../common/CommonCard';
import Translations from '../../resources/translations';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../global/DataManager';


const pendingPaymentsListHeaders = [{
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

}, {
    name: Translations.BILLS_LIST.DISCOUNTAMOUNT,
    width: '10%',
    datakey: 'visitDiscount',
}, {
    name: Translations.DIAGNOSIS_MASTER.ACTIONS,
    width: '10%',
    isActions: true,
    actions: [{
        icon: 'add'
    }, {
        icon: 'print'
    }]
}]
export default function PendingPayments(props) {
    const [billtableData, setBilltableData] = useState([]);
    const appContextValue = useContext(AppContext);

    useEffect(() => {
        getBills();
    }, []);

    async function getBills() {
        let visitid = "";
        if (props && props.visitId) {
            visitid = props.visitId;
        } else {
            visitid = appContextValue.selectedVisitDeatils.visitid
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
    return (
        <>
            <Box sx={{ flexGrow: 1, m: 1 }}>
                <CommonCard title={Translations.PAYMENTS_SCREEN.TITLE} >
                    <CustomDataGrid tableHeaders={pendingPaymentsListHeaders} tableData={billtableData} triggerEvent={(row, action) => {
                        //openEditmode(row, action);
                    }}></CustomDataGrid>
                </CommonCard>

            </Box>
        </>
    )
}