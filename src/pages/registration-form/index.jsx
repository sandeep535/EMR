import React, { useState } from 'react';
import { Box} from '@mui/material';
import {TextField, FormControl,InputLabel,Select,MenuItem,Grid, Button} from "@material-ui/core";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Header from "../../components/Header";
import Translations from '../../resources/translations';
import AddressController from '../address/addressComponent';
//import axios from 'axios';

const Registration = () => {

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

  const [ isAlertVisible, setIsAlertVisible ] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  function handleSubmit(event) {
    setOpen(true);
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
    
    setTimeout(() => {
      setOpen(false);
      setIsAlertVisible(true);
    }, 3000);
    setTimeout(() => {
      setIsAlertVisible(false);
    }, 6000);

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
          value:'Male',
          id:1
      },
      {
          name:'Female',
          value:'Female',
          id:2
      },
      {
          name:'Others',
          value:'Others',
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
  
  return (
    <Box m="20px">
      <Header title={Translations.patientRegistration.pagetitle} subtitle={Translations.patientRegistration.pagesubtitle} />
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
              <Grid container spacing={2}>
                <Grid item xs={2} spacing={4}>

                  <FormControl variant="outlined" fullWidth>
                    <InputLabel
                      style={{ disableAnimation: false }}
                      disableAnimation={false}
                      htmlFor="title"
                    >
                    {Translations.patientRegistration.title}
                    </InputLabel>
                    
                      <Select
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

                <Grid item xs={4} spacing={4}>
                  <TextField
                    fullWidth
                    type="text"
                    variant="outlined"
                    required
                    label={Translations.patientRegistration.firstName}
                    name="firstName"
                    onChange={e => setFirstName(e.target.value)}
                    value={firstName}
                  />
                </Grid>
                <Grid item xs={4} spacing={4}>
                  <TextField
                    fullWidth
                    type="text"
                    variant="outlined"
                    required
                    label={Translations.patientRegistration.lastName}
                    name="lastName"
                    onChange={e => setLastName(e.target.value)}
                    value={lastName}
                  />
                </Grid>
                <Grid item xs={2} >

                <FormControl  variant="outlined" fullWidth>
                      <InputLabel
                        style={{ disableAnimation: false }}
                        disableAnimation={false}
                        htmlFor="gender"
                      >
                      {Translations.patientRegistration.gender}
                      </InputLabel>
                      <Select
                        label={Translations.patientRegistration.gender}
                        name="gender"
                        required
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
              </Grid>
              <Grid container spacing={4}>
                <Grid item xs={3} >
                  <TextField
                      type="date"
                      variant="outlined"
                      onChange={e => setDOB(e.target.value)}
                      value={dob}
                      fullWidth
                  />
                </Grid>
                <Grid item xs={3} >
                  <TextField
                    fullWidth
                    type="number"
                    variant="outlined"
                    label={Translations.patientRegistration.age}
                    name="age"
                    onChange={e => setAge(e.target.value)}
                    value={age}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    type="email"
                    variant="outlined"
                    label={Translations.patientRegistration.email}
                    name="email"
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    type="text"
                    variant="outlined"
                    label={Translations.patientRegistration.contact}
                    name="contact"
                    required
                    onChange={e => setContact(e.target.value)}
                    value={contact}
                  />
                </Grid>
              </Grid>
              <AddressController />             
            </Box>
          
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                {Translations.Common.registerBtn}
              </Button>
              <Button color="secondary" variant="contained" onClick={clearData}>
                {Translations.Common.clearBtn}
              </Button>
              <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
                <CircularProgress color="inherit" />
              </Backdrop>
            </Box>
          </form>
          
    </Box>
  );
}

export default Registration;