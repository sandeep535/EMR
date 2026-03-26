import React, { useEffect, useContext } from 'react';
import { Box } from '@mui/material';
import AppContext from '../../components/Context/AppContext';
import { sendRequest } from '../global/DataManager';
import APIS from '../../Utils/APIS';
import CommonCard from '../../common/CommonCard';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import ModelPopUp from '../../common/ModelPopup/ModelPopUp';
import Prescriptions from './Prescriptions';

const prescriptionTableData = [
    { name: 'Date', datakey: 'createdDate', width: '8%',   isDateFiled: true,
    dateFormat: 'DD-MM-YYYY HH:mm'},
    { name: 'Drug Name', datakey: 'drugname', width: '18%' },
    { name: 'Dose', datakey: 'dose', width: '8%' },
    { name: 'Dose Unit', datakey: 'doseunit', width: '8%' },
    { name: 'SIG', datakey: 'sig', width: '15%' },
    { name: 'Instructions', datakey: 'instructions', width: '20%' },
    { name: 'Start Date', datakey: 'startdate', width: '10%', isDateFiled: true },
    { name: 'End Date', datakey: 'endate', width: '10%', isDateFiled: true },
];

export default function PrescriptionsList() {
    const [prescriptionlist, setPrescriptionlist] = React.useState([]);
    const [isOpen, setIsOpen] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const rowsPerPage = 10;
    const appContextValue = useContext(AppContext);

    useEffect(() => { getprescriptionlist(); }, []);

    async function getprescriptionlist() {
        const result = await sendRequest({
            method: APIS.GET_PRESCRIPTIONS.METHOD,
            url: APIS.GET_PRESCRIPTIONS.URL,
            paramas: [0, appContextValue.selectedVisitDeatils.clientid.seqid],
        });
        if (result?.length) setPrescriptionlist(result);
    }

    return (
        <Box sx={{ m: 1, width: '100%' }}>
            <CommonCard title="Prescription List" iconsList={[{ title: 'Add Prescription', icon: 'add_icon' }]}
                catchCliedEvent={() => setIsOpen(true)}>
                <CustomDataGrid tableHeaders={prescriptionTableData} tableData={prescriptionlist} rowsPerPage={rowsPerPage} totalcount={prescriptionlist.length} paginationChangeEvent={(newPage) => setPage(newPage)} />
            </CommonCard>
            <ModelPopUp isOpen={isOpen} title="Add Prescription" maxWidth="lg" handleClose={() => setIsOpen(false)}>
                <Prescriptions isActionButtonReq={true} refreshPrescriptionList={() => { setIsOpen(false); getprescriptionlist(); }} />
            </ModelPopUp>
        </Box>
    );
}
