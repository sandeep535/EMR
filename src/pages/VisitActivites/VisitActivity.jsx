import React, { useRef, useEffect, useState,useContext } from 'react';
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
import AppContext from '../../components/Context/AppContext';
import EMRAlert from '../../Utils/CustomAlert';

export default function VisitActivity() {
    const appContextValue  = useContext(AppContext);
    console.log(appContextValue.selectedVisitDeatils);
    debugger
    useEffect(() => {

    }, []);
    async function updateVisitStatus(status) {
        var payLoad = {
            method: APIS.UPDATE_VISIT_STATUS.METHOD,
            url: APIS.UPDATE_VISIT_STATUS.URL,
            paramas: [appContextValue.selectedVisitDeatils.visitid,status],
        }
        let result = await sendRequest(payLoad);
        if (result) {
            EMRAlert.alertifySuccess("Visit started succussfully");
        } else {
            EMRAlert.alertifyError("Not created");
        }
    }
    return (
        <>
        {appContextValue && appContextValue.selectedVisitDeatils.status == 1 &&
            <Box
                m={1}
                display="flex"
                justifyContent="flex-end"
                alignItems="flex-end"
            >
                <Button color="secondary" variant="outlined" onClick={()=>updateVisitStatus(3)}>Start Visit</Button>
            </Box>
        }
         {appContextValue && appContextValue.selectedVisitDeatils.status == 3 &&
            <Box
                m={1}
                display="flex"
                justifyContent="flex-end"
                alignItems="flex-end"
            >
                <Button color="secondary" variant="outlined" onClick={()=>updateVisitStatus(4)}>Close Visit</Button>
            </Box>
        }
            

        </>
    )
}