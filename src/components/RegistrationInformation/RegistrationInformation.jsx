import React, { useEffect, useState, forwardRef } from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import Translations from '../../resources/translations';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import SLSelectDropDown from '../../CoreComponents/SLSelectDropDown';
import SLTextField from '../../CoreComponents/SLTextField';
import SLDatePicker from '../../CoreComponents/SLDatePicker';
import dayjs from 'dayjs';
import moment from 'moment';

const RegistrationInformation = forwardRef((props, ref) => {
    const { control, errors } = props;
    const [titleList, setTitleList] = useState([]);
    const [genderList, setGenderList] = useState([]);
    useEffect(() => {
        getLookUpDetails();
        return () => console.log("Cleanup..");
    }, []);
    function calculateDate(years) {
        if (!years)
            return false;
        years = Number(years);
        let currentDate = new Date();
        let newDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - years));
        let finalDate = dayjs(moment(newDate).format("YYYY-MM-DD"));
        props.setValue("dob", finalDate);
    }
    
    async function getLookUpDetails() {
        var payLoad = {
            method: APIS.LOOKUP.METHOD,
            url: APIS.LOOKUP.URL,
            paramas: ["GENDER,SALUTATION"]
        }
        let result = await sendRequest(payLoad);
        if (result && result.GENDER) {
            setGenderList(result.GENDER);
        }
        if (result && result.SALUTATION) {
            setTitleList(result.SALUTATION);
            props.setValue("title", result.SALUTATION[0]);
        }
    }

    function calculateAge(dateOfBirth) {
        const today = new Date(); // Current date
        const birthDate = new Date(dateOfBirth); // Convert input to Date object
        let age = today.getFullYear() - birthDate.getFullYear(); // Initial age calculation
        const monthDifference = today.getMonth() - birthDate.getMonth(); // Month difference
        // Adjust age if the current month/day is before the birth month/day
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        props.setValue("age",age);
      }
    return (
        <Box display="grid" >
            <Grid container spacing={1}>
                <Grid item xs={1} spacing={0}>
                    <SLSelectDropDown
                        name="title"
                        label={Translations.patientRegistration.title}
                        control={control}
                        options={titleList}
                        error={errors.title}
                        mapvalues={{ id: "lookupid", value: 'lookupvalue' }}
                    />
                </Grid>

                <Grid item xs={2} spacing={0}>
                    <SLTextField
                        name="firstname"
                        label={Translations.patientRegistration.firstName}
                        control={control}
                        placeholder={Translations.patientRegistration.firstName}
                    />
                </Grid>
                <Grid item xs={2} spacing={1}>
                    <SLTextField
                        name="lastname"
                        label={Translations.patientRegistration.lastName}
                        control={control}
                        placeholder={Translations.patientRegistration.lastName}
                    />
                </Grid>
                <Grid item xs={1} >
                    <SLSelectDropDown
                        name="gender"
                        label={Translations.patientRegistration.gender}
                        control={control}
                        options={genderList}
                        error={errors.gender}
                        mapvalues={{ id: "lookupid", value: 'lookupvalue' }}
                    />
                </Grid>
                <Grid item xs={1} >
                    <SLTextField
                        name="age"
                        label={Translations.patientRegistration.age}
                        control={control}
                        placeholder={Translations.patientRegistration.age}
                        blurEvent={(item) => {
                            calculateDate(item);
                        }}
                    />
                </Grid>
                <Grid item xs={2} >
                    <SLDatePicker
                        name="dob"
                        label={Translations.patientRegistration.dob}
                        control={control}
                        error={errors.dob}
                        onChange={(date)=>{
                            console.log(date);
                            calculateAge(date);
                        }}
                    />
                </Grid>
               
                <Grid item xs={2}>
                    <SLTextField
                        name="contact"
                        label={Translations.patientRegistration.contact}
                        control={control}
                        placeholder={Translations.patientRegistration.contact}
                    />

                </Grid>
                <Grid item xs={3}>
                    <SLTextField
                        name="email"
                        label={Translations.patientRegistration.email}
                        control={control}
                        placeholder={Translations.patientRegistration.email}
                    />
                </Grid>

            </Grid>
        </Box>
    );
})
RegistrationInformation.displayName ="RegistrationInformation";
export default RegistrationInformation;