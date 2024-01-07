import React, { useState, useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../global/DataManager';
import RegistrationInformation from '../../components/RegistrationInformation/RegistrationInformation';
import Translations from '../../resources/translations';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import Header from "../../components/Header";
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import EMRAlert from '../../Utils/CustomAlert';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import ServiceMasterList from './ServiceMasterList';


export default function ServiceMaster() {
    const [servicename, setServicename] = useState([]);
    const [price, setPrice] = useState([]);
    const [active, setActive] = useState(1);

    useEffect(() => {
      
    }, []);

    const handleChange = (event) => {
        setActive(event.target.value);
    };
    
    async function handleSubmit(event) {
        event.preventDefault();
        var sendingobj = {
            servicename:servicename,
            price:price,
            active:active
        }
        var payLoad = {
            method: APIS.SAVE_MASTER_DATA.METHOD,
            url: APIS.SAVE_MASTER_DATA.URL,
            paramas: [],
            data: sendingobj
          }
          let result = await sendRequest(payLoad);
          if (result) {
            EMRAlert.alertifySuccess("Service Saved Succussfully");
          } else {
            EMRAlert.alertifyError("Not created");
          }
      }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box display="grid" gap="10px">
                    <Grid container spacing={1}>
                        <Grid item xs={4} spacing={1}>
                            <TextField
                                fullWidth
                                type="text"
                                size="small"
                                variant="outlined"
                                required
                                label={Translations.SERVICE_MASTER.SERVICE_NAME}
                                name="servicename"
                                onChange={e => setServicename(e.target.value)}
                                value={servicename}
                            />
                        </Grid>
                        <Grid item xs={4} spacing={1}>
                            <TextField
                                fullWidth
                                type="text"
                                size="small"
                                variant="outlined"
                                required
                                label={Translations.SERVICE_MASTER.PRICE}
                                name="price"
                                onChange={e => setPrice(e.target.value)}
                                value={price}
                            />

                        </Grid>
                        <Grid item xs={4} spacing={1}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">{Translations.SERVICE_MASTER.STATUS}</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                >
                                    <FormControlLabel value="1" control={<Radio onChange={handleChange} />} label="Active" />
                                    <FormControlLabel value="2" control={<Radio onChange={handleChange} />} label="Inactive" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
                <FormButtonComponent button1={"Save"} button2={"Clear"} />
            </form>
            <ServiceMasterList/>
        </>
    )
}

