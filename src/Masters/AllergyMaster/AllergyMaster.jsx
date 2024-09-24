import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import FormControl from '@mui/material/FormControl';
import EMRAlert from '../../Utils/CustomAlert';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CommonCard from '../../common/CommonCard';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import SLTextField from '../../CoreComponents/SLTextField';
import { AllergyNewMasterSchema, AllergySearchMasterSchema } from '../../common/YupSchema/formSchema';
import SLRadioButton from '../../CoreComponents/SLRadioButton';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const activeRadioButtonOptions = [
    { label: 'Active', value: '1' },
    { label: 'In-active', value: '2' }
];
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
}];
export default function AllergyMaster(props) {
    const [allergiesTypeCombo, setAllergiesTypeCombo] = useState([]);
    const [mode, setMode] = useState();
    const [editModeData, setEditModeData] = useState(null);
    const [totalcount, setTotalcount] = useState(0);
    const [showAddForm, setShowAddForm] = useState(false);

    const [tableData, setTableData] = useState([]);


    const { control: searchControl, handleSubmit: handleSearchSubmit, reset: handleSearchReset, formState: { errors: searchFormError } } = useForm({
        defaultValues: {
            status: 1
        },
        resolver: yupResolver(AllergySearchMasterSchema),
    });

    const { control: addFormControl, handleSubmit: handleformAddSubmit, reset: handleAddFormReset, formState: { errors: AddformError } } = useForm({
        defaultValues: {
            status: 1
        },
        resolver: yupResolver(AllergyNewMasterSchema),
    });

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
        handleAddFormReset({
            status: '1'
        })
    }

    async function allergyMasterhandleSubmit(data1) {
        let data = {
            allergyid: (mode == "edit") ? editModeData.allergyid : "",
            allergyname: data1.allergyname,
            status: data1.status,
            allergycode: data1.allergycode,
            allergytype: data1.allergytype
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
            if (mode == 'edit') {
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
        handleAddFormReset({
            allergytype: row.allergytype,
            allergycode: row.allergycode,
            allergyname: row.allergyname,
            status: row.status
        })

    }


    async function getAllergiesList(data) {

        let data1 = {
            allergyid: data ? data.allergyid : "",
            allergyname: (data) ? data.allergyname : "",
            status: (data) ? data.status : 1,
            allergycode: (data) ? data.allergycode : null,
            allergytype: null//data? data.allergyType:''
        }
        var mainDTO = {
            pagenumber: 0,
            pagesize: 20,
            allergieslist: [data1]
        }
        var payLoad = {
            method: APIS.GET_ALLERIES_MASTER_LIST.METHOD,
            url: APIS.GET_ALLERIES_MASTER_LIST.URL,
            paramas: [],
            data: mainDTO
        }
        let result = await sendRequest(payLoad);
        if (result && result.allergieslist.length != 0) {
            setTableData(result.allergieslist);
            setTotalcount(result.totalcount);
        } else {
            setTableData([]);
        }

    }
    const allergyMasterSearchhandleSubmit = async (data) => {
        getAllergiesList(data)
    }

    return (
        <>

            {showAddForm &&
                <CommonCard title={Translations.ALLERGY_MASTER.ADD_ALLERGY_TITLE}>
                    <Box m="0px">
                        <form onSubmit={handleformAddSubmit(allergyMasterhandleSubmit)} >
                            <Box>
                                <Grid xs={12} container spacing={1}>
                                    <Grid item xs={2} spacing={1}>
                                        <FormControl variant="outlined" fullWidth>
                                            <AutocompleteField
                                                name="allergytype"
                                                label={Translations.ALLERGY_MASTER.ALLERGY_TYPE}
                                                control={addFormControl}
                                                options={allergiesTypeCombo}
                                                placeholder={Translations.ALLERGY_MASTER.ALLERGY_TYPE}
                                                mapvalues={{ id: "lookupid", value: 'lookupvalue' }}
                                                isMultiSelect={false}
                                                id={"allergyType-combo-box-demo"}
                                                error={AddformError.allergyType}
                                                onInputChange={(data) => {

                                                }} />

                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2} spacing={1}>
                                        <SLTextField
                                            name="allergycode"
                                            label={Translations.ALLERGY_MASTER.ALLERGY_CODE}
                                            control={addFormControl}
                                            placeholder={Translations.ALLERGY_MASTER.ALLERGY_CODE}
                                            error={AddformError.allergycode}
                                        />
                                    </Grid>
                                    <Grid item xs={2} spacing={1}>
                                        <SLTextField
                                            name="allergyname"
                                            label={Translations.ALLERGY_MASTER.ALLERGY_NAME}
                                            control={addFormControl}
                                            placeholder={Translations.ALLERGY_MASTER.ALLERGY_NAME}
                                            error={AddformError.allergyname}
                                        />
                                    </Grid>
                                    <Grid item xs={2} spacing={1}>
                                        <SLRadioButton
                                            name="status"
                                            label={Translations.ALLERGY_MASTER.STATUS}
                                            control={addFormControl}
                                            options={activeRadioButtonOptions}
                                            error={AddformError.status}
                                        />
                                    </Grid>
                                    <Grid item xs={2} spacing={1}>
                                        <FormButtonComponent button1={"Save"} button2={"Close"} clearFormEvent={() => {
                                            clearForm();
                                            setShowAddForm(false);
                                        }} />
                                    </Grid>
                                </Grid>
                            </Box>
                        </form>
                    </Box>

                </CommonCard>
            }

            <CommonCard title={Translations.ALLERGY_MASTER.ALLERGY_LIST_TITLE}>
                <form onSubmit={handleSearchSubmit(allergyMasterSearchhandleSubmit)} >
                    <Box m="0px">
                        <Box>
                            <Grid xs={12} container spacing={1}>
                                <Grid item xs={2} spacing={1}>
                                    <FormControl variant="outlined" fullWidth>
                                        <AutocompleteField
                                            name="allergyType"
                                            label={Translations.ALLERGY_MASTER.ALLERGY_TYPE}
                                            control={searchControl}
                                            options={allergiesTypeCombo}
                                            placeholder={Translations.ALLERGY_MASTER.ALLERGY_TYPE}
                                            mapvalues={{ id: "lookupid", value: 'lookupvalue' }}
                                            isMultiSelect={false}
                                            id={"allergyType-combo-box-demo"}
                                            error={searchFormError.allergyType}
                                            onInputChange={(data) => {

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2} spacing={1}>
                                    <SLTextField
                                        name="allergycode"
                                        label={Translations.ALLERGY_MASTER.ALLERGY_CODE}
                                        control={searchControl}
                                        placeholder={Translations.ALLERGY_MASTER.ALLERGY_CODE}
                                        error={searchFormError.allergycode}
                                    />
                                </Grid>
                                <Grid item xs={2} spacing={1}>
                                    <SLTextField
                                        name="allergyname"
                                        label={Translations.ALLERGY_MASTER.ALLERGY_NAME}
                                        control={searchControl}
                                        placeholder={Translations.ALLERGY_MASTER.ALLERGY_NAME}
                                        error={searchFormError.allergyname}
                                    />
                                </Grid>
                                <Grid item xs={2} spacing={1}>
                                    <SLRadioButton
                                        name="status"
                                        label={Translations.ALLERGY_MASTER.STATUS}
                                        control={searchControl}
                                        options={activeRadioButtonOptions}
                                        error={searchFormError.status}
                                    />
                                </Grid>
                                <Grid item xs={2} spacing={1}>
                                    <FormButtonComponent button1={"Search"} button2={"Clear"} clearFormEvent={() => {

                                    }} />
                                </Grid>
                                <Grid item xs={2} spacing={1}>
                                    <AddCircleOutlineIcon onClick={() => { setShowAddForm(true) }} />
                                </Grid>

                            </Grid>
                        </Box>
                        <Box >
                            <CustomDataGrid tableHeaders={allergiesListHeaders} tableData={tableData} totalcount={totalcount} rowsPerPage={20} paginationChangeEvent={(number) => {
                            }} triggerEvent={(row, action) => {
                                openEditmode(row, action);
                            }}></CustomDataGrid>
                        </Box>
                    </Box>
                </form>
            </CommonCard>
        </>
    )
};