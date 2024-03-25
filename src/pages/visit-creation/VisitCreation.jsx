
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
import Typography from '@mui/material/Typography';


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
export default function VisitCreation(props) {
  const [doctor, setDoctor] = React.useState((props?.visitEditData?.doctor)?props?.visitEditData?.doctor:null);
  const [contact, setContact] = React.useState();
  const [specility, setSpecility] = React.useState((props?.visitEditData?.specilaity) ?props?.visitEditData?.specilaity:null);
  const [visitType, setVisitType] = React.useState((props?.visitEditData?.visittype) ? props.visitEditData.visittype : null);

  const [doctorInputValueChange, setDoctorInputValueChange] = React.useState('');
  const [serviceinputValue, setServiceInputValue] = React.useState('');

  const [doctoroptions, setDoctoroptions] = React.useState([]);
  const [serviceoptions, setServiceOptions] = React.useState([]);
  const [visiiTypeOptions, setVisiiTypeOptions] = React.useState([]);
  const [specialityListOptions, setSpecialityListOptions] = React.useState([]);

  const [visitServiceList, setVisitServiceList] = React.useState([]);
  const [clientsearchlist, setClientsearchlist] = React.useState([]);

  const [visitreason, setVisitReason] = React.useState((props?.visitEditData?.reason) ? props?.visitEditData?.reason :"");
  const [serviceValues, setServiceValues] = React.useState();

  const [visitdate, setVisitdate] = React.useState((props?.visitEditData?.visitdate) ? dayjs(moment(new Date(props?.visitEditData.visitdate)).format("YYYY-MM-DD")) : dayjs(moment(new Date()).format("YYYY-MM-DD")));
  const [token, setToken] = React.useState((props?.visitEditData?.token) ?props?.visitEditData?.token:null);

  const [selectedClientData, setSelectedClientData] = React.useState([]);

  const [visitdiscount, setVisitdiscount] = React.useState(0);
  const [visitpercentage, setVisitpercentage] = React.useState(0);

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

  function setVisitDataInEditMode(){
    setSelectedClientData(props?.visitEditData?.clientid);
    registrationInformationRef.current.setFormData1(props?.visitEditData?.clientid);
    setVisitServiceList(props?.visitEditData?.services);
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

      if(props?.isEdit == 'true'){
        setVisitDataInEditMode();
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
      servicediscountinpercentage: 0,
      quantity: 1,
      servicetotalamount: newService.price * 1
    }
    let copyList = [...visitServiceList];
    copyList.push(obj);
    setVisitServiceList(copyList);

  }

  function calPercentage(data, index, key) {
    let copyVisitServiceData = [...visitServiceList];
    var cuurentData = copyVisitServiceData[index];
    var percentage = (Number(cuurentData.servicediscount) / (Number(cuurentData.quantity) * Number(cuurentData.serviceprice))) * 100;
    cuurentData.servicediscountinpercentage = percentage.toFixed(2);
    copyVisitServiceData[index] = cuurentData;
    return copyVisitServiceData;
  }

  function setChangesToVisistServicelist(data, index, key) {
    let copyVisitServiceData = [...visitServiceList];
    copyVisitServiceData[index][key] = data;
    let totalAmount = calParticularServiceTotalAmount(copyVisitServiceData[index]);
    copyVisitServiceData[index]['servicetotalamount'] = totalAmount;
    copyVisitServiceData = calPercentage(data, index, key);
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
  function calDiscountBasedonPercentage(data, index) {
    let copyVisitServiceData = [...visitServiceList];
    copyVisitServiceData[index]["servicediscountinpercentage"] = data;
    let cuurentData = copyVisitServiceData[index];
    let discount = (Number(cuurentData.quantity) * Number(cuurentData.serviceprice)) * (100 - Number(data)) / 100;
    discount = (Number(cuurentData.quantity) * Number(cuurentData.serviceprice)) - discount;
    copyVisitServiceData[index]["servicediscount"] = discount;
    setVisitServiceList(copyVisitServiceData);

  }
  function calVisitDiscountAmountBAsedonPercentage(value) {
    let copyVisistamount = totalAmount;
    let discount = (copyVisistamount) * (100 - Number(value)) / 100;
    discount = copyVisistamount - discount;
    setVisitdiscount(discount);
  }

  function calPercentageBasedOnDiscount(value) {
    let copyVisistamount = totalAmount;
    var percentage = (Number(value) / (copyVisistamount)) * 100;
    setVisitpercentage(percentage.toFixed(2));
  }
  async function handleSubmit(event) {
    event.preventDefault();
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
      visitpercentage: visitpercentage,
      reason: visitreason,
      status: 1,
      clientid: clientDeatils,
      services: visitServiceList,
      token: token,
      visitid : (props?.isEdit == "true") ? props?.visitEditData?.visitid: null
    }

    var payLoad = {
      method: APIS.SAVE_VISIT.METHOD,
      url: APIS.SAVE_VISIT.URL,
      paramas: [],
      data: sendingObj
    }
    let result = await sendRequest(payLoad);
    if (result) {
      EMRAlert.alertifySuccess("Visit Saved Succussfully.you token number is "+result.token+"");
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
            renderOption={(props, option) => {
              return (
                <li onClick={()=>{
                  populateClientDatatoForm(option);
                }}>
                  <Grid container alignItems="center">
                    <Grid item sx={{ ml: 1, width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                      <Box
                        component="span"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {option.firstname}
                        <Typography variant="body2" color="text.secondary">
                          {option.contact}
                        </Typography>
                      </Box>
                  
                    </Grid>
                  </Grid>
                  <Divider variant="middle" component="li" />
                </li>

              );
            }}
            onInputChange={(event, newInputValue) => {
              if (newInputValue.length > 4) {
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
        <Box display="grid" >
          <CardComponent title="Client Details">
            <RegistrationInformation data={selectedClientData} ref={registrationInformationRef} />
          </CardComponent>
        </Box>
        {/* <Divider sx={{ color: "secondary.light", paddingTop: 1, fontSize: 14 }} textAlign="left">Visit Details</Divider> */}
        <CardComponent title="Visit Details">
          <Box display="grid" gap="10px" >

            <Grid xs={12} container spacing={1}>
              <Grid item xs={2} spacing={1}>
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
              <Grid item xs={3} spacing={1}>
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
                    renderInput={(params) => <TextField {...params} label="Docor Name" />}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={2} spacing={1} >
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
              

              <Grid item xs={3}  spacing={1}>
                <LocalizationProvider dateAdapter={AdapterDayjs} sx={{mt:-9}}>
                  <DemoContainer components={['DateField', 'DateField']}>
                    <DatePicker
                      label="Visit Date"
                      value={visitdate}
                      onChange={newValue => setVisitdate(new Date(newValue))}
                      slotProps={{ textField: { size: 'small' } }}
                      format="DD-MM-YYYY"
                      fullWidth
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={2} spacing={1}>
                <TextField
                  fullWidth
                  type="text"
                  size="small"
                  variant="outlined"
                  label={Translations.visitCreation.token}
                  name="token"
                  onChange={e => setToken(e.target.value)}
                  value={token}
                />
              </Grid>

              <Grid item xs={6} spacing={1}  >
                <TextField
                  fullWidth
                  variant="outlined"
                  className='input_background'
                  type="text"
                  size="small"
                  multiline
                  rows={2}
                  label={Translations.visitCreation.visitReason}
                  name="Reason For Visit"
                  onChange={e => setVisitReason(e.target.value)}
                  value={visitreason} />
              </Grid>
            </Grid>
            <Grid xs={12} container spacing={1}>
              <Grid item xs={3} spacing={1}>
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
            </Grid>
            <Grid xs={12} container spacing={1}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      {(visitServiceTableHeaders.map(header => {
                        return (
                          <TableCell key={header.name} width={header.width}>{header.name}</TableCell>
                        )
                      }))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visitServiceList && visitServiceList.map((service, index) => (
                      <TableRow key={index}>
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
                          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
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
                            <TextField
                              fullWidth
                              variant="outlined"
                              className='input_background'
                              type="text"
                              label={"%"}
                              sx={{ ml: 1 }}
                              onBlur={(e) => {
                                let copyVisitServiceData = [...visitServiceList];
                                let discountValue = copyVisitServiceData[index].servicediscount;
                                setChangesToVisistServicelist(discountValue, index, 'servicediscount');
                              }}
                              onChange={(e) => {
                                calDiscountBasedonPercentage(e.target.value, index);
                              }}
                              value={service.servicediscountinpercentage}
                              size="small"
                            />
                          </Box>
                        </TableCell>
                        <TableCell>{service.servicetotalamount}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow key={"12111"}>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>Total Amount(before discount)</TableCell>
                      <TableCell>{totalAmount}</TableCell>
                    </TableRow>
                    <TableRow key={"323"}>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>Discount Amount</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            className='input_background'
                            type="text"
                            label={"Discount"}
                            onChange={(e) => {
                              setVisitdiscount(e.target.value);
                              setTotalAmountAfterDiscountFun(e.target.value);
                              calPercentageBasedOnDiscount(e.target.value);
                            }}
                            value={visitdiscount}
                            size="small"
                          />
                          <TextField
                            fullWidth
                            variant="outlined"
                            className='input_background'
                            type="text"
                            label={"%"}
                            onBlur={(e) => {
                              setTotalAmountAfterDiscountFun(visitdiscount);
                            }}
                            onChange={(e) => {
                              setVisitpercentage(e.target.value);
                              calVisitDiscountAmountBAsedonPercentage(e.target.value);
                              //setTotalAmountAfterDiscountFun(e.target.value)
                            }}
                            value={visitpercentage}
                            size="small"
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow key={"123545111"}>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>Total Amount(after discount)</TableCell>
                      <TableCell>{visittotalamount}</TableCell>
                    </TableRow>
                  </TableBody>

                </Table>
              </TableContainer>
            </Grid>

          </Box>
        </CardComponent>

        <FormButtonComponent button1={"Save"} button2={"Clear"} clearFormEvent={() => {
          clearVisitForm();
        }} />
      </form>
    </Box>
  );
}
