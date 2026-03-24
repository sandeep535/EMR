import React, { useRef, useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, Divider, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import FormControl from '@mui/material/FormControl';
import Translations from '../../resources/translations';
import { sendRequest } from '../global/DataManager';
import APIS from '../../Utils/APIS';
import RegistrationInformation from '../../components/RegistrationInformation/RegistrationInformation';
import EMRAlert from '../../Utils/CustomAlert';
import dayjs from 'dayjs';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import SLDatePicker from '../../CoreComponents/SLDatePicker';
import SLTextField from '../../CoreComponents/SLTextField';
import { VisitCreationSchema } from '../../common/YupSchema/formSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import ClientSearchComponent from '../../components/ClientSearch/ClientSearchComponent';
import VisitServiceList from '../../components/VisitServiceList/VisitServiceList';
import SLConfirmationPopup from '../../common/SLConfirmationPopup/SLConfirmationPopup';

const SectionHeader = ({ icon, title }) => (
  <Box sx={{ px: 2, py: 1.5, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
    {icon}
    <Typography variant="subtitle2" fontWeight={600} color="text.secondary">{title}</Typography>
  </Box>
);

export default function VisitCreation(props) {
  const [doctoroptions, setDoctoroptions] = React.useState([]);
  const [visiiTypeOptions, setVisiiTypeOptions] = React.useState([]);
  const [paymentTypeOptions, setPaymentTypeOptions] = React.useState([]);
  const [specialityListOptions, setSpecialityListOptions] = React.useState([]);
  const [selectedClientData, setSelectedClientData] = React.useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [visitid, setVisitid] = useState('');

  const visitServiceListRef = useRef();
  const { control, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm({
    defaultValues: {},
    resolver: yupResolver(VisitCreationSchema),
  });

  useEffect(() => {
    getLookUpDetails();
    getPaymentTypeList();
  }, []);

  function clearVisitForm() { reset({}); }

  function setVisitDataInEditMode() {
    setSelectedClientData(props?.visitEditData?.clientid);
    setDataToRegistrationForm(props?.visitEditData?.clientid);
    let data = {
      visitServiceList: props?.visitEditData?.services,
      visitdiscount: props?.visitEditData?.visitdiscount,
      visittotalamount: props?.visitEditData?.visittotalamount,
      visitpercentage: props?.visitEditData?.visitpercentage,
      visitId: props?.visitEditData.visitid,
    };
    visitServiceListRef.current.setVisitServiceList(data);
    setVisitDetailsInEditmode(props?.visitEditData);
  }

  async function getDoctorsData(value) {
    if (!value) return false;
    let specility = getValues('specility')?.lookupid ?? null;
    const result = await sendRequest({ method: APIS.GET_EMPLOYES_BASED_ON_NAME_DESIGNATION.METHOD, url: APIS.GET_EMPLOYES_BASED_ON_NAME_DESIGNATION.URL, paramas: [specility, value] });
    if (result) setDoctoroptions(result);
  }

  async function getPaymentTypeList() {
    const result = await sendRequest({ method: APIS.GET_MASTER_DATA_BASED_ON_CODE.METHOD, url: APIS.GET_MASTER_DATA_BASED_ON_CODE.URL, paramas: ['PAYMENT_MODE'] });
    if (result) setPaymentTypeOptions(result);
  }

  async function getLookUpDetails() {
    const result = await sendRequest({ method: APIS.LOOKUP.METHOD, url: APIS.LOOKUP.URL, paramas: ['SPECILAITY,VISIT_TYPES'] });
    if (result?.SPECILAITY) setSpecialityListOptions(result.SPECILAITY);
    if (result?.VISIT_TYPES) setVisiiTypeOptions(result.VISIT_TYPES);
    if (props?.isEdit === 'true') {
      setVisitDataInEditMode();
    } else {
      reset({ visitdate: dayjs(moment(new Date()).format('YYYY-MM-DD')) });
    }
  }

  function populateClientDatatoForm(clientData) {
    setDataToRegistrationForm(clientData);
    setSelectedClientData(clientData);
  }

  function setDataToRegistrationForm(data) {
    setValue('title', data.title);
    setValue('firstname', data.firstname);
    setValue('lastname', data.lastname);
    setValue('gender', data.gender);
    setValue('dob', dayjs(moment(data.dob).format('YYYY-MM-DD')));
    setValue('age', data.age);
    setValue('contact', data.contact);
    setValue('email', data.email);
  }

  function setVisitDetailsInEditmode(data) {
    setValue('specility', data.specilaity);
    setValue('doctor', data.doctor);
    setValue('visitType', data.visittype);
    setValue('visitdate', dayjs(moment(data.visitdate).format('YYYY-MM-DD')));
    setValue('token', data.token);
    setValue('visitreason', data.reason);
    setValue('paymenttype', data.paymenttype);
  }

  const visitCreationhandleSubmit = async (data) => { handleSubmit1(data); };

  async function handleSubmit1(data) {
    let { visitServiceList, visitdiscount, visittotalamount, visitpercentage } = visitServiceListRef.current.getVisistsList();
    if (visitServiceList.length === 0) { EMRAlert.alertifyError('Please select atleast one service'); return false; }
    let clientDeatils = selectedClientData?.seqid ? selectedClientData : {
      title: data.title, firstname: data.firstname, lastname: data.lastname,
      gender: data.gender, dob: new Date(data.dob), age: data.age,
      contact: data.contact, email: data.email,
    };
    let sendingObj = {
      visitdate: new Date(data.visitdate), doctor: data.doctor, visittype: data.visitType,
      specilaity: data.specility, visitdiscount, visittotalamount, visitpercentage,
      reason: data.visitreason, status: 1, clientid: clientDeatils,
      services: visitServiceList, token: data.token, paymenttype: data.paymenttype,
      patienttype: props.patienttype,
      visitid: props?.isEdit === 'true' ? props?.visitEditData?.visitid : null,
    };
    const result = await sendRequest({ method: APIS.SAVE_VISIT.METHOD, url: APIS.SAVE_VISIT.URL, paramas: [], data: sendingObj });
    if (result) {
      EMRAlert.alertifySuccess('Visit Saved Successfully. Your token number is ' + result.token);
      setPopupOpen(true);
      setVisitid(result.visitid);
      clearVisitForm();
    } else {
      EMRAlert.alertifyError('Not created');
    }
  }

  const handleConfirm = () => { generateBill(); };

  async function generateBill() {
    const result = await sendRequest({ method: APIS.GENERATE_BILL.METHOD, url: APIS.GENERATE_BILL.URL, paramas: [], data: { visitid, clientId: selectedClientData.seqid } });
    EMRAlert[result ? 'alertifySuccess' : 'alertifyError'](result ? 'Bill generated Successfully' : 'Bill generation failed');
    setPopupOpen(false);
  }

  const handleClose = () => setPopupOpen(false);

  return (
    <Box sx={{ m: 1.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <form onSubmit={handleSubmit(visitCreationhandleSubmit)}>

        {/* Patient Search */}
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <SectionHeader icon={<PersonIcon sx={{ fontSize: 18, color: '#1976d2' }} />} title="PATIENT SEARCH" />
          <Box sx={{ p: 2 }}>
            <Grid container>
              <Grid item xs={12} sm={5}>
                <ClientSearchComponent
                  label={Translations.visitCreation.searchCleint}
                  selectedPatientDetails={(data) => populateClientDatatoForm(data)}
                  onInputChangeEvent={(newInputValue) => setValue('contact', newInputValue)}
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Patient Information */}
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <SectionHeader icon={<PersonIcon sx={{ fontSize: 18, color: '#1976d2' }} />} title="PATIENT INFORMATION" />
          <Box sx={{ p: 2 }}>
            <RegistrationInformation control={control} errors={errors} setValue={setValue} />
          </Box>
        </Paper>

        {/* Visit Details */}
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <SectionHeader icon={<EventNoteIcon sx={{ fontSize: 18, color: '#1976d2' }} />} title="VISIT DETAILS" />
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <AutocompleteField
                    name="specility"
                    label={Translations.visitCreation.speciality}
                    control={control}
                    options={specialityListOptions}
                    placeholder={Translations.visitCreation.speciality}
                    mapvalues={{ id: 'lookupid', value: 'lookupvalue' }}
                    isMultiSelect={false}
                    id="specility-combo-box-demo"
                    onInputChange={() => {}}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <AutocompleteField
                    name="doctor"
                    label={Translations.visitCreation.DocName}
                    control={control}
                    options={doctoroptions}
                    placeholder={Translations.visitCreation.DocName}
                    mapvalues={{ id: 'id', value: ['firstname', 'lastname'] }}
                    isMultiSelect={false}
                    id="doctor-combo-box-demo"
                    onInputChange={(data) => getDoctorsData(data)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <AutocompleteField
                    name="visitType"
                    label={Translations.visitCreation.visitType}
                    control={control}
                    options={visiiTypeOptions}
                    placeholder={Translations.visitCreation.visitType}
                    mapvalues={{ id: 'lookupid', value: 'lookupvalue' }}
                    isMultiSelect={false}
                    id="visitType-combo-box-demo"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <SLDatePicker name="visitdate" label={Translations.visitCreation.visitDate} control={control} error={errors.visitdate} />
              </Grid>
              <Grid item xs={12} sm={6} md={1}>
                <SLTextField name="token" label={Translations.visitCreation.token} control={control} placeholder={Translations.visitCreation.token} disable={true} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <AutocompleteField
                    name="paymenttype"
                    label={Translations.visitCreation.paymenttype}
                    control={control}
                    options={paymentTypeOptions}
                    placeholder={Translations.visitCreation.paymenttype}
                    mapvalues={{ id: 'id', value: 'masterdatavalue' }}
                    isMultiSelect={false}
                    id="paymenttype-combo-box-demo"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <SLTextField name="visitreason" label={Translations.visitCreation.visitReason} control={control} placeholder={Translations.visitCreation.visitReason} />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Services */}
            <VisitServiceList ref={visitServiceListRef} />
          </Box>
        </Paper>

        {/* Action Footer */}
        <Paper variant="outlined" sx={{ borderRadius: 2, p: 1.5, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<ClearIcon />} onClick={clearVisitForm}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
            Clear
          </Button>
          <Button type="submit" variant="contained" startIcon={<SaveIcon />}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
            Save Visit
          </Button>
        </Paper>

      </form>

      <SLConfirmationPopup
        open={isPopupOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title="Generate Bill"
        message="Do you want to generate a bill for this visit?"
      />
    </Box>
  );
}
