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
import Autocomplete from '@mui/material/Autocomplete';
import EMRAlert from '../../Utils/CustomAlert';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import { act } from 'react-dom/test-utils';

const allergiesListHeaders = [{
    name: Translations.ALLERGY.ALLERGYNAME,
    datakey: 'allergy',
    width: '30%'
}, {
    name: Translations.ALLERGY.SERVERITY,
    width: '20%',
    datakey: 'severity.lookupvalue'
}, {
    name: Translations.ALLERGY.INDICATIONS,
    width: '40%',
    datakey: 'indications'
}, {
    name: Translations.ALLERGY.STATUS,
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

export default function AllergiesList(props) {
    const appContextValue = useContext(AppContext);
    const [tableData, setTableData] = useState([]);
    useEffect(() => {
        getAllerigies();
    }, []);
    async function getAllerigies() {
        var obj = {
            pagenumber: 0,
            pagesize: 1,
            visitid: null,
            clientid: appContextValue.selectedVisitDeatils.clientid.seqid,
            allergy: '',
            status: -999,
            severity: null

        }
        var payLoad = {
            method: APIS.GET_ALLERIGIES_DATA.METHOD,
            url: APIS.GET_ALLERIGIES_DATA.URL,
            paramas: [],
            data: obj
            //paramas: [0, (appContextValue.selectedVisitDeatils) ? appContextValue.selectedVisitDeatils.clientid.seqid : 0],
        }
        let result = await sendRequest(payLoad);
        if (result && result.allergieslist && result.length !== 0) {
            setTableData(result.allergieslist);
            //allergiesref.current.setFormData1(result);
        }
    }
    function triggerEventActions(row, action) {
        debugger
        props.selectedRecord(row,action)
    }
    return (
        <>
            <Box display="grid" gap="10px">
                <Card variant="outlined">
                    <CardContent>
                        <Typography sx={{ fontSize: 16 }} className='card-header' >
                            Allergies List
                        </Typography>
                        <Box sx={{ m: 1 }}>
                            <CustomDataGrid tableHeaders={allergiesListHeaders} tableData={tableData} triggerEvent={(row, action) => {
                                triggerEventActions(row, action)
                            }}></CustomDataGrid>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </>
    )
}