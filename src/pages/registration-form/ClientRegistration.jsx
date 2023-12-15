import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem, Grid, Button } from "@material-ui/core";
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Header from "../../components/Header";
import Translations from '../../resources/translations';
import AddressController from '../../components/address/addressComponent';
import { sendRequest } from '../global/DataManager'
import APIS from '../../Utils/APIS';
import RegistrationInformation from '../../components/RegistrationInformation/RegistrationInformation';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
const ClientRegistration = () => {
  const [isAlertVisible, setIsAlertVisible] = React.useState(false);
  const [open, setOpen] = React.useState(false);
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
    console.log(result);
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

        {/* <Box display="flex" justifyContent="center" mt="20px">
          <Button type="submit" color="secondary" variant="contained">
            {Translations.Common.registerBtn}
          </Button>
          <Button color="secondary" variant="contained" onClick={() => { }}>
            {Translations.Common.clearBtn}
          </Button>

        </Box> */}
        <FormButtonComponent button1={"Register"} button2={"Clear"} />
      </form>

    </Box>
  );
}

export default ClientRegistration;