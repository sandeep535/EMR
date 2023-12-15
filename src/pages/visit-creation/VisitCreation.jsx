
import React, { useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Typography, useTheme } from '@mui/material'
import { FormControl, InputLabel, Select, MenuItem, Grid, Button } from "@material-ui/core";
import Translations from '../../resources/translations';
import { sendRequest } from '../global/DataManager'
import APIS from '../../Utils/APIS';
import RegistrationInformation from '../../components/RegistrationInformation/RegistrationInformation';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';

const DemoPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: '100%',
  padding: theme.spacing(1),
  ...theme.typography.body2,
  textAlign: 'center',
  borderColor: 'primary.main'
}));

const visitServiceTableHeaders = [{
  name: 'Service Type',
  width: '15%'
}, {
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
  const [value, setValue] = React.useState();
  const [contact, setContact] = React.useState();
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const [specialityList, setSpecialityList] = React.useState([]);
  const [visitTypeList, setVisitTypeList] = React.useState([]);
  const [visitreason, setVisitReason] = React.useState([]);

  const [serviceinputValue, setServiceInputValue] = React.useState('');
  const [serviceoptions, setServiceOptions] = React.useState([]);
  const [serviceValues, setServiceValues] = React.useState();
  const [visitServiceList, setVisitServiceList] = React.useState([]);

  const [clientsearchlist, setClientsearchlist] = React.useState([]);
  const [selectedClientData, setSelectedClientData] = React.useState([]);
  const registrationInformationRef = useRef();

  useEffect(() => {
    getLookUpDetails();
  }, []);

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

    debugger
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
      setOptions(result)
    }
  }

  async function getLookUpDetails() {
    var payLoad = {
      method: APIS.LOOKUP.METHOD,
      url: APIS.LOOKUP.URL,
      paramas: ["SPECILAITY,VISIT_TYPES"]
    }
    let result = await sendRequest(payLoad);
    console.log(result);
    if (result && result.SPECILAITY) {
      setSpecialityList(result.SPECILAITY);
    }
    if (result && result.VISIT_TYPES) {
      setVisitTypeList(result.VISIT_TYPES);
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
    debugger
    var obj = {
      service: newService,
      serviceprice: newService.price,
      servicediscount: 0,
      quantity: 0,
      servicetotalamount: 0
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
  }

  function calParticularServiceTotalAmount(data) {
    let totalAmount = Number(data.serviceprice) * Number(data.quantity);
    let totalAmountAfterDiscount = totalAmount - data.servicediscount;
    return totalAmountAfterDiscount;
  }
  function populateClientDatatoForm(clientData){
    registrationInformationRef.current.setFormData1(clientData);
    setSelectedClientData(clientData);
  }

  function handleSubmit(event) {
    event.preventDefault();
    // const VisitCreationObj = {
    //   "speciality": speciality,
    //   "docName": docName,
    //   "visitType": visitType,
    //   "visitreason": visitreason
    // }
    // console.log(VisitCreationObj);


    //setStoreData([...storeData, VisitCreationObj]);
    //clearData();
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
          {/* <TextField
            className='input_background'
            fullWidth
            variant="outlined"
            type="text"
            required
            size="small"
            label={Translations.patientRegistration.contact}
            name="contact"
            onBlur={e => {
              getDataBasedOnMobileNumber(e.target.value)
            }}
            onChange={e => setContact(e.target.value)}
            value={contact}
          /> */}
        </Grid>
      </Box>
      <form onSubmit={handleSubmit}>
        <Box display="grid" gap="10px">
          <DemoPaper square={false}>
            <RegistrationInformation data = {selectedClientData} ref={registrationInformationRef} />
          </DemoPaper>
        </Box>
        <Box display="grid" gap="10px" style={{ marginTop: '10px' }}>
          <DemoPaper square={false}>
            <Grid xs={12} container spacing={4}>
              <Grid item xs={3} spacing={4}>
                <FormControl variant="outlined" fullWidth>
                  <Autocomplete
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    options={specialityList}
                    key={option => option.lookupid}
                    getOptionLabel={option => option.lookupvalue}
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
              <Grid item xs={3} spacing={4}>
                <FormControl variant="outlined" size="small" fullWidth>
                  <Autocomplete
                    size="small"
                    value={value}
                    onChange={(event, newValue) => {
                      console.log("111111", newValue)
                      setValue(newValue);
                    }}
                    key={option => option.id}
                    getOptionLabel={option => option.firstname}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                      if (newInputValue.length != 1) {
                        getDoctorsData(newInputValue)
                      }
                      setInputValue(newInputValue);

                    }}
                    id="controllable-states-demo"
                    options={options}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Docor Name" />}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={3} spacing={4} >
                <FormControl variant="outlined" size="small" fullWidth>
                  <Autocomplete
                    size="small"
                    disablePortal
                    id="visitTypeList"
                    options={visitTypeList}
                    key={option => option.lookupid}
                    getOptionLabel={option => option.lookupvalue}
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

              <Grid item xs={3} spacing={4}  >
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



            </Grid>
            <Grid xs={12} container spacing={4}>
              <Grid item xs={3} spacing={4}>
                <FormControl variant="outlined" fullWidth>
                  <Autocomplete
                    size="small"
                    value={serviceValues}
                    onChange={(event, newValue) => {
                      setServiceValues(newValue);
                      addServicetoList(newValue);
                    }}
                    key={option => option.serviceid}
                    getOptionLabel={option => option.servicename}
                    inputValue={serviceinputValue}
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
                    <TableRow key={service.service.service}>
                      <TableCell>{(service && service.service) ? service.service.serviceType : ""}</TableCell>
                      <TableCell>{(service && service.service) ? service.service.servicename : ""}</TableCell>
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
                </TableBody>

              </Table>
            </TableContainer>
          </DemoPaper>
        </Box>
        <FormButtonComponent button1={"Save"} button2={"Clear"} />
      </form>

    </Box>


  );
}
