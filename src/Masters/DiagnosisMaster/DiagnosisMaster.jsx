import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import FormControl from '@mui/material/FormControl';
import EMRAlert from '../../Utils/CustomAlert';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';
import CommonCard from '../../common/CommonCard';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SLTextField from '../../CoreComponents/SLTextField';
import { DiagnosisMasterSchema } from '../../common/YupSchema/formSchema';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import SLRadioButton from '../../CoreComponents/SLRadioButton';

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
const activeRadioButtonOptions = [
    { label: 'Active', value: '1' },
    { label: 'In-active', value: '2' }
];
export default function DiagnosisMaster(props) {

    const [diagnosisCodeSetMasterData, setDiagnosisCodeSetMasterData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [totalcount, settotalcount] = useState(0);
    const defaultobj = {
        name: "",
        code: "",
        codeset: {},
        status: "1"
    }

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: defaultobj,
        resolver: yupResolver(DiagnosisMasterSchema),
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
            getMasterDataList();
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
                                <AutocompleteField
                                    name="codeset"
                                    label={Translations.DIAGNOSIS_MASTER.CODE_SET}
                                    control={control}
                                    options={diagnosisCodeSetMasterData}
                                    placeholder={Translations.DIAGNOSIS_MASTER.CODE_SET}
                                    mapvalues={{ id: "lookupid", value: 'lookupvalue' }}
                                    isMultiSelect={false}
                                    id={"Allergy-combo-box-demo"}
                                    onInputChange={(data) => {

                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={2} spacing={1}>
                            <SLTextField
                                name="code"
                                label={Translations.DIAGNOSIS_MASTER.CODE}
                                control={control}
                                placeholder={Translations.DIAGNOSIS_MASTER.CODE}
                            />
                        </Grid>
                        <Grid item xs={2} spacing={1}>
                            <SLTextField
                                name="name"
                                label={Translations.DIAGNOSIS_MASTER.NAME}
                                control={control}
                                placeholder={Translations.DIAGNOSIS_MASTER.NAME}
                            />

                        </Grid>
                        <Grid item xs={3} spacing={1}>
                            <SLRadioButton
                                name="status"
                                label="Status"
                                control={control}
                                options={activeRadioButtonOptions}
                                error={errors.status}
                            />

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
                }} triggerEvent={(row, action) => {
                    //openEditmode(row, action);
                }}></CustomDataGrid>
            </CommonCard>
        </>
    )
};