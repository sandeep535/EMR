import React, { useState, useEffect, forwardRef, useImperativeHandle, useContext,useDeferredValue  } from 'react';
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
import Autocomplete from '@mui/material/Autocomplete';
import EMRAlert from '../../Utils/CustomAlert';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import AllergiesList from './AllergiesList';

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

const allergiesListHeaders = [{
    name: "Allergy",
    datakey: 'allergytype.lookupvalue',
    width: '20%'
},]
const Allergies = forwardRef((props, ref) => {
    const [allergyInputValue, setAllergyInputValue] = useState("");
    const [allergy, setAllergy] = useState([]);
    const [status, setStatus] = useState("1");
    const [indications, setIndications] = useState("");
    const [severity, setSeverity] = useState({});
    const [severityList, setSeverityList] = useState([]);

    const [allergiesList, setAllergiesList] = useState([]);
    const appContextValue = useContext(AppContext);
    const [allergyTypeOptions, setAllergyTypeOptions] = useState([]);
    const [mode,setMode] = useState("");
    const [selectedRow,setSelectedRow] = useState("");
    useEffect(() => {
        getLookUpDetails();
        getAllergiesMasterList();
        setMode("new")
    }, []);

    async function getAllergiesMasterList(name) {
        let data = {
            allergyid: "",
            allergyname: name,
            status: 1,
            allergycode: null,
            allergytype: null
        }
        var mainDTO = {
            pagenumber: 0,
            pagesize: 1000,
            allergieslist: [data]
        }
        var payLoad = {
            method: APIS.GET_ALLERIES_MASTER_LIST.METHOD,
            url: APIS.GET_ALLERIES_MASTER_LIST.URL,
            paramas: [],
            data: mainDTO
        }
        let result = await sendRequest(payLoad);
        if (result && result.allergieslist.length != 0) {
            setAllergyTypeOptions(result.allergieslist);
            // setTableData(result.allergieslist);
            //setTotalcount(result.totalcount);
        } else {
            // setTableData([]);
        }
        debugger
    }

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
    async function addAllergiestoGrid() {
        var obj = {
            allergy: allergy.allergyname,
            status: status,
            indications: indications,
            severity: severity,
            visitid: appContextValue.selectedVisitDeatils.visitid,
            clientid: appContextValue.selectedVisitDeatils.clientid.seqid,
            allergymaster: {
                allergyid: allergy.allergyid,
                allergyname: allergy.allergyname
            }
        }
        if(mode == "edit"){
            obj["allergyid"] = selectedRow.allergyid;
            obj["visitid"] = selectedRow.visitid;
        }
     
       
        if (props.isSaveDirect) {
            var payLoad = {
                method: APIS.SAVE_ALLERIES.METHOD,
                url: APIS.SAVE_ALLERIES.URL,
                paramas: [],
                data: [obj]
            }
            let result = await sendRequest(payLoad);
            if (result) {
                EMRAlert.alertifySuccess("Allergy Saved Succussfully");
            } else {
                EMRAlert.alertifyError("Not Saved");
            }
        } else {
            var copyObj = [...allergiesList];
            copyObj.push(obj);
            setAllergiesList(copyObj);
        }

    }
    function setDatatoForm(row){
        debugger
        setAllergy(row.allergymaster);
        setStatus(row.status);
        setIndications(row.indications);
        setSeverity(row.severity);
        setMode("edit");
        setSelectedRow(row);
    }
    
    async function handleSubmit(event) {
        event.preventDefault();
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box display="grid" gap="10px">
                    <Card variant="outlined">
                        <CardContent>
                            <Typography sx={{ fontSize: 16 }} className='card-header' >
                                Add Allergies
                            </Typography>
                            <Box sx={{ m: 1 }}>
                                <Grid container spacing={1}>
                                    <Grid item xs={2} spacing={1}>
                                        <FormControl variant="outlined" fullWidth>
                                            <Autocomplete
                                                size="small"
                                                disablePortal
                                                id="Allergy-combo-box-demo"
                                                options={allergyTypeOptions}
                                                key={option => option.allergyid}
                                                getOptionLabel={option => option.allergyname || ""}
                                                value={allergy}
                                                inputValue={allergyInputValue}
                                                onInputChange={(event, newInputValue) => {
                                                    if (newInputValue.length > 1) {
                                                        getAllergiesMasterList(newInputValue)
                                                    }
                                                    setAllergyInputValue(newInputValue);
                                                }}
                                                onChange={(event, newValue) => {
                                                    console.log("------------", newValue);
                                                    setAllergy(newValue);
                                                }}
                                                renderOption={(props, option) => {
                                                    return (
                                                        <li {...props} key={option.allergyid}>
                                                            {option.allergyname}
                                                        </li>
                                                    );
                                                }}
                                                renderInput={(params) => <TextField {...params} label={Translations.ALLERGY.ALLERGYNAME} />}
                                            />
                                        </FormControl>
                                        {/* <TextField
                                            fullWidth
                                            type="text"
                                            size="small"
                                            variant="outlined"
                                            required
                                            label={Translations.ALLERGY.ALLERGYNAME}
                                            name="allergy"
                                            onChange={e => setAllergy(e.target.value)}
                                            value={allergy}
                                        /> */}
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
                                                renderValue={(o) => o.lookupvalue || ''}
                                                onChange={e => {console.log(e.target.value); setSeverity(e.target.value)}}
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
                                                value={status}
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
                                {props && !props.isSaveDirect &&
                                    <Grid xs={12} container spacing={1}>
                                        <TableContainer component={Paper} >
                                            <Table stickyHeader aria-label="simple table">
                                                <TableHead style={{ backgroundColor: '#1976d2', color: '#ffffff', padding: '8px', fontSize: '14px' }}>
                                                    <TableRow>
                                                        {allergiesColumns.map((header, index) => (
                                                            <TableCell key={index} style={{ minWidth: header.width }}>{header.name}</TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody className='grid-height'>
                                                    {allergiesList && allergiesList.map((callergy, index) => (
                                                        <TableRow key={callergy.id} >
                                                            <TableCell style={{ padding: '6px', fontSize: '12px' }}>{(callergy && callergy.allergy) ? callergy.allergy : ""}</TableCell>
                                                            <TableCell style={{ padding: '6px', fontSize: '12px' }}>{(callergy && callergy.severity) ? callergy.severity.lookupvalue : ""}</TableCell>
                                                            <TableCell style={{ padding: '6px', fontSize: '12px' }}>{(callergy && callergy.status === 1) ? "Active" : "In-Active"}</TableCell>
                                                            <TableCell style={{ padding: '6px', fontSize: '12px' }}>{(callergy && callergy.indications) ? callergy.indications : ""}</TableCell>
                                                            <TableCell style={{ padding: '6px', fontSize: '12px' }}><ClearIcon fontSize='small' style={{ cursor: 'pointer' }} onClick={() => {
                                                                //removePrescriptionFromList(index);
                                                            }} /></TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                    </Grid>
                                }
                                {/* {props && props.isSaveDirect && <CustomDataGrid tableHeaders={allergiesListHeaders} tableData={tableData} totalcount={totalcount} rowsPerPage={20} paginationChangeEvent={(number) => {
                                    debugger
                                }} triggerEvent={(row, action) => {
                                    openEditmode(row, action);
                                }}></CustomDataGrid>
                                } */}
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

            </form>
            <AllergiesList selectedRecord = {(row,action)=>{
                debugger
                setDatatoForm(row)
            }}/>
        </>
    )
});
export default Allergies;

