import * as React from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { FormControl, InputLabel, Select, MenuItem, Grid, Button } from "@material-ui/core";
import TextField from '@mui/material/TextField';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';

export default function ClientSearchComponent() {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = open && options.length === 0;

    React.useEffect(() => {
       // getDataBasedOnPhoneNumber();
      }, []);
    async function getDataBasedOnPhoneNumber(phoneNumber){
        var payLoad = {
            method: APIS.CLIENT_DATA_BASED_ON_PHONENUMBER.METHOD,
            url: APIS.CLIENT_DATA_BASED_ON_PHONENUMBER.URL,
            paramas: [phoneNumber]
          }
          let result = await sendRequest(payLoad);
          
    }
    return (
        <FormControl variant="outlined" fullWidth>
            <Autocomplete
                id="combo-box-demo"
                options={top100Films}
                renderInput={(params) => <TextField {...params} label={'Mobile Number'} />}
            />
        </FormControl>
      );
}
const top100Films = [
    { label: 'General Medicine', id: 1 },
    { label: 'Physio', id: 2 },
    { label: 'Physchology', id: 3 },
    { label: 'Dental', id: 4 }
]