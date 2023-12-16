import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Translations from '../../resources/translations';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';

const RegistrationInformation = forwardRef((props, ref) => {
    // console.log("sssssssssssssssssssddddddddd",props)
    const [title, setTitle] = useState([]);
    const [firstname, setFirstname] = useState([]);
    const [lastname, setLastname] = useState([]);
    const [gender, setGender] = useState([]);
    const [dob, setDOB] = useState([]);
    const [age, setAge] = useState(0);
    const [email, setEmail] = useState([]);
    const [contact, setContact] = useState([]);
    const [titleList, setTitleList] = useState([]);
    const [genderList, setGenderList] = useState([]);
    useEffect(() => {
        getLookUpDetails();
        return () => console.log("Cleanup..");
    }, []);

    useImperativeHandle(
        ref,
        () => {
            // the return object will pass to parent ref.current, so you can add anything what you want.
            return {
                getFormData: () => {
                    return {
                        title,
                        firstname,
                        lastname,
                        gender,
                        dob,
                        age,
                        email,
                        contact,
                    }
                },
                setFormData1: (data) => {
                    console.log("inside form data", data)
                    setAge(data.age);
                    setTitle(data.title);
                    setFirstname(data.firstname);
                    setLastname(data.lastname);
                    setGender(data.gender);
                    setContact(data.contact);
                    setDOB(data.dob);
                    setEmail(data.email);
                }
            }
        },
        [title, firstname, lastname, gender, dob, age, email, contact],
    );



    async function getLookUpDetails() {
        var payLoad = {
            method: APIS.LOOKUP.METHOD,
            url: APIS.LOOKUP.URL,
            paramas: ["GENDER,SALUTATION"]
        }
        let result = await sendRequest(payLoad);
        console.log(result);
        if (result && result.GENDER) {
            setGenderList(result.GENDER);
        }
        if (result && result.SALUTATION) {
            setTitleList(result.SALUTATION);
        }


    }

    return (
        <Box display="grid" gap="10px">
            <Grid container spacing={1}>
                <Grid item xs={2} spacing={1}>
                    <FormControl size="small" fullWidth>
                        <InputLabel
                            id="demo-select-small-label"
                        >
                            {Translations.patientRegistration.title}
                        </InputLabel>

                        <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={title}
                            label={Translations.patientRegistration.title}
                            name="title"
                            renderValue={(o) => o.lookupvalue}
                            onChange={e => setTitle(e.target.value)}>

                            {titleList.map((titles) => (
                                <MenuItem key={titles.lookupid} value={titles}>
                                    {titles.lookupvalue}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={4} spacing={1}>
                    <TextField
                        fullWidth
                        type="text"
                        size="small"
                        variant="outlined"
                        required
                        label={Translations.patientRegistration.firstName}
                        name="firstname"
                        onChange={e => setFirstname(e.target.value)}
                        value={firstname}
                    />
                </Grid>
                <Grid item xs={4} spacing={1}>
                    <TextField
                        fullWidth
                        type="text"
                        size="small"
                        variant="outlined"
                        required
                        label={Translations.patientRegistration.lastName}
                        name="lastname"
                        onChange={e => setLastname(e.target.value)}
                        value={lastname}
                    />
                </Grid>
                <Grid item xs={2} >
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel
                            style={{ disableAnimation: false }}
                            disableAnimation={false}
                            htmlFor="gender"
                            size="small"

                        >
                            {Translations.patientRegistration.gender}
                        </InputLabel>
                        <Select
                            label={Translations.patientRegistration.gender}
                            name="gender"
                            size="small"
                            required
                            renderValue={(o) => o.lookupvalue}
                            onChange={e => setGender(e.target.value)}
                            value={gender}
                        >
                            {genderList.map((genders) => (
                                <MenuItem key={genders.lookupid} value={genders}>
                                    {genders.lookupvalue}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid item xs={3} >
                    <TextField
                        type="date"
                        size="small"
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
                        size="small"
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
                        size="small"
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
                        size="small"
                        variant="outlined"
                        label={Translations.patientRegistration.contact}
                        name="contact"
                        required
                        onChange={e => setContact(e.target.value)}
                        value={contact}
                    />
                </Grid>
            </Grid>
        </Box>
    );
})

export default RegistrationInformation;