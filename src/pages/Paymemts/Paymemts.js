import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import PaymentsIcon from '@mui/icons-material/Payments';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PendingPayments from './PendingPayments';
import PaidPayments from './PaidPayments';

export default function Paymemts({ clientId }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 1.5 }}>

      {/* Summary */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Chip icon={<HourglassEmptyIcon />} label="Pending Payments" size="small"
          sx={{ bgcolor: '#fff3e0', color: '#e65100', fontWeight: 600 }} />
        <Chip icon={<CheckCircleIcon />} label="Paid Payments" size="small"
          sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }} />
      </Box>

      {/* Pending */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ px: 2, py: 1.2, bgcolor: '#fff8f0', borderBottom: '1px solid #ffe0b2', display: 'flex', alignItems: 'center', gap: 1 }}>
          <HourglassEmptyIcon sx={{ fontSize: 18, color: '#e65100' }} />
          <Typography variant="subtitle2" fontWeight={600} color="#e65100">PENDING PAYMENTS</Typography>
        </Box>
        <PendingPayments clientId={clientId} />
      </Paper>

      {/* Paid */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ px: 2, py: 1.2, bgcolor: '#f0faf4', borderBottom: '1px solid #c8e6c9', display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon sx={{ fontSize: 18, color: '#2e7d32' }} />
          <Typography variant="subtitle2" fontWeight={600} color="#2e7d32">PAID PAYMENTS</Typography>
        </Box>
        <PaidPayments clientId={clientId} />
      </Paper>

    </Box>
  );
}
