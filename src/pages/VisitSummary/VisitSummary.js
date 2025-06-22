import React, { useEffect, useState, useContext } from 'react';
import Grid from '@mui/material/Grid';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import AppContext from '../../components/Context/AppContext';
import { Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Moment from 'react-moment';
import SLCommonPrintComponent from '../../components/Print/SLCommonPrintComponent';

export default function VisitSummary(props) {
    const appContextValue = useContext(AppContext);

    const [vitalsData, setVitalsData] = useState([]);
    const [diagnosisData, setDiagnosisData] = useState([]);
    const [notes, setNotes] = useState([]);
    const [prescriptionData, setPrescriptionData] = useState([]);
    const [labOrders, setLabOrders] = useState([]);

    useEffect(() => {
        getVitalsData();
        getDig();
        getNotes();
        getPresctiptions();
        getLabOrders();
    }, []);
    async function getVitalsData() {
        var payLoad = {
            method: APIS.GET_VITALS_DATA.METHOD,
            url: APIS.GET_VITALS_DATA.URL,
            paramas: [appContextValue.selectedVisitDeatils.visitid, 0],
        }
        let result = await sendRequest(payLoad);
        if (result && result.length !== 0) {

            setVitalsData(result[0]);
        }
    }
    async function getDig() {
        var payLoad = {
            method: APIS.GET_DIAGNOSIS.METHOD,
            url: APIS.GET_DIAGNOSIS.URL,
            paramas: [appContextValue.selectedVisitDeatils.visitid],
        }
        let result = await sendRequest(payLoad);
        if (result) {
            setDiagnosisData(result);
        }
    }
    async function getNotes() {
        var payLoad = {
            method: APIS.GET_NOTES.METHOD,
            url: APIS.GET_NOTES.URL,
            paramas: [appContextValue.selectedVisitDeatils.visitid],
        }
        let result = await sendRequest(payLoad);
        if (result) {
            setNotes(result);
        }
    }
    async function getPresctiptions() {
        var payLoad = {
            method: APIS.GET_PRESCRIPTIONS.METHOD,
            url: APIS.GET_PRESCRIPTIONS.URL,
            paramas: [appContextValue.selectedVisitDeatils.visitid, 0],
        }
        let result = await sendRequest(payLoad);
        if (result) {
            setPrescriptionData(result)
        }
    }
    async function getLabOrders() {
        var payLoad = {
            method: APIS.GET_LAB_LIST_BASED_ON_VISITID_CLIENT_ID.METHOD,
            url: APIS.GET_LAB_LIST_BASED_ON_VISITID_CLIENT_ID.URL,
            paramas: [appContextValue.selectedVisitDeatils.visitid, 0],
        }
        let result = await sendRequest(payLoad);
        if (result) {
            setLabOrders(result);
        }

    }

    

    const contentDiv = (
        <Card variant="outlined" sx={{ maxWidth: '100%', margin: '20px auto', '@media print': { boxShadow: 'none' } }}>
            <CardContent sx={{ '@media print': { padding: '8px' } }}>
                <Stack direction="row" justifyContent='center' alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>Visit Summary</Typography>
                </Stack>
                <Divider className='page-beak' sx={{ mb: 2 }}/>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h4" gutterBottom sx={{ textDecoration: 'underline', mb: 2 }}>
                        Vitals
                    </Typography>
                    <Box sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box component="span" sx={{ minWidth: '140px', fontWeight: 'bold' }}>Height:</Box>
                                    {vitalsData.height || '-'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box component="span" sx={{ minWidth: '140px', fontWeight: 'bold' }}>Weight:</Box>
                                    {vitalsData.weight || '-'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box component="span" sx={{ minWidth: '140px', fontWeight: 'bold' }}>Temperature:</Box>
                                    {vitalsData.temperature || '-'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box component="span" sx={{ minWidth: '140px', fontWeight: 'bold' }}>BP:</Box>
                                    {vitalsData.systolic && vitalsData.diastolic ? `${vitalsData.systolic}/${vitalsData.diastolic}` : '-'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box component="span" sx={{ minWidth: '140px', fontWeight: 'bold' }}>Respiratory Rate:</Box>
                                    {vitalsData.respiratoryrate || '-'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box component="span" sx={{ minWidth: '140px', fontWeight: 'bold' }}>Pulse:</Box>
                                    {vitalsData.pulse || '-'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box component="span" sx={{ minWidth: '140px', fontWeight: 'bold' }}>BMI:</Box>
                                    {vitalsData.bmi || '-'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Divider className='page-beak' sx={{ my: 2 }}/>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h4" gutterBottom sx={{ textDecoration: 'underline', mb: 2 }}>Diagnosis</Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', pl: 2 }}>
                        {diagnosisData.description || "No diagnosis found"}
                    </Typography>
                </Box>
                <Divider className='page-beak' sx={{ my: 2 }}/>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h4" gutterBottom sx={{ textDecoration: 'underline', mb: 2 }}>Notes</Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', pl: 2 }}>
                        {notes.description || "No notes found"}
                    </Typography>
                </Box>
                <Divider className='page-beak' sx={{ my: 2 }}/>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h4" gutterBottom sx={{ textDecoration: 'underline', mb: 2 }}>Prescriptions</Typography>
                    <Box>
                        <TableContainer 
                            sx={{ 
                                '@media print': { 
                                    boxShadow: 'none',
                                    pageBreakInside: 'avoid',
                                    marginBottom: '20px'
                                }
                            }}
                        >
                            <Table 
                                size="small" 
                                sx={{ 
                                    '@media print': { 
                                        borderCollapse: 'collapse',
                                        width: '100%'
                                    },
                                    '& .MuiTableCell-root': {
                                        border: '1px solid #e0e0e0',
                                        padding: '12px 16px',
                                        fontSize: '14px'
                                    }
                                }}
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell 
                                            align="left"
                                            sx={{ 
                                                fontWeight: 600,
                                                backgroundColor: '#f8f9fa',
                                                color: '#2c3e50',
                                                borderBottom: '2px solid #dee2e6',
                                                '@media print': {
                                                    backgroundColor: '#f8f9fa !important',
                                                    WebkitPrintColorAdjust: 'exact'
                                                }
                                            }}
                                        >
                                            Drug Name
                                        </TableCell>
                                        <TableCell 
                                            align="left"
                                            sx={{ 
                                                fontWeight: 600,
                                                backgroundColor: '#f8f9fa',
                                                color: '#2c3e50',
                                                borderBottom: '2px solid #dee2e6',
                                                '@media print': {
                                                    backgroundColor: '#f8f9fa !important',
                                                    WebkitPrintColorAdjust: 'exact'
                                                }
                                            }}
                                        >
                                            SIG
                                        </TableCell>
                                        <TableCell 
                                            align="center"
                                            sx={{ 
                                                fontWeight: 600,
                                                backgroundColor: '#f8f9fa',
                                                color: '#2c3e50',
                                                borderBottom: '2px solid #dee2e6',
                                                '@media print': {
                                                    backgroundColor: '#f8f9fa !important',
                                                    WebkitPrintColorAdjust: 'exact'
                                                }
                                            }}
                                        >
                                            Start Date
                                        </TableCell>
                                        <TableCell 
                                            align="center"
                                            sx={{ 
                                                fontWeight: 600,
                                                backgroundColor: '#f8f9fa',
                                                color: '#2c3e50',
                                                borderBottom: '2px solid #dee2e6',
                                                '@media print': {
                                                    backgroundColor: '#f8f9fa !important',
                                                    WebkitPrintColorAdjust: 'exact'
                                                }
                                            }}
                                        >
                                            End Date
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {prescriptionData.map((row, index) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ 
                                                '&:hover': {
                                                    backgroundColor: '#f8f9fa'
                                                },
                                                '@media print': {
                                                    '&:hover': {
                                                        backgroundColor: 'transparent'
                                                    }
                                                }
                                            }}
                                        >
                                            <TableCell 
                                                component="th" 
                                                scope="row"
                                                align="left"
                                                sx={{ 
                                                    fontWeight: 500,
                                                    color: '#2c3e50'
                                                }}
                                            >
                                                {row.drugname}
                                            </TableCell>
                                            <TableCell 
                                                align="left"
                                                sx={{ 
                                                    color: '#2c3e50'
                                                }}
                                            >
                                                {row.sig}
                                            </TableCell>
                                            <TableCell 
                                                align="center"
                                                sx={{ 
                                                    color: '#2c3e50'
                                                }}
                                            >
                                                <Moment format="DD-MMM-YYYY">
                                                    {new Date(row.startdate)}
                                                </Moment>
                                            </TableCell>
                                            <TableCell 
                                                align="center"
                                                sx={{ 
                                                    color: '#2c3e50'
                                                }}
                                            >
                                                <Moment format="DD-MMM-YYYY">
                                                    {new Date(row.endate)}
                                                </Moment>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
                <Divider className='page-beak' sx={{ my: 2 }}/>
                <Box sx={{ 
                    p: 2,
                    '@media print': {
                        pageBreakBefore: 'auto',
                        pageBreakInside: 'avoid',
                        marginTop: '20px'
                    }
                }}>
                    <Typography 
                        variant="h4" 
                        gutterBottom 
                        sx={{ 
                            textDecoration: 'underline', 
                            mb: 2,
                            '@media print': {
                                marginTop: '20px'
                            }
                        }}
                    >
                        Lab Orders
                    </Typography>
                    {labOrders && labOrders.length > 0 ? (
                        <TableContainer 
                            sx={{ 
                                '@media print': { 
                                    boxShadow: 'none',
                                    marginTop: '10px'
                                }
                            }}
                        >
                            <Table 
                                size="small" 
                                sx={{ 
                                    '@media print': { 
                                        borderCollapse: 'collapse',
                                        width: '100%'
                                    },
                                    '& .MuiTableCell-root': {
                                        border: '1px solid #e0e0e0',
                                        padding: '12px 16px',
                                        fontSize: '14px'
                                    }
                                }}
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell 
                                            align="left"
                                            sx={{ 
                                                fontWeight: 600,
                                                backgroundColor: '#f8f9fa',
                                                color: '#2c3e50',
                                                borderBottom: '2px solid #dee2e6',
                                                '@media print': {
                                                    backgroundColor: '#f8f9fa !important',
                                                    WebkitPrintColorAdjust: 'exact'
                                                }
                                            }}
                                        >
                                            Lab Name
                                        </TableCell>
                                        <TableCell 
                                            align="left"
                                            sx={{ 
                                                fontWeight: 600,
                                                backgroundColor: '#f8f9fa',
                                                color: '#2c3e50',
                                                borderBottom: '2px solid #dee2e6',
                                                '@media print': {
                                                    backgroundColor: '#f8f9fa !important',
                                                    WebkitPrintColorAdjust: 'exact'
                                                }
                                            }}
                                        >
                                            Status
                                        </TableCell>
                                        <TableCell 
                                            align="center"
                                            sx={{ 
                                                fontWeight: 600,
                                                backgroundColor: '#f8f9fa',
                                                color: '#2c3e50',
                                                borderBottom: '2px solid #dee2e6',
                                                '@media print': {
                                                    backgroundColor: '#f8f9fa !important',
                                                    WebkitPrintColorAdjust: 'exact'
                                                }
                                            }}
                                        >
                                            Order Date
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {labOrders.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ 
                                                '&:hover': {
                                                    backgroundColor: '#f8f9fa'
                                                },
                                                '@media print': {
                                                    '&:hover': {
                                                        backgroundColor: 'transparent'
                                                    }
                                                }
                                            }}
                                        >
                                            <TableCell 
                                                component="th" 
                                                scope="row"
                                                align="left"
                                                sx={{ 
                                                    fontWeight: 500,
                                                    color: '#2c3e50'
                                                }}
                                            >
                                                {row.labname}
                                            </TableCell>
                                            <TableCell 
                                                align="left"
                                                sx={{ 
                                                    color: '#2c3e50'
                                                }}
                                            >
                                                {row.status || 'Pending'}
                                            </TableCell>
                                            <TableCell 
                                                align="center"
                                                sx={{ 
                                                    color: '#2c3e50'
                                                }}
                                            >
                                                <Moment format="DD-MMM-YYYY">
                                                    {new Date(row.orderdate || new Date())}
                                                </Moment>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Box sx={{ 
                            p: 2, 
                            textAlign: 'center',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '4px',
                            border: '1px solid #dee2e6',
                            '@media print': {
                                marginTop: '10px'
                            }
                        }}>
                            <Typography variant="body1" sx={{ color: '#6c757d' }}>
                                No lab orders found for this visit
                            </Typography>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box className="main-class-visitsummary" sx={{ p: 2 }}>
            <SLCommonPrintComponent printContent={contentDiv} />
        </Box>
    );
}
