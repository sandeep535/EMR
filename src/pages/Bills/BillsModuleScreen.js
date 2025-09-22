import React, { useEffect, useState, useContext, useRef } from "react";
import { Box, Grid } from "@mui/material";
import ClientSearchComponent from "../../components/ClientSearch/ClientSearchComponent";
import Translations from "../../resources/translations";
import BillsTabs from "./BillsTabs";
import VisitBillsList from "./VisitBillsList";

export default function BillsModuleScreen(props) {
  const [clientId, setClientId] = useState(null);
  function populateClientDatatoForm(clientData) {}

  return (
    <React.Fragment>
      <Box m="3px">
        <Grid xs={6} container>
          <ClientSearchComponent
            label={Translations.visitCreation.searchCleint}
            selectedPatientDetails={(data) => {
              console.log("selected client data in bills", data);
              setClientId(data.seqid);
              populateClientDatatoForm(data);
            }}
            onInputChangeEvent={(newInputValue) => {
              //setValue("contact", newInputValue);
            }}
          />
        </Grid>
      </Box>
      {clientId && <VisitBillsList clientId={clientId} />}
    </React.Fragment>
  );
}
