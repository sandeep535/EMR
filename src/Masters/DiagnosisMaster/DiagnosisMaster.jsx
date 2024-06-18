import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import EMRAlert from '../../Utils/CustomAlert';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import CommonCard from '../../common/CommonCard';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
    .object({
        name: yup.string().required(),
        code: yup.string().required(),
        codeset: yup.object().required(),
    })
    .required()

const diagnosisListHeaders = [{
    name: Translations.DIAGNOSIS_MASTER.CODE_SET,
    datakey: 'dignosiscodeset.lookupvalue',
    width: '20%'
}, {
    name: Translations.DIAGNOSIS_MASTER.CODE,
    width: '20%',
    datakey: 'dignosiscode'
}, {
    name: Translations.DIAGNOSIS_MASTER.NAME,
    width: '40%',
    datakey: 'dignosisname'
}, {
    name: Translations.DIAGNOSIS_MASTER.STATUS,
    width: '10%',
    datakey: 'status',
    mappingData: { 1: "Active", 2: "In-active" }
}, {
    name: Translations.DIAGNOSIS_MASTER.ACTIONS,
    width: '10%',
    isActions: true,
    actions: [{
        icon: 'edit'
    }]
}]

export default function DiagnosisMaster(props) {

    const [diagnosisCodeSetMasterData, setDiagnosisCodeSetMasterData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [totalcount, settotalcount] = useState(0);
    const defaultobj = {
        name: "",
        code: "",
        codeset: "",
        status: "1"
    }
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { status: "1" },
        resolver: yupResolver(schema),
    })

    useEffect(() => {
        getLookUpDetails();
        getMasterDataList();
        return () => console.log("Cleanup..");
    }, []);
    async function getLookUpDetails() {
        var payLoad = {
            method: APIS.LOOKUP.METHOD,
            url: APIS.LOOKUP.URL,
            paramas: ["DIAGNOSISMASTERCODESET"]
        }
        let result = await sendRequest(payLoad);
        if (result && result.DIAGNOSISMASTERCODESET) {
            setDiagnosisCodeSetMasterData(result.DIAGNOSISMASTERCODESET);
        }
    }
    async function getMasterDataList() {
        var obj = {
            pagenumber: 0,
            pagesize: 100,
            totalcount: 0,
            diagnosisMasterModel: [{
                dignosiscodeset: null,
                dignosiscode: null,
                dignosisname: '',
                status: 1
            }]
        }
        var payLoad = {
            method: APIS.GET_DIADNOSIS_MASTER.METHOD,
            url: APIS.GET_DIADNOSIS_MASTER.URL,
            paramas: [],
            data: obj
        }
        let result = await sendRequest(payLoad);
        console.log(result);
        if (result && result.diagnosisMasterModel) {
            setTableData(result.diagnosisMasterModel);
        } else {
            setTableData([]);
        }
    }


    const diagnosisMasterhandleSubmit = async (data) => {
        let sendingdata = {
            dignosisid: null,
            dignosisname: data.name,
            status: data.status,
            dignosiscode: data.code,
            dignosiscodeset: data.codeset
        }
        var payLoad = {
            method: APIS.SAVE_DIADNOSIS_MASTER.METHOD,
            url: APIS.SAVE_DIADNOSIS_MASTER.URL,
            paramas: [],
            data: sendingdata
        }
        let result = await sendRequest(payLoad);
        if (result) {
            EMRAlert.alertifySuccess("Diagnosis Saved Succussfully");
            reset();
        } else {
            EMRAlert.alertifyError("Not Saved");
        }
    }

    return (
        <>
            <CommonCard title="Add New Diagnosis">
                <form onSubmit={handleSubmit(diagnosisMasterhandleSubmit)} >
                    <Grid xs={12} container spacing={1}>
                        <Grid item xs={2} spacing={1}>
                            <FormControl variant="outlined" fullWidth>
                                <Controller
                                    name="codeset"
                                    control={control}
                                    render={({ field: { onChange } }) =>
                                        <Autocomplete
                                            size="small"
                                            disablePortal
                                            id="Allergy-combo-box-demo"
                                            options={diagnosisCodeSetMasterData}
                                            key={option => option.lookupid}
                                            getOptionLabel={option => option.lookupvalue || ''}
                                            onChange={(event, item) => {
                                                onChange(item);
                                            }}

                                            renderOption={(props, option) => {
                                                return (
                                                    <li {...props} key={option.lookupid}>
                                                        {option.lookupvalue}
                                                    </li>
                                                );
                                            }}
                                            slotProps={{
                                                popper: {
                                                    sx: {
                                                        zIndex: 99999
                                                    }
                                                }
                                            }}
                                            renderInput={(params) => <TextField {...params} error={errors.codeset?.message}
                                                helperText={errors.codeset?.message} label={Translations.DIAGNOSIS_MASTER.CODE_SET} />}
                                        />
                                    }
                                />

                            </FormControl>
                        </Grid>
                        <Grid item xs={2} spacing={1}>

                            <Controller
                                name="code"
                                control={control}
                                render={({ field }) =>
                                    <TextField
                                        {...field}
                                        fullWidth
                                        type="text"
                                        size="small"
                                        variant="outlined"
                                        label={Translations.DIAGNOSIS_MASTER.CODE}
                                        error={errors.code?.message}
                                        helperText={errors.code?.message}
                                    />
                                }
                            />

                        </Grid>
                        <Grid item xs={2} spacing={1}>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) =>
                                    <TextField
                                        {...field}
                                        fullWidth
                                        type="text"
                                        size="small"
                                        variant="outlined"
                                        label={Translations.DIAGNOSIS_MASTER.NAME}
                                        error={errors.name?.message}
                                        helperText={errors.name?.message}
                                    />}
                            />

                        </Grid>
                        <Grid item xs={3} spacing={1}>
                            <FormControl style={{ display: 'row', flexDirection: 'row' }}>
                                <FormLabel id="demo-row-radio-buttons-group-label" style={{ paddingRight: '8px', paddingTop: '8px' }}>{Translations.DIAGNOSIS_MASTER.STATUS}</FormLabel>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) =>
                                        <RadioGroup
                                            {...field}
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"

                                        //   value={dignosisformData.status}
                                        >
                                            <FormControlLabel value="1" control={<Radio />} label="Active" />
                                            <FormControlLabel value="2" control={<Radio />} label="Inactive" />
                                        </RadioGroup>}
                                />

                            </FormControl>
                        </Grid>
                        <Grid item xs={2} spacing={1}>
                            <FormButtonComponent button1={"Save"} button2={"Close"} clearFormEvent={() => {
                                reset(defaultobj,
                                    {
                                        keepErrors: true,
                                        keepDirty: true,
                                    });
                            }} />
                        </Grid>
                    </Grid>

                </form>
            </CommonCard>
            <CommonCard title="Diagnosis List">
                <CustomDataGrid tableHeaders={diagnosisListHeaders} tableData={tableData} totalcount={totalcount} rowsPerPage={20} paginationChangeEvent={(number) => {
                    debugger
                }} triggerEvent={(row, action) => {
                    //openEditmode(row, action);
                }}></CustomDataGrid>
            </CommonCard>
        </>
    )
};