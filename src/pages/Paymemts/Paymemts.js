import React, { useEffect, useState, useContext, useRef } from 'react';
import { Box } from '@mui/material'
import PendingPayments from './PendingPayments';
import PaidPayments from './PaidPayments';
import AddPayment from './AddPayment';


export default function Paymemts() {
    return (
        <>
            <Box sx={{ flexGrow: 1, m: 1 }}>
                <PendingPayments />
                <PaidPayments />
                {/* <AddPayment /> */}
            </Box>
        </>
    )
}