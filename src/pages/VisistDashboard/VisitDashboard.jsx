import React, { useRef, useEffect, useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, InputLabel } from '@mui/material'
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Translations from '../../resources/translations';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { sendRequest } from '../global/DataManager';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import APIS from '../../Utils/APIS';
import { useNavigate } from "react-router-dom";
import AppContext from '../../components/Context/AppContext';



export default function VisitDasboard() {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setTodate] = useState('');
    const [visitList, setVisitList] = useState([]);
    const appContextValue = useContext(AppContext);

    const navigate = useNavigate();
    useEffect(() => {
        getVisitDetails();
    }, []);

    async function getVisitDetails() {
        let localfromDate = fromDate ? new Date(fromDate).setHours(0, 0, 0) : new Date().setHours(0, 0, 0);
        let localtoDate = toDate ? new Date(toDate).setHours(23, 59, 59) : new Date().setHours(23, 59, 59);
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
            <Grid container spacing={2}>
                <Grid item xs={3} >
                    <TextField
                        type="date"
                        size="small"
                        variant="outlined"
                        onChange={e => setFromDate(e.target.value)}
                        value={fromDate}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3} >
                    <TextField
                        type="date"
                        size="small"
                        variant="outlined"
                        onChange={e => {
                            setTodate(e.target.value);
                            getVisitDetails();
                        }}
                        value={toDate}
                        fullWidth
                    />
                </Grid>
            </Grid>
            <Box spacing={2} sx={{ flexGrow: 1 }}>
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