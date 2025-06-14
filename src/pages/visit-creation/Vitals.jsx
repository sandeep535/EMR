import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import { useForm } from 'react';
import { CommonCard } from '../../components/CommonCard';
import { SLTextField } from '../../components/SLTextField';
import { Translations } from '../../translations/Translations';

const Vitals = () => {
  const { control } = useForm();
  const [vitals, setVitals] = useState([]);

  const handleformAddSubmit = (handleSubmit) => (data) => {
    // Handle form submission
  };

  const vitalshandleSubmit = (data) => {
    // Handle vitals submission
  };

  return (
    <CommonCard title={Translations.visitCreation.VITALS_TITLE}>
      <Box m="0px">
        <form onSubmit={handleformAddSubmit(vitalshandleSubmit)} >
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <SLTextField
                      name="height"
                      label={Translations.visitCreation.Height}
                      control={control}
                      placeholder={Translations.visitCreation.Height}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <SLTextField
                      name="weight"
                      label={Translations.visitCreation.Weight}
                      control={control}
                      placeholder={Translations.visitCreation.Weight}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <SLTextField
                      name="bmi"
                      label={Translations.visitCreation.BMI}
                      control={control}
                      placeholder={Translations.visitCreation.BMI}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <SLTextField
                      name="temprature"
                      label={Translations.visitCreation.Temprature}
                      control={control}
                      placeholder={Translations.visitCreation.Temprature}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <SLTextField
                      name="pulse"
                      label={Translations.visitCreation.Pulse}
                      control={control}
                      placeholder={Translations.visitCreation.Pulse}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <SLTextField
                      name="respiration"
                      label={Translations.visitCreation.Respiration}
                      control={control}
                      placeholder={Translations.visitCreation.Respiration}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <SLTextField
                      name="spo2"
                      label={Translations.visitCreation.SPO2}
                      control={control}
                      placeholder={Translations.visitCreation.SPO2}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <SLTextField
                      name="systolic"
                      label={Translations.visitCreation.Systolic}
                      control={control}
                      placeholder={Translations.visitCreation.Systolic}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <SLTextField
                      name="diastolic"
                      label={Translations.visitCreation.Diastolic}
                      control={control}
                      placeholder={Translations.visitCreation.Diastolic}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <SLTextField
                      name="map"
                      label={Translations.visitCreation.MAP}
                      control={control}
                      placeholder={Translations.visitCreation.MAP}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <SLTextField
                      name="pain"
                      label={Translations.visitCreation.Pain}
                      control={control}
                      placeholder={Translations.visitCreation.Pain}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <SLTextField
                      name="headcircumference"
                      label={Translations.visitCreation.HeadCircumference}
                      control={control}
                      placeholder={Translations.visitCreation.HeadCircumference}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Box>
    </CommonCard>
  );
};

export default Vitals; 