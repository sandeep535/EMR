import React, { useEffect, useState } from 'react';
import CommonCard from "../../common/CommonCard";
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';
import { useForm } from "react-hook-form";
import SLTextField from '../../CoreComponents/SLTextField';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import Grid from '@mui/material/Grid';

const drugMasterListHeaders = [{
    name: Translations.DRUG_MASTER.DRUG_NAME,
    datakey: 'drugname',
    width: '25%'
}, {
    name: Translations.DRUG_MASTER.DRUG_CODE,
    width: '10%',
    datakey: 'drugcode'
}, {
    name: Translations.DRUG_MASTER.DRUG_TYPE,
    width: '10%',
    datakey: 'drugtyp.masterdatavalue'
}, {
    name: Translations.DRUG_MASTER.DRUG_DOSAGE,
    width: '10%',
    datakey: 'drugdose'
}, {
    name: Translations.DRUG_MASTER.DRUG_UNIT,
    width: '10%',
    datakey: 'drugunit.masterdatavalue'
}, {
    name: Translations.DRUG_MASTER.SIG,
    width: '20%',
    datakey: 'sig'
}, {
    name: Translations.DRUG_MASTER.STATUS,
    width: '10%',
    datakey: 'status',
    mappingData: { 1: "Active", 2: "In-active" }
}, {
    name: Translations.DIAGNOSIS_MASTER.ACTIONS,
    width: '5%',
    isActions: true,
    actions: [{
        icon: 'edit'
    }]
}]

export default function DrugMasterList(props) {
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { drugname: '' },
    })
    const [tableData, setTableData] = React.useState([]);
    useEffect(() => {
        getDrugMasterData("")
    }, []);

    async function getDrugMasterData(newValue) {
        var payLoad = {
            method: APIS.GET_DRUG_MASTER_DATA.METHOD,
            url: APIS.GET_DRUG_MASTER_DATA.URL,
            paramas: [newValue]
        }
        let result = await sendRequest(payLoad);
        if (result) {
            setTableData(result);
        }
    }
    function openDrugEditmode(row, action){
        props.openDrugEditmode(row, action);
    }
    return (
        <>
            <CommonCard title={Translations.DRUG_MASTER.DRUG_MASTER_LIST}>
                <Grid container spacing={1}>
                    <Grid item xs={3} spacing={1} >
                        <SLTextField
                            name="drugname"
                            label={Translations.DRUG_MASTER.DRUG_NAME}
                            control={control}
                            placeholder={Translations.DRUG_MASTER.DRUG_NAME}
                            blurEvent={(item) => {
                                getDrugMasterData(item)
                            }}
                        />
                    </Grid>
                </Grid>
                <CustomDataGrid tableHeaders={drugMasterListHeaders} tableData={tableData} triggerEvent={(row, action) => {
                    openDrugEditmode(row, action);
                }}></CustomDataGrid>

            </CommonCard>
        </>
    )
}