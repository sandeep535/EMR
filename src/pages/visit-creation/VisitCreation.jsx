
import React, { useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, InputLabel } from '@mui/material'
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Translations from '../../resources/translations';
import { sendRequest } from '../global/DataManager'
import APIS from '../../Utils/APIS';
import RegistrationInformation from '../../components/RegistrationInformation/RegistrationInformation';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import EMRAlert from '../../Utils/CustomAlert';
import DemoPaper from '../../Utils/CustomCssUtil';
import Divider from '@mui/material/Divider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
import CardComponent from '../../components/Common/CardComponent';


const visitServiceTableHeaders = [{
  name: 'Service Name',
  width: '25%'
}, {
  name: 'Price',
  width: '15%'
}, {
  name: 'Qty',
  width: '15%'
}, {
  name: 'Discount',
  width: '15%'
}, {
  name: 'Total Amount',
  width: '15%'
}]
export default function VisitCreation() {
  const [doctor, setDoctor] = React.useState();
  const [contact, setContact] = React.useState();
  const [specility, setSpecility] = React.useState();
  const [visitType, setVisitType] = React.useState();

  const [doctorInputValueChange, setDoctorInputValueChange] = React.useState('');
  const [serviceinputValue, setServiceInputValue] = React.useState('');

  const [doctoroptions, setDoctoroptions] = React.useState([]);
  const [serviceoptions, setServiceOptions] = React.useState([]);
  const [visiiTypeOptions, setVisiiTypeOptions] = React.useState([]);
  const [specialityListOptions, setSpecialityListOptions] = React.useState([]);

  const [visitServiceList, setVisitServiceList] = React.useState([]);
  const [clientsearchlist, setClientsearchlist] = React.useState([]);

  const [visitreason, setVisitReason] = React.useState([]);
  const [serviceValues, setServiceValues] = React.useState();

  const [visitdate, setVisitdate] = React.useState(dayjs(moment(new Date()).format("YYYY-MM-DD")));
  const [token, setToken] = React.useState();

  const [selectedClientData, setSelectedClientData] = React.useState([]);

  const [visitdiscount, setVisitdiscount] = React.useState(0);
  const [totalAmount, setTotalAmount] = React.useState();
  const [visittotalamount, setVisittotalamount] = React.useState();
  const registrationInformationRef = useRef();
  const autoComplteSpRef = useRef();
  const autoComplteServicesRef = useRef();
  const autoCompltedocRef = useRef();
  const autoComplteVisittypeRef = useRef();

  useEffect(() => {
    getLookUpDetails();
  }, []);

  useEffect(() => {
    updateTotalAmount();
  }, [visitServiceList]);

  function clearVisitForm() {
    registrationInformationRef.current.clearForm();
    setSpecility("");
    setVisitType("");
    setDoctor("");
    setVisitdate(dayjs(moment(new Date()).format("YYYY-MM-DD")));
    setToken("");
    setSelectedClientData([]);
    setVisitdiscount(0);
    setTotalAmount(0);
    setVisittotalamount(0);
    setVisitReason("");
    setVisitServiceList([]);
    setDoctorInputValueChange("")
    setServiceInputValue('');
    const ele = autoComplteSpRef.current.getElementsByClassName('MuiAutocomplete-clearIndicator')[0];
    if (ele) ele.click();
    const ele1 = autoComplteServicesRef.current.getElementsByClassName('MuiAutocomplete-clearIndicator')[0];
    if (ele1) ele1.click();
    const ele2 = autoCompltedocRef.current.getElementsByClassName('MuiAutocomplete-clearIndicator')[0];
    if (ele2) ele2.click();
    const ele3 = autoComplteVisittypeRef.current.getElementsByClassName('MuiAutocomplete-clearIndicator')[0];
    if (ele3) ele3.click();

  }
  async function getDataBasedOnMobileNumber(mobileNumber) {
    var payLoad = {
      method: APIS.CLIENT_DATA_BASED_ON_PHONENUMBER.METHOD,
      url: APIS.CLIENT_DATA_BASED_ON_PHONENUMBER.URL,
      paramas: [mobileNumber]
    }
    let result = await sendRequest(payLoad);
    if (result && result.size != 0) {
      setClientsearchlist(result);
    }
  }

  async function getDoctorsData(value) {

    if (!value)
      return false;
    var payLoad = {
      method: APIS.GET_EMPLOYES_BASED_ON_NAME.METHOD,
      url: APIS.GET_EMPLOYES_BASED_ON_NAME.URL,
      paramas: [value]
    }
    let result = await sendRequest(payLoad);
    if (result) {
      setDoctoroptions(result)
    }
  }

  async function getLookUpDetails() {
    var payLoad = {
      method: APIS.LOOKUP.METHOD,
      url: APIS.LOOKUP.URL,
      paramas: ["SPECILAITY,VISIT_TYPES"]
    }
    let result = await sendRequest(payLoad);
    if (result && result.SPECILAITY) {
      setSpecialityListOptions(result.SPECILAITY);
    }
    if (result && result.VISIT_TYPES) {
      setVisiiTypeOptions(result.VISIT_TYPES);
    }

  }

  async function getServiceMaterList(value) {
    if (!value)
      return false;
    var payLoad = {
      method: APIS.GET_SERVICE_MASTER_DATA_BASED_SERVICENAME.METHOD,
      url: APIS.GET_SERVICE_MASTER_DATA_BASED_SERVICENAME.URL,
      paramas: [value]
    }
    let result = await sendRequest(payLoad);
    if (result) {
      setServiceOptions(result)
    }
  }

  function addServicetoList(newService) {
    var obj = {
      serviceid: newService,
      serviceprice: newService.price,
      servicediscount: 0,
      quantity: 1,
      servicetotalamount: newService.price * 1
    }
    let copyList = [...visitServiceList];
    copyList.push(obj);
    setVisitServiceList(copyList);

  }

  function setChangesToVisistServicelist(data, index, key) {
    let copyVisitServiceData = [...visitServiceList];
    copyVisitServiceData[index][key] = data;
    let totalAmount = calParticularServiceTotalAmount(copyVisitServiceData[index]);
    copyVisitServiceData[index]['servicetotalamount'] = totalAmount;
    setVisitServiceList(copyVisitServiceData);
    updateTotalAmount();
  }
  function updateTotalAmount() {
    let copyVisitServiceData = [...visitServiceList];
    let totalAmount = 0;
    copyVisitServiceData.forEach(item => {
      totalAmount = totalAmount + calParticularServiceTotalAmount(item);
    });
    let afterDiscount = totalAmount - visitdiscount;
    setVisittotalamount(afterDiscount);
    setTotalAmount(totalAmount);
  }

  function setTotalAmountAfterDiscountFun(discountAmount) {
    var aftertotalAmount = totalAmount - discountAmount;
    setVisittotalamount(aftertotalAmount);
  }

  function calParticularServiceTotalAmount(data) {
    let totalAmount = Number(data.serviceprice) * Number(data.quantity);
    let totalAmountAfterDiscount = totalAmount - data.servicediscount;
    return totalAmountAfterDiscount;
  }

  function populateClientDatatoForm(clientData) {
    registrationInformationRef.current.setFormData1(clientData);
    setSelectedClientData(clientData);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    debugger
    if (!specility) {
      EMRAlert.alertifyError("Please select specility");
      return false;
    }
    if (!doctor) {
      EMRAlert.alertifyError("Please select doctor");
      return false;
    }
    if (!visitType) {
      EMRAlert.alertifyError("Please select visit type");
      return false;
    }
    if (visitServiceList.length == 0) {
      EMRAlert.alertifyError("Please select atlease one service");
      return false;
    }
    var clientDeatils = "";
    if (selectedClientData && selectedClientData.seqid) {
      clientDeatils = selectedClientData;
    } else {
      clientDeatils = registrationInformationRef.current.getFormData();
    }
    let sendingObj = {
      visitdate: new Date(visitdate),
      doctor: doctor,
      visittype: visitType,
      specilaity: specility,
      visitdiscount: visitdiscount,
      visittotalamount: visittotalamount,
      reason: visitreason,
      status: 1,
      clientid: clientDeatils,
      services: visitServiceList,
      token: token
    }

    var payLoad = {
      method: APIS.SAVE_VISIT.METHOD,
      url: APIS.SAVE_VISIT.URL,
      paramas: [],
      data: sendingObj
    }
    let result = await sendRequest(payLoad);
    if (result) {
      EMRAlert.alertifySuccess("Visit Saved Succussfully");
      clearVisitForm()
    } else {
      EMRAlert.alertifyError("Not created")
    }
  };
  return (
    <Box m="10px">
      <Box m="10px">
        <Grid xs={6} container>
          <Autocomplete
            size="small"
            value={contact}
            onChange={(event, newValue) => {
              setContact(newValue.contact);
              populateClientDatatoForm(newValue);
            }}
            key={option => option.seqid}
            getOptionLabel={option => option.contact}
            inputValue={contact}
            onInputChange={(event, newInputValue) => {
              if (newInputValue.length > 9) {
                getDataBasedOnMobileNumber(newInputValue)
              }
              setContact(newInputValue);

            }}
            id="service-controllable-states-demo11"
            options={clientsearchlist}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Search client" />}
          />
        </Grid>
      </Box>
      <form onSubmit={handleSubmit}>
        <Box display="grid" gap="10px">
          <CardComponent title="Client Details">
            <RegistrationInformation data={selectedClientData} ref={registrationInformationRef} />
          </CardComponent>
        </Box>
        {/* <Divider sx={{ color: "secondary.light", paddingTop: 1, fontSize: 14 }} textAlign="left">Visit Details</Divider> */}
        <CardComponent title="Visit Details">
          <Box display="grid" gap="10px" style={{ marginTop: '10px' }}>

            <Grid xs={12} container spacing={1}>
              <Grid item xs={3} spacing={2}>
                <FormControl variant="outlined" fullWidth>
                  <Autocomplete
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    options={specialityListOptions}
                    key={option => option.lookupid}
                    getOptionLabel={option => option.lookupvalue}
                    value={specility}
                    ref={autoComplteSpRef}
                    onChange={(event, newValue) => {
                      setSpecility(newValue);
                    }}
                    renderOption={(props, option) => {
                      return (
                        <li {...props} key={option.lookupid}>
                          {option.lookupvalue}
                        </li>
                      );
                    }}
                    renderInput={(params) => <TextField {...params} label={Translations.visitCreation.speciality} />}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3} spacing={2}>
                <FormControl variant="outlined" size="small" fullWidth>
                  <Autocomplete
                    size="small"
                    value={doctor}
                    onChange={(event, newValue) => {
                      setDoctor(newValue);
                    }}
                    key={option => option.id}
                    getOptionLabel={option => option.firstname}
                    inputValue={doctorInputValueChange}
                    ref={autoCompltedocRef}
                    onInputChange={(event, newInputValue) => {
                      if (newInputValue.length != 1) {
                        getDoctorsData(newInputValue)
                      }
                      setDoctorInputValueChange(newInputValue);

                    }}
                    id="controllable-states-demo"
                    options={doctoroptions}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Docor Name" />}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={3} spacing={2} >
                <FormControl variant="outlined" size="small" fullWidth>
                  <Autocomplete
                    size="small"
                    disablePortal
                    id="visitTypeList"
                    options={visiiTypeOptions}
                    ref={autoComplteVisittypeRef}
                    key={option => option.lookupid}
                    getOptionLabel={option => option.lookupvalue}
                    value={visitType}
                    onChange={(event, newValue) => {
                      setVisitType(newValue);
                    }}
                    renderOption={(props, option) => {
                      return (
                        <li {...props} key={option.lookupid}>
                          {option.lookupvalue}
                        </li>
                      );
                    }}
                    renderInput={(params) => <TextField {...params} label={Translations.visitCreation.visitType} />}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3} spacing={2}  >
                <TextField
                  fullWidth
                  variant="outlined"
                  className='input_background'
                  type="text"
                  size="small"
                  label={Translations.visitCreation.visitReason}
                  name="Reason For Visit"
                  onChange={e => setVisitReason(e.target.value)}
                  value={visitreason} />
              </Grid>
              <Grid item xs={3} spacing={2}>
                <FormControl variant="outlined" fullWidth>
                  <Autocomplete
                    size="small"
                    value={serviceValues}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setServiceValues(newValue);
                        addServicetoList(newValue);
                      }

                    }}
                    key={option => option.serviceid}
                    getOptionLabel={option => option.servicename}
                    inputValue={serviceinputValue}
                    ref={autoComplteServicesRef}
                    onInputChange={(event, newInputValue) => {
                      if (newInputValue.length > 3) {
                        getServiceMaterList(newInputValue)
                      }
                      setServiceInputValue(newInputValue);

                    }}
                    id="service-controllable-states-demo"
                    options={serviceoptions}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Add Services" />}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3} spacing={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DateField', 'DateField']}>
                    <DatePicker
                      label="From Date"
                      value={visitdate}
                      onChange={newValue => setVisitdate(new Date(newValue))}
                      format="DD-MM-YYYY"
                      fullWidth
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={3} spacing={2}>
                <TextField
                  fullWidth
                  type="text"
                  size="small"
                  variant="outlined"
                  required
                  label={Translations.visitCreation.token}
                  name="token"
                  onChange={e => setToken(e.target.value)}
                  value={token}
                />
              </Grid>
            </Grid>
            <Grid xs={12} container spacing={1}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      {(visitServiceTableHeaders.map(header => {
                        return (
                          <TableCell width={header.width}>{header.name}</TableCell>
                        )
                      }))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visitServiceList && visitServiceList.map((service, index) => (
                      <TableRow key={service.serviceid.service}>
                        <TableCell>{(service && service.serviceid) ? service.serviceid.servicename : ""}</TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            variant="outlined"
                            className='input_background'
                            type="text"
                            onChange={(e) => {
                              setChangesToVisistServicelist(e.target.value, index, 'serviceprice')
                            }}
                            label={"Price"}
                            size="small"
                            value={service.serviceprice}
                          />
                        </TableCell>
                        <TableCell >
                          <TextField
                            fullWidth
                            variant="outlined"
                            className='input_background'
                            type="text"
                            label={"Qty"}
                            onChange={(e) => {
                              setChangesToVisistServicelist(e.target.value, index, 'quantity')
                            }}
                            value={service.quantity}
                            size="small"
                          />
                        </TableCell>
                        <TableCell >
                          <TextField
                            fullWidth
                            variant="outlined"
                            className='input_background'
                            type="text"
                            label={"Discount"}
                            onChange={(e) => {
                              setChangesToVisistServicelist(e.target.value, index, 'servicediscount')
                            }}
                            value={service.servicediscount}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{service.servicetotalamount}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow key={"12111"}>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>Total Amount</TableCell>
                      <TableCell>{totalAmount}</TableCell>
                    </TableRow>
                    <TableRow key={"323"}>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>Discount Amount</TableCell>
                      <TableCell><TextField
                        fullWidth
                        variant="outlined"
                        className='input_background'
                        type="text"
                        label={"Discount"}
                        onChange={(e) => {
                          setVisitdiscount(e.target.value);
                          setTotalAmountAfterDiscountFun(e.target.value)
                        }}
                        value={visitdiscount}
                        size="small"
                      /></TableCell>
                    </TableRow>
                    <TableRow key={"123545111"}>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>Total Amount</TableCell>
                      <TableCell>{visittotalamount}</TableCell>
                    </TableRow>
                  </TableBody>

                </Table>
              </TableContainer>
            </Grid>

          </Box>
        </CardComponent>

        <FormButtonComponent button1={"Save"} button2={"Clear"} clearFormEvent={() => {
          debugger
          clearVisitForm();
        }} />
      </form>
    </Box>
  );
}
