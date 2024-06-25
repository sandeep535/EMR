import React, { useRef, useEffect, useState, useContext } from 'react';
import { Box } from '@mui/material'
import { sendRequest } from '../global/DataManager';
import Button from '@mui/material/Button';
import APIS from '../../Utils/APIS';
import AppContext from '../../components/Context/AppContext';
import EMRAlert from '../../Utils/CustomAlert';
import ClientBanner from '../../components/ClientBanner/ClientBanner';
import Vitals from '../Vitals/Vitals';
import Grid from '@mui/material/Grid';
import Notes from '../Notes/Notes';
import Prescriptions from '../Prescriptions/Prescriptions';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import { useReactToPrint } from 'react-to-print';
import { FunctionalComponentToPrint } from '../../components/Print/ComponentToPrint';
import PrintTableFomat from '../../common/Prints/PrintTableFomat';
import PrintHeaders from '../../common/PrintHeaders'
import PrintTextFormar from '../../common/Prints/PrintTextFormar';
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import StartIcon from '@mui/icons-material/Start';
import PrintIcon from '@mui/icons-material/Print';
import BlindsClosedIcon from '@mui/icons-material/BlindsClosed';
import Tooltip from '@mui/material/Tooltip';
import SaveIcon from '@mui/icons-material/Save';


export default function VisitActivity() {
    const appContextValue = useContext(AppContext);
    const vitalsRef = useRef();
    const notesRef = useRef();
    const diagnosissRef = useRef();
    const prescriptionRef = useRef();
    const allergiesref = useRef();
    const navigate = useNavigate();
    const [enablePrint, setEnablePrint] = useState(false);
    var notesAPIData = [];
    var diagnosissAPIData = null;

    useEffect(() => {
        callVisitAPis();
        getVisitCountBasedondate();
    }, []);
    function callVisitAPis() {
        getVitalsData();
        getNotes();
        getDig();
        getPresctiptions();
        //getAllerigies();
    }

    async function getVisitCountBasedondate() {
        var payLoad = {
            method: APIS.GET_COUNT_BASED_ON_VISITDATE.METHOD,
            url: APIS.GET_COUNT_BASED_ON_VISITDATE.URL,
            paramas: [new Date('2023-12-16')],
        }
        let result = await sendRequest(payLoad);
        if (result && result.length !== 0) {
            console.log(result);
        }
    }

    async function getVitalsData() {
        var payLoad = {
            method: APIS.GET_VITALS_DATA.METHOD,
            url: APIS.GET_VITALS_DATA.URL,
            paramas: [appContextValue.selectedVisitDeatils.visitid, 0],
        }
        let result = await sendRequest(payLoad);
        if (result && result.length !== 0) {
            vitalsRef.current.setFormData(result[0]);
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
            notesAPIData = result;
             notesRef.current.setFormData(notesAPIData.description)
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
            diagnosissAPIData = result;
             diagnosissRef.current.setFormData(diagnosissAPIData.description)
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
            prescriptionRef.current.setFormData(result)
        }
    }
    async function updateVisitStatus(status, label) {
        var payLoad = {
            method: APIS.UPDATE_VISIT_STATUS.METHOD,
            url: APIS.UPDATE_VISIT_STATUS.URL,
            paramas: [appContextValue.selectedVisitDeatils.visitid, status],
        }
        let result = await sendRequest(payLoad);
        if (result) {
            EMRAlert.alertifySuccess("Visit " + label + " succussfully");
            let copyData = { ...appContextValue.selectedVisitDeatils };
            copyData.status = status;
            appContextValue.setSelectedVisitDeatils(copyData);
        } else {
            EMRAlert.alertifyError("Not created");
        }
    }

    async function handlePrescriptionSubmit(event) {
        diagnosissRef.current.submitFormmData();
        notesRef.current.submitFormmData();
        vitalsRef.current.submitFormmData();

        setTimeout(() => {
            const notesData = notesRef.current.getFormData();
            if (notesAPIData && notesAPIData.notesid) {
                notesData.notesid = notesAPIData.notesid;
            }
            const diagnosissData = diagnosissRef.current.getFormData();
            if (diagnosissAPIData && diagnosissAPIData.diagnosisid) {
                diagnosissData.diagnosisid = diagnosissAPIData.diagnosisid;
            }
            const vitalData = vitalsRef.current.getFormData().vitalformData;
            const prescriptionData = prescriptionRef.current.getFormData();
            return false;
            saveActivityData(notesData, diagnosissData, vitalData, prescriptionData)
        });
        //const allergiesrefData = allergiesref.current.getFormData();
    }
    async function saveActivityData(notesData, diagnosissData, vitalData, prescriptionData) {
        var sendingOnj = {
            clientid: appContextValue.selectedVisitDeatils.clientid.seqid,
            visitid: appContextValue.selectedVisitDeatils.visitid,
            capturedby: 1,
            prescriptions: prescriptionData.prescriptionList,
            vitalsDTO: vitalData,
            notesDTO: notesData,
            diagnosisDTO: diagnosissData,
            //   allergies: allergiesrefData.allergiesList
        }
        var payLoad = {
            method: APIS.SAVE_VISIT_DATA.METHOD,
            url: APIS.SAVE_VISIT_DATA.URL,
            paramas: [],
            data: sendingOnj
        }
        let result = await sendRequest(payLoad);
        if (result) {
            EMRAlert.alertifySuccess("Visit data saved succussfully");
            callVisitAPis()
        } else {
            EMRAlert.alertifyError("Not created");
        }
    }

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        onAfterPrint: () => {
            setEnablePrint(false);
        },
        onBeforeGetContent: () => {
            console.log("onBeforeGetContent");
        }
    });
    function backtoDashboard() {
        navigate(-1);
    }
    return (
        <Box sx={{ m: 1 }}>
            <ClientBanner clientData={appContextValue.selectedVisitDeatils.clientid} visitData={appContextValue.selectedVisitDeatils} />
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <Box
                        mt={1}
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        style={{ color: 'red', cursor: 'pointer' }}
                    >
                        <Tooltip title="Back to dashboard">
                            <ArrowBackIosIcon onClick={() => backtoDashboard()} />
                        </Tooltip>

                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    {appContextValue && appContextValue.selectedVisitDeatils && appContextValue.selectedVisitDeatils.status == 3 &&
                        <Tooltip title="Save">
                            <SaveIcon style={{ color: 'blue', cursor: 'pointer', marginRight: '5px' }} onClick={() => { handlePrescriptionSubmit() }} />
                        </Tooltip>
                    }
                    {appContextValue && appContextValue.selectedVisitDeatils.status == 1 &&
                        <Box
                            mt={1}
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="flex-end"
                            style={{ marginRight: '5px', color: 'green', cursor: 'pointer' }}
                        >
                            <Tooltip title="Start Visit">
                                <StartIcon onClick={() => updateVisitStatus(3, "Started")} />
                            </Tooltip>

                        </Box>
                    }
                    {appContextValue && appContextValue.selectedVisitDeatils.status == 3 &&
                        <Box
                            mt={1}
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="flex-end"
                            style={{ marginRight: '5px', color: 'green', cursor: 'pointer' }}
                        >
                            <Tooltip title="Close Visit">
                                <BlindsClosedIcon onClick={() => updateVisitStatus(4, "Closed")} />
                            </Tooltip>
                        </Box>
                    }
                    <Box
                        mt={1}
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="flex-end"
                        style={{ color: 'red' }}
                    >
                        <Tooltip title="Print">
                            <PrintIcon onClick={() => {
                                setEnablePrint(true)
                                setTimeout(function () {
                                    handlePrint();
                                }, 100)

                            }} />
                        </Tooltip>

                    </Box>
                </Box>
            </Box>
            <Box style={{ height: '530px', overflowY: 'auto', marginTop: '10px' }}>
                <Grid container spacing={1} xs={12}>
                    <Grid item xs={6} spacing={4}>
                        <Vitals ref={vitalsRef} />
                    </Grid>
                    <Grid item xs={6} spacing={4}>
                           
                       <Notes label={"Diagnosis"} ref={diagnosissRef} /> 
                    </Grid>
                    {/* <Grid item xs={8}>
                        <Allergies ref={allergiesref} />
                    </Grid> */}
                </Grid>
                <Grid container spacing={1} xs={12}>
                    <Grid item xs={12} spacing={4}>
                        <Notes label={"General Notes"} ref={notesRef} />
                    </Grid>
                </Grid>
                <Grid container spacing={1} xs={12}>
                    <Grid item xs={12} spacing={4}>
                        <Prescriptions ref={prescriptionRef} />
                    </Grid>
                </Grid>
            </Box>
            {enablePrint && (
                <FunctionalComponentToPrint ref={componentRef} >
                    <Box sx={{ width: '100%' }}>
                        <PrintTableFomat headers={PrintHeaders.VITALS} data={[vitalsRef.current.getFormData()]} title="Vitals" />
                        <PrintTableFomat headers={PrintHeaders.PRESCRIPTIONS} data={prescriptionRef.current.getFormData().prescriptionList} title="Medications" />
                        <PrintTableFomat headers={PrintHeaders.ALLERIGIES} data={allergiesref.current.getFormData().allergiesList} title="Allerigies" />
                        <PrintTextFormar headers={PrintHeaders.NOTES} data={notesRef.current.getFormData()} />
                        <PrintTextFormar headers={PrintHeaders.Diagnosis} data={diagnosissRef.current.getFormData()} />
                    </Box>
                </FunctionalComponentToPrint>
            )}
        </Box>
    )
}