import React from 'react';
import { Box, Typography, Divider, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

// invoiceData shape:
// { patientName, patientId, phoneNumber, patientAddress, doctorName,
//   invoiceNumber, billDate, services[], billAmountBeforeDiscount,
//   visitDiscount, visitDiscountPercentage, billAmount, payments[] }

const Invoice = ({ invoiceData }) => {
  const {
    patientName, patientId, phoneNumber, patientAddress, doctorName,
    invoiceNumber, billDate, services = [], billAmountBeforeDiscount,
    visitDiscount, visitDiscountPercentage, billAmount, payments = [],
  } = invoiceData;

  const totalPaid = payments.reduce((s, p) => s + (p.paymentAmount || 0), 0);
  const remaining = (billAmount || 0) - totalPaid;

  const cellStyle = { fontSize: 12, py: 0.8, px: 1.5, borderBottom: '1px solid #e0e0e0' };
  const headStyle = { fontSize: 12, fontWeight: 700, py: 0.8, px: 1.5, bgcolor: '#f5f7fa', borderBottom: '2px solid #d0d0d0' };

  return (
    <Box sx={{ maxWidth: 780, mx: 'auto', p: 4, fontFamily: 'Arial, sans-serif', color: '#222' }}>

      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={700} letterSpacing={1}>INVOICE</Typography>
        <Typography variant="body2" color="text.secondary">{invoiceNumber}</Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Patient + Bill Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="body2"><strong>Patient Name:</strong> {patientName}</Typography>
          <Typography variant="body2"><strong>Patient ID:</strong> {patientId}</Typography>
          <Typography variant="body2"><strong>Phone:</strong> {phoneNumber}</Typography>
          {patientAddress && <Typography variant="body2"><strong>Address:</strong> {patientAddress}</Typography>}
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2"><strong>Invoice No:</strong> {invoiceNumber}</Typography>
          <Typography variant="body2"><strong>Bill Date:</strong> {billDate}</Typography>
          <Typography variant="body2"><strong>Doctor:</strong> {doctorName}</Typography>
        </Box>
      </Box>

      {/* Services Table */}
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5, color: '#1976d2', textTransform: 'uppercase', fontSize: 11 }}>Services</Typography>
      <Table size="small" sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={headStyle}>#</TableCell>
            <TableCell sx={headStyle}>Service</TableCell>
            <TableCell sx={{ ...headStyle, textAlign: 'right' }}>Qty</TableCell>
            <TableCell sx={{ ...headStyle, textAlign: 'right' }}>Price</TableCell>
            <TableCell sx={{ ...headStyle, textAlign: 'right' }}>Discount</TableCell>
            <TableCell sx={{ ...headStyle, textAlign: 'right' }}>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {services.map((s, i) => (
            <TableRow key={i}>
              <TableCell sx={cellStyle}>{i + 1}</TableCell>
              <TableCell sx={cellStyle}>{s.serviceName || s.serviceid?.servicename || '-'}</TableCell>
              <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{s.quantity || 1}</TableCell>
              <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>₹{Number(s.serviceAmount || s.serviceprice || 0).toFixed(2)}</TableCell>
              <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>₹{Number(s.servicediscount || 0).toFixed(2)}</TableCell>
              <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>₹{Number(s.servicetotalamount || s.serviceAmount || s.serviceprice || 0).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Bill Summary */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Box sx={{ minWidth: 260, border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
          {[
            { label: 'Gross Amount', value: billAmountBeforeDiscount },
            { label: `Discount (${visitDiscountPercentage || 0}%)`, value: visitDiscount, color: '#e65100' },
            { label: 'Net Amount', value: billAmount, bold: true, bgcolor: '#f5f7fa' },
            { label: 'Total Paid', value: totalPaid, color: '#2e7d32' },
            { label: 'Balance Due', value: remaining, bold: true, color: remaining > 0 ? '#d32f2f' : '#2e7d32', bgcolor: remaining > 0 ? '#fff3e0' : '#e8f5e9' },
          ].map((r, i) => (
            <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', px: 2, py: 0.7, bgcolor: r.bgcolor || 'transparent', borderBottom: '1px solid #f0f0f0' }}>
              <Typography variant="body2" fontWeight={r.bold ? 700 : 400}>{r.label}</Typography>
              <Typography variant="body2" fontWeight={r.bold ? 700 : 400} color={r.color || 'inherit'}>
                ₹{Number(r.value || 0).toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Payment History */}
      {payments.length > 0 && (
        <>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5, color: '#2e7d32', textTransform: 'uppercase', fontSize: 11 }}>Payment History</Typography>
          <Table size="small" sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={headStyle}>#</TableCell>
                <TableCell sx={headStyle}>Date</TableCell>
                <TableCell sx={{ ...headStyle, textAlign: 'right' }}>Amount</TableCell>
                <TableCell sx={headStyle}>Mode</TableCell>
                <TableCell sx={headStyle}>Txn No.</TableCell>
                <TableCell sx={headStyle}>Remarks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((p, i) => (
                <TableRow key={i}>
                  <TableCell sx={cellStyle}>{i + 1}</TableCell>
                  <TableCell sx={cellStyle}>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('en-IN') : '-'}</TableCell>
                  <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>₹{Number(p.paymentAmount || 0).toFixed(2)}</TableCell>
                  <TableCell sx={cellStyle}>{p.paymentMode?.masterdatavalue || '-'}</TableCell>
                  <TableCell sx={cellStyle}>{p.transactionNumber || '-'}</TableCell>
                  <TableCell sx={cellStyle}>{p.remarks || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      <Divider sx={{ mb: 2 }} />
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">Thank you for choosing our services. Get well soon!</Typography>
      </Box>
    </Box>
  );
};

export default Invoice;
