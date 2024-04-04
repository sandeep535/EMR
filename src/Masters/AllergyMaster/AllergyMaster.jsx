import React, { useState, useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import Header from "../../components/Header";
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import EMRAlert from '../../Utils/CustomAlert';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import SearchClearButtonComponent from '../../common/SearchClearButton/SearchClearButtonComponent';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function AllergyMaster(props) {
    const [allergiesTypeCombo, setAllergiesTypeCombo] = useState([]);
    const [allergyType, setAllergyType] = useState(null);
    const [allergycode, setAllergycode] = useState("");
    const [allergyname, setAllergyname] = useState("");
    const [status, setStatus] = useState("1");
    const [mode, setMode] = useState();
    const [editModeData, setEditModeData] = useState(null);

    const [searchObj, setSearchObj] = useState({ status: "1" });
    const [showAddForm, setShowAddForm] = useState(false);

    const [tableData, setTableData] = useState([]);
    const allergiesListHeaders = [{
        name: Translations.ALLERGY_MASTER.ALLERGY_TYPE,
        datakey: 'allergytype.lookupvalue',
        width: '20%'
    }, {
        name: Translations.ALLERGY_MASTER.ALLERGY_CODE,
        width: '20%',
        datakey: 'allergycode'
    }, {
        name: Translations.ALLERGY_MASTER.ALLERGY_NAME,
        width: '40%',
        datakey: 'allergyname'
    }, {
        name: Translations.ALLERGY_MASTER.STATUS,
        width: '10%',
        datakey: 'status',
        mappingData: { 1: "Active", 2: "In-active" }
    }, {
        name: Translations.ALLERGY_MASTER.ACTIONS,
        width: '10%',
        isActions: true,
        actions: [{
            icon: 'edit'
        }]
    }]
    useEffect(() => {
        getLookUpDetails();
        getAllergiesList();
    }, []);

    async function getLookUpDetails() {
        var payLoad = {
            method: APIS.LOOKUP.METHOD,
            url: APIS.LOOKUP.URL,
            paramas: ["ALLERGY_TYPE"]
        }
        let result = await sendRequest(payLoad);
        if (result && result.ALLERGY_TYPE) {
            setAllergiesTypeCombo(result.ALLERGY_TYPE);
        }
    }
    function clearForm() {
        setAllergyType(null);
        setAllergycode("");
        setAllergyname("")
    }

    async function allergyMasterhandleSubmit(event) {
        event.preventDefault();
        let data = {
            allergyid: (mode == "edit") ? editModeData.allergyid : "",
            allergyname: allergyname,
            status: status,
            allergycode: allergycode,
            allergytype: allergyType
        }
        var payLoad = {
            method: APIS.SAVE_ALLERIES_MASTER.METHOD,
            url: APIS.SAVE_ALLERIES_MASTER.URL,
            paramas: [],
            data: data
        }
        let result = await sendRequest(payLoad);
        if (result) {
            EMRAlert.alertifySuccess("Allergy Saved Succussfully");
            clearForm();
            if(mode == 'edit'){
                setMode();
                setEditModeData(null);
                setShowAddForm(false);
            }
            getAllergiesList();
        } else {
            EMRAlert.alertifyError("Not Saved");
        }
    }
    async function openEditmode(row, action) {
        setMode("edit");
        setEditModeData(row);
        setShowAddForm(true);
        setAllergyType(row.allergytype);
        setAllergycode(row.allergycode);
        setAllergyname(row.allergyname);
        setStatus(row.status);
    }
    const handleChange = (event) => {
        setStatus(event.target.value);
    };
    const handleSearchChange = (event) => {
        var copyData = { ...searchObj };
        copyData.status = event.target.value;
        setSearchObj(copyData);
    };

    async function getAllergiesList() {
        let data = {
            allergyid: searchObj.allergyid,
            allergyname: (searchObj.allergyname) ? searchObj.allergyname : "",
            status: (searchObj.status) ? searchObj.status : 1,
            allergycode: (searchObj.allergycode) ? searchObj.allergycode : '',
            allergytype: searchObj.allergyType
        }
        var payLoad = {
            method: APIS.GET_ALLERIES_MASTER_LIST.METHOD,
            url: APIS.GET_ALLERIES_MASTER_LIST.URL,
            paramas: [],
            data: data
        }
        let result = await sendRequest(payLoad);
        if (result) {
            setTableData(result);
        }
        debugger
    }

    return (
        <>
            <Header title={Translations.ALLERGY_MASTER.NAME} />
            {showAddForm &&
                <Box m="20px">

                    <form onSubmit={allergyMasterhandleSubmit}>
                        <Box>
                            <Grid xs={12} container spacing={1}>
                                <Grid item xs={2} spacing={1}>
                                    <FormControl variant="outlined" fullWidth>
                                        <Autocomplete
                                            size="small"
                                            disablePortal
                                            id="Allergy-combo-box-demo"
                                            options={allergiesTypeCombo}
                                            key={option => option.lookupid}
                                            getOptionLabel={option => option.lookupvalue}
                                            value={allergyType}
                                            onChange={(event, newValue) => {
                                                setAllergyType(newValue);
                                            }}
                                            renderOption={(props, option) => {
                                                return (
                                                    <li {...props} key={option.lookupid}>
                                                        {option.lookupvalue}
                                                    </li>
                                                );
                                            }}
                                            renderInput={(params) => <TextField {...params} label={Translations.ALLERGY_MASTER.ALLERGY_TYPE} />}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2} spacing={1}>
                                    <TextField
                                        fullWidth
                                        type="text"
                                        size="small"
                                        variant="outlined"
                                        required
                                        label={Translations.ALLERGY_MASTER.ALLERGY_CODE}
                                        name="allergycode"
                                        onChange={e => setAllergycode(e.target.value)}
                                        value={allergycode}
                                        onBlur={() => {
                                            //checkduplicateDrugCode();
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2} spacing={1}>
                                    <TextField
                                        fullWidth
                                        type="text"
                                        size="small"
                                        variant="outlined"
                                        required
                                        label={Translations.ALLERGY_MASTER.ALLERGY_NAME}
                                        name="allergyname"
                                        onChange={e => setAllergyname(e.target.value)}
                                        value={allergyname}
                                        onBlur={() => {
                                            //checkduplicateDrugCode();
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2} spacing={1}>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">{Translations.ALLERGY_MASTER.STATUS}</FormLabel>
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
                                <Grid item xs={2} spacing={1}>
                                    <FormButtonComponent button1={"Save"} button2={"Close"} clearFormEvent={() => {
                                        setShowAddForm(false);
                                    }} />
                                </Grid>
                            </Grid>
                        </Box>
                    </form>
                </Box>
            }
            <Box m="20px">
                <Box>
                    <Grid xs={12} container spacing={1}>
                        <Grid item xs={2} spacing={1}>
                            <FormControl variant="outlined" fullWidth>
                                <Autocomplete
                                    size="small"
                                    disablePortal
                                    id="Allergy-combo-box-demo"
                                    options={allergiesTypeCombo}
                                    key={option => option.lookupid}
                                    getOptionLabel={option => option.lookupvalue}
                                    value={searchObj.allergyType}
                                    onChange={(event, newValue) => {
                                        var copyData = { ...searchObj };
                                        copyData.allergyType = newValue;
                                        setSearchObj(copyData);
                                    }}
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option.lookupid}>
                                                {option.lookupvalue}
                                            </li>
                                        );
                                    }}
                                    renderInput={(params) => <TextField {...params} label={Translations.ALLERGY_MASTER.ALLERGY_TYPE} />}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={2} spacing={1}>
                            <TextField
                                fullWidth
                                type="text"
                                size="small"
                                variant="outlined"
                                required
                                label={Translations.ALLERGY_MASTER.ALLERGY_CODE}
                                name="allergycode"
                                onChange={e => {
                                    var copyData = { ...searchObj };
                                    copyData.allergycode = e.target.value;
                                    setSearchObj(copyData);
                                }}
                                value={searchObj.allergycode}
                                onBlur={() => {
                                    //checkduplicateDrugCode();
                                }}
                            />
                        </Grid>
                        <Grid item xs={2} spacing={1}>
                            <TextField
                                fullWidth
                                type="text"
                                size="small"
                                variant="outlined"
                                required
                                label={Translations.ALLERGY_MASTER.ALLERGY_NAME}
                                name="allergyname"
                                onChange={e => {
                                    var copyData = { ...searchObj };
                                    copyData.allergyname = e.target.value;
                                    setSearchObj(copyData);
                                }}
                                value={searchObj.allergyname}
                                onBlur={() => {
                                    //checkduplicateDrugCode();
                                }}
                            />
                        </Grid>
                        <Grid item xs={2} spacing={1}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">{Translations.ALLERGY_MASTER.STATUS}</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={searchObj.status}
                                >
                                    <FormControlLabel value="1" control={<Radio onChange={handleSearchChange} />} label="Active" />
                                    <FormControlLabel value="2" control={<Radio onChange={handleSearchChange} />} label="Inactive" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2} spacing={1}>
                            <SearchClearButtonComponent button1="Search" button2="Clear" clickbtton1={() => {
                                getAllergiesList();
                            }} clickbtton2={() => {

                            }}></SearchClearButtonComponent>

                        </Grid>
                        <Grid item xs={2} spacing={1}>
                            <AddCircleOutlineIcon onClick={() => { setShowAddForm(true) }} />
                        </Grid>

                    </Grid>
                </Box>
                <Box >
                    <CustomDataGrid tableHeaders={allergiesListHeaders} tableData={tableData} triggerEvent={(row, action) => {
                        openEditmode(row, action);
                    }}></CustomDataGrid>
                </Box>
            </Box>
        </>
    )
};