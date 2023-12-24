import React, { useEffect, useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { sendRequest } from '../global/DataManager';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import APIS from '../../Utils/APIS';
import { useNavigate } from "react-router-dom";
import AppContext from '../../components/Context/AppContext';
import Container from '@mui/material/Container';
import styles from './VisitDashboard.css';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Moment from 'react-moment';
import moment from 'moment'

export default function VisitDasboard() {
    const [fromDate, setFromDate] = useState(dayjs(moment(new Date()).format("YYYY-MM-DD")));
    const [toDate, setTodate] = useState(dayjs(moment(new Date()).format("YYYY-MM-DD")));
    const [visitList, setVisitList] = useState([]);
    const appContextValue = useContext(AppContext);
    
    const navigate = useNavigate();
    useEffect(() => {
        const currentDate  = dayjs(moment(new Date()).format("YYYY-MM-DD"));
       // setFromDate(dayjs(currentDate));
     //   setTodate(dayjs(currentDate));
        getVisitDetails();
    }, [toDate]);

    async function getVisitDetails() {

        let localfromDate = fromDate ? new Date(fromDate).setHours(0, 0, 0) : new Date().setHours(0, 0, 0);
        let localtoDate = toDate ? new Date(toDate).setHours(23, 59, 59) : new Date().setHours(23, 59, 59);
        console.log(new Date(fromDate));
        console.log(new Date(toDate));
        var payLoad = {
            method: APIS.GET_VISITS.METHOD,
            url: APIS.GET_VISITS.URL,
            paramas: [new Date(localfromDate), new Date(localtoDate), 1, 20]
        }
        let result = await sendRequest(payLoad);
        if (result && result.size != 0) {
            console.log(result)
            setVisitList(result);
        }

    }

    function gotoActivitiesPage(visit) {
        appContextValue.setSelectedVisitDeatils(visit);
        navigate("/vist-activity");
    }

    return (
        <>
            <Box spacing={2} sx={{ flexGrow: 1, m: 1 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateField', 'DateField']}>
                        <Grid container >
                            <Grid item xs={3} >
                                <DatePicker
                                    label="From Date"
                                    value={fromDate}
                                    onChange={newValue => setFromDate(new Date(newValue))}
                                    format="DD-MM-YYYY"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={3} >

                                <DatePicker
                                    label="To Date"
                                    value={toDate}
                                    onChange={newValue => {
                                        setTodate(new Date(newValue))


                                    }}
                                    format="DD-MM-YYYY"
                                    fullWidth
                                />

                            </Grid>
                        </Grid>
                    </DemoContainer>
                </LocalizationProvider>
            </Box>
            <Box sx={{ flexGrow: 1, m: 1 }}>
                <Grid container spacing={2}>
                    {visitList && visitList.map(visit => {
                        return (
                            <Grid item xs={3}>
                                <Card>
                                    <CardContent>
                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            {visit.clientid.firstname}
                                        </Typography>
                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            {visit.reason}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" onClick={() => { gotoActivitiesPage(visit) }}>open</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    })}

                </Grid>
            </Box>
        </>
    )
}