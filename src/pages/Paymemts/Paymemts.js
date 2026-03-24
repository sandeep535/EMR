import React, { useEffect, useState, useContext } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AppContext from '../../components/Context/AppContext';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../global/DataManager';
import PendingPayments from './PendingPayments';
import PaidPayments from './PaidPayments';

// Visit context — fetches bills by visitId, passes payments[] to PaidPayments
export default function Paymemts() {
  const [bills, setBills] = useState([]);
  const appContextValue = useContext(AppContext);

  useEffect(() => { fetchBills(); }, []);

  async function fetchBills() {
    const visitid = appContextValue.selectedVisitDeatils?.visitid;
    if (!visitid) return;
    const result = await sendRequest({
      method: APIS.GET_GENERATE_BILL.METHOD,
      url: APIS.GET_GENERATE_BILL.URL,
      paramas: [visitid],
    });
    setBills(result || []);
  }

  // Flatten all payments from all bills of this visit, attach billNumber
  const allPayments = [];
  bills.forEach(bill => {
    (bill.payments || []).forEach(p => {
      allPayments.push({ ...p, billNumber: bill.billNumber, billAmount: bill.billAmount });
    });
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 1.5 }}>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ px: 2, py: 1.2, bgcolor: '#fff8f0', borderBottom: '1px solid #ffe0b2', display: 'flex', alignItems: 'center', gap: 1 }}>
          <HourglassEmptyIcon sx={{ fontSize: 18, color: '#e65100' }} />
          <Typography variant="subtitle2" fontWeight={600} color="#e65100">PENDING PAYMENTS</Typography>
        </Box>
        <PendingPayments onSuccess={fetchBills} />
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ px: 2, py: 1.2, bgcolor: '#f0faf4', borderBottom: '1px solid #c8e6c9', display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon sx={{ fontSize: 18, color: '#2e7d32' }} />
          <Typography variant="subtitle2" fontWeight={600} color="#2e7d32">PAID PAYMENTS</Typography>
        </Box>
        <PaidPayments payments={allPayments} />
      </Paper>

    </Box>
  );
}
