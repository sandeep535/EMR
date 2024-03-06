import React, { useEffect, useState, useContext,useRef } from 'react';
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
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Moment from 'react-moment';
import moment from 'moment';
import styles from './VisitDashboardCss';

const borderColor = {
    1: 'green',
    2: 'red',
    3: 'blue',
    4: 'orange'
}
const visitStatus = {
    1: "Visit Not Started",
    2: 'Visit In-active',
    3: 'Visit In progress',
    4: 'Visit Complted'
}

export default function VisitDasboard() {
    const [fromDate, setFromDate] = useState(dayjs(moment(new Date()).format("YYYY-MM-DD")));
    const [toDate, setTodate] = useState(dayjs(moment(new Date()).format("YYYY-MM-DD")));
    const [visitList, setVisitList] = useState([]);
    const appContextValue = useContext(AppContext);
    const listInnerRef = useRef();
    const [count,setCount] = useState(0);

    const navigate = useNavigate();
    useEffect(() => {
        getVisitDetails();
    }, [toDate, fromDate]);
    useEffect(() => {
        getVisitDetails();
    },[count])
  
    async function getVisitDetails() {
        let localfromDate = fromDate ? new Date(fromDate).setHours(0, 0, 0) : new Date().setHours(0, 0, 0);
        let localtoDate = toDate ? new Date(toDate).setHours(23, 59, 59) : new Date().setHours(23, 59, 59);
        var payLoad = {
            method: APIS.GET_VISITS.METHOD,
            url: APIS.GET_VISITS.URL,
            paramas: [new Date(localfromDate), new Date(localtoDate), count, 25]
        }
        let result = await sendRequest(payLoad);
        if (result && result.size != 0) {
            console.log(result)
            setVisitList(result);
        }

    }

    function gotoActivitiesPage(visit) {
        appContextValue.setSelectedVisitDeatils(visit);
        var copyData = [...appContextValue.leftMenuList];
        copyData.map(item => {
            if (item.hasOwnProperty("isPatientSpecific")) {
                item.isPatientSpecific = true;
            }
        });
        appContextValue.setLeftMenuList(copyData);
        navigate("/vist-activity");
    }

    return (
        <>
            <Box sx={{ flexGrow: 1, m: 1 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateField', 'DateField']}>
                        <Grid container >
                            <Grid item xs={2} spacing={1}>
                                <DatePicker
                                    label="From Date"
                                    value={fromDate}
                                    onChange={newValue => setFromDate(new Date(newValue))}
                                    format="DD-MM-YYYY"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={2} spacing={1} sx={{ ml: 1 }}>
                                <DatePicker
                                    label="To Date"
                                    value={toDate}
                                    onChange={newValue => {
                                        setTodate(new Date(newValue));
                                    }}
                                    format="DD-MM-YYYY"
                                    fullWidth
                                />

                            </Grid>
                        </Grid>
                    </DemoContainer>
                </LocalizationProvider>
            </Box>
            <Box sx={{ m: 1 }} className='visit-cards-div' ref={listInnerRef}>
                <Grid container spacing={1}  >
                    {visitList && visitList.map(visit => {
                        return (
                            <Grid item xs={3} >
                                <Card sx={styles[borderColor[visit.status]]}>
                                    <CardContent sx={{ m: 1 }}>
                                        <Box sx={styles.wrapper}>
                                            <Typography sx={{ fontSize: 14, fontWeight: 900 }} color="text.secondary" gutterBottom>
                                                {visit.clientid.firstname}
                                            </Typography>
                                            <Typography sx={{ fontSize: 14, fontWeight: 900 }} color="text.secondary" gutterBottom>
                                                {<Moment format="DD-MMM-YYYY">
                                                    {new Date(visit.visitdate)}
                                                </Moment>}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            {visit.reason}
                                        </Typography>
                                        <Box sx={styles.wrapper}>
                                            <Typography sx={{ fontSize: 14, fontWeight: 900 }} color="text.secondary" gutterBottom>
                                                {visitStatus[visit.status]}
                                            </Typography>
                                            <Typography sx={{ fontSize: 14, fontWeight: 900 }} color="text.secondary" gutterBottom>
                                                {visit.doctor.firstname + " " + visit.doctor.lastname}
                                            </Typography>
                                        </Box>
                                        <Button size="small" variant="outlined" onClick={() => { gotoActivitiesPage(visit) }}>Go to visit</Button>

                                    </CardContent>

                                </Card>
                            </Grid>
                        )
                    })}

                </Grid>

            </Box>
        </>
    )
}