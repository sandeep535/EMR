import React, { useEffect, useContext } from 'react';
import { Box } from '@mui/material'
import AppContext from '../../components/Context/AppContext';
import { sendRequest } from '../global/DataManager';
import APIS from '../../Utils/APIS';
import ClientBanner from '../../components/ClientBanner/ClientBanner';
import CommonCard from '../../common/CommonCard';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import ModelPopUp from '../../common/ModelPopup/ModelPopUp';
import Prescriptions from './Prescriptions';
import Grid from '@mui/material/Grid';

const prescriptionTableData = [{
    name: 'Date',
    datakey: 'date',
    width: '10%'
}, {
    name: 'Drug Name',
    width: '20%',
    datakey: 'drugname'
}, {
    name: 'Dose',
    width: '10%',
    datakey: 'dose'
}, {
    name: 'Dose Unit',
    width: '10%',
    datakey: 'doseunit'
}, {
    name: 'SIG',
    width: '20%',
    datakey: 'sig',
}, {
    name: 'Start Date',
    width: '10%',
    datakey: 'startdate',
    isDateFiled: true
}, {
    name: 'End Date',
    width: '10%',
    datakey: 'endate',
    isDateFiled: true
}]
export default function PrescriptionsList() {
    const [prescriptionlist, setPrescriptionlist] = React.useState([]);
    const [isOpen, setIsOpen] = React.useState(false);
    const appContextValue = useContext(AppContext);
    useEffect(() => {
        getprescriptionlist();
    }, []);

    async function getprescriptionlist() {
        var payLoad = {
            method: APIS.GET_PRESCRIPTIONS.METHOD,
            url: APIS.GET_PRESCRIPTIONS.URL,
            paramas: [0, appContextValue.selectedVisitDeatils.clientid.seqid],
        }
        let result = await sendRequest(payLoad);
        if (result && result.length != 0) {
            setPrescriptionlist(result);

        }
    }

    return (
        <Box sx={{ m: 1 }}>
            <Grid xs={12} container>
                <ClientBanner clientData={appContextValue.selectedVisitDeatils.clientid} visitData={appContextValue.selectedVisitDeatils} />
            </Grid>
            <CommonCard title={"Prescription List"} iconsList={[{ title: 'Add Presxription', icon: 'add_icon' }]} catchCliedEvent={(clickedEvent) => {
                setIsOpen(true);
            }}>
                <CustomDataGrid tableHeaders={prescriptionTableData} tableData={prescriptionlist}></CustomDataGrid>
            </CommonCard>
            <ModelPopUp isOpen={isOpen} size={'md'} handleClose={() => { setIsOpen(false) }} >
                <Prescriptions isActionButtonReq={true} refreshPrescriptionList={() => { setIsOpen(false); getprescriptionlist() }} />
            </ModelPopUp>
        </Box>

    )
}