import React, { useEffect, useState, useContext, useRef } from 'react';
import { Box } from '@mui/material'
import { generateBill } from '../../Utils/UtilService';
import AppContext from '../../components/Context/AppContext';
import CommonCard from '../../common/CommonCard';
import Translations from '../../resources/translations';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import SLButton from '../../CoreComponents/SLButton';


export default function PaidPayments(Paymemts) {
    return (
        <>
            <Box sx={{ flexGrow: 1, m: 1 }}>
                <CommonCard title={Translations.PAYMENTS_SCREEN.PAID_PAYMENTS}>
                    {/* <CustomDataGrid tableHeaders={pendingbillListHeaders} tableData={pendingbilltableData} triggerEvent={(row, action) => {
                        //openEditmode(row, action);
                    }}></CustomDataGrid> */}
                </CommonCard>

            </Box>
        </>
    )
}