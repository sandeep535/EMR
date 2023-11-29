import React, { useEffect, useState } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { GetCountries, GetState, GetCity } from "react-country-state-city";
import Grid from '@mui/material/Grid';
import Translations from '../../resources/translations';

const AddressController = () => {
const [countryid, setCountryid] = useState(0);
const [countriesList, setCountriesList] = useState([]);
const [stateList, setStateList] = useState([]);
const [cityList, setCityList] = useState([]);

useEffect(() => {
    GetCountries().then((result) => {
      setCountriesList(result);
    });
  }, []);

return(
<></>
);

}
export default AddressController;