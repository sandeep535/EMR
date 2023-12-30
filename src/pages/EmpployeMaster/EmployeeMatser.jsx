import React, { useState, useRef, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../global/DataManager';
import RegistrationInformation from '../../components/RegistrationInformation/RegistrationInformation';
import Translations from '../../resources/translations';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import Header from "../../components/Header";
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';

export default function EmployeeMaster(props) {
    const [username, setUsername] = useState([]);
    const [password, setPassword] = useState([]);
    const [role,setRole] = useState('');
    const [designation,setDesignation] = useState([]);

    const [rolesList,setRolesList] = useState([]);
    const [designationList,setDesignationList] = useState([]);
    
    const registrationInformationRef = useRef();

    useEffect(() => {
        getRoleMasterData();
    }, []);

   async function getRoleMasterData(){
    var payLoad = {
        method: APIS.GET_MASTER_DATA_BASED_ON_CODE.METHOD,
        url: APIS.GET_MASTER_DATA_BASED_ON_CODE.URL,
        paramas: ["ROLE"]
    }
    let result = await sendRequest(payLoad);
    if (result ) {
      setRolesList(result);
    }
    }
    const handleSubmit = (event) => {
        const regFormData = registrationInformationRef.current.getFormData();
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        var obj = {
            username: data.get('username'),
            password: data.get('password'),
        }

    };

    return (
        <>
            <Box m="20px">
                <Header title={Translations.employeeRegistration.pagetitle} />
                <form onSubmit={handleSubmit}>
                    <Box display="grid"
                        gap="20px">
                        <RegistrationInformation ref={registrationInformationRef} />
                        <Grid container spacing={2}>
                            <Grid item xs={4} spacing={1}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    size="small"
                                    variant="outlined"
                                    required
                                    label={Translations.employeeRegistration.username}
                                    name="username"
                                    onChange={e => setUsername(e.target.value)}
                                    value={username}
                                />
                            </Grid>
                            <Grid item xs={4} spacing={1}>
                                <TextField
                                    fullWidth
                                    type="password"
                                    size="small"
                                    variant="outlined"
                                    required
                                    label={Translations.employeeRegistration.password}
                                    name="password"
                                    onChange={e => setPassword(e.target.value)}
                                    value={password}
                                />
                            </Grid>
                            <Grid item xs={4} spacing={1}>
                                <FormControl variant="outlined" fullWidth>
                                    <Autocomplete
                                        size="small"
                                        disablePortal
                                        id="combo-box-demo"
                                        options={rolesList}
                                        key={option => option.id}
                                        getOptionLabel={option => option.masterdatavalue}
                                        value={role}
                                        onChange={(event, newValue) => {
                                            setRole(newValue);
                                        }}
                                        renderOption={(props, option) => {
                                            return (
                                                <li {...props} key={option.id}>
                                                    {option.masterdatavalue}
                                                </li>
                                            );
                                        }}
                                        renderInput={(params) => <TextField {...params} label={Translations.employeeRegistration.role} />}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={4} spacing={1}>
                                <FormControl variant="outlined" fullWidth>
                                    <Autocomplete
                                        size="small"
                                        disablePortal
                                        id="combo-box-demo"
                                        options={designationList}
                                        key={option => option.lookupid}
                                        getOptionLabel={option => option.lookupvalue}
                                        value={designation}
                                        onChange={(event, newValue) => {
                                            setDesignation(newValue);
                                        }}
                                        renderOption={(props, option) => {
                                            return (
                                                <li {...props} key={option.lookupid}>
                                                    {option.lookupvalue}
                                                </li>
                                            );
                                        }}
                                        renderInput={(params) => <TextField {...params} label={Translations.employeeRegistration.designation} />}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                    <FormButtonComponent button1={"Register"} button2={"Clear"} />
                </form>

            </Box>
        </>
    );
}