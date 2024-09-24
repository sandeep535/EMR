import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Translations from '../../resources/translations';

export default function ClientSearchComponent(props) {
    const [clientsearchlist, setClientsearchlist] = React.useState([]);
    React.useEffect(() => {

    }, []);
    async function getDataBasedOnMobileNumber(mobileNumber) {
        var payLoad = {
            method: APIS.CLIENT_DATA_BASED_ON_PHONENUMBER.METHOD,
            url: APIS.CLIENT_DATA_BASED_ON_PHONENUMBER.URL,
            paramas: [mobileNumber]
        }
        let result = await sendRequest(payLoad);
        if (result && result.size != 0) {
            setClientsearchlist(result);
        }
    }
    return (
        <FormControl variant="outlined" fullWidth>
            <Autocomplete
                size="small"
                onChange={(event, newValue) => {
                    if (newValue) {
                        props.selectedPatientDetails(newValue);
                    }
                }}
                key={option => option.seqid}
                getOptionLabel={option => option.contact}
                renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                        <Box
                            key={key}
                            component="li"
                            {...optionProps}>
                            <Grid container alignItems="center">
                                <Grid item sx={{ ml: 1, width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                    <Box
                                        component="span"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        {option.firstname}
                                        <Typography variant="body2" color="text.secondary">
                                            {option.contact}
                                        </Typography>
                                    </Box>

                                </Grid>
                            </Grid>
                            <Divider variant="middle" component="li" />
                        </Box>
                    );
                }}
                onInputChange={(event, newInputValue) => {
                    if (newInputValue.length > 3) {
                        getDataBasedOnMobileNumber(newInputValue)
                    }
                    if (props.onInputChangeEvent) {
                        props.onInputChangeEvent(newInputValue);
                    }
                }}
                id="cleint-controllable-states-demo11"
                options={clientsearchlist}
                autoHighlight
                renderInput={(params) => <TextField {...params} label={Translations.visitCreation.searchCleint} />}
            />

        </FormControl>
    );
}