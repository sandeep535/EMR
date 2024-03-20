import React, { useEffect, useState, useContext, forwardRef, useImperativeHandle } from 'react';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid';
import AppContext from '../../components/Context/AppContext';
import Translations from '../../resources/translations';
import DemoPaper from '../../Utils/CustomCssUtil';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { sendRequest } from '../global/DataManager';
import APIS from '../../Utils/APIS';
import ClientBanner from '../../components/ClientBanner/ClientBanner';

const columns =[{
    id: 'date', label: 'Date'
},{
   id: 'height', label: 'Height'
},{
   id: 'weight', label: 'Weight'
},{
    id: 'bmi', label: 'BMI'
 },{
    id: 'BP', label: 'BP'
 },{
    id: 'pulse', label: 'Pulse'
 },{
    id: 'respiratoryrate', label: 'Respiratory Rate'
 },{
    id: 'temp', label: 'Temerature'
 }]
export default function VisitCreation() {
    const [vitalsList,setVitalsList] = React.useState([]);
    const appContextValue = useContext(AppContext);
    useEffect(() => {
        getVitalsData();
    }, []);

    async function getVitalsData(){
        var payLoad = {
            method: APIS.GET_VITALS_DATA.METHOD,
            url: APIS.GET_VITALS_DATA.URL,
            paramas: [0,appContextValue.selectedVisitDeatils.clientid.seqid],
        }
        let result = await sendRequest(payLoad);
        if (result && result.length!=0) {
            setVitalsList(result);
        }
    }

    return (
        <Box m="10px">
            <Box m="10px">
                <Grid xs={12} container>
                <ClientBanner clientData={appContextValue.selectedVisitDeatils.clientid} visitData={appContextValue.selectedVisitDeatils} />

                </Grid>
                <Grid xs={12}  container>
                    <Paper sx={{ width: '100%', overflow: 'hidden',mt:2 }}>
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
                                    {vitalsList && vitalsList.map((vital, index) => (
                                        <TableRow key={vital.id}>
                                            <TableCell>{(vital.date) ? vital.date : ''}</TableCell>
                                            <TableCell>{(vital.height) ? vital.height : ''}</TableCell>
                                            <TableCell>{(vital.weight) ? vital.weight : ''}</TableCell>
                                            <TableCell>{(vital.bmi) ? vital.bmi : ''}</TableCell>
                                            <TableCell>{(vital.systolic) ? vital.systolic +"/"+vital.diastolic : ''}</TableCell>
                                            <TableCell>{(vital.pulse) ? vital.pulse : ''}</TableCell>
                                            <TableCell>{(vital.respiratoryrate) ? vital.respiratoryrate : ''}</TableCell>
                                            <TableCell>{(vital.temperature) ? vital.temperature : ''}</TableCell>
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