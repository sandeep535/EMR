
import React, { useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box } from '@mui/material'
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
import Divider from '@mui/material/Divider';
import dayjs from 'dayjs';
import moment from 'moment';
import Typography from '@mui/material/Typography';
import CommonCard from '../../common/CommonCard';
import { useForm } from "react-hook-form";
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import SLDatePicker from '../../CoreComponents/SLDatePicker';
import SLTextField from '../../CoreComponents/SLTextField';
import { VisitCreationSchema } from '../../common/YupSchema/formSchema';
import { yupResolver } from "@hookform/resolvers/yup";

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
  const [doctoroptions, setDoctoroptions] = React.useState([]);
  const [serviceoptions, setServiceOptions] = React.useState([]);
  const [visiiTypeOptions, setVisiiTypeOptions] = React.useState([]);
  const [paymentTypeOptions, setPaymentTypeOptions] = React.useState([]);
  const [specialityListOptions, setSpecialityListOptions] = React.useState([]);
  const [visitServiceList, setVisitServiceList] = React.useState([]);
  const [clientsearchlist, setClientsearchlist] = React.useState([]);
  const [selectedClientData, setSelectedClientData] = React.useState([]);
  const [visitdiscount, setVisitdiscount] = React.useState(0);
  const [visitpercentage, setVisitpercentage] = React.useState(0);
  const [totalAmount, setTotalAmount] = React.useState();
  const [visittotalamount, setVisittotalamount] = React.useState();
  const searchAutoCompleteRef = useRef();

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {},
    resolver: yupResolver(VisitCreationSchema),
  })

  useEffect(() => {
    getLookUpDetails();
    getPaymentTypeList();

  }, []);

  useEffect(() => {
    updateTotalAmount();
  }, [visitServiceList]);

  function clearVisitForm() {
    reset({})
  }

  function setVisitDataInEditMode() {
    setSelectedClientData(props?.visitEditData?.clientid);
    setDataToRegistrationForm(props?.visitEditData?.clientid);
    setVisitServiceList(props?.visitEditData?.services);
    setVisitDetailsInEditmode(props?.visitEditData);
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
  async function getPaymentTypeList() {
    var payLoad = {
      method: APIS.GET_MASTER_DATA_BASED_ON_CODE.METHOD,
      url: APIS.GET_MASTER_DATA_BASED_ON_CODE.URL,
      paramas: ["PAYMENT_MODE"]
    }
    let result = await sendRequest(payLoad);
    if (result) {
      setPaymentTypeOptions(result);
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
    if (props?.isEdit == 'true') {
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
    setDataToRegistrationForm(clientData);
    setSelectedClientData(clientData);
  }
  function setDataToRegistrationForm(data) {
    setValue("title", data.title);
    setValue("firstname", data.firstname);
    setValue("lastname", data.lastname);
    setValue("gender", data.gender);
    let dob1 = dayjs(moment(data.dob).format("YYYY-MM-DD"));
    setValue("dob", dob1);
    setValue("age", data.age);
    setValue("contact", data.contact);
    setValue("email", data.email);
  }
  function setVisitDetailsInEditmode(data) {
    setValue("specility", data.specilaity);
    setValue("doctor", data.doctor);
    setValue("visitType", data.visittype);
    let visitdate1 = dayjs(moment(data.visitdate).format("YYYY-MM-DD"));
    setValue("visitdate", visitdate1);
    setValue("token", data.token);
    setValue("visitreason", data.reason);
    setValue("paymenttype", data.paymenttype);
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
  const visitCreationhandleSubmit = async (data) => {
    handleSubmit1(data);
  }
  async function handleSubmit1(data) {
    if (visitServiceList.length == 0) {
      EMRAlert.alertifyError("Please select atlease one service");
      return false;
    }
    var clientDeatils = "";
    if (selectedClientData && selectedClientData.seqid) {
      clientDeatils = selectedClientData;
    } else {
      clientDeatils = {
        title: data.title,
        firstname: data.firstname,
        lastname: data.lastname,
        gender: data.gender,
        dob: new Date(data.dob),
        age: data.age,
        contact: data.contact,
        email: data.email
      };
    }
    let sendingObj = {
      visitdate: new Date(data.visitdate),
      doctor: data.doctor,
      visittype: data.visitType,
      specilaity: data.specility,
      visitdiscount: visitdiscount,
      visittotalamount: visittotalamount,
      visitpercentage: visitpercentage,
      reason: data.visitreason,
      status: 1,
      clientid: clientDeatils,
      services: visitServiceList,
      token: data.token,
      paymenttype: data.paymenttype,
      visitid: (props?.isEdit == "true") ? props?.visitEditData?.visitid : null
    }
    var payLoad = {
      method: APIS.SAVE_VISIT.METHOD,
      url: APIS.SAVE_VISIT.URL,
      paramas: [],
      data: sendingObj
    }
    let result = await sendRequest(payLoad);
    if (result) {
      EMRAlert.alertifySuccess("Visit Saved Succussfully.you token number is " + result.token + "");
      clearVisitForm()
    } else {
      EMRAlert.alertifyError("Not created")
    }
  };
  return (
    <>
      <Box m="10px">
        <Box m="10px">
          <Grid xs={6} container>
            <Autocomplete
              size="small"
              ref={searchAutoCompleteRef}
              onChange={(event, newValue) => {
                if (newValue) {
                  setValue("contact", newValue.contact);
                  populateClientDatatoForm(newValue);
                }
              }}
              key={option => option.seqid}
              getOptionLabel={option => option.contact}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <Box
                    key={key}
                    component="li"
                    {...optionProps}>
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
                  </Box>
                );
              }}
              onInputChange={(event, newInputValue) => {
                if (newInputValue.length > 4) {
                  getDataBasedOnMobileNumber(newInputValue)
                }
                setValue("contact", newInputValue);
              }}
              id="service-controllable-states-demo11"
              options={clientsearchlist}
              autoHighlight
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label={Translations.visitCreation.searchCleint} />}
            />
          </Grid>
        </Box>
        <form onSubmit={handleSubmit(visitCreationhandleSubmit)} >
          <CommonCard title={Translations.visitCreation.clientDetails}>
            <RegistrationInformation control={control} errors={errors} setValue={setValue} />
          </CommonCard>
          <CommonCard title={Translations.visitCreation.visitDetails}>
            <Box display="grid" gap="10px" >
              <Grid xs={12} container spacing={1}>
                <Grid item xs={2} spacing={1}>
                  <FormControl variant="outlined" fullWidth>
                    <AutocompleteField
                      name="specility"
                      label={Translations.visitCreation.speciality}
                      control={control}
                      options={specialityListOptions}
                      placeholder={Translations.visitCreation.speciality}
                      mapvalues={{ id: "lookupid", value: 'lookupvalue' }}
                      isMultiSelect={false}
                      id={"specility-combo-box-demo"}
                      onInputChange={(data) => {

                      }}
                    />

                  </FormControl>
                </Grid>
                <Grid item xs={2} spacing={1}>
                  <FormControl variant="outlined" size="small" fullWidth>
                    <AutocompleteField
                      name="doctor"
                      label={Translations.visitCreation.DocName}
                      control={control}
                      options={doctoroptions}
                      placeholder={Translations.visitCreation.DocName}
                      mapvalues={{ id: "id", value: 'firstname' }}
                      isMultiSelect={false}
                      id={"doctor-combo-box-demo"}
                      onInputChange={(data) => {
                        getDoctorsData(data)
                      }}
                    />

                  </FormControl>
                </Grid>

                <Grid item xs={2} spacing={1} >
                  <FormControl variant="outlined" size="small" fullWidth>
                    <AutocompleteField
                      name="visitType"
                      label={Translations.visitCreation.visitType}
                      control={control}
                      options={visiiTypeOptions}
                      placeholder={Translations.visitCreation.visitType}
                      mapvalues={{ id: "lookupid", value: 'lookupvalue' }}
                      isMultiSelect={false}
                      id={"visitType-combo-box-demo"}
                    />

                  </FormControl>
                </Grid>

                <Grid item xs={2} spacing={1}>
                  <SLDatePicker
                    name="visitdate"
                    label={Translations.visitCreation.visitDate}
                    control={control}
                    error={errors.visitdate}
                  />

                </Grid>
                <Grid item xs={2} spacing={1}>
                  <SLTextField
                    name="token"
                    label={Translations.visitCreation.token}
                    control={control}
                    placeholder={Translations.visitCreation.token}
                  />

                </Grid>

                <Grid item xs={6} spacing={1}  >
                  <SLTextField
                    name="visitreason"
                    label={Translations.visitCreation.visitReason}
                    control={control}
                    placeholder={Translations.visitCreation.visitReason}
                  />
                </Grid>
                <Grid item xs={2} spacing={1} >
                  <FormControl variant="outlined" size="small" fullWidth>
                    <AutocompleteField
                      name="paymenttype"
                      label={Translations.visitCreation.paymenttype}
                      control={control}
                      options={paymentTypeOptions}
                      placeholder={Translations.visitCreation.paymenttype}
                      mapvalues={{ id: "id", value: 'masterdatavalue' }}
                      isMultiSelect={false}
                      id={"paymenttype-combo-box-demo"}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid xs={12} container spacing={1}>
                <Grid item xs={3} spacing={1}>
                  <FormControl variant="outlined" fullWidth>
                    <AutocompleteField
                      name="serviceValues"
                      label={Translations.visitCreation.addServices}
                      control={control}
                      options={serviceoptions}
                      placeholder={Translations.visitCreation.addServices}
                      mapvalues={{ id: "serviceid", value: 'servicename' }}
                      isMultiSelect={false}
                      id={"service-controllable-states-demo"}
                      onchangeEventCallBack={(newValue) => {
                        addServicetoList(newValue);
                      }}
                      onInputChange={(data) => {
                        if (data.length > 3) {
                          getServiceMaterList(data)
                        }
                      }}
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
          </CommonCard>
          <FormButtonComponent button1={"Save"} button2={"Clear"} clearFormEvent={() => {
            clearVisitForm();
          }} />
        </form>
      </Box>
    </>
  );
}
