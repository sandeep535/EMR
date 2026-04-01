import React, { useState, useCallback } from "react";
import { Box, Grid } from "@mui/material";
import ClientSearchComponent from "../../components/ClientSearch/ClientSearchComponent";
import Translations from "../../resources/translations";
import BillsTabs from "./BillsTabs";

export default function BillsModuleScreen() {
  const [clientId, setClientId] = useState(null);

  const handlePatientDetails = useCallback((data) => setClientId(data.seqid), []);
  const handleInputChange = useCallback(() => {}, []);

  return (
    <React.Fragment>
      <Box m="3px">
        <Grid xs={6} container>
          <ClientSearchComponent
            label={Translations.visitCreation.searchCleint}
            selectedPatientDetails={handlePatientDetails}
            onInputChangeEvent={handleInputChange}
          />
        </Grid>
      </Box>
      {clientId && <BillsTabs clientId={clientId} />}
    </React.Fragment>
  );
}
