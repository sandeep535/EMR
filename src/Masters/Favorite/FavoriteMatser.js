import React from 'react';
import Grid from '@mui/material/Grid';
import CommonCard from '../../common/CommonCard';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


import AllerigiesComponent from '../../components/Allerigies/AllerigiesComponent';
import { Box } from '@mui/material';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import DiagnosisComponent from '../../components/Diagnosis/DiagnosisComponent';
import PrescriptionsComponent from '../../components/Prescriptions/PrescriptionsComponent';

const schema = yup
    .object({
        selectedAllerigies: yup.array().required("Select Diagnosis")
    })
    .required()
const FavoriteMatser = () => {
    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        mode: 'onChange',
        defaultValues: { selectedAllerigies: [],selectedDrugValues:[] },
        resolver: yupResolver(schema),
    });
    const favoratesHandle = async (data) => {
        
    }
    return (
        <Box sx={{ m: 1 }}>
            <form onSubmit={handleSubmit(favoratesHandle)}  >
                <Grid container spacing={1} xs={12}>
                    <Grid item xs={6} spacing={4}>
                        <CommonCard title={"Allergies"} >
                            <AllerigiesComponent isMultiSelect={true} control={control} />
                        </CommonCard>
                    </Grid>
                    <Grid item xs={6} spacing={4}>
                        <CommonCard title={"Diagnosis"} >
                            <DiagnosisComponent isMultiSelect={true} control={control} errors={errors} />
                        </CommonCard>
                    </Grid>
                    <Grid item xs={6} spacing={4}>
                        <CommonCard title={"Drugs"} >
                            <PrescriptionsComponent isMultiSelect={true} control={control} errors={errors} />
                        </CommonCard>
                    </Grid>
                    
                </Grid>
                <FormButtonComponent button1={"Save"} button2={"Close"} clearFormEvent={() => {

                }} />
            </form>
        </Box>
    );
}

export default FavoriteMatser;