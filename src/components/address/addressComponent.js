import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Box } from '@mui/material';
//import { TextField, FormControl, InputLabel, Select, MenuItem, Grid } from "@material-ui/core";
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Translations from '../../resources/translations';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';

const AddressController = forwardRef((props, ref) => {
  const [countriesList, setCountriesList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [address1, setAddress1] = useState();
  const [address2, setAddress2] = useState([]);
  const [country, setCountry] = useState([]);
  const [city, setCity] = useState([]);
  const [state, setState] = useState([]);
  const [pincode, setPincode] = useState([]);

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
    console.log(result);
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
    console.log(result);
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
  useImperativeHandle(
    ref,
    () => {
      // the return object will pass to parent ref.current, so you can add anything what you want.
      return {
        getAdderessData: () => {
          return {
            "address1": address1,
            "address2": address2,
            country,
            state,
            city,
            pincode
          }
        },
      }
    },
    [address1, address2, country, city, state, pincode],
  );

  return (
    <Box display="grid" gap="10px">
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            type="text"
            variant="outlined"
            label={Translations.Common.address1}
            name="address1"
            onChange={e => setAddress1(e.target.value)}
            value={address1}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            type="text"
            variant="outlined"
            label={Translations.Common.address2}
            name="address2"
            onChange={e => setAddress2(e.target.value)}
            value={address2}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel
              style={{ disableAnimation: false }}
              disableAnimation={false}
              htmlFor="country"
            >
              {Translations.Common.country}
            </InputLabel>
            <Select name="country"
              label={Translations.Common.country}
              onChange={(e) => {
                setCountry(e.target.value);
                getStateData(e.target.value.countryid);
              }}
              value={country.name}
            >
              {countriesList.map((item) => (
                <MenuItem key={item.countryid} value={item}>
                  {item.countryname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel
              style={{ disableAnimation: false }}
              disableAnimation={false}
              htmlFor="state"
            >
              {Translations.Common.state}
            </InputLabel>
            <Select name="state"
              label={Translations.patientRegistration.state}
              onChange={(e) => {
                setState(e.target.value);
                getCities(e.target.value.stateid);
              }}
              value={state}
            >
              {stateList.map((stateValue) => (
                <MenuItem key={stateValue.stateid} value={stateValue}>
                  {stateValue.statename}
                </MenuItem>
              ))}

            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel
              style={{ disableAnimation: false }}
              disableAnimation={false}
              htmlFor="city"
            >
              {Translations.Common.city}
            </InputLabel>
            <Select name="city"
              label={Translations.patientRegistration.city}
              onChange={(e) => {
                setCity(e.target.value);
              }}
              value={city}
            >
              {cityList.map((city) => (
                <MenuItem key={city.cityid} value={city}>
                  {city.cityname}
                </MenuItem>
              ))}

            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            variant="outlined"
            type="text"
            label={Translations.Common.pincode}
            name="pincode"
            onChange={e => setPincode(e.target.value)}
            value={pincode}
          />
        </Grid>
      </Grid>
    </Box>
  );
});
export default AddressController;