import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import Translations from '../../resources/translations';
import { sendRequest } from '../global/DataManager'
import APIS from '../../Utils/APIS';
import RegistrationInformation from '../../components/RegistrationInformation/RegistrationInformation';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import EMRAlert from '../../Utils/CustomAlert';
import { useForm } from "react-hook-form";
import CommonCard from '../../common/CommonCard';
import { PatientCreationSchema } from '../../common/YupSchema/formSchema';
import { yupResolver } from "@hookform/resolvers/yup";
import AddressComponent from '../../components/address/AddressComponent';

const ClientRegistration = () => {
  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {},
    resolver: yupResolver(PatientCreationSchema),
  })
  useEffect(() => {
    return () => console.log("Cleanup..");
  }, []);


  async function saveClientRegistration(data) {
    var payLoad = {
      method: APIS.CLIENT_REGISTRATION.METHOD,
      url: APIS.CLIENT_REGISTRATION.URL,
      paramas: [],
      data: data
    }
    let result = await sendRequest(payLoad);
    if (result) {
      EMRAlert.alertifySuccess("Patient Saved Succussfully");
    } else {
      EMRAlert.alertifyError("Not created");
    }

  }

  const patientregistrationhandleSubmit = async (data) => {
    let dataCopy = { ...data };
    var obj = {
      address1: dataCopy.address1,
      address2: dataCopy.address2,
      country: dataCopy.country,
      city: dataCopy.city,
      state: dataCopy.state,
      pincode: dataCopy.pincode
    }
    dataCopy.address = obj;
    delete dataCopy.address1;
    delete dataCopy.address2;
    delete dataCopy.country;
    delete dataCopy.city;
    delete dataCopy.state;
    delete dataCopy.pincode;
    saveClientRegistration(dataCopy);
  }
  return (
    <Box m="0px">
      <CommonCard title={Translations.patientRegistration.pagetitle}>
        <form onSubmit={handleSubmit(patientregistrationhandleSubmit)} >
          <Box display="grid">
            <CommonCard title={Translations.patientRegistration.personalDetails}>
              <RegistrationInformation control={control} errors={errors} setValue={setValue} />
            </CommonCard>
            <CommonCard title={Translations.patientRegistration.address}>
              <AddressComponent control={control} errors={errors} watch={watch} />
            </CommonCard>

          </Box>
          <FormButtonComponent button1={"Register"} button2={"Clear"} />
        </form>
      </CommonCard>


    </Box>
  );
}

export default ClientRegistration;