import React, { useRef, useEffect, useCallback } from 'react';
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Translations from '../../resources/translations';
import { sendRequest } from '../global/DataManager'
import APIS from '../../Utils/APIS';
import RegistrationInformation from '../../components/RegistrationInformation/RegistrationInformation';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import EMRAlert from '../../Utils/CustomAlert';
import dayjs from 'dayjs';
import moment from 'moment';
import CommonCard from '../../common/CommonCard';
import { useForm } from "react-hook-form";
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import SLDatePicker from '../../CoreComponents/SLDatePicker';
import SLTextField from '../../CoreComponents/SLTextField';
import { AddmissionSchema, VisitCreationSchema } from '../../common/YupSchema/formSchema';
import { yupResolver } from "@hookform/resolvers/yup";
import ClientSearchComponent from '../../components/ClientSearch/ClientSearchComponent';
import BedSelection from '../../common/BedSelection/BedSelection';
import BedSelectionView from '../../common/BedSelection/BedSelectionView';

export default function Admission(props) {
  const [doctoroptions, setDoctoroptions] = React.useState([]);
  const [visiiTypeOptions, setVisiiTypeOptions] = React.useState([]);
  const [specialityListOptions, setSpecialityListOptions] = React.useState([]);
  const [selectedClientData, setSelectedClientData] = React.useState([]);
   const [bedList, setBedList] = React.useState([]);
  const { control, handleSubmit, reset, setValue,getValues, formState: { errors } } = useForm({
    defaultValues: {},
    resolver: yupResolver(AddmissionSchema),
  })

  useEffect(() => {
    getLookUpDetails();
  }, []);

  function clearVisitForm() {
    reset({})
  }

  function setVisitDataInEditMode() {
    setSelectedClientData(props?.visitEditData?.clientid);
    setDataToRegistrationForm(props?.visitEditData?.clientid);
    let data = {
      visitId : props?.visitEditData.visitid
    }
    setVisitDetailsInEditmode(props?.visitEditData);
  }
  async function getDoctorsData(value) {
    if (!value)
      return false;
    let specility = getValues("specility") && getValues("specility").lookupid ? getValues("specility").lookupid : null;
    var payLoad = {
      method: APIS.GET_EMPLOYES_BASED_ON_NAME_DESIGNATION.METHOD,
      url: APIS.GET_EMPLOYES_BASED_ON_NAME_DESIGNATION.URL,
      paramas: [specility,value]
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
    if (props?.isEdit == 'true') {
      setVisitDataInEditMode();
    }else{
      reset({
        visitdate: dayjs(moment(new Date()).format("YYYY-MM-DD"))
      })
    }
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
    setValue("admissionType", data.visittype);
    let visitdate1 = dayjs(moment(data.visitdate).format("YYYY-MM-DD"));
    setValue("visitdate", visitdate1);
    setValue("token", data.token);
    setValue("visitreason", data.reason);
    setValue("paymenttype", data.paymenttype);
  }

  const visitCreationhandleSubmit = async (data) => {
    handleSubmit1(data);
  }
  async function handleSubmit1(data) {
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
      reason: data.visitreason,
      status: 1,
      clientid: clientDeatils,
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
  }

  const handleBedPicked = useCallback((bed) => {
    setBedList(bed);
  }, []);
 
  return (
    <>
      <Box m="2px" >
        <Box m="3px">
          <Grid xs={6} container>
            <ClientSearchComponent
              label={Translations.visitCreation.searchCleint}
              selectedPatientDetails={(data) => {
                populateClientDatatoForm(data);
              }}
              onInputChangeEvent={(newInputValue) => {
                setValue("contact", newInputValue);
              }}
            />

          </Grid>
        </Box>
        <Box sx={{ width: '100%' }}>
          <form onSubmit={handleSubmit(visitCreationhandleSubmit)} >
            <CommonCard title={Translations.visitCreation.clientDetails}>
              <RegistrationInformation control={control} errors={errors} setValue={setValue} />
            </CommonCard>
            <CommonCard title={Translations.admission.pagesubtitle}>
              <Box display="grid" gap="10px" sx={{width:'100%'}} >
                <Grid xs={12} container spacing={1} style={{ width: '100%' }}>
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
                        mapvalues={{ id: "id", value: ['firstname', 'lastname'] }}
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
                        name="admissionType"
                        label={Translations.visitCreation.admissionType}
                        control={control}
                        options={visiiTypeOptions}
                        placeholder={Translations.admission.admissionType}
                        mapvalues={{ id: "lookupid", value: 'lookupvalue' }}
                        isMultiSelect={false}
                        id={"visitType-combo-box-demo"}
                      />

                    </FormControl>
                  </Grid>
                  <Grid item xs={2} spacing={1}>
                    <SLDatePicker
                      name="admisionDate"
                      label={Translations.admission.admissionDate}
                      control={control}
                      error={errors.admisionDate}
                    />

                  </Grid>
                 
                  <Grid item xs={6} spacing={1}  >
                    <SLTextField
                      name="admissionReason"
                      label={Translations.admission.admissionReason}
                      control={control}
                      placeholder={Translations.admission.admissionReason}
                      error={errors.admissionReason}
                    />
                  </Grid>
                  
                </Grid>
                

              </Box>
            </CommonCard>
            <Box>
            <BedSelection  onChange={handleBedPicked} initialParentId={-999} />
        </Box>
        <Box>
            <BedSelectionView  bed={bedList}  />
        </Box>
            <FormButtonComponent button1={"Save"} button2={"Clear"} clearFormEvent={() => {
              clearVisitForm();
            }} />
          </form>
        </Box>
       
      </Box>
    </>
  );
}
