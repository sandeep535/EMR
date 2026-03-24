import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Chip, Divider, IconButton, Tooltip } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import { useForm } from 'react-hook-form';
import GeneratedBillsList from '../../pages/Bills/GeneratedBillsList';

const InlineField = ({ label, value, onChange, disabled = false }) => (
  <TextField
    fullWidth size="small" variant="outlined" label={label}
    value={value} onChange={onChange} disabled={disabled}
    sx={{ '& .MuiInputBase-input': { fontSize: 12 }, '& .MuiInputLabel-root': { fontSize: 12 } }}
  />
);

const SummaryRow = ({ label, value, highlight = false, children }) => (
  <TableRow sx={{ bgcolor: highlight ? '#f0f7ff' : 'transparent' }}>
    <TableCell colSpan={5} align="right" sx={{ fontWeight: 600, fontSize: 12, color: highlight ? '#1976d2' : 'text.secondary', border: 0, py: 0.8 }}>
      {label}
    </TableCell>
    <TableCell sx={{ fontWeight: highlight ? 700 : 500, fontSize: 13, color: highlight ? '#1976d2' : 'text.primary', border: 0, py: 0.8 }}>
      {children || (value !== undefined ? `₹${Number(value || 0).toFixed(2)}` : '-')}
    </TableCell>
  </TableRow>
);

const VisitServiceList = forwardRef((props, ref) => {
  const [visitServiceList, setVisitServiceList] = React.useState([]);
  const [visitdiscount, setVisitdiscount] = React.useState(0);
  const [visitpercentage, setVisitpercentage] = React.useState(0);
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [visittotalamount, setVisittotalamount] = React.useState(0);
  const [serviceoptions, setServiceOptions] = React.useState([]);
  const [visitId, setVisitId] = React.useState('');
  const [paidAmount, setPaidAmount] = React.useState(0);

  const { control } = useForm();

  useImperativeHandle(ref, () => ({
    getVisistsList() { return { visitServiceList, visitdiscount, visittotalamount, visitpercentage }; },
    setVisitServiceList(data) {
      setVisitId(data.visitId);
      setVisitServiceList((data.visitServiceList || []).filter(s => !s.billId));
      setVisitdiscount(data.visitdiscount);
      setVisittotalamount(data.visittotalamount);
      setVisitpercentage(data.visitpercentage);
    },
  }));

  useEffect(() => { updateTotalAmount(); }, [visitServiceList]);

  function calParticularServiceTotalAmount(data) {
    let total = Number(data.serviceprice) * Number(data.quantity);
    let afterDiscount = total - data.servicediscount;
    let gstAmount = data.gst ? afterDiscount * (data.gst / 100) : 0;
    return { totalAmountAfterDiscount: afterDiscount + gstAmount, gstAmount };
  }

  function setChangesToVisistServicelist(data, index, key) {
    let copy = [...visitServiceList];
    copy[index][key] = data;
    let { totalAmountAfterDiscount, gstAmount } = calParticularServiceTotalAmount(copy[index]);
    copy[index].servicetotalamount = totalAmountAfterDiscount;
    if (gstAmount) copy[index].gstAmount = gstAmount;
    copy = calPercentage(data, index, key, copy);
    setVisitServiceList(copy);
  }

  function updateTotalAmount() {
    let total = visitServiceList.reduce((sum, item) => sum + calParticularServiceTotalAmount(item).totalAmountAfterDiscount, 0);
    setTotalAmount(total);
    setVisittotalamount(total - visitdiscount);
    setPaidAmount(total - visitdiscount);
  }

  function calPercentage(data, index, key, copy) {
    let item = copy[index];
    item.servicediscountinpercentage = ((Number(item.servicediscount) / (Number(item.quantity) * Number(item.serviceprice))) * 100).toFixed(2);
    copy[index] = item;
    return copy;
  }

  function calDiscountBasedonPercentage(data, index) {
    let copy = [...visitServiceList];
    copy[index].servicediscountinpercentage = data;
    let item = copy[index];
    let discount = (Number(item.quantity) * Number(item.serviceprice)) * (Number(data) / 100);
    copy[index].servicediscount = discount;
    setVisitServiceList(copy);
  }

  function calVisitDiscountAmountBAsedonPercentage(value) {
    let discount = totalAmount * (Number(value) / 100);
    setVisitdiscount(discount);
  }

  function calPercentageBasedOnDiscount(value) {
    setVisitpercentage(((Number(value) / totalAmount) * 100).toFixed(2));
  }

  function removeService(index) {
    setVisitServiceList(prev => prev.filter((_, i) => i !== index));
  }

  function addServicetoList(newService) {
    let obj = { serviceid: newService, serviceprice: newService.price, servicediscount: 0, servicediscountinpercentage: 0, quantity: 1, servicetotalamount: newService.price, gst: newService.gst, gstAmount: 0 };
    let { totalAmountAfterDiscount, gstAmount } = calParticularServiceTotalAmount(obj);
    obj.servicetotalamount = totalAmountAfterDiscount;
    obj.gstAmount = gstAmount;
    setVisitServiceList(prev => [...prev, obj]);
  }

  async function getServiceMaterList(value) {
    if (!value) return;
    const result = await sendRequest({ method: APIS.GET_SERVICE_MASTER_DATA_BASED_SERVICENAME.METHOD, url: APIS.GET_SERVICE_MASTER_DATA_BASED_SERVICENAME.URL, paramas: [value] });
    if (result) setServiceOptions(result);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

      {/* Service Search */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AddCircleOutlineIcon sx={{ color: '#1976d2', fontSize: 20 }} />
        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">ADD SERVICES</Typography>
      </Box>
      <Grid container>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <AutocompleteField
              name="serviceValues"
              label={Translations.visitCreation.addServices}
              control={control}
              options={serviceoptions}
              placeholder={Translations.visitCreation.addServices}
              mapvalues={{ id: 'serviceid', value: 'servicename' }}
              isMultiSelect={false}
              id="service-controllable-states-demo"
              onchangeEventCallBack={(newValue) => addServicetoList(newValue)}
              onInputChange={(data) => { if (data.length > 3) getServiceMaterList(data); }}
            />
          </FormControl>
        </Grid>
        {visitServiceList.length > 0 && (
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            <Chip label={`${visitServiceList.length} service${visitServiceList.length > 1 ? 's' : ''}`} size="small"
              sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 600 }} />
          </Box>
        )}
      </Grid>

      {/* Services Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f7fa' }}>
              {['Service Name', 'Price', 'Qty', 'Discount / %', 'GST', 'Total', ''].map(h => (
                <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: 'text.secondary', borderBottom: '2px solid #e0e0e0' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visitServiceList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3, color: 'text.disabled', fontSize: 13 }}>
                  No services added. Search and add services above.
                </TableCell>
              </TableRow>
            ) : visitServiceList.map((service, index) => (
              <TableRow key={index} hover sx={{ '&:last-child td': { borderBottom: '1px solid #e0e0e0' } }}>
                <TableCell sx={{ fontSize: 12, fontWeight: 500 }}>{service.serviceid?.servicename || ''}</TableCell>
                <TableCell sx={{ minWidth: 90 }}>
                  <InlineField label="Price" value={service.serviceprice}
                    onChange={(e) => setChangesToVisistServicelist(e.target.value, index, 'serviceprice')} />
                </TableCell>
                <TableCell sx={{ minWidth: 70 }}>
                  <InlineField label="Qty" value={service.quantity}
                    onChange={(e) => setChangesToVisistServicelist(e.target.value, index, 'quantity')} />
                </TableCell>
                <TableCell sx={{ minWidth: 160 }}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <InlineField label="Disc" value={service.servicediscount}
                      onChange={(e) => setChangesToVisistServicelist(e.target.value, index, 'servicediscount')} />
                    <InlineField label="%" value={service.servicediscountinpercentage}
                      onChange={(e) => calDiscountBasedonPercentage(e.target.value, index)} />
                  </Box>
                </TableCell>
                <TableCell sx={{ minWidth: 80 }}>
                  <InlineField label="GST" value={service.gstAmount} onChange={() => {}} disabled />
                </TableCell>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: '#1976d2' }}>
                  ₹{Number(service.servicetotalamount || 0).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Tooltip title="Remove">
                    <IconButton size="small" onClick={() => removeService(index)}>
                      <DeleteOutlineIcon sx={{ fontSize: 16, color: '#f0776c' }} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {/* Summary Footer */}
            {visitServiceList.length > 0 && (
              <>
                <TableRow><TableCell colSpan={7} sx={{ p: 0 }}><Divider /></TableCell></TableRow>
                <SummaryRow label="Total Amount (before discount)" value={totalAmount} />
                <SummaryRow label="Discount">
                  <Box sx={{ display: 'flex', gap: 0.5, maxWidth: 200 }}>
                    <InlineField label="Amount" value={visitdiscount}
                      onChange={(e) => { setVisitdiscount(e.target.value); setVisittotalamount(totalAmount - e.target.value); calPercentageBasedOnDiscount(e.target.value); }} />
                    <InlineField label="%" value={visitpercentage}
                      onChange={(e) => { setVisitpercentage(e.target.value); calVisitDiscountAmountBAsedonPercentage(e.target.value); }}
                      onBlur={() => setVisittotalamount(totalAmount - visitdiscount)} />
                  </Box>
                </SummaryRow>
                <SummaryRow label="Net Amount (after discount & GST)" value={visittotalamount} highlight />
                <SummaryRow label="Paid Amount">
                  <Box sx={{ maxWidth: 120 }}>
                    <InlineField label="Paid" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
                  </Box>
                </SummaryRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {visitId && <GeneratedBillsList visitId={visitId} />}
    </Box>
  );
});

VisitServiceList.displayName = 'VisitServiceList';
export default VisitServiceList;
