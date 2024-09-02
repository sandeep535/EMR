// import * as React from 'react';
// import { styled } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
// import Grid from '@mui/material/Grid';

// const Item = styled(Paper)(({ theme }) => ({
//     backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//     ...theme.typography.body2,
//     padding: theme.spacing(1),
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
//   }));

// const Invoice = (props) => {


//   return (
//     <Box mb="10px">
//           <Grid container spacing={2}>
//               <Grid item xs={6}>
//                   <Item>xs=8</Item>
//               </Grid>
//               <Grid item xs={6}>
//                   <Item>xs=4</Item>
//               </Grid>
//               <Grid item xs={4}>
//                   <Item>xs=4</Item>
//               </Grid>
//               <Grid item xs={4}>
//                   <Item>xs=8</Item>
//               </Grid>
//           </Grid>
//     </Box>
//   );
// };

// export default Invoice;

// src/components/HospitalInvoice.js
import React from 'react';
import { Box, Typography, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


const Invoice = ({ invoiceData }) => {
    const invoiceData1 = {
        hospitalName: 'City Hospital',
        hospitalAddress: '123 Main Street, Anytown, AN 12345',
        patientName: 'John Doe',
        patientId: '123456',
        date: new Date().toLocaleDateString(),
        phoneNumber:9032151096,
        doctorName:'Sandeep',
        invoiceNumber:'1212131',
        patientAddress:"Hyderabad",
        services: [
            { description: 'Consultation Fee', cost: 50.00 },
            { description: 'X-Ray', cost: 100.00 },
            { description: 'Blood Test', cost: 30.00 },
            { description: 'Medication', cost: 45.00 },
        ],
        totalAmount: 225.00, // Sum of all services
    };
    const { hospitalName, hospitalAddress, patientName, patientId,phoneNumber,patientAddress, date, services, totalAmount,doctorName,invoiceNumber } = invoiceData1;

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 4, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            {/* Header Section */}
            <Box textAlign="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">
                    {hospitalName}
                </Typography>
                <Typography variant="body1">{hospitalAddress}</Typography>
            </Box>

            <Divider />

            {/* Patient and Invoice Information */}
            <Box textAlign="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                    Invoice
                </Typography>
            </Box>
            <Box mt={3} mb={3}>
                <Box display="flex" justifyContent="space-between" mt={2}>
                    <Box>
                        <Typography variant="body1"><strong>Patient Name:</strong> {patientName}</Typography>
                        <Typography variant="body1"><strong>Phone Number:</strong> {phoneNumber}</Typography>
                        <Typography variant="body1"><strong>Address:</strong> {patientAddress}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="body1"><strong>Invoice No:</strong> {invoiceNumber}</Typography>
                        <Typography variant="body1"><strong>Date:</strong> {date}</Typography>
                        <Typography variant="body1"><strong>Doctor Name:</strong> {doctorName}</Typography>
                    </Box>
                </Box>
            </Box>

            <Divider />

            {/* Services Table */}
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Service Name</strong></TableCell>
                            <TableCell><strong>Quantity</strong></TableCell>
                            <TableCell align="right"><strong>Price</strong></TableCell>
                            <TableCell align="right"><strong>Discount</strong></TableCell>
                            <TableCell align="right"><strong>Total</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {services.map((service, index) => (
                            <TableRow key={index}>
                                <TableCell>{service.description}</TableCell>
                                <TableCell >${service.cost.toFixed(2)}</TableCell>
                                <TableCell align="right">${service.cost.toFixed(2)}</TableCell>
                                <TableCell align="right">${service.cost.toFixed(2)}</TableCell>
                                <TableCell align="right">${service.cost.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"><strong>Total</strong></TableCell>
                            <TableCell align="right"><strong>${totalAmount.toFixed(2)}</strong></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"><strong>Total Discount</strong></TableCell>
                            <TableCell align="right"><strong>${totalAmount.toFixed(2)}</strong></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"><strong>Tax</strong></TableCell>
                            <TableCell align="right"><strong>${totalAmount.toFixed(2)}</strong></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"><strong>Toatal Amount</strong></TableCell>
                            <TableCell align="right"><strong>${totalAmount.toFixed(2)}</strong></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Footer Section */}
            <Box textAlign="center" mt={4}>
                <Typography variant="body2">Thank you for choosing our hospital services. Get well soon!</Typography>
            </Box>
        </Box>
    );
};

export default Invoice;
