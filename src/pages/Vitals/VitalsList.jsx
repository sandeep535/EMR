import React, { useEffect, useContext, useState } from 'react';
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid';
import AppContext from '../../components/Context/AppContext';
import { sendRequest } from '../global/DataManager';
import APIS from '../../Utils/APIS';
import ClientBanner from '../../components/ClientBanner/ClientBanner';
import CommonCard from '../../common/CommonCard';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import ModelPopUp from '../../common/ModelPopup/ModelPopUp';
import Vitals from './Vitals';


const vitalsListTableData = [{
    name: "Date",
    datakey: 'date',
    width: '20%'
}, {
    name: "Height",
    width: '20%',
    datakey: 'height'
}, {
    name: 'Weight',
    width: '10%',
    datakey: 'weight'
}, {
    name: 'BMI',
    width: '10%',
    datakey: 'bmi',
}, {
    name: 'Systolic',
    width: '10%',
    datakey: 'systolic',
}, {
    name: 'Diastolic',
    width: '10%',
    datakey: 'diastolic',
}, {
    name: 'Pulse',
    width: '10%',
    datakey: 'pulse',
}, {
    name: 'Respiratory Rate',
    width: '10%',
    datakey: 'respiratoryrate',
}, {
    name: 'Temerature',
    width: '10%',
    datakey: 'temperature',
}]

export default function VisitCreation() {
    const [vitalsList, setVitalsList] = React.useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const appContextValue = useContext(AppContext);
    useEffect(() => {
        getVitalsData();
    }, []);

    async function getVitalsData() {
        var payLoad = {
            method: APIS.GET_VITALS_DATA.METHOD,
            url: APIS.GET_VITALS_DATA.URL,
            paramas: [0, appContextValue.selectedVisitDeatils.clientid.seqid],
        }
        let result = await sendRequest(payLoad);
        if (result && result.length != 0) {
            setVitalsList(result);
        }
    }

    return (
        <Box sx={{ m: 1 }}>
            <Box >
                <Grid xs={12} container>
                    <ClientBanner clientData={appContextValue.selectedVisitDeatils.clientid} visitData={appContextValue.selectedVisitDeatils} />
                </Grid>
                <CommonCard title={"Vitals List"} iconsList={[{ title: 'Add Vitals', icon: 'add_icon' }]} catchCliedEvent={(clickedEvent) => {
                    setIsOpen(true);
                }}>
                    <Grid xs={12} container>
                        <CustomDataGrid tableHeaders={vitalsListTableData} tableData={vitalsList}></CustomDataGrid>
                    </Grid>
                </CommonCard>

            </Box>
            <ModelPopUp isOpen={isOpen} handleClose={() => { setIsOpen(false) }} >
                <Vitals isActionButtonReq={true} refreshVitalsList={() => { setIsOpen(false); getVitalsData() }} />
            </ModelPopUp>
        </Box>
    )
}