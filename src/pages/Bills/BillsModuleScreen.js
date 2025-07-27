import React, { useEffect, useState, useContext, useRef } from 'react';
import { Box, Grid } from '@mui/material'
import ClientSearchComponent from '../../components/ClientSearch/ClientSearchComponent';
import Translations from '../../resources/translations';

export default function BillsModuleScreen(props) {

    function populateClientDatatoForm(clientData) {
        
      }

    return (
        <React.Fragment>
            <Box m="3px">
                      <Grid xs={6} container>
                        <ClientSearchComponent
                          label={Translations.visitCreation.searchCleint}
                          selectedPatientDetails={(data) => {
                            populateClientDatatoForm(data);
                          }}
                          onInputChangeEvent={(newInputValue) => {
                           //setValue("contact", newInputValue);
                          }}
                        />
            
                      </Grid>
                    </Box>
        </React.Fragment>
           
        )
}