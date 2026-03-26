import React, { useEffect, useState, useContext, useRef } from 'react';
import { Box, Paper, Typography, Grid, Divider, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip } from '@mui/material';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import MedicationIcon from '@mui/icons-material/Medication';
import BiotechIcon from '@mui/icons-material/Biotech';
import PersonIcon from '@mui/icons-material/Person';
import PrintIcon from '@mui/icons-material/Print';
import Moment from 'react-moment';
import { useReactToPrint } from 'react-to-print';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import AppContext from '../../components/Context/AppContext';

const SectionHeader = ({ icon, title, count }) => (
    <Box className="section-header" sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon}
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.5 }}>{title}</Typography>
        </Box>
        {count > 0 && <Chip label={count} size="small" sx={{ bgcolor: '#ede7f6', color: '#673AB7', fontWeight: 600, fontSize: 11 }} />}
    </Box>
);

const VitalItem = ({ label, value, unit }) => (
    <Box sx={{ p: 1.5, bgcolor: '#fafafa', borderRadius: 1, border: '1px solid #eeeeee' }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">{label}</Typography>
        <Typography variant="body1" fontWeight={700} color="#333">{value || '-'}{value && unit ? ` ${unit}` : ''}</Typography>
    </Box>
);

export default function VisitSummary() {
    const appContextValue = useContext(AppContext);
    const visit = appContextValue.selectedVisitDeatils;
    const printRef = useRef();

    const [vitalsData, setVitalsData] = useState({});
    const [diagnosisData, setDiagnosisData] = useState({});
    const [notes, setNotes] = useState({});
    const [prescriptionData, setPrescriptionData] = useState([]);
    const [labOrders, setLabOrders] = useState([]);

    useEffect(() => {
        getVitalsData(); getDig(); getNotes(); getPresctiptions(); getLabOrders();
    }, []);

    async function getVitalsData() {
        const r = await sendRequest({ method: APIS.GET_VITALS_DATA.METHOD, url: APIS.GET_VITALS_DATA.URL, paramas: [visit.visitid, 0] });
        if (r?.length) setVitalsData(r[0]);
    }
    async function getDig() {
        const r = await sendRequest({ method: APIS.GET_DIAGNOSIS.METHOD, url: APIS.GET_DIAGNOSIS.URL, paramas: [visit.visitid] });
        if (r) setDiagnosisData(r);
    }
    async function getNotes() {
        const r = await sendRequest({ method: APIS.GET_NOTES.METHOD, url: APIS.GET_NOTES.URL, paramas: [visit.visitid] });
        if (r) setNotes(r);
    }
    async function getPresctiptions() {
        const r = await sendRequest({ method: APIS.GET_PRESCRIPTIONS.METHOD, url: APIS.GET_PRESCRIPTIONS.URL, paramas: [visit.visitid, 0] });
        if (r) setPrescriptionData(r);
    }
    async function getLabOrders() {
        const r = await sendRequest({ method: APIS.GET_LAB_LIST_BASED_ON_VISITID_CLIENT_ID.METHOD, url: APIS.GET_LAB_LIST_BASED_ON_VISITID_CLIENT_ID.URL, paramas: [visit.visitid, 0] });
        if (r) setLabOrders(r);
    }

    const handlePrint = useReactToPrint({ content: () => printRef.current });

    const patientName = `${visit?.clientid?.firstname || ''} ${visit?.clientid?.lastname || ''}`.trim();
    const doctorName = `Dr. ${visit?.doctor?.firstname || ''} ${visit?.doctor?.lastname || ''}`.trim();
    const visitDate = visit?.visitdate ? new Date(visit.visitdate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

    return (
        <Box sx={{ m: 1 }}>
            {/* Print styles injected into head */}
            <style>{`
                @media print {
                    @page { size: A4 portrait; margin: 12mm 14mm; }
                    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    .no-print { display: none !important; }
                    .print-patient-header { background-color: #673AB7 !important; color: #fff !important; }
                    .print-table-head th { background-color: #673AB7 !important; color: #fff !important; }
                    .section-header { background-color: #f5f7fa !important; }
                    .vital-item { background-color: #fafafa !important; border: 1px solid #eeeeee !important; }
                    .print-area { padding: 0 !important; }
                    .MuiPaper-root { box-shadow: none !important; }
                }
            `}</style>

            {/* Print button — hidden on print */}
            <Box className="no-print" sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
                <Tooltip title="Print Visit Summary">
                    <IconButton onClick={handlePrint}
                        sx={{ bgcolor: '#673AB7', color: '#fff', borderRadius: 2, px: 2, gap: 0.5, '&:hover': { bgcolor: '#512DA8' } }}>
                        <PrintIcon fontSize="small" />
                        <Typography variant="caption" fontWeight={600} color="#fff">Print</Typography>
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Printable area */}
            <Box ref={printRef} className="print-area">

                {/* Patient Header */}
                <Box className="print-patient-header"
                    sx={{ bgcolor: '#673AB7', borderRadius: 2, px: 2.5, py: 1.8, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <PersonIcon sx={{ color: '#fff', fontSize: 28 }} />
                        <Box>
                            <Typography fontWeight={700} fontSize={16} color="#fff">{patientName}</Typography>
                            <Typography fontSize={11} color="rgba(255,255,255,0.85)">
                                Patient ID: {visit?.clientid?.seqid}&nbsp;&nbsp;|&nbsp;&nbsp;Phone: {visit?.clientid?.contact}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography fontSize={13} fontWeight={600} color="#fff">{doctorName}</Typography>
                        <Typography fontSize={11} color="rgba(255,255,255,0.85)">
                            Visit #{visit?.visitid}&nbsp;&nbsp;|&nbsp;&nbsp;{visitDate}
                        </Typography>
                    </Box>
                </Box>

                <Grid container spacing={2}>

                    {/* Vitals */}
                    <Grid item xs={12}>
                        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                            <SectionHeader icon={<MonitorHeartIcon sx={{ fontSize: 16, color: '#673AB7' }} />} title="Vitals" />
                            <Box sx={{ p: 2 }}>
                                <Grid container spacing={1.5}>
                                    {[
                                        { label: 'Height', value: vitalsData.height, unit: 'cm' },
                                        { label: 'Weight', value: vitalsData.weight, unit: 'kg' },
                                        { label: 'BMI', value: vitalsData.bmi },
                                        { label: 'Blood Pressure', value: vitalsData.systolic && vitalsData.diastolic ? `${vitalsData.systolic}/${vitalsData.diastolic}` : null, unit: 'mmHg' },
                                        { label: 'Pulse', value: vitalsData.pulse, unit: 'bpm' },
                                        { label: 'Temperature', value: vitalsData.temperature, unit: '°F' },
                                        { label: 'Resp. Rate', value: vitalsData.respiratoryrate, unit: '/min' },
                                    ].map((v, i) => (
                                        <Grid item xs={6} sm={3} key={i}>
                                            <Box className="vital-item" sx={{ p: 1.5, bgcolor: '#fafafa', borderRadius: 1, border: '1px solid #eeeeee' }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">{v.label}</Typography>
                                                <Typography fontWeight={700} fontSize={14} color="#333">
                                                    {v.value || '-'}{v.value && v.unit ? ` ${v.unit}` : ''}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Diagnosis */}
                    <Grid item xs={12} sm={6}>
                        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', height: '100%' }}>
                            <SectionHeader icon={<CoronavirusIcon sx={{ fontSize: 16, color: '#673AB7' }} />} title="Diagnosis" />
                            <Box sx={{ p: 2 }}>
                                <Typography variant="body2" color={diagnosisData.description ? '#333' : 'text.disabled'}>
                                    {diagnosisData.description || 'No diagnosis recorded'}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Notes */}
                    <Grid item xs={12} sm={6}>
                        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', height: '100%' }}>
                            <SectionHeader icon={<NoteAltIcon sx={{ fontSize: 16, color: '#673AB7' }} />} title="Clinical Notes" />
                            <Box sx={{ p: 2 }}>
                                <Typography variant="body2" color={notes.description ? '#333' : 'text.disabled'} sx={{ whiteSpace: 'pre-wrap' }}>
                                    {notes.description || 'No notes recorded'}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Prescriptions */}
                    <Grid item xs={12}>
                        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                            <SectionHeader icon={<MedicationIcon sx={{ fontSize: 16, color: '#673AB7' }} />} title="Prescriptions" count={prescriptionData.length} />
                            <TableContainer>
                                <Table size="small">
                                    <TableHead className="print-table-head">
                                        <TableRow>
                                            {['#', 'Drug Name', 'Dose', 'SIG', 'Instructions', 'Start Date', 'End Date'].map((h, i) => (
                                                <TableCell key={i} sx={{ fontWeight: 700, fontSize: 12, color: '#fff', bgcolor: '#673AB7', py: 1 }}>{h}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {prescriptionData.length === 0 ? (
                                            <TableRow><TableCell colSpan={7} align="center" sx={{ py: 2.5, color: 'text.disabled', fontSize: 12 }}>No prescriptions recorded</TableCell></TableRow>
                                        ) : prescriptionData.map((row, i) => (
                                            <TableRow key={i} sx={{ bgcolor: i % 2 === 0 ? '#fff' : '#faf8ff', '&:last-child td': { border: 0 } }}>
                                                <TableCell sx={{ fontSize: 12, py: 0.8 }}>{i + 1}</TableCell>
                                                <TableCell sx={{ fontSize: 12, py: 0.8, fontWeight: 600 }}>{row.drugname}</TableCell>
                                                <TableCell sx={{ fontSize: 12, py: 0.8 }}>{row.dose} {row.doseunit}</TableCell>
                                                <TableCell sx={{ fontSize: 12, py: 0.8 }}>{row.sig || '-'}</TableCell>
                                                <TableCell sx={{ fontSize: 12, py: 0.8 }}>{row.instructions || '-'}</TableCell>
                                                <TableCell sx={{ fontSize: 12, py: 0.8 }}>{row.startdate ? <Moment format="DD-MMM-YYYY">{new Date(row.startdate)}</Moment> : '-'}</TableCell>
                                                <TableCell sx={{ fontSize: 12, py: 0.8 }}>{row.endate ? <Moment format="DD-MMM-YYYY">{new Date(row.endate)}</Moment> : '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>

                    {/* Lab Orders */}
                    <Grid item xs={12}>
                        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                            <SectionHeader icon={<BiotechIcon sx={{ fontSize: 16, color: '#673AB7' }} />} title="Lab Orders" count={labOrders.length} />
                            <TableContainer>
                                <Table size="small">
                                    <TableHead className="print-table-head">
                                        <TableRow>
                                            {['#', 'Lab Test', 'Status'].map((h, i) => (
                                                <TableCell key={i} sx={{ fontWeight: 700, fontSize: 12, color: '#fff', bgcolor: '#673AB7', py: 1 }}>{h}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {labOrders.length === 0 ? (
                                            <TableRow><TableCell colSpan={3} align="center" sx={{ py: 2.5, color: 'text.disabled', fontSize: 12 }}>No lab orders recorded</TableCell></TableRow>
                                        ) : labOrders.map((row, i) => (
                                            <TableRow key={i} sx={{ bgcolor: i % 2 === 0 ? '#fff' : '#faf8ff', '&:last-child td': { border: 0 } }}>
                                                <TableCell sx={{ fontSize: 12, py: 0.8 }}>{i + 1}</TableCell>
                                                <TableCell sx={{ fontSize: 12, py: 0.8, fontWeight: 600 }}>{row.labname || row.labmasterid?.labname}</TableCell>
                                                <TableCell sx={{ fontSize: 12, py: 0.8 }}>
                                                    <Chip label={row.status === 1 ? 'Active' : 'Completed'} size="small"
                                                        sx={{ bgcolor: row.status === 1 ? '#e8f5e9' : '#e3f2fd', color: row.status === 1 ? '#2e7d32' : '#1976d2', fontWeight: 600, fontSize: 11 }} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>

                    {/* Print footer */}
                    <Grid item xs={12}>
                        <Divider sx={{ mt: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
                            <Typography variant="caption" color="text.disabled">
                                Generated on {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                                {doctorName} &nbsp;|&nbsp; Visit #{visit?.visitid}
                            </Typography>
                        </Box>
                    </Grid>

                </Grid>
            </Box>
        </Box>
    );
}
