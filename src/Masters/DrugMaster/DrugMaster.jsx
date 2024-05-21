import React, { useEffect, useState, useContext, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import Header from "../../components/Header";
import EMRAlert from '../../Utils/CustomAlert';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';

export default function DrugMaster(props) {
    const [drugname, setDrugname] = useState("");
    const [drugcode, setDrugcode] = useState("");
    const [drugType, setDrugType] = useState("");
    const [drugAlert, setDrugAlert] = useState("");
    const [drugForm, setDrugForm] = useState("");
    const [drugDose, setDrugDosage] = useState("");
    const [drugDoseUnit, setDrugDosageunit] = useState("");
    const [status, setStatus] = useState("1");


    const [drugTypeListOptions, setDrugTypeListOptions] = useState([]);
    const [drugAlerListOptions, setDrugAlerListOptions] = useState([]);
    const [drugFormListOptions, setDrugFormListOptions] = useState([]);
    const [drugDoseUnitListOptions, setDrugDoseUnitListOptions] = useState([]);


    const [duplicatecheck, setDuplicatecheck] = useState(false);

    useEffect(() => {
        getDrugtypeMastersData();
        getDrugFormMastersData();
        getDrugAlertsMastersData();
    }, []);
    
    function handleSubmit(event) {
        event.preventDefault();
        if (duplicatecheck) {
            EMRAlert.alertifySuccess("Please check drug name or drug code");
            return false;
        }
        saveData();
    }
    const handleChange = (event) => {
        setStatus(event.target.value);
    };
    async function saveData() {
        let data = {
            drugid: "",
            drugname: drugname,
            status: 1,
            drugcode: drugcode,
            drugtype:drugType,
            drugform:drugForm,
            drugalert:drugAlert,
            drugdose:drugDose,
            drugunit:null
        }
        var payLoad = {
            method: APIS.SAVE_DRUG_MASTER.METHOD,
            url: APIS.SAVE_DRUG_MASTER.URL,
            paramas: [],
            data: data
        }
        let result = await sendRequest(payLoad);
        if (result) {
            EMRAlert.alertifySuccess("Drug Saved Succussfully");
        } else {
            EMRAlert.alertifyError("Not Saved");
        }
    }
    async function checkduplicateDrugName() {
        if (!drugname) {
            return false;
        }
        var payLoad = {
            method: APIS.CHECK_DUPLICATE_DRUG_NAME.METHOD,
            url: APIS.CHECK_DUPLICATE_DRUG_NAME.URL,
            paramas: [drugname.trim()],
        }
        let result = await sendRequest(payLoad);
        if (result && result.drugid) {
            EMRAlert.alertifySuccess("This drug name already avaliable");
            setDuplicatecheck(true);
        }
    }
    async function checkduplicateDrugCode() {
        if (!drugcode) {
            return false;
        }
        var payLoad = {
            method: APIS.CHECK_DUPLICATE_DRUG_CODE.METHOD,
            url: APIS.CHECK_DUPLICATE_DRUG_CODE.URL,
            paramas: [drugcode.trim()],
        }
        let result = await sendRequest(payLoad);
        if (result && result.drugid) {
            EMRAlert.alertifySuccess("This drug code already avaliable");
            setDuplicatecheck(true);
        }
    }

    async function getDrugtypeMastersData() {
        var payLoad = {
            method: APIS.GET_MASTER_DATA_BASED_ON_CODE.METHOD,
            url: APIS.GET_MASTER_DATA_BASED_ON_CODE.URL,
            paramas: ["DRUG_TYPE"]
        }
        let result = await sendRequest(payLoad);
        if (result) {
            setDrugTypeListOptions(result);
           debugger
        }
    }

    async function getDrugAlertsMastersData() {
        var payLoad = {
            method: APIS.GET_MASTER_DATA_BASED_ON_CODE.METHOD,
            url: APIS.GET_MASTER_DATA_BASED_ON_CODE.URL,
            paramas: ["DRUG_ALERTS"]
        }
        let result = await sendRequest(payLoad);
        if (result) {
            setDrugAlerListOptions(result);
           debugger
        }
    }

    async function getDrugFormMastersData() {
        var payLoad = {
            method: APIS.GET_MASTER_DATA_BASED_ON_CODE.METHOD,
            url: APIS.GET_MASTER_DATA_BASED_ON_CODE.URL,
            paramas: ["DRUG_FORM"]
        }
        let result = await sendRequest(payLoad);
        if (result) {
            setDrugFormListOptions(result);
           debugger
        }
    }
   

    return (
        <>
            <Box m="20px">
                <Header title={Translations.DRUG_MASTER.NAME} />
                <form onSubmit={handleSubmit}>
                    <Box display="grid" gap="20px">
                        <Grid container spacing={2}>
                            <Grid item xs={3} spacing={1} >
                                <FormControl variant="outlined" size="small" fullWidth>
                                    <Autocomplete
                                        size="small"
                                        disablePortal
                                        id="drugmatserId"
                                        options={drugTypeListOptions}
                                        //ref={autoComplteVisittypeRef}
                                        key={option => option.id}
                                        getOptionLabel={option => option.masterdatavalue || ""}
                                        value={drugType}
                                        onChange={(event, newValue) => {
                                            setDrugType(newValue);
                                        }}
                                        renderOption={(props, option) => {
                                            return (
                                                <li {...props} key={option.id}>
                                                    {option.masterdatavalue}
                                                </li>
                                            );
                                        }}
                                        renderInput={(params) => <TextField {...params} label={Translations.DRUG_MASTER.DRUG_TYPE} />}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={4} spacing={1}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    size="small"
                                    variant="outlined"
                                    required
                                    label={Translations.DRUG_MASTER.DRUG_NAME}
                                    name="username"
                                    onChange={e => setDrugname(e.target.value)}
                                    value={drugname}
                                    onBlur={() => {
                                        checkduplicateDrugName();
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4} spacing={1}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    size="small"
                                    variant="outlined"
                                    required
                                    label={Translations.DRUG_MASTER.DRUG_CODE}
                                    name="username"
                                    onChange={e => setDrugcode(e.target.value)}
                                    value={drugcode}
                                    onBlur={() => {
                                        checkduplicateDrugCode();
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3} spacing={1} >
                                <FormControl variant="outlined" size="small" fullWidth>
                                    <Autocomplete
                                        size="small"
                                        disablePortal
                                        id="drugmatserAlertId"
                                        options={drugAlerListOptions}
                                        //ref={autoComplteVisittypeRef}
                                        key={option => option.id}
                                        getOptionLabel={option => option.masterdatavalue || ""}
                                        value={drugAlert}
                                        onChange={(event, newValue) => {
                                            setDrugAlert(newValue);
                                        }}
                                        renderOption={(props, option) => {
                                            return (
                                                <li {...props} key={option.id}>
                                                    {option.masterdatavalue}
                                                </li>
                                            );
                                        }}
                                        renderInput={(params) => <TextField {...params} label={Translations.DRUG_MASTER.DRUG_ALERT} />}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={3} spacing={1} >
                                <FormControl variant="outlined" size="small" fullWidth>
                                    <Autocomplete
                                        size="small"
                                        disablePortal
                                        id="drugmatserAlertId"
                                        options={drugFormListOptions}
                                        //ref={autoComplteVisittypeRef}
                                        key={option => option.id}
                                        getOptionLabel={option => option.masterdatavalue || ""}
                                        value={drugForm}
                                        onChange={(event, newValue) => {
                                            setDrugForm(newValue);
                                        }}
                                        renderOption={(props, option) => {
                                            return (
                                                <li {...props} key={option.id}>
                                                    {option.masterdatavalue}
                                                </li>
                                            );
                                        }}
                                        renderInput={(params) => <TextField {...params} label={Translations.DRUG_MASTER.DRUG_FORM} />}
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
                                    label={Translations.DRUG_MASTER.DRUG_DOSAGE}
                                    name="username"
                                    onChange={e => setDrugDosage(e.target.value)}
                                    value={drugDose}

                                />

                            </Grid>
                            <Grid item xs={2} spacing={1}>
                                <FormControl variant="outlined" size="small" fullWidth>
                                    <Autocomplete
                                        size="small"
                                        disablePortal
                                        id="drugmatserAlertId"
                                        options={drugDoseUnitListOptions}
                                        //ref={autoComplteVisittypeRef}
                                        key={option => option.lookupid}
                                        getOptionLabel={option => option.lookupvalue || ""}
                                        value={drugDoseUnit}
                                        onChange={(event, newValue) => {
                                            setDrugDosageunit(newValue);
                                        }}
                                        renderOption={(props, option) => {
                                            return (
                                                <li {...props} key={option.lookupid}>
                                                    {option.lookupvalue}
                                                </li>
                                            );
                                        }}
                                        renderInput={(params) => <TextField {...params} label={Translations.DRUG_MASTER.DRUG_UNIT} />}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={2} spacing={1}>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">{Translations.DRUG_MASTER.STATUS}</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            value={status}
                                        >
                                            <FormControlLabel value="1" control={<Radio onChange={handleChange} />} label={Translations.DRUG_MASTER.ACTIVE} />
                                            <FormControlLabel value="2" control={<Radio onChange={handleChange} />} label={Translations.DRUG_MASTER.IN_ACTIVE} />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                        </Grid>
                        <FormButtonComponent button1={"Save"} button2={"Clear"} />
                    </Box>
                </form>
            </Box>
        </>
    )
}