import React, { useEffect, useState } from 'react';
import { Box,Typography,useTheme} from '@mui/material';
import {TextField, FormControl,InputLabel,Select,MenuItem,Grid, Button} from "@material-ui/core";
import { tokens } from "../../theme";
import Autocomplete from '@mui/material/Autocomplete';
//import * as yup from 'yup';
import Translations from '../../resources/translations';
import { DataGrid } from '@mui/x-data-grid';

//import axios from 'axios';

const VisitCreation = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [title, setTitle] = useState([]);
  const [firstName, setFirstName] = useState([]);
  const [lastName, setLastName] = useState([]);
  const [gender, setGender] = useState([]);
  const [dob, setDOB] = useState([]);
  const [age, setAge] = useState([]);
  const [contact, setContact] = useState([]);
  const [speciality,setSpeciality]= useState([]);
  const [docName, setDocName] = useState([]);
  const [visitType,setVisitType] = useState([]);
  const [visitreason ,setVisitReason]= useState([]);
  const [storeData, setStoreData] = useState([]);


  function handleSubmit(event) {
    event.preventDefault();
    
    const RegistrationObj = {
      "Title":title,
      "FirstName":firstName,
      "LastName":lastName,
      "Age":age,
      "Gender":gender,
      "DateofBirth":dob,
      "Contact":contact,
    }
    console.log(RegistrationObj); 

    const VisitCreationObj = {
        "speciality":speciality,
        "docName":docName,
        "visitType":visitType,
        "visitreason":visitreason
      }
      console.log(VisitCreationObj); 
    /*axios.post('/user', obj)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });*/

      // console.log(values);
  
    setStoreData([...storeData, VisitCreationObj]);
    clearData();
  };
  const columns = [
    { field: "id", headerName: "ID", width: 30, align: "left", flex: 4 },
    {
      field: 'Servicetype',
      headerName: 'Service Type',
      width: 200,
      editable: true,
    },
    {
      field: 'servicename',
      headerName: 'Service Name',
      width: 200,
      editable: true,
    },
    {
        field: 'price',
        headerName: 'Price',
        sortable: true,
        width: 150
      },
      {
        field: 'qnty',
        headerName: 'Quantity',
        sortable: true,
        width: 150
      },
      {
        field: 'discount',
        headerName: 'Discount',
        sortable: true,
        width: 150
      },
      {
        field: 'totAmt',
        headerName: 'Total Amount',
        sortable: true,
        width: 150
      }
  ];
  
  let newId = 0;
  const rows = storeData?.map((row) => {
    newId += 1;

    return {
      id: `${newId}`,
      Servicetype: `${row.speciality}`,
      servicename: `${row.speciality}`,
      visittype: `${row.visitType}`,
      DocName: `${row.docName}`,
      price: `${newId}`,
      qnty: `${newId}`,
      discount: `${newId}`,
      totAmt: `${newId}`,

    };
  });

  
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

  const VisitTypeList=[
    { label:'General',id:1},
    { label:'Emergency',id:2}
]
const SpecialityList=[
    { label:'General Medicine',id:1},
    { label:'Physio',id:2},
    { label:'Physchology',id:3},
    { label:'Dental',id:4}
]

const DoctorList=[
    { label:'Dr.Ram',id:1},
    { label:'Dr.Sandeep', id:2},
    { label:'Dr.Shiva',id:3}
]
  
  function clearData (){
    console.log('clear');
      setTitle('');
      setFirstName('');
      setLastName('');
      setGender('');
      setDOB('');
      setAge('');
      setContact('');
      setVisitReason('');
      setVisitType('');
      setDocName('');
      setSpeciality('');
  } 
  
  useEffect(() => {
  }, []);

  return (
    <Box m="20px">
        <form onSubmit={handleSubmit}>
          <Box display="grid" gap="15px" className='reg_div'>
            <Grid xs={12} container>
              <Grid item xs={4}>
                <Typography variant="h5" color={colors.greenAccent[400]}>
                Patient Registration
                </Typography>
              </Grid>
            </Grid>
            <Grid xs={12} container spacing={4}>
              <Grid item xs={2}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel style={{ disableAnimation: false }} disableAnimation={false}  htmlFor="title">
                    {Translations.patientRegistration.title}
                  </InputLabel>
                  <Select className='input_background'
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
              <Grid item xs={4}>
                <TextField
                  className='input_background'
                  fullWidth
                  variant="outlined"
                  type="text"
                  required
                  label={Translations.patientRegistration.firstName}
                  name="firstName"
                  onChange={e => setFirstName(e.target.value)}
                  value={firstName}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  className='input_background'
                  variant="outlined"
                  type="text"
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
                    htmlFor="gender">
                      {Translations.patientRegistration.gender}
                  </InputLabel>
                  <Select
                    className='input_background'
                    label={Translations.patientRegistration.title}
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
            <Grid xs={12} container spacing={4}>
              <Grid item xs={4} >
                <TextField
                  type="date"
                  className='input_background'
                  variant='outlined'
                  onChange={e => setDOB(e.target.value)}
                  value={dob}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4} >
                <TextField
                  fullWidth
                  className='input_background'
                  variant="outlined"
                  type="number"
                  label={Translations.patientRegistration.age}
                  name="age"
                  onChange={e => setAge(e.target.value)}
                  value={age}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  className='input_background'
                  variant="outlined"
                  type="text"
                  required
                  label={Translations.patientRegistration.contact}
                  name="contact"
                  onChange={e => setContact(e.target.value)}
                  value={contact}
                />
              </Grid>
            </Grid>
          </Box>
          <Box display="grid" gap="20px" className='reg_div visit_div'>
          <Grid xs={12} container>
              <Grid item xs={4}>
                <Typography variant="h5" color={colors.greenAccent[400]}>
                Visit Creation
                </Typography>
              </Grid>
            </Grid>
            <Grid xs={12} container spacing={4}>
              <Grid item xs={3} spacing={4}>
                <FormControl  variant="outlined" fullWidth>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={SpecialityList}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label= {Translations.visitCreation.speciality} />}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3}  spacing={4} >
                <FormControl  variant="outlined" fullWidth>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    variant="outlined"
                    fullWidth
                    options={DoctorList}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label= {Translations.visitCreation.DocName} />}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3} spacing={4} >
                <FormControl  variant="outlined" fullWidth>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={VisitTypeList}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label= {Translations.visitCreation.visitType} />}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3} spacing={4}  >
                <TextField
                    fullWidth
                    variant="outlined"
                    className='input_background'
                    type="text"
                    label={Translations.visitCreation.visitReason}
                    name="Reason For Visit"
                    onChange={e => setVisitReason(e.target.value)}
                    value={visitreason}/>
              </Grid>
            </Grid>
          </Box>
          <Box display="grid" gap="20px">
            <Grid xs={12} container spacing={4}>
              <Box sx={{ height: 400, width: '100%',paddingLeft:'2%',marginTop:'2%' }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  initialState={{
                  pagination: {
                      paginationModel: {
                      pageSize: 5,
                      },
                  },
                  }}
                  pageSizeOptions={[5]}
                  disableRowSelectionOnClick
                />
              </Box>
            </Grid>                  
          </Box>
          <Box display="flex" justifyContent="center" mt="20px">
            <Button type="submit" color="secondary" variant="contained">
              {Translations.Common.Save}
            </Button>
            <Button color="secondary" variant="contained" onClick={clearData}>
              {Translations.Common.clearBtn}
            </Button>
          </Box>
        </form>
      </Box>
  );
}
export default VisitCreation;