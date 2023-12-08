import React, { useEffect, useState } from 'react';
import { Box} from '@mui/material';
import {TextField, FormControl,InputLabel,Select,MenuItem,Grid} from "@material-ui/core";
import { GetCountries, GetState, GetCity } from "react-country-state-city";
import Translations from '../../resources/translations';

const AddressController = () => {
const [countryid, setCountryid] = useState(0);
const [countriesList, setCountriesList] = useState([]);
const [stateList, setStateList] = useState([]);
const [cityList, setCityList] = useState([]);

const [address1, setAddress1] = useState([]);
  const [address2, setAddress2] = useState([]);
  const [country, setCountry] = useState([]);
  const [city, setCity] = useState([]);
  const [state, setState] = useState([]);
  const [pincode, setPincode] = useState([]);

useEffect(() => {
    GetCountries().then((result) => {
      setCountriesList(result);
    });
  }, []);

return(
<Box display="grid" gap="20px">
  <Grid container spacing={2}>
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
      <FormControl  variant="outlined" fullWidth>
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
              const country = countriesList.find(cntry => cntry.name === e.target.value);
              setCountryid(country.id);
              setCountry(country.name);
              GetState(country.id).then((result) => {
                setStateList(result);
              });
            }}
            value={country}
          >
            {countriesList.map((item) => (
            <MenuItem key={item.id} value={item.name}>
              {item.name}
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
            const state = stateList.find(st => st.name === e.target.value); //here you will get full state object.
            setState(state.name);
            GetCity(countryid, state.id).then((result) => {
              setCityList(result);
            });
          }}
          value={state}
          >
            {stateList.map((item1) => (
            <MenuItem key={item1.id} value={item1.name}>
              {item1.name}
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
            const city = cityList.find(cty => cty.name === e.target.value);
            setCity(city.name); //here you will get full city object.
          }}
          value={city}
          >
            {cityList.map((item2) => (
            <MenuItem key={item2.id} value={item2.name}>
              {item2.name}
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
}
export default AddressController;