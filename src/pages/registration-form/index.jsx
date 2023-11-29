import React, { useEffect, useState } from 'react';
import { Box,TextField, Button, FormControl } from '@mui/material';
//import * as yup from 'yup';
import Header from "../../components/Header";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { GetCountries, GetState, GetCity } from "react-country-state-city";
import Grid from '@mui/material/Grid';
import Translations from '../../resources/translations';
//import axios from 'axios';

const Registration = () => {

  const [countryid, setCountryid] = useState(0);
  const [countriesList, setCountriesList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [title, setTitle] = useState([]);
  const [firstName, setFirstName] = useState([]);
  const [lastName, setLastName] = useState([]);
  const [gender, setGender] = useState([]);
  const [dob, setDOB] = useState([]);
  const [age, setAge] = useState([]);
  const [email, setEmail] = useState([]);
  const [contact, setContact] = useState([]);
  const [address1, setAddress1] = useState([]);
  const [address2, setAddress2] = useState([]);
  const [country, setCountry] = useState([]);
  const [city, setCity] = useState([]);
  const [state, setState] = useState([]);
  const [pincode, setPincode] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();
    const obj = {
      "Title":title,
      "FirstName":firstName,
      "LastName":lastName,
      "Age":age,
      "Gender":gender,
      "DateofBirth":dob,
      "Email":email,
      "Contact":contact,
      "Address1":address1,
      "Address2":address2,
      "Country":country,
      "State":state,
      "City":city,
      "Pin Code":pincode
    }
    console.log(obj); 

    /*axios.post('/user', obj)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });*/

    clearData();
  };
  const TitleList=[
      {
          name:'Mr',
          value:'Mr',
          id:1
      },
      {
          name:'Mrs',
          value:'Mrs',
          id:2
      },
      {
          name:'Miss',
          value:'Miss',
          id:3
      },
      {
          name:'Dr',
          value:'Dr',
          id:4
      },
      {
          name:'Baby',
          value:'Baby',
          id:5
      },
      {
          name:'Master',
          value:'Master',
          id:6
      },
  ];

  const GenderList=[
      {
          name:'Male',
          Value:'Male',
          id:1
      },
      {
          name:'Female',
          Value:'Female',
          id:2
      },
      {
          name:'Others',
          Value:'Others',
          id:3
      }
  ]

  
  function clearData (){
    console.log('clear');

      setTitle('');
      setFirstName('');
      setLastName('');
      setGender('');
      setDOB('');
      setAge('');
      setEmail('');
      setContact('');
      setAddress1('');
      setAddress2('');
      setCountry('');
      setCity('');
      setState('');
      setPincode('');
  } 
  
  useEffect(() => {
    GetCountries().then((result) => {
      setCountriesList(result);
    });
  }, []);

  return (
    <Box m="20px">
      <Header title={Translations.patientRegistration.pagetitle} subtitle={Translations.patientRegistration.pagesubtitle} />
     
          <form onSubmit={handleSubmit}>
            <Box display="grid"
              gap="40px">
              <Grid container spacing={2}>
                <Grid item xs={2} spacing={4}>

                  <FormControl variant="outlined" fullWidth>
                    <InputLabel shrink>{Translations.patientRegistration.title}</InputLabel>
                      <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={title}
                        label={Translations.patientRegistration.title}
                        name="title"
                        onChange={e => setTitle(e.target.value)}>

                        {TitleList.map((titles) => (
                        <MenuItem key={titles.id} value={titles.value}>
                          {titles.name}
                        </MenuItem>
                      ))}
                      </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={5} spacing={4}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label={Translations.patientRegistration.firstName}
                    name="firstName"
                    onChange={e => setFirstName(e.target.value)}
                    value={firstName}
                  />
                </Grid>
                <Grid item xs={5} spacing={4}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label={Translations.patientRegistration.lastName}
                    name="lastName"
                    onChange={e => setLastName(e.target.value)}
                    value={lastName}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid item xs={4} >

                <FormControl  variant="outlined" fullWidth>
                    <InputLabel shrink>{Translations.patientRegistration.gender}</InputLabel>
                      <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        label={Translations.patientRegistration.title}
                        name="gender"
                        onChange={e => setGender(e.target.value)}
                        value={gender}
                      >
                      {GenderList.map((genders) => (
                        <MenuItem key={genders.id} value={genders.value}>
                          {genders.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                </Grid>
                <Grid item xs={4} >
                  <TextField
                      type="date"
                      variant='filled'
                      label={Translations.patientRegistration.dob}
                      onChange={e => setDOB(e.target.value)}
                      value={dob}
                      fullWidth
                  />
                </Grid>
                <Grid item xs={4} >
                  <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    label={Translations.patientRegistration.age}
                    name="age"
                    onChange={e => setAge(e.target.value)}
                    value={age}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="email"
                    label={Translations.patientRegistration.email}
                    name="email"
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label={Translations.patientRegistration.contact}
                    name="contact"
                    onChange={e => setContact(e.target.value)}
                    value={contact}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label={Translations.Common.address1}
                    name="address1"
                    onChange={e => setAddress1(e.target.value)}
                    value={address1}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
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
                    <InputLabel shrink>{Translations.Common.country}</InputLabel>
                      <Select name="country"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
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
                    <InputLabel shrink>{Translations.Common.state}</InputLabel>
                    <Select name="state" 
                      labelId="demo-simple-select-label"
                      id="demo-simple-select1"
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
                    <InputLabel shrink>{Translations.Common.city}</InputLabel>
                    <Select name="city" 
                      labelId="demo-simple-select-label"
                      id="demo-simple-select2"
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
                    variant="filled"
                    type="text"
                    label={Translations.Common.pincode}
                    name="pincode"
                    onChange={e => setPincode(e.target.value)}
                    value={pincode}
                  />
                </Grid>
              </Grid>

            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                {Translations.Common.registerBtn}
              </Button>
              <Button color="secondary" variant="contained" onClick={clearData}>
                {Translations.Common.clearBtn}
              </Button>
            </Box>
          </form>
    </Box>
  );
}

export default Registration;