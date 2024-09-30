import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import RegistrationInformation from '../../components/RegistrationInformation/RegistrationInformation';
import Translations from '../../resources/translations';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import FormControl from '@mui/material/FormControl';
import EMRAlert from '../../Utils/CustomAlert';
import EmployeeMasterList from './EmployeeMasterList';
import { useForm } from "react-hook-form";
import { EmployeeCreationSchema } from '../../common/YupSchema/formSchema';
import { yupResolver } from "@hookform/resolvers/yup";
import CommonCard from '../../common/CommonCard';
import SLTextField from '../../CoreComponents/SLTextField';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import CommonConst from '../../Utils/CommonConst'
import SLRadioButton from '../../CoreComponents/SLRadioButton';
import dayjs from 'dayjs';
import moment from 'moment';

export default function EmployeeMaster(props) {
    const [rolesList, setRolesList] = useState([]);
    const [designationList, setDesignationList] = useState([]);

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            status:'1'
        },
        resolver: yupResolver(EmployeeCreationSchema),
    });

    useEffect(() => {
        getRoleMasterData();
    }, []);

    async function getRoleMasterData() {
        var payLoad = {
            method: APIS.GET_MASTER_DATA_BASED_ON_CODE.METHOD,
            url: APIS.GET_MASTER_DATA_BASED_ON_CODE.URL,
            paramas: ["ROLE"]
        }
        let result = await sendRequest(payLoad);
        if (result) {
            setRolesList(result);
        }
    }
    async function saveData(data) {
        var payLoad = {
            method: APIS.EMP_REGISTRATION.METHOD,
            url: APIS.EMP_REGISTRATION.URL,
            paramas: [],
            data: data
        }
        let result = await sendRequest(payLoad);
        if (result) {
            EMRAlert.alertifySuccess("Employee Saved Succussfully");
            reset({status:'1'})
        } else {
            EMRAlert.alertifyError("Not Saved");
        }
    }
    const employeeCreationhandleSubmit = async (data) => {
        var obj = {
            id:(data.id)?data.id:null,
            firstname: data.firstname,
            lastname: data.lastname,
            username: data.username,
            password: data.password,
            title: data.title,
            designation: data.designation,
            gender: data.gender,
            role: data.role,
            age: data.age,
            dob: new Date(data.dob),
            mail: data.email,
            mobilenumber: data.contact
        }
        saveData(obj);
    }
    function setDatatoEditMode(row,action){
        row.dob = dayjs(moment(new Date()).format("YYYY-MM-DD"));
        row.contact = row.mobilenumber;
        row.email = row.mail;
        reset(row);
    }
    return (
        <>
            <CommonCard title={Translations.employeeRegistration.pagetitle}>
                <form onSubmit={handleSubmit(employeeCreationhandleSubmit)} >
                    <Box display="grid"
                        gap="5px">
                        <RegistrationInformation control={control} errors={errors} setValue={setValue} />
                        <Grid container spacing={2}>
                            <Grid item xs={4} spacing={1}>
                                <SLTextField
                                    name="username"
                                    label={Translations.employeeRegistration.username}
                                    control={control}
                                    placeholder={Translations.employeeRegistration.username}
                                />
                            </Grid>
                            <Grid item xs={4} spacing={1}>
                                <SLTextField
                                    name="password"
                                    type='password'
                                    label={Translations.employeeRegistration.password}
                                    control={control}
                                    placeholder={Translations.employeeRegistration.password}
                                />
                            </Grid>
                            <Grid item xs={4} spacing={1}>
                                <FormControl variant="outlined" fullWidth>
                                    <AutocompleteField
                                        name="role"
                                        label={Translations.employeeRegistration.role}
                                        control={control}
                                        options={rolesList}
                                        placeholder={Translations.employeeRegistration.role}
                                        mapvalues={{ id: "id", value: 'masterdatavalue' }}
                                        isMultiSelect={false}
                                        id={"emprole-combo-box-demo"}
                                        onInputChange={(data) => {

                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={4} spacing={1}>
                                <FormControl variant="outlined" fullWidth>
                                    <AutocompleteField
                                        name="designation"
                                        label={Translations.employeeRegistration.designation}
                                        control={control}
                                        options={designationList}
                                        placeholder={Translations.employeeRegistration.designation}
                                        mapvalues={{ id: "lookupid", value: 'lookupvalue' }}
                                        isMultiSelect={false}
                                        id={"designation-combo-box-demo"}
                                        onInputChange={(data) => {

                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={3} spacing={1}>
                                <SLRadioButton
                                    name="status"
                                    label="Status"
                                    control={control}
                                    options={CommonConst.activeRadioButtonOptions}
                                    error={errors.status}
                                />

                            </Grid>
                        </Grid>
                    </Box>
                    <FormButtonComponent button1={"Register"} button2={"Clear"} />
                </form>
            </CommonCard>

            <Box m="0px">
                <EmployeeMasterList openEditmode = {(row, action)=>{
                    setDatatoEditMode(row, action);
                }}/>
            </Box>
        </>
    );
}