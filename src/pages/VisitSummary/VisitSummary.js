import React, { useRef, forwardRef, useImperativeHandle, useEffect, useState, useContext } from 'react';
import Grid from '@mui/material/Grid';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import AppContext from '../../components/Context/AppContext';
import { Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
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
import dayjs from 'dayjs';
import moment from 'moment';
import Moment from 'react-moment';
import { useReactToPrint } from 'react-to-print';
import { FunctionalComponentToPrint } from '../../components/Print/ComponentToPrint';
import PrintIcon from '@mui/icons-material/Print';

export default function VisitSummary(props) {
    console.log("sssssssssssssssssss", props.visitEditData)
    const appContextValue = useContext(AppContext);

    const [vitalsData, setVitalsData] = useState([]);
    const [diagnosisData, setDiagnosisData] = useState([]);
    const [notes, setNotes] = useState([]);
    const [prescriptionData, setPrescriptionData] = useState([]);
    const [labOrders, setLabOrders] = useState([]);
    const [enablePrint, setEnablePrint] = useState(false);

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
            debugger
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
            console.log("sddddddddddd", result);
            setLabOrders(result);
        }

    }
    const componentRef = useRef();
    const componentRef1 = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        onAfterPrint: () => {
            setEnablePrint(false);
        },
        onBeforeGetContent: () => {
        }
    });
    const contentDiv = (
        <Card variant="outlined" ref={componentRef1} >
            <CardContent>
                <Stack direction="row" justifyContent='center' alignItems="center">
                    <Typography variant="h4" component="div"> Visit Summary</Typography>
                </Stack>
                <Divider />
                <Box sx={{ p: 2 }}>
                    <Typography variant="h4" gutterBottom sx={{ textDecoration: 'underline' }}>
                        Vitals
                    </Typography>
                    <Box sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                            <Grid xs={2}>
                                <Typography variant="h5" gutterBottom >
                                    Height :{vitalsData.height}
                                </Typography>
                            </Grid>
                            <Grid xs={2}>
                                <Typography variant="h5" gutterBottom >
                                    Weight :{vitalsData.weight}
                                </Typography>
                            </Grid>
                            <Grid xs={2}>
                                <Typography variant="h5" gutterBottom >
                                    Temperature :{vitalsData.temperature}
                                </Typography>
                            </Grid>
                            <Grid xs={2}>
                                <Typography variant="h5" gutterBottom >
                                    BP :{vitalsData.systolic + "/" + vitalsData.diastolic}
                                </Typography>
                            </Grid>
                            <Grid xs={2}>
                                <Typography variant="h5" gutterBottom >
                                    Respiratory Rate :{vitalsData.respiratoryrate}
                                </Typography>
                            </Grid>
                            <Grid xs={2}>
                                <Typography variant="h5" gutterBottom >
                                    Pluse :{vitalsData.pulse}
                                </Typography>
                            </Grid>
                            <Grid xs={2}>
                                <Typography variant="h5" gutterBottom >
                                    BMI :{vitalsData.bmi}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                    <Typography variant="h4" gutterBottom sx={{ textDecoration: 'underline' }}>Diagnosis</Typography>
                    <Typography variant="body" gutterBottom >{diagnosisData.description}</Typography>
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                    <Typography variant="h4" gutterBottom sx={{ textDecoration: 'underline' }}>Notes</Typography>
                    <Typography variant="body" gutterBottom >{notes.description}</Typography>
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                    <Typography variant="h4" gutterBottom sx={{ textDecoration: 'underline' }}>Prescriptions</Typography>
                    <Box>
                        <TableContainer>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={'30%'}>Drug Name</TableCell>
                                        <TableCell width={'30%'}>SIG</TableCell>
                                        <TableCell width={'20%'}>Start Date</TableCell>
                                        <TableCell width={'20%'}>End Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {prescriptionData.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.drugname}
                                            </TableCell>
                                            <TableCell>{row.sig}</TableCell>
                                            <TableCell>
                                                <Moment format="DD-MMM-YYYY">
                                                    {new Date(row.startdate)}
                                                </Moment>
                                            </TableCell>
                                            <TableCell>
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
                <Divider />
                <Box sx={{ p: 2 }}>
                    <Typography variant="h4" gutterBottom sx={{ textDecoration: 'underline' }}>Lab Orders</Typography>
                    <Box>
                        <TableContainer>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={'30%'}>Lab Name</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {labOrders.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.labname}
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>


                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <>
            <Box
                mt={1}
                display="flex"
                justifyContent="flex-end"
                alignItems="flex-end"
                style={{ color: 'red', cursor: 'pointer' }}
            >
                <Tooltip title="Print">
                    <PrintIcon onClick={() => {
                        setEnablePrint(true);
                        setTimeout(function () {
                            handlePrint();
                        }, 100)

                    }} />
                </Tooltip>

            </Box>

            {contentDiv}
            {enablePrint &&
                <FunctionalComponentToPrint ref={componentRef} >
                    {contentDiv}
                </FunctionalComponentToPrint>
            }
        </>

    )

}
