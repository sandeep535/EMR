import React, { useState, useEffect, forwardRef, useImperativeHandle, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../global/DataManager';
import Translations from '../../resources/translations';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ClearIcon from '@mui/icons-material/Clear';
import AppContext from '../../components/Context/AppContext';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const allergiesColumns = [{
    name: 'Allergy',
    width: '30%'
}, {
    name: 'Severity',
    width: '10%'
}, {
    name: 'Status',
    width: '10%'
}, {
    name: 'Indications',
    width: '40%'
}, {
    name: 'Actions',
    width: '10%'
}]
const Allergies = forwardRef((props, ref) => {
    const [allergy, setAllergy] = useState("");
    const [status, setStatus] = useState([]);
    const [indications, setIndications] = useState("");
    const [severity, setSeverity] = useState();
    const [severityList, setSeverityList] = useState([]);

    const [allergiesList, setAllergiesList] = useState([]);
    const appContextValue = useContext(AppContext);
    useEffect(() => {
        getLookUpDetails();
    }, []);
    useImperativeHandle(
        ref,
        () => {
            // the return object will pass to parent ref.current, so you can add anything what you want.
            return {
                getFormData: () => {
                    return {
                        allergiesList
                    }
                },
                setFormData1: (data) => {
                    setAllergiesList(data)
                }
            }
        },
        [allergiesList],
    );

    const handleChange = (event) => {
        setStatus(event.target.value);
    };
    async function getLookUpDetails() {
        var payLoad = {
            method: APIS.LOOKUP.METHOD,
            url: APIS.LOOKUP.URL,
            paramas: ["ALLERGY_SEVERITY"]
        }
        let result = await sendRequest(payLoad);
        console.log(result);
        if (result && result.ALLERGY_SEVERITY) {
            setSeverityList(result.ALLERGY_SEVERITY);
        }
    }
    function addAllergiestoGrid() {
        var obj = {
            allergy: allergy,
            status: status,
            indications: indications,
            severity: severity,
            visitid: appContextValue.selectedVisitDeatils.visitid,
            clientid: appContextValue.selectedVisitDeatils.clientid.seqid,
        }
        var copyObj = [...allergiesList];
        copyObj.push(obj);
        setAllergiesList(copyObj);
    }
    async function handleSubmit(event) {
        event.preventDefault();
        // var sendingobj = {
        //     servicename: servicename,
        //     price: price,
        //     active: active
        // }
        // var payLoad = {
        //     method: APIS.SAVE_MASTER_DATA.METHOD,
        //     url: APIS.SAVE_MASTER_DATA.URL,
        //     paramas: [],
        //     data: sendingobj
        // }
        // let result = await sendRequest(payLoad);
        // if (result) {
        //     EMRAlert.alertifySuccess("Service Saved Succussfully");
        // } else {
        //     EMRAlert.alertifyError("Not created");
        // }
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box display="grid" gap="10px">
                    <Card variant="outlined">
                        <CardContent>
                            <Typography sx={{ fontSize: 16 }} className='card-header' >
                                Allergies
                            </Typography>
                            <Box sx={{ m: 1 }}>
                                <Grid container spacing={1}>
                                    <Grid item xs={2} spacing={1}>
                                        <TextField
                                            fullWidth
                                            type="text"
                                            size="small"
                                            variant="outlined"
                                            required
                                            label={Translations.ALLERGY.ALLERGYNAME}
                                            name="allergy"
                                            onChange={e => setAllergy(e.target.value)}
                                            value={allergy}
                                        />
                                    </Grid>
                                    <Grid item xs={2} >
                                        <FormControl variant="outlined" size="small" fullWidth>
                                            <InputLabel
                                                style={{ disableAnimation: false }}
                                                disableAnimation={false}
                                                htmlFor="severity"
                                                size="small"

                                            >
                                                {Translations.ALLERGY.SERVERITY}
                                            </InputLabel>
                                            <Select
                                                label={Translations.ALLERGY.SERVERITY}
                                                name="severity"
                                                size="small"
                                                renderValue={(o) => o.lookupvalue}
                                                onChange={e => setSeverity(e.target.value)}
                                                value={severity}
                                            >
                                                {severityList.map((severity) => (
                                                    <MenuItem key={severity.lookupid} value={severity}>
                                                        {severity.lookupvalue}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                    </Grid>
                                    <Grid item xs={3} spacing={1}>
                                        <TextField
                                            fullWidth
                                            type="text"
                                            size="small"
                                            variant="outlined"
                                            required
                                            label={Translations.ALLERGY.INDICATIONS}
                                            name="indications"
                                            onChange={e => setIndications(e.target.value)}
                                            value={indications}
                                            multiline
                                            rows={1}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormControl>
                                            <FormLabel id="demo-row-radio-buttons-group-label">{Translations.ALLERGY.STATUS}</FormLabel>
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
                                    <Grid item xs={2} spacing={1} >
                                        <Button variant="contained" onClick={() => {
                                            addAllergiestoGrid();
                                        }}>Add</Button>
                                    </Grid>
                                </Grid>
                                <Grid xs={12} container spacing={1}>
                                <TableContainer  style={{maxHeight:120 }}  component={Paper} >
                                        <Table stickyHeader aria-label="simple table">
                                            <TableHead style={{ backgroundColor: '#1976d2',color:'#ffffff',padding: '8px', fontSize: '14px' }}>
                                                <TableRow>
                                                    {allergiesColumns.map((header, index) => (
                                                        <TableCell key={index} style={{ minWidth: header.width }}>{header.name}</TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody  className='grid-height'>
                                                {allergiesList && allergiesList.map((callergy, index) => (
                                                    <TableRow key={callergy.id} >
                                                        <TableCell style={{ padding: '6px', fontSize: '12px' }}>{(callergy && callergy.allergy) ? callergy.allergy : ""}</TableCell>
                                                        <TableCell style={{ padding: '6px', fontSize: '12px' }}>{(callergy && callergy.severity) ? callergy.severity.lookupvalue : ""}</TableCell>
                                                        <TableCell style={{ padding: '6px', fontSize: '12px' }}>{(callergy && callergy.status === 1) ? "Active" : "In-Active"}</TableCell>
                                                        <TableCell style={{ padding: '6px', fontSize: '12px' }}>{(callergy && callergy.indications) ? callergy.indications : ""}</TableCell>
                                                        <TableCell style={{ padding: '6px', fontSize: '12px' }}><ClearIcon fontSize='small'  style={{ cursor: 'pointer' }} onClick={() => {
                                                            //removePrescriptionFromList(index);
                                                        }} /></TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                   
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

            </form>
        </>
    )
});
export default Allergies;

