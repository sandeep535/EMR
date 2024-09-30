import React, { useEffect, useState, forwardRef } from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import Translations from '../../resources/translations';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import SLTextField from '../../CoreComponents/SLTextField';
import SLSelectDropDown from '../../CoreComponents/SLSelectDropDown';

const AddressController = forwardRef((props, ref) => {
  const { control, errors } = props;
  const [countriesList, setCountriesList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  useEffect(() => {
    getCountries();
  }, []);
  async function getCountries() {
    var payLoad = {
      method: APIS.GET_COUNTRIESLIST.METHOD,
      url: APIS.GET_COUNTRIESLIST.URL,
      paramas: []
    }
    let result = await sendRequest(payLoad);
    if (result) {
      setCountriesList(result);
    }
  }
  async function getStateData(countryid) {
    var payLoad = {
      method: APIS.GET_STATES.METHOD,
      url: APIS.GET_STATES.URL,
      paramas: [countryid]
    }
    let result = await sendRequest(payLoad);
    if (result) {
      setStateList(result);
    }
  }
  async function getCities(stateId) {
    var payLoad = {
      method: APIS.GET_CITIES.METHOD,
      url: APIS.GET_CITIES.URL,
      paramas: [stateId]
    }
    let result = await sendRequest(payLoad);
    if (result) {
      setCityList(result);
    }
  }
  return (
    <Box display="grid" gap="10px">
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <SLTextField
            name="address1"
            label={Translations.Common.address1}
            control={control}
            placeholder={Translations.Common.address1}
          />
        </Grid>
        <Grid item xs={6}>
          <SLTextField
            name="address2"
            label={Translations.Common.address2}
            control={control}
            placeholder={Translations.Common.address2}
          />
        </Grid>
      
     
        <Grid item xs={3}>
          <SLSelectDropDown
            name="country"
            label={Translations.Common.country}
            control={control}
            options={countriesList}
            error={errors.country}
            mapvalues={{ id: "countryid", value: 'countryname' }}
            onchangeEventCallBack={(item) => {
              getStateData(item.countryid);
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <SLSelectDropDown
            name="state"
            label={Translations.Common.state}
            control={control}
            options={stateList}
            error={errors.state}
            mapvalues={{ id: "stateid", value: 'statename' }}
            onchangeEventCallBack={(item) => {
              getCities(item.stateid);
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <SLSelectDropDown
            name="city"
            label={Translations.Common.city}
            control={control}
            options={cityList}
            error={errors.city}
            mapvalues={{ id: "cityid", value: 'cityname' }}
          />
        </Grid>
        <Grid item xs={3}>
          <SLTextField
            name="pincode"
            label={Translations.Common.pincode}
            control={control}
            placeholder={Translations.Common.pincode}
          />
        </Grid>
        </Grid>
    </Box>
  );
});
export default AddressController;