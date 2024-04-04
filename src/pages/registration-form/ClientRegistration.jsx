import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Header from "../../components/Header";
import Translations from '../../resources/translations';
import AddressController from '../../components/address/addressComponent';
import { sendRequest } from '../global/DataManager'
import APIS from '../../Utils/APIS';
import RegistrationInformation from '../../components/RegistrationInformation/RegistrationInformation';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import EMRAlert from '../../Utils/CustomAlert';

const ClientRegistration = () => {
  const [isAlertVisible, setIsAlertVisible] = React.useState(false);
  const addrssComponentRef = useRef();
  const registrationInformationRef = useRef();

  function handleSubmit(event) {
    const childData = addrssComponentRef.current.getAdderessData();
    const regFormData = registrationInformationRef.current.getFormData();
    event.preventDefault();
    regFormData.address = childData;
    console.log(regFormData);
    saveClientRegistration(regFormData);
  }
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
  return (
    <Box m="20px">
      <Header title={Translations.patientRegistration.pagetitle} />
      <form onSubmit={handleSubmit}>
        <Box display="grid"
          gap="20px">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {isAlertVisible && <Stack sx={{ width: '100%' }} spacing={2} >
                <Alert variant="filled" severity="success"><strong>Registration Success !!!</strong></Alert>
              </Stack>}
            </Grid>
          </Grid>
          <RegistrationInformation ref={registrationInformationRef} />
          <AddressController ref={addrssComponentRef} />
        </Box>
        <FormButtonComponent button1={"Register"} button2={"Clear"} />
      </form>

    </Box>
  );
}

export default ClientRegistration;