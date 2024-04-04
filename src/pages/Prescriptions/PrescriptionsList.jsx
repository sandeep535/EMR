import React, { useEffect, useContext} from 'react';
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid';
import AppContext from '../../components/Context/AppContext';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { sendRequest } from '../global/DataManager';
import APIS from '../../Utils/APIS';
import Moment from 'react-moment';
import ClientBanner from '../../components/ClientBanner/ClientBanner';

const columns =[{
    id: 'date', label: 'Date'
},{
   id: 'drugname', label: 'Drug Name'
},{
   id: 'dose', label: 'Dose'
},{
    id: 'sig', label: 'SIG'
 },{
    id: 'startdate', label: 'Start Date'
 },{
    id: 'enddate', label: 'End Date'
 }]
export default function PrescriptionsList() {
    const [prescriptionlist,setPrescriptionlist] = React.useState([]);
    const appContextValue = useContext(AppContext);
    useEffect(() => {
        getprescriptionlist();
    }, []);

    async function getprescriptionlist(){
        var payLoad = {
            method: APIS.GET_PRESCRIPTIONS.METHOD,
            url: APIS.GET_PRESCRIPTIONS.URL,
            paramas: [0,appContextValue.selectedVisitDeatils.clientid.seqid],
        }
        let result = await sendRequest(payLoad);
        if (result && result.length!=0) {
            setPrescriptionlist(result);
        }
    }

    return (
        <Box m="10px">
            <Box m="10px">
                <Grid xs={12} container>
                <ClientBanner clientData={appContextValue.selectedVisitDeatils.clientid} visitData={appContextValue.selectedVisitDeatils} />

                </Grid>
                <Grid xs={12} container>
                    <Paper sx={{ mt:2,width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {prescriptionlist && prescriptionlist.map((prescription, index) => (
                                        <TableRow key={prescription.drugid}>
                                            <TableCell>{(prescription.date) ? prescription.date : ''}</TableCell>
                                            <TableCell>{(prescription && prescription.drugname) ? prescription.drugname : ""}</TableCell>
                                            <TableCell>{(prescription && prescription.dose) ? prescription.dose + "" + prescription.doseunit : ""}</TableCell>
                                            <TableCell>{(prescription && prescription.sig) ? prescription.sig : ""}</TableCell>
                                            <TableCell>{(prescription && prescription.startdate) ? <Moment format="DD-MMM-YYYY">
                                                        {new Date(prescription.startdate)}
                                            </Moment> : ""}</TableCell>
                                            <TableCell>{(prescription && prescription.endate) ? <Moment format="DD-MMM-YYYY">
                                                        {new Date(prescription.endate)}
                                            </Moment> : ""}</TableCell>
                                        </TableRow>
                                    ))}
                                    
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/* <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={employeeList.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        /> */}
                    </Paper>
                </Grid>
            </Box>
        </Box>
    )
}