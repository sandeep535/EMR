import React, { useEffect, useState } from 'react';
import { Box} from '@mui/material';
import {TextField, FormControl,InputLabel,Select,MenuItem,Grid, Button} from "@material-ui/core";
//import * as yup from 'yup';
import Header from "../../components/Header";
import Translations from '../../resources/translations';
import { DataGrid } from '@mui/x-data-grid';

//import axios from 'axios';

const VisitCreation = () => {


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
      width: 150,
      editable: true,
    },
    {
      field: 'servicename',
      headerName: 'Service Name',
      width: 150,
      editable: true,
    },
    {
      field: 'visittype',
      headerName: 'Visit Type',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'DocName',
      headerName: 'Doctor Name',
      sortable: true,
      width: 160
    },
    {
        field: 'price',
        headerName: 'Price',
        sortable: true,
        width: 160
      },
      {
        field: 'qnty',
        headerName: 'Quantity',
        sortable: true,
        width: 160
      },
      {
        field: 'discount',
        headerName: 'Discount',
        sortable: true,
        width: 160
      },
      {
        field: 'totAmt',
        headerName: 'Total Amount',
        sortable: true,
        width: 160
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
    {
        name:'General',
        value:'General',
        id:1
    },
    {
        name:'Emergency',
        value:'Emergency',
        id:2
    }
]
const SpecialityList=[
    {
        name:'General Medicine',
        value:'General Medicine',
        id:1
    },
    {
        name:'Physio',
        value:'Physio',
        id:2
    },
    {
        name:'Physchology',
        value:'Physchology',
        id:3
    },
    {
        name:'Dental',
        value:'Dental',
        id:4
    }
]
const DoctorList=[
    {
        name:'Dr.Ram',
        value:'Dr.Ram',
        id:1
    },
    {
        name:'Dr.Sandeep',
        value:'Dr.Sandeep',
        id:2
    },
    {
        name:'Dr.shiva',
        value:'Dr.Shiva',
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
      <Header title={Translations.visitCreation.pagetitle} subtitle={Translations.visitCreation.pagesubtitle} />
        <form onSubmit={handleSubmit}>
          <Box display="grid" gap="20px">
            <Grid xs={12} container spacing={4}>
              <Grid item xs={2}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel style={{ disableAnimation: false }} disableAnimation={false}  htmlFor="title">
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
                  variant="outlined"
                  type="text"
                  label={Translations.patientRegistration.firstName}
                  name="firstName"
                  onChange={e => setFirstName(e.target.value)}
                  value={firstName}
                />
              </Grid>
              <Grid item xs={4} spacing={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label={Translations.patientRegistration.lastName}
                  name="lastName"
                  onChange={e => setLastName(e.target.value)}
                  value={lastName}
                />
              </Grid>
              <Grid item xs={2}  spacing={4} >
                <FormControl  variant="outlined" fullWidth>
                  <InputLabel
                    style={{ disableAnimation: false }}
                    disableAnimation={false}
                    htmlFor="gender">
                      {Translations.patientRegistration.gender}
                  </InputLabel>
                  <Select
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
            </Grid>
            <Grid xs={12} container spacing={4}>
              <Grid item xs={4} >
                <TextField
                  type="date"
                  variant='outlined'
                  onChange={e => setDOB(e.target.value)}
                  value={dob}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4} >
                <TextField
                  fullWidth
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
                  variant="outlined"
                  type="text"
                  label={Translations.patientRegistration.contact}
                  name="contact"
                  onChange={e => setContact(e.target.value)}
                  value={contact}
                />
              </Grid>
            </Grid>
            <Grid xs={12} container spacing={4}>
              <Grid item xs={3} >
                <FormControl  variant="outlined" fullWidth>
                  <InputLabel
                  style={{ disableAnimation: false }}
                  disableAnimation={false}
                  htmlFor="speciality">
                    {Translations.visitCreation.speciality}
                  </InputLabel>
                  <Select
                    label={Translations.visitCreation.speciality}
                    required
                    name="speciality"
                    onChange={e => setSpeciality(e.target.value)}
                    value={speciality}
                    >
                    {SpecialityList.map((spcl) => (
                    <MenuItem key={spcl.id} value={spcl.value}>
                      {spcl.name}
                    </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}   >
                <FormControl  variant="outlined" fullWidth>
                  <InputLabel
                    style={{ disableAnimation: false }}
                    disableAnimation={false}
                    htmlFor="DocName">
                    {Translations.visitCreation.DocName}
                  </InputLabel>
                  <Select
                    label={Translations.visitCreation.DocName}
                    required
                    name="DocName"
                    onChange={e => setDocName(e.target.value)}
                    value={docName}
                    >
                    {DoctorList.map((dtrName) => (
                      <MenuItem key={dtrName.id} value={dtrName.value}>
                        {dtrName.name}
                      </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}  >
                <FormControl  variant="outlined" fullWidth>
                  <InputLabel
                    style={{ disableAnimation: false }}
                    disableAnimation={false}
                    htmlFor="visitType">
                    {Translations.visitCreation.visitType}
                  </InputLabel>
                  <Select
                    label={Translations.visitCreation.visitType}
                    required
                    name="visitType"
                    onChange={e => setVisitType(e.target.value)}
                    value={visitType}
                    >
                    {VisitTypeList.map((vstype) => (
                    <MenuItem key={vstype.id} value={vstype.value}>
                      {vstype.name}
                    </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}   >
                <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    label={Translations.visitCreation.visitReason}
                    name="Reason For Visit"
                    onChange={e => setVisitReason(e.target.value)}
                    value={visitreason}/>
              </Grid>
            </Grid>
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