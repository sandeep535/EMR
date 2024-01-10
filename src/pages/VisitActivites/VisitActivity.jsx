import React, { useRef, useEffect, useState, useContext } from 'react';
import { Box } from '@mui/material'
import { sendRequest } from '../global/DataManager';
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
import Allergies from '../Allergies/Allergies';


export default function VisitActivity() {
    const appContextValue = useContext(AppContext);
    const vitalsRef = useRef();
    const notesRef = useRef();
    const diagnosissRef = useRef();
    const prescriptionRef = useRef();
    const allergiesref = useRef();
    var notesAPIData = [];
    var diagnosissAPIData = [];
    useEffect(() => {
        callVisitAPis();
    }, []);
    function callVisitAPis(){
        getVitalsData();
        getNotes();
        getDig();
        getPresctiptions();
        getAllerigies();
    }
    async function getAllerigies(){
        var payLoad = {
            method: APIS.GET_ALLERIGIES_DATA.METHOD,
            url: APIS.GET_ALLERIGIES_DATA.URL,
            paramas: [appContextValue.selectedVisitDeatils.visitid,0],
        }
        let result = await sendRequest(payLoad);
        if (result && result.length!=0) {
            allergiesref.current.setFormData1(result);
        }
    }
    async function getVitalsData(){
        var payLoad = {
            method: APIS.GET_VITALS_DATA.METHOD,
            url: APIS.GET_VITALS_DATA.URL,
            paramas: [appContextValue.selectedVisitDeatils.visitid,0],
        }
        let result = await sendRequest(payLoad);
        if (result && result.length!=0) {
            vitalsRef.current.setFormData1(result[0]);
        }
    }
    async function getNotes(){
        var payLoad = {
            method: APIS.GET_NOTES.METHOD,
            url: APIS.GET_NOTES.URL,
            paramas: [appContextValue.selectedVisitDeatils.visitid],
        }
        let result = await sendRequest(payLoad);
        if (result) {
            notesAPIData = result;
            notesRef.current.setFormData1(result)
        }
    }
    async function getDig(){
        var payLoad = {
            method: APIS.GET_DIAGNOSIS.METHOD,
            url: APIS.GET_DIAGNOSIS.URL,
            paramas: [appContextValue.selectedVisitDeatils.visitid],
        }
        let result = await sendRequest(payLoad);
        if (result) {
            diagnosissAPIData = result;
            diagnosissRef.current.setFormData1(result);
        }
    }
    async function getPresctiptions(){
        var payLoad = {
            method: APIS.GET_PRESCRIPTIONS.METHOD,
            url: APIS.GET_PRESCRIPTIONS.URL,
            paramas: [appContextValue.selectedVisitDeatils.visitid,0],
        }
        let result = await sendRequest(payLoad);
        if (result) {
            prescriptionRef.current.setFormData1(result)
        }
    }
    async function updateVisitStatus(status,label) {
        var payLoad = {
            method: APIS.UPDATE_VISIT_STATUS.METHOD,
            url: APIS.UPDATE_VISIT_STATUS.URL,
            paramas: [appContextValue.selectedVisitDeatils.visitid, status],
        }
        let result = await sendRequest(payLoad);
        if (result) {
            EMRAlert.alertifySuccess("Visit "+label+" succussfully");
            let copyData = {...appContextValue.selectedVisitDeatils};
            copyData.status = status;
            appContextValue.setSelectedVisitDeatils(copyData);
        } else {
            EMRAlert.alertifyError("Not created");
        }
    }
    async function handlePrescriptionSubmit(event){
        
        const vitalData = vitalsRef.current.getFormData();
        const notesData = notesRef.current.getFormData();
        if(notesAPIData && notesAPIData.notesid){
            notesData.notesid = notesAPIData.notesid;
        }
        const diagnosissData = diagnosissRef.current.getFormData();
        if(diagnosissAPIData && diagnosissAPIData.diagnosisid){
            diagnosissData.diagnosisid = diagnosissAPIData.diagnosisid;
        }
        const prescriptionData = prescriptionRef.current.getFormData();
        const allergiesrefData = allergiesref.current.getFormData();
        event.preventDefault();
        var sendingOnj = {
            clientid:appContextValue.selectedVisitDeatils.clientid.seqid,
            visitid:appContextValue.selectedVisitDeatils.visitid,
            capturedby:1,
            prescriptions:prescriptionData.prescriptionList,
            vitalsDTO:vitalData,
            notesDTO:notesData,
            diagnosisDTO:diagnosissData,
            allergies:allergiesrefData.allergiesList
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
            callVisitAPis()
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
                        <Button color="secondary" variant="outlined" onClick={() => updateVisitStatus(3,"Started")}>Start Visit</Button>
                    </Box>
                }
                {appContextValue && appContextValue.selectedVisitDeatils.status == 3 &&
                    <Box
                        mt={1}
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="flex-end"
                    >
                        <Button color="secondary" variant="outlined" onClick={() => updateVisitStatus(4,"Closed")}>Close Visit</Button>
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
                    <Divider sx={{ color: "secondary.light", fontSize: 14 }} textAlign="left">Allerigies</Divider>
                    <Allergies  ref={allergiesref}/>
                   {appContextValue && appContextValue.selectedVisitDeatils && appContextValue.selectedVisitDeatils.status == 3 && <FormButtonComponent button1={"Save"} button2={"Clear"} />}
                </form>
            </Box>

        </>
    )
}