import React, { useState, useContext } from 'react';
import { Box, Paper, Typography, Grid, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Chip, Divider, IconButton, Tooltip } from '@mui/material';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import Moment from 'react-moment';
import { useForm } from 'react-hook-form';
import { useReactToPrint } from 'react-to-print';
import AppContext from '../../components/Context/AppContext';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../global/DataManager';
import EMRAlert from '../../Utils/CustomAlert';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import SLButton from '../../CoreComponents/SLButton';
import Translations from '../../resources/translations';
import { generateBill } from '../../Utils/UtilService';
import { FunctionalComponentToPrint } from '../../components/Print/ComponentToPrint';
import Invoice from '../../components/Invoice/Invoice';
import { useEffect } from 'react';

const InlineField = ({ label, value, onChange, disabled = false }) => (
    <TextField fullWidth size="small" variant="outlined" label={label} value={value} onChange={onChange} disabled={disabled}
        sx={{ '& .MuiInputBase-input': { fontSize: 12 }, '& .MuiInputLabel-root': { fontSize: 12 } }} />
);

const tableHeadSx = { fontWeight: 700, fontSize: 12, color: '#fff', bgcolor: '#673AB7', py: 1 };
const cellSx = { fontSize: 12, py: 0.8 };

export default function VisitServices() {
    const appContextValue = useContext(AppContext);
    const visit = appContextValue.selectedVisitDeatils;

    const [serviceoptions, setServiceOptions] = useState([]);
    const [pendingServices, setPendingServices] = useState([]);
    const [newlyAdded, setNewlyAdded] = useState([]);
    const [generatedBills, setGeneratedBills] = useState([]);
    const [invoiceData, setInvoiceData] = useState(null);
    const [enablePrint, setEnablePrint] = useState(false);
    const printRef = React.useRef();
    const { control } = useForm();

    useEffect(() => { loadExistingServices(); fetchGeneratedBills(); }, []);

    function loadExistingServices() {
        const services = (visit?.services || []).filter(s => !s.billId);
        setPendingServices(services.map(s => ({
            serviceid: s.serviceid, serviceprice: s.serviceprice,
            servicediscount: s.servicediscount || 0, servicediscountinpercentage: s.servicediscountinpercentage || 0,
            quantity: s.quantity || 1, servicetotalamount: s.servicetotalamount || s.serviceprice,
            gst: s.gst || 0, gstAmount: s.gstAmount || 0,
        })));
    }

    async function fetchGeneratedBills() {
        if (!visit?.visitid) return;
        const result = await sendRequest({ method: APIS.GET_GENERATE_BILL.METHOD, url: APIS.GET_GENERATE_BILL.URL, paramas: [visit.visitid] });
        setGeneratedBills(result || []);
    }

    async function getServiceMaterList(value) {
        if (!value) return;
        const result = await sendRequest({ method: APIS.GET_SERVICE_MASTER_DATA_BASED_SERVICENAME.METHOD, url: APIS.GET_SERVICE_MASTER_DATA_BASED_SERVICENAME.URL, paramas: [value] });
        if (result) setServiceOptions(result);
    }

    function addServicetoList(newService) {
        if (!newService) return;
        const obj = { serviceid: newService, serviceprice: newService.price, servicediscount: 0, servicediscountinpercentage: 0, quantity: 1, servicetotalamount: newService.price, gst: newService.gst || 0, gstAmount: 0 };
        setPendingServices(prev => [...prev, obj]);
        setNewlyAdded(prev => [...prev, obj]);
    }

    function calTotal(item) {
        const total = Number(item.serviceprice) * Number(item.quantity);
        const afterDiscount = total - Number(item.servicediscount || 0);
        const gstAmount = item.gst ? afterDiscount * (item.gst / 100) : 0;
        return { total: afterDiscount + gstAmount, gstAmount };
    }

    function updateService(index, key, value) {
        setPendingServices(prev => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [key]: value };
            const { total, gstAmount } = calTotal(copy[index]);
            copy[index].servicetotalamount = total;
            copy[index].gstAmount = gstAmount;
            if (key === 'servicediscount') {
                const base = Number(copy[index].quantity) * Number(copy[index].serviceprice);
                copy[index].servicediscountinpercentage = base ? ((Number(value) / base) * 100).toFixed(2) : 0;
            }
            return copy;
        });
    }

    function updateDiscountByPercent(index, pct) {
        setPendingServices(prev => {
            const copy = [...prev];
            const base = Number(copy[index].quantity) * Number(copy[index].serviceprice);
            copy[index].servicediscountinpercentage = pct;
            copy[index].servicediscount = (base * (Number(pct) / 100)).toFixed(2);
            const { total, gstAmount } = calTotal(copy[index]);
            copy[index].servicetotalamount = total;
            copy[index].gstAmount = gstAmount;
            return copy;
        });
    }

    const totalAmount = pendingServices.reduce((s, i) => s + calTotal(i).total, 0);

    async function saveServices() {
        if (newlyAdded.length === 0) { EMRAlert.alertifyError('No new services to save'); return; }
        const payload = newlyAdded.map(s => ({
            visitid: visit.visitid,
            serviceid: s.serviceid?.serviceid || s.serviceid,
            serviceprice: Number(s.serviceprice),
            servicediscount: Number(s.servicediscount || 0),
            quantity: Number(s.quantity || 1),
            servicetotalamount: Number(s.servicetotalamount || 0),
            servicediscountinpercentage: Number(s.servicediscountinpercentage || 0),
            status: 1,
        }));
        const result = await sendRequest({
            method: APIS.SAVE_VISIT_SERVICES.METHOD, url: APIS.SAVE_VISIT_SERVICES.URL, paramas: [],
            data: payload
        });
        if (result) {
            EMRAlert.alertifySuccess('Services saved successfully');
            setNewlyAdded([]);
            const copy = { ...appContextValue.selectedVisitDeatils };
            copy.services = [...(copy.services || []), ...newlyAdded];
            appContextValue.setSelectedVisitDeatils(copy);
            fetchGeneratedBills();
        } else EMRAlert.alertifyError('Not saved');
    }

    async function handleGenerateBill() {
        const result = await generateBill(visit.visitid, visit.clientid.seqid);
        if (result.status === 'succuss') { loadExistingServices(); fetchGeneratedBills(); }
    }

    const handlePrint = useReactToPrint({ content: () => printRef.current, onAfterPrint: () => setEnablePrint(false) });

    function printInvoice(row) {
        setInvoiceData({
            patientName: `${visit.clientid.firstname} ${visit.clientid.lastname}`,
            patientId: visit.clientid.seqid, date: new Date().toLocaleDateString('en-IN'),
            phoneNumber: visit.clientid.contact, doctorName: `${visit.doctor.firstname} ${visit.doctor.lastname}`,
            invoiceNumber: row.billNumber, billDate: row.billDate ? new Date(row.billDate).toLocaleDateString('en-IN') : '',
            patientAddress: '', services: row.services || [],
            billAmountBeforeDiscount: row.billAmountBeforeDiscount, visitDiscount: row.visitDiscount,
            visitDiscountPercentage: row.visitDiscountPercentage, billAmount: row.billAmount, payments: row.payments || [],
        });
        setEnablePrint(true);
        setTimeout(handlePrint, 100);
    }

    return (
        <Box sx={{ m: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Pending Services */}
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PendingActionsIcon sx={{ fontSize: 18, color: '#673AB7' }} />
                        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">PENDING SERVICES</Typography>
                        {pendingServices.length > 0 && <Chip label={pendingServices.length} size="small" sx={{ bgcolor: '#ede7f6', color: '#673AB7', fontWeight: 600 }} />}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {pendingServices.length > 0 && (
                            <SLButton variant="outlined" size="small" onClick={handleGenerateBill}
                                sx={{ textTransform: 'none', borderColor: '#673AB7', color: '#673AB7', fontSize: 12 }}>
                                Generate Bill
                            </SLButton>
                        )}
                        <SLButton variant="contained" size="small" startIcon={<SaveIcon sx={{ fontSize: 14 }} />} onClick={saveServices}
                            sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#673AB7', '&:hover': { bgcolor: '#512DA8' }, fontSize: 12 }}>
                            Save
                        </SLButton>
                    </Box>
                </Box>

                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <AutocompleteField name="serviceValues" label={Translations.visitCreation.addServices}
                                    control={control} options={serviceoptions} placeholder={Translations.visitCreation.addServices}
                                    mapvalues={{ id: 'serviceid', value: 'servicename' }} isMultiSelect={false} id="service-combo"
                                    onchangeEventCallBack={(v) => addServicetoList(v)}
                                    onInputChange={(v) => { if (v.length > 2) getServiceMaterList(v); }} />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={8} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AddCircleOutlineIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                            <Typography variant="caption" color="text.disabled">Search and select a service to add</Typography>
                        </Grid>
                    </Grid>
                </Box>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                {['Service Name', 'Price', 'Qty', 'Discount', 'Disc %', 'GST', 'Total', ''].map((h, i) => (
                                    <TableCell key={i} sx={tableHeadSx}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pendingServices.length === 0 ? (
                                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 3, color: 'text.disabled', fontSize: 13 }}>No pending services. Search and add above.</TableCell></TableRow>
                            ) : pendingServices.map((s, i) => (
                                <TableRow key={i} hover sx={{ bgcolor: i % 2 === 0 ? '#fff' : '#faf8ff', '&:last-child td': { border: 0 } }}>
                                    <TableCell sx={{ ...cellSx, fontWeight: 600 }}>{s.serviceid?.servicename}</TableCell>
                                    <TableCell sx={{ minWidth: 80 }}><InlineField label="Price" value={s.serviceprice} onChange={e => updateService(i, 'serviceprice', e.target.value)} /></TableCell>
                                    <TableCell sx={{ minWidth: 60 }}><InlineField label="Qty" value={s.quantity} onChange={e => updateService(i, 'quantity', e.target.value)} /></TableCell>
                                    <TableCell sx={{ minWidth: 80 }}><InlineField label="Disc" value={s.servicediscount} onChange={e => updateService(i, 'servicediscount', e.target.value)} /></TableCell>
                                    <TableCell sx={{ minWidth: 70 }}><InlineField label="%" value={s.servicediscountinpercentage} onChange={e => updateDiscountByPercent(i, e.target.value)} /></TableCell>
                                    <TableCell sx={{ minWidth: 70 }}><InlineField label="GST" value={Number(s.gstAmount || 0).toFixed(2)} onChange={() => {}} disabled /></TableCell>
                                    <TableCell sx={{ ...cellSx, fontWeight: 700, color: '#673AB7' }}>₹{Number(s.servicetotalamount || 0).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Remove">
                                            <IconButton size="small" onClick={() => {
                                                    setPendingServices(prev => prev.filter((_, idx) => idx !== i));
                                                    setNewlyAdded(prev => prev.filter(n => n !== pendingServices[i]));
                                                }}>
                                                <DeleteOutlineIcon sx={{ fontSize: 16, color: '#e53935' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {pendingServices.length > 0 && (
                                <>
                                    <TableRow><TableCell colSpan={8} sx={{ p: 0 }}><Divider /></TableCell></TableRow>
                                    <TableRow>
                                        <TableCell colSpan={6} align="right" sx={{ fontWeight: 600, fontSize: 12, color: 'text.secondary', border: 0, py: 0.6 }}>Total Amount</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: 13, border: 0, py: 0.6 }}>₹{totalAmount.toFixed(2)}</TableCell>
                                        <TableCell sx={{ border: 0 }} />
                                    </TableRow>
                                </>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Generated Bills */}
            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ReceiptLongIcon sx={{ fontSize: 18, color: '#673AB7' }} />
                    <Typography variant="subtitle2" fontWeight={600} color="text.secondary">GENERATED BILLS</Typography>
                    {generatedBills.length > 0 && <Chip label={generatedBills.length} size="small" sx={{ bgcolor: '#ede7f6', color: '#673AB7', fontWeight: 600 }} />}
                </Box>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                {['Bill No.', 'Bill Date', 'Total Amt', 'Disc %', 'Disc Amt', 'Net Amount', 'Paid Amt', ''].map((h, i) => (
                                    <TableCell key={i} sx={tableHeadSx}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {generatedBills.length === 0 ? (
                                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 3, color: 'text.disabled', fontSize: 13 }}>No bills generated yet</TableCell></TableRow>
                            ) : generatedBills.map((bill, i) => (
                                <TableRow key={i} hover sx={{ bgcolor: i % 2 === 0 ? '#fff' : '#faf8ff', '&:last-child td': { border: 0 } }}>
                                    <TableCell sx={{ ...cellSx, fontWeight: 600 }}>{bill.billNumber}</TableCell>
                                    <TableCell sx={cellSx}>{bill.billDate ? <Moment format="DD-MMM-YYYY">{new Date(bill.billDate)}</Moment> : '-'}</TableCell>
                                    <TableCell sx={cellSx}>₹{bill.billAmountBeforeDiscount || 0}</TableCell>
                                    <TableCell sx={cellSx}>{bill.visitDiscountPercentage || 0}%</TableCell>
                                    <TableCell sx={cellSx}>₹{bill.visitDiscount || 0}</TableCell>
                                    <TableCell sx={{ ...cellSx, fontWeight: 700, color: '#673AB7' }}>₹{bill.billAmount || 0}</TableCell>
                                    <TableCell sx={cellSx}>
                                        <Chip label={`₹${bill.paymentAmount || 0}`} size="small"
                                            sx={{ bgcolor: bill.paymentAmount >= bill.billAmount ? '#e8f5e9' : '#fff3e0', color: bill.paymentAmount >= bill.billAmount ? '#2e7d32' : '#e65100', fontWeight: 600, fontSize: 11 }} />
                                    </TableCell>
                                    <TableCell sx={cellSx}>
                                        <Tooltip title="Print Invoice">
                                            <IconButton size="small" onClick={() => printInvoice(bill)}>
                                                <PrintIcon sx={{ fontSize: 16, color: '#673AB7' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {enablePrint && invoiceData && (
                <FunctionalComponentToPrint ref={printRef}>
                    <Invoice invoiceData={invoiceData} />
                </FunctionalComponentToPrint>
            )}
        </Box>
    );
}
