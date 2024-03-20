import React, { useState, useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import RegistrationInformation from '../../components/RegistrationInformation/RegistrationInformation';
import Translations from '../../resources/translations';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import Header from "../../components/Header";
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import EMRAlert from '../../Utils/CustomAlert';

export default function DrugMaster(props) {
    const [drugname, setDrugname] = useState("");
    const [drugcode, setDrugcode] = useState("");
    const [duplicatecheck,setDuplicatecheck] = useState(false);
    function handleSubmit(event) {
        event.preventDefault();
        if(duplicatecheck){
            EMRAlert.alertifySuccess("Please check drug name or drug code");
            return false;
        }
        saveData();
    }
    async function saveData() {
        let data = {
            drugid: "",
            drugname: drugname,
            status: 1,
            drugcode: drugcode
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
    async function checkduplicateDrugName(){
        if(!drugname){
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
    async function checkduplicateDrugCode(){
        if(!drugcode){
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
    return (
        <>
            <Box m="20px">
                <Header title={Translations.DRUG_MASTER.NAME} />
                <form onSubmit={handleSubmit}>
                    <Box display="grid" gap="20px">
                        <Grid container spacing={2}>
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
                                    onBlur={()=>{
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
                                    onBlur={()=>{
                                        checkduplicateDrugCode();
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <FormButtonComponent button1={"Save"} button2={"Clear"} />
                    </Box>
                </form>
            </Box>
        </>
    )
}