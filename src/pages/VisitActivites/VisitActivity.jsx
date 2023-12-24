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
import AppContext from '../../components/Context/AppContext';
import EMRAlert from '../../Utils/CustomAlert';
import ClientBanner from '../../components/ClientBanner/ClientBanner';
import Vitals from '../Vitals/Vitals';
import Notes from '../Notes/Notes';
import Prescriptions from '../Prescriptions/Prescriptions';
import Divider from '@mui/material/Divider';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';

export default function VisitActivity() {
    const appContextValue = useContext(AppContext);
    const vitalsRef = useRef();
    const notesRef = useRef();
    const diagnosissRef = useRef();
    const prescriptionRef = useRef();
    useEffect(() => {

    }, []);
    async function updateVisitStatus(status) {
        var payLoad = {
            method: APIS.UPDATE_VISIT_STATUS.METHOD,
            url: APIS.UPDATE_VISIT_STATUS.URL,
            paramas: [appContextValue.selectedVisitDeatils.visitid, status],
        }
        let result = await sendRequest(payLoad);
        if (result) {
            EMRAlert.alertifySuccess("Visit started succussfully");
        } else {
            EMRAlert.alertifyError("Not created");
        }
    }
    async function handlePrescriptionSubmit(event){
        
        const vitalData = vitalsRef.current.getFormData();
        const notesData = notesRef.current.getFormData();
        const diagnosissData = diagnosissRef.current.getFormData();
        const prescriptionData = prescriptionRef.current.getFormData();
        debugger
        event.preventDefault();
        var sendingOnj = {
            clientid:appContextValue.selectedVisitDeatils.clientid.seqid,
            visitid:appContextValue.selectedVisitDeatils.visitid,
            capturedby:1,
            prescriptions:prescriptionData.prescriptionList,
            vitalsDTO:vitalData,
            notesDTO:notesData,
            diagnosisDTO:diagnosissData
        }
        var payLoad = {
            method: APIS.SAVE_VISIT_DATA.METHOD,
            url: APIS.SAVE_VISIT_DATA.URL,
            paramas: [],
            data:sendingOnj
        }
        let result = await sendRequest(payLoad);
        if (result) {
            EMRAlert.alertifySuccess("Visit data saved succussfully");
        } else {
            EMRAlert.alertifyError("Not created");
        }
    }
    return (
        <>
            <Box sx={{ m: 1 }}>
                <ClientBanner clientData={appContextValue.selectedVisitDeatils.clientid} visitData={appContextValue.selectedVisitDeatils} />
                {appContextValue && appContextValue.selectedVisitDeatils.status == 1 &&
                    <Box
                        mt={1}
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="flex-end"
                    >
                        <Button color="secondary" variant="outlined" onClick={() => updateVisitStatus(3)}>Start Visit</Button>
                    </Box>
                }
                {appContextValue && appContextValue.selectedVisitDeatils.status == 3 &&
                    <Box
                        mt={1}
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="flex-end"
                    >
                        <Button color="secondary" variant="outlined" onClick={() => updateVisitStatus(4)}>Close Visit</Button>
                    </Box>
                }
                <form onSubmit={handlePrescriptionSubmit}>
                    <Vitals ref={vitalsRef}/>
                    <Divider sx={{ color: "secondary.light", fontSize: 14 }} textAlign="left">General Notes</Divider>
                    <Notes label={"General Notes"} ref={notesRef}/>
                    <Divider sx={{ color: "secondary.light", fontSize: 14 }} textAlign="left">Diagnosis</Divider>
                    <Notes label={"Diagnosis"}  ref={diagnosissRef}/>
                    <Divider sx={{ color: "secondary.light", fontSize: 14 }} textAlign="left">Prescriptions</Divider>
                    <Prescriptions  ref={prescriptionRef}/>
                 <FormButtonComponent button1={"Save"} button2={"Clear"} />
                </form>
            </Box>

        </>
    )
}