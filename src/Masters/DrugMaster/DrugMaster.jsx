import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import EMRAlert from '../../Utils/CustomAlert';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import CommonCard from '../../common/CommonCard';
import { yupResolver } from "@hookform/resolvers/yup";
import { DrugMasterSchema } from '../../common/YupSchema/formSchema';
import { useForm } from "react-hook-form";
import SLTextField from '../../CoreComponents/SLTextField';
import SLRadioButton from '../../CoreComponents/SLRadioButton';
import DrugMasterList from './DrugMasterList';

const activeRadioButtonOptions = [
    { label: 'Active', value: '1' },
    { label: 'In-active', value: '2' }
];
const defaultobj = {
    drugType: "",
    drugname: "",
    drugname: "",
    status: "1"
}
export default function DrugMaster(props) {

    const [drugTypeListOptions, setDrugTypeListOptions] = useState([]);
    const [drugAlerListOptions, setDrugAlerListOptions] = useState([]);
    const [drugFormListOptions, setDrugFormListOptions] = useState([]);
    const [drugDoseUnitListOptions, setDrugDoseUnitListOptions] = useState([]);


    const [duplicatecheck, setDuplicatecheck] = useState(false);

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: defaultobj,
        resolver: yupResolver(DrugMasterSchema),
    })

    useEffect(() => {
        getDrugtypeMastersData();
        getDrugFormMastersData();
        getDrugAlertsMastersData();
        getDrugUnitMastersData();
    }, []);

    const drugMasterhandleSubmit = async (data) => {
        if (duplicatecheck) {
            EMRAlert.alertifySuccess("Please check drug name or drug code");
            return false;
        }
        saveData(data);
    }

    async function saveData(data) {
        let data1 = {
            drugid: "",
            drugname: data.drugname,
            status: data.status,
            drugcode: data.drugcode,
            drugtype: data.drugType,
            drugform: data.drugForm,
            drugalert: data.drugAlert,
            drugdose: data.drugDose,
            drugunit: data.drugDoseUnit,
            defaultduration: data.defaultduration ? Number(data.defaultduration) : '',
            defaultInstruction: data.defaultInstruction,
            sig: data.sig
        }
        var payLoad = {
            method: APIS.SAVE_DRUG_MASTER.METHOD,
            url: APIS.SAVE_DRUG_MASTER.URL,
            paramas: [],
            data: data1
        }
        let result = await sendRequest(payLoad);
        if (result) {
            EMRAlert.alertifySuccess("Drug Saved Succussfully");
        } else {
            EMRAlert.alertifyError("Not Saved");
        }
    }
    async function checkduplicateDrugName(drugname) {
        if (!drugname) {
            return false;
        }
        var payLoad = {
            method: APIS.CHECK_DUPLICATE_DRUG_NAME.METHOD,
            url: APIS.CHECK_DUPLICATE_DRUG_NAME.URL,
            paramas: [drugname.trim()],
        }
        let result = await sendRequest(payLoad);
        if (result && result.drugid) {
            EMRAlert.alertifySuccess("This drug name already avaliable");
            setDuplicatecheck(true);
        }
    }
    async function checkduplicateDrugCode(drugcode) {
        if (!drugcode) {
            return false;
        }
        var payLoad = {
            method: APIS.CHECK_DUPLICATE_DRUG_CODE.METHOD,
            url: APIS.CHECK_DUPLICATE_DRUG_CODE.URL,
            paramas: [drugcode.trim()],
        }
        let result = await sendRequest(payLoad);
        if (result && result.drugid) {
            EMRAlert.alertifySuccess("This drug code already avaliable");
            setDuplicatecheck(true);
        }
    }

    async function getDrugtypeMastersData() {
        var payLoad = {
            method: APIS.GET_MASTER_DATA_BASED_ON_CODE.METHOD,
            url: APIS.GET_MASTER_DATA_BASED_ON_CODE.URL,
            paramas: ["DRUG_TYPE"]
        }
        let result = await sendRequest(payLoad);
        if (result) {
            setDrugTypeListOptions(result);
        }
    }

    async function getDrugAlertsMastersData() {
        var payLoad = {
            method: APIS.GET_MASTER_DATA_BASED_ON_CODE.METHOD,
            url: APIS.GET_MASTER_DATA_BASED_ON_CODE.URL,
            paramas: ["DRUG_ALERTS", "DRUG_DOSE_UNIT"]
        }
        let result = await sendRequest(payLoad);
        if (result) {
            setDrugAlerListOptions(result);

        }
    }
    async function getDrugUnitMastersData() {
        var payLoad = {
            method: APIS.GET_MASTER_DATA_BASED_ON_CODE.METHOD,
            url: APIS.GET_MASTER_DATA_BASED_ON_CODE.URL,
            paramas: ["DRUG_DOSE_UNIT"]
        }
        let result = await sendRequest(payLoad);
        if (result) {
            setDrugDoseUnitListOptions(result);

        }
    }

    async function getDrugFormMastersData() {
        var payLoad = {
            method: APIS.GET_MASTER_DATA_BASED_ON_CODE.METHOD,
            url: APIS.GET_MASTER_DATA_BASED_ON_CODE.URL,
            paramas: ["DRUG_FORM"]
        }
        let result = await sendRequest(payLoad);
        if (result) {
            setDrugFormListOptions(result);

        }
    }


    return (
        <>
            <CommonCard title={Translations.DRUG_MASTER.NAME}>
                <form onSubmit={handleSubmit(drugMasterhandleSubmit)} >
                    <Grid container spacing={2}>
                        <Grid item xs={3} spacing={1}>
                            <AutocompleteField
                                name="drugType"
                                label={Translations.DRUG_MASTER.DRUG_TYPE}
                                control={control}
                                options={drugTypeListOptions}
                                placeholder={Translations.DRUG_MASTER.DRUG_TYPE}
                                mapvalues={{ id: "id", value: 'masterdatavalue' }}
                                isMultiSelect={false}
                                id={"Drugmaster-combo-box-demo"}
                                onInputChange={(data) => {

                                }}
                            />
                        </Grid>
                        <Grid item xs={4} spacing={1}>
                            <SLTextField
                                name="drugname"
                                label={Translations.DRUG_MASTER.DRUG_NAME}
                                control={control}
                                placeholder={Translations.DRUG_MASTER.DRUG_NAME}
                                blurEvent={(item) => {
                                    checkduplicateDrugName(item)
                                }}
                            />
                        </Grid>
                        <Grid item xs={4} spacing={1}>
                            <SLTextField
                                name="drugcode"
                                label={Translations.DRUG_MASTER.DRUG_CODE}
                                control={control}
                                placeholder={Translations.DRUG_MASTER.DRUG_CODE}
                                blurEvent={(item) => {
                                    checkduplicateDrugCode(item)
                                }}
                            />
                        </Grid>
                        <Grid item xs={4} spacing={1}>
                            <AutocompleteField
                                name="drugAlert"
                                label={Translations.DRUG_MASTER.DRUG_ALERT}
                                control={control}
                                options={drugAlerListOptions}
                                placeholder={Translations.DRUG_MASTER.DRUG_ALERT}
                                mapvalues={{ id: "id", value: 'masterdatavalue' }}
                                isMultiSelect={false}
                                id={"DrugmasterdrugAlert-combo-box-demo"}
                            />
                        </Grid>
                        <Grid item xs={4} spacing={1}>
                            <AutocompleteField
                                name="drugForm"
                                label={Translations.DRUG_MASTER.DRUG_FORM}
                                control={control}
                                options={drugFormListOptions}
                                placeholder={Translations.DRUG_MASTER.DRUG_FORM}
                                mapvalues={{ id: "id", value: 'masterdatavalue' }}
                                isMultiSelect={false}
                                id={"DrugmasterdrugForm-combo-box-demo"}
                            />
                        </Grid>
                        <Grid item xs={4} spacing={1}>
                            <SLTextField
                                name="sig"
                                label={Translations.DRUG_MASTER.SIG}
                                control={control}
                                placeholder={Translations.DRUG_MASTER.SIG}
                            />
                        </Grid>
                        <Grid item xs={2} spacing={1}>
                            <SLTextField
                                name="drugDose"
                                label={Translations.DRUG_MASTER.DRUG_DOSAGE}
                                control={control}
                                placeholder={Translations.DRUG_MASTER.DRUG_DOSAGE}
                            />
                        </Grid>
                        <Grid item xs={2} spacing={1}>
                            <AutocompleteField
                                name="drugDoseUnit"
                                label={Translations.DRUG_MASTER.DRUG_UNIT}
                                control={control}
                                options={drugDoseUnitListOptions}
                                placeholder={Translations.DRUG_MASTER.DRUG_UNIT}
                                mapvalues={{ id: "id", value: 'masterdatavalue' }}
                                isMultiSelect={false}
                                id={"DrugmasterdrugDoseUnit-combo-box-demo"}
                            />
                        </Grid>
                        <Grid item xs={2} spacing={1}>
                            <SLTextField
                                name="defaultduration"
                                label={Translations.DRUG_MASTER.DURATION}
                                control={control}
                                placeholder={Translations.DRUG_MASTER.DURATION}
                            />
                        </Grid>
                        <Grid item xs={4} spacing={1}>
                            <SLTextField
                                name="defaultInstruction"
                                label={Translations.DRUG_MASTER.INSTRUCTIONS}
                                control={control}
                                placeholder={Translations.DRUG_MASTER.INSTRUCTIONS}
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

                    </Grid>
                    <FormButtonComponent button1={"Save"} button2={"Clear"} />
                </form>
            </CommonCard>
            <DrugMasterList/>
        </>
    )
}