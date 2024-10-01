import React, { useRef, useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import CommonCard from '../../common/CommonCard';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormControl from '@mui/material/FormControl';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import Translations from '../../resources/translations';
import { LabordersSchema } from '../../common/YupSchema/formSchema';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import AppContext from '../../components/Context/AppContext';
import LabOrder from './LabOrder';
import SLButton from '../../CoreComponents/SLButton';
import EMRAlert from '../../Utils/CustomAlert';

const labOrdersListHeaders = [{
    name: Translations.LAB_ORDER.LAB_NAME,
    datakey: 'labname',
    width: '30%'
},{
    name: Translations.LAB_ORDER.STATUS,
    datakey: 'status',
    width: '20%'
}]

export default function LabOrdersList(props) {
    const [tableData, setTableData] = useState([]);
    const [totalcount, setTotalcount] = useState();

    const appContextValue = useContext(AppContext);

    const labRef = useRef();
    useEffect(() => {
        getLabData();
    }, []);

    async function getLabData() {
        var payLoad = {
            method: APIS.GET_LAB_LIST_BASED_ON_VISITID_CLIENT_ID.METHOD,
            url: APIS.GET_LAB_LIST_BASED_ON_VISITID_CLIENT_ID.URL,
            paramas: [0, appContextValue.selectedVisitDeatils.clientid.seqid],
        }
        let result = await sendRequest(payLoad);
        if (result) {
            setTableData(result);
        }
    }
    const handleAdd = () => {
        labRef.current.submitFormmData();
    };
    async function saveLabOrders(data) {
        let sendingData = data.selectedLabOrder;
        let finaldata =[];
        sendingData.forEach(item=>{
            var obj = {
                labtransid: "",
                labname: item.labname,
                status: 1,
                visitid:appContextValue.selectedVisitDeatils.visitid,
                clientid:appContextValue.selectedVisitDeatils.clientid.seqid,
                labmasterid: item
            }
            finaldata.push(obj);
        });
        var payLoad = {
            method: APIS.SAVE_LAB_ORDERS.METHOD,
            url: APIS.SAVE_LAB_ORDERS.URL,
            paramas: [],
            data: finaldata
        }
        let result = await sendRequest(payLoad);
        if (result) {
            EMRAlert.alertifySuccess("Lab Reports data saved succussfully");
            labRef.current.setFormData([]);
            getLabData();
        } else {
            EMRAlert.alertifyError("Not created");
        }
        
        console.log("debuggerdebuggerdebuggerdebuggerdebuggerdebugger", data)
    }
    return (
        <>
            <Grid xs={12} container>
                <Grid item xs={8} spacing={0}>
                    <LabOrder sendDataToParent={saveLabOrders} label={Translations.LAB_ORDER.LAB_TITLE} data={[]} ref={labRef} />
                </Grid>
                <Grid item xs={3} spacing={0}>
                    <SLButton variant="outlined" color="success" onClick={handleAdd}>{Translations.LAB_ORDER.ADD}</SLButton>
                </Grid>
            </Grid>

            <CommonCard title={Translations.LAB_ORDER.ORDER_LIST_TITLE}>
                <CustomDataGrid tableHeaders={labOrdersListHeaders} tableData={tableData} totalcount={totalcount} rowsPerPage={20} paginationChangeEvent={(number) => {
                }} triggerEvent={(row, action) => {
                    //  openEditmode(row, action);
                }}></CustomDataGrid>
            </CommonCard>
        </>
    )
}