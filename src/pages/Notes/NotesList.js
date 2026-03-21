import React, { useEffect, useContext, useState, useRef } from 'react';
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid';
import AppContext from '../../components/Context/AppContext';
import { sendRequest } from '../global/DataManager';
import APIS from '../../Utils/APIS';
import CommonCard from '../../common/CommonCard';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import ModelPopUp from '../../common/ModelPopup/ModelPopUp';
import Notes from './Notes';
import SLButton from '../../CoreComponents/SLButton';

const notesTableHeaders = [{
    name: "Date",
    datakey: 'date',
    width: '20%'
}, {
    name: "Notes",
    datakey: 'description',
    width: '20%'
}, {
    name: 'action',
    width: '10%',
    isActions: true,
    actions: [{
        icon: 'visibility'
    }]
}]

export default function NotesList() {
    const [notesList, setNotesList] = React.useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const notesRef = useRef();

    const appContextValue = useContext(AppContext);
    useEffect(() => {
        getNotesData();
    }, []);

    async function getNotesData() {
        var payLoad = {
            method: APIS.GET_NOTES_BASED_CIENT_VISITID.METHOD,
            url: APIS.GET_NOTES_BASED_CIENT_VISITID.URL,
            paramas: [appContextValue.selectedVisitDeatils.clientid.seqid],
        }
        let result = await sendRequest(payLoad);
        if (result && result.length != 0) {
            setNotesList(result);
        }
    }

    const handleAdd = () => {
        notesRef.current.submitFormmData();
        setTimeout(() => {
            const notesData = notesRef.current.getFormData();
            //saveNotes(notesData);
        });
    };

    return (
        <Box sx={{ m: 1 }}>
            <Box >
                <CommonCard title={"Notes List"} iconsList={[{ title: 'Add Note', icon: 'add_icon' }]} catchCliedEvent={(clickedEvent) => {
                    setIsOpen(true);
                }}>
                    <Grid xs={12} container>
                        <CustomDataGrid tableHeaders={notesTableHeaders} tableData={notesList} triggerEvent={(row, action) => {
                            setIsOpen(true);
                            setTimeout(() => {
                                notesRef.current.setFormData(row.description);
                            }, 100)

                        }}></CustomDataGrid>
                    </Grid>
                </CommonCard>

            </Box>
            <ModelPopUp isOpen={isOpen} handleClose={() => { setIsOpen(false) }} >
                <Notes label={"General Notes"} ref={notesRef} />
                <SLButton variant="outlined" color="success" onClick={handleAdd}>{"Save"}</SLButton>
            </ModelPopUp>
        </Box>
    )
}