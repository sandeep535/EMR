import React, { useRef, useEffect, useState, useContext } from 'react';
import { Box, Divider, Paper, Tooltip, IconButton, Chip } from '@mui/material';
import { sendRequest } from '../global/DataManager';
import APIS from '../../Utils/APIS';
import AppContext from '../../components/Context/AppContext';
import EMRAlert from '../../Utils/CustomAlert';
import Vitals from '../Vitals/Vitals';
import Grid from '@mui/material/Grid';
import Notes from '../Notes/Notes';
import Prescriptions from '../Prescriptions/Prescriptions';
import { useReactToPrint } from 'react-to-print';
import { FunctionalComponentToPrint } from '../../components/Print/ComponentToPrint';
import PrintTableFomat from '../../common/Prints/PrintTableFomat';
import PrintHeaders from '../../common/PrintHeaders';
import PrintTextFormar from '../../common/Prints/PrintTextFormar';
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import StartIcon from '@mui/icons-material/Start';
import PrintIcon from '@mui/icons-material/Print';
import BlindsClosedIcon from '@mui/icons-material/BlindsClosed';
import SaveIcon from '@mui/icons-material/Save';
import Diagnosis from '../Diagnosis/Diagnosis';
import LabOrder from '../LabOrders/LabOrder';
import Invoice from '../../components/Invoice/Invoice';
import SLBreadcrumbs from '../../CoreComponents/SLBreadcrumbs';

const breadcrumbItems = [{ label: 'Go to Dashboard', link: '/vist-dashboard' }];

const statusConfig = {
    1: { label: 'Not Started', color: '#3498db' },
    2: { label: 'Inactive',    color: '#f0776c' },
    3: { label: 'In Progress', color: '#1abc9c' },
    4: { label: 'Completed',   color: '#ffd071' },
};

const SectionCard = ({ children }) => (
    <Paper variant="outlined" sx={{ borderRadius: 2, p: 1.5, height: '100%' }}>
        {children}
    </Paper>
);

export default function VisitActivity(props) {
    const appContextValue = useContext(AppContext);
    const vitalsRef = useRef();
    const notesRef = useRef();
    const diagnosissRef = useRef();
    const prescriptionRef = useRef();
    const allergiesref = useRef();
    const labRef = useRef();
    const navigate = useNavigate();
    const [enablePrint, setEnablePrint] = useState(false);
    const [customapisData, setCustomapisData] = useState({});
    var notesAPIData = [];

    useEffect(() => {
        callVisitAPis();
    }, []);

    function callVisitAPis() {
        getVitalsData();
        getNotes();
        getLabOrders();
        getPresctiptions();
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
            setCustomapisData((previousState) => {
                previousState["notesAPIData"] = result;
                return previousState;
            });
            notesRef.current.setFormData(notesAPIData.description);
        }
        getDig();
    }

    async function getLabOrders() {
        var payLoad = {
            method: APIS.GET_LAB_LIST_BASED_ON_VISITID_CLIENT_ID.METHOD,
            url: APIS.GET_LAB_LIST_BASED_ON_VISITID_CLIENT_ID.URL,
            paramas: [appContextValue.selectedVisitDeatils.visitid, 0],
        }
        let result = await sendRequest(payLoad);
        if (result) {
            var selectedLabList = [];
            result.forEach(item => { selectedLabList.push(item.labmasterid); });
            setCustomapisData((previousState) => {
                previousState["labOredersAPIdata"] = result;
                return previousState;
            });
            labRef.current.setFormData(selectedLabList);
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
            setCustomapisData((previousState) => {
                previousState["diagnosissAPIData"] = result;
                return previousState;
            });
            diagnosissRef.current.setFormData(result.dignosismasterid);
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
            prescriptionRef.current.setFormData(result);
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

    function getCommonElements(array1, array2, transType) {
        let removedLabList = [];
        array1.forEach(item => {
            const isThere = array2.some(order =>
                item.labmasterid && item.labmasterid.labid === order.labid
            );
            if (!isThere && transType == 'update') {
                item.status = 2;
                removedLabList.push(item);
            }
            if (!isThere && transType == 'new') {
                var obj = {
                    labtransid: "",
                    labname: item.labname,
                    status: item.status,
                    labmasterid: item
                }
                removedLabList.push(obj);
            }
        });
        return removedLabList;
    }

    async function handleSubmitNursedashboard() {
        notesRef.current.submitFormmData();
        vitalsRef.current.submitFormmData();
        setTimeout(() => {
            const notesData = notesRef.current.getFormData();
            if (Object.keys(customapisData).length != 0 && customapisData.notesAPIData && customapisData.notesAPIData.notesid) {
                notesData.notesid = customapisData.notesAPIData.notesid;
            }
            const vitalData = vitalsRef.current.getFormData().vitalformData;
            saveActivityData(notesData, null, vitalData, null, null);
        });
    }

    async function handlePrescriptionSubmit(event) {
        diagnosissRef.current.submitFormmData();
        notesRef.current.submitFormmData();
        vitalsRef.current.submitFormmData();
        labRef.current.submitFormmData();

        setTimeout(() => {
            const notesData = notesRef.current.getFormData();
            if (Object.keys(customapisData).length != 0 && customapisData.notesAPIData && customapisData.notesAPIData.notesid) {
                notesData.notesid = customapisData.notesAPIData.notesid;
            }
            const diagnosissData = diagnosissRef.current.getFormData();
            var diaObj = {
                dignosismasterid: diagnosissData.description,
                description: diagnosissData.description.dignosisname
            }
            if (Object.keys(customapisData).length != 0 && customapisData.diagnosissAPIData && customapisData.diagnosissAPIData.diagnosisid) {
                diaObj.diagnosisid = customapisData.diagnosissAPIData.diagnosisid;
            }
            const vitalData = vitalsRef.current.getFormData().vitalformData;
            const prescriptionData = prescriptionRef.current.getFormData();
            let labOrderData = labRef.current.getFormData();
            let labResult = [];
            let removedLabList = [];
            let finalLabData = [];
            if (labOrderData && labOrderData.description) {
                labOrderData = labOrderData.description;
                let onloadApiResData = customapisData.labOredersAPIdata;
                onloadApiResData.forEach(item => {
                    const isThere = labOrderData.some(order =>
                        item.labmasterid && item.labmasterid.labid === order.labid
                    );
                    if (!isThere) {
                        item.status = 2;
                        removedLabList.push(item);
                    }
                });
                labOrderData.forEach(order => {
                    const isAva = onloadApiResData.some(item =>
                        item.labmasterid && item.labmasterid.labid === order.labid
                    );
                    if (!isAva) {
                        labResult.push({
                            labtransid: "",
                            labname: order.labname,
                            status: order.status,
                            labmasterid: order
                        });
                    }
                });
                finalLabData = [...labResult, ...removedLabList];
            } else {
                labOrderData = null;
            }
            saveActivityData(notesData, diaObj, vitalData, prescriptionData, finalLabData);
        });
    }

    async function saveActivityData(notesData, diagnosissData, vitalData, prescriptionData, labOrderData) {
        var sendingOnj = {
            clientid: appContextValue.selectedVisitDeatils.clientid.seqid,
            visitid: appContextValue.selectedVisitDeatils.visitid,
            capturedby: 1,
            prescriptions: prescriptionData ? prescriptionData.prescriptionList : null,
            vitalsDTO: vitalData,
            notesDTO: notesData,
            diagnosisDTO: diagnosissData ? diagnosissData : null,
            labOrders: labOrderData ? labOrderData : null
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
            callVisitAPis();
        } else {
            EMRAlert.alertifyError("Not created");
        }
    }

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        onAfterPrint: () => { setEnablePrint(false); },
        onBeforeGetContent: () => {}
    });

    function backtoDashboard() {
        navigate(-1);
    }

    const visitStatus = appContextValue?.selectedVisitDeatils?.status;
    const { color: statusColor, label: statusLabel } = statusConfig[visitStatus] || { color: '#ccc', label: '' };

    return (
        <Box sx={{ m: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>

            {/* Action Bar */}
            <Paper variant="outlined" sx={{ borderRadius: 2, px: 2, py: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Left — breadcrumb */}
                <Tooltip title="Back to dashboard">
                    <Box sx={{ cursor: 'pointer' }}>
                        <SLBreadcrumbs items={breadcrumbItems} />
                    </Box>
                </Tooltip>

                {/* Right — status chip + action icons */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                        label={statusLabel}
                        size="small"
                        sx={{ bgcolor: statusColor, color: '#fff', fontWeight: 600, fontSize: 11 }}
                    />

                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                    {visitStatus == 1 && (
                        <Tooltip title="Start Visit">
                            <IconButton size="small" sx={{ color: '#1abc9c' }} onClick={() => updateVisitStatus(3, "Started")}>
                                <StartIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}

                    {visitStatus == 3 && (
                        <>
                            <Tooltip title="Save">
                                <IconButton size="small" sx={{ color: '#1976d2' }} onClick={() => handlePrescriptionSubmit()}>
                                    <SaveIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Close Visit">
                                <IconButton size="small" sx={{ color: '#f0776c' }} onClick={() => updateVisitStatus(4, "Closed")}>
                                    <BlindsClosedIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}

                    <Tooltip title="Print">
                        <IconButton size="small" sx={{ color: '#757575' }} onClick={() => {
                            setEnablePrint(true);
                            setTimeout(() => { handlePrint(); }, 100);
                        }}>
                            <PrintIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Paper>

            {/* Content */}
            <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
                <Grid container spacing={1.5}>
                    <Grid item xs={6}>
                        <SectionCard><Vitals ref={vitalsRef} /></SectionCard>
                    </Grid>
                    <Grid item xs={6}>
                        <SectionCard>
                            <Diagnosis
                                label={"Diagnosis"}
                                ref={diagnosissRef}
                                data={customapisData.diagnosissAPIData ? customapisData.diagnosissAPIData : []}
                            />
                        </SectionCard>
                    </Grid>
                    <Grid item xs={6}>
                        <SectionCard><Notes label={"General Notes"} ref={notesRef} /></SectionCard>
                    </Grid>
                    <Grid item xs={6}>
                        <SectionCard>
                            <LabOrder label={"Lab Orders"} data={customapisData.labOredersAPIdata} ref={labRef} />
                        </SectionCard>
                    </Grid>
                    <Grid item xs={12}>
                        <SectionCard><Prescriptions ref={prescriptionRef} /></SectionCard>
                    </Grid>
                </Grid>
            </Box>

            {/* Print */}
            {enablePrint && (
                <FunctionalComponentToPrint ref={componentRef}>
                    <Box sx={{ width: '100%' }}>
                        <PrintTableFomat headers={PrintHeaders.VITALS} data={[vitalsRef.current.getFormData()]} title="Vitals" />
                        <PrintTableFomat headers={PrintHeaders.PRESCRIPTIONS} data={prescriptionRef.current.getFormData().prescriptionList} title="Medications" />
                        <PrintTextFormar headers={PrintHeaders.NOTES} data={notesRef.current.getFormData()} />
                        <PrintTextFormar headers={PrintHeaders.Diagnosis} data={diagnosissRef.current.getFormData()} />
                    </Box>
                </FunctionalComponentToPrint>
            )}
        </Box>
    );
}
