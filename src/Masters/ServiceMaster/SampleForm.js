import React, { useState, Suspense, useEffect } from 'react';

import * as Babel from '@babel/standalone';
const SampleForm = (props) => {
 
  const codeString = `
  import React, { useState, useEffect } from 'react';
  import { Box, Paper, Typography, Button, Grid } from "@mui/material";
  import { useForm } from "react-hook-form";
  import { sendRequest } from "@src/pages/global/DataManager";
  import { yupResolver } from "@hookform/resolvers/yup";
  import Icon from '@mui/material/Icon';
  import CustomDataGrid from '@src/CoreComponents/CustomDataGrid';

  const SampleForm = (props) => {
    const [TablestateValue, setTablestateValue] = useState();
    const [tableState, setTableState] = useState();
    const [PageSize, setPageSize] = useState();
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
      defaultValues: {},
      resolver: yupResolver({}),
    });

    useEffect(() => {
      getTablestateValuemethodlist();
      return () => console.log("Cleanup..");
    }, []);

    const getTablestateValuemethodlist = async () => {
      var payLoad = {
        method: 'GET',
        url: 'coomon/gettable',
        paramas: []
      };
      let result = await sendRequest(payLoad);
      if (result) {
        setTablestateValue(result);
      }
    };

    const sampleFormhandleSubmit = (data) => {};

    return (
      <form onSubmit={handleSubmit(sampleFormhandleSubmit)}>
        <Grid xs={12} container spacing={1}>
          <Grid item xs={12} spacing={1}>
            <CustomDataGrid
              tableHeaders={[
                { "name": "header1", "datakey": "header", "width": "50%", "mappingData": "", "actions": [] },
                { "name": "header2", "datakey": "header2", "width": "30%", "mappingData": "", "actions": [] }
              ]}
              tableData={TablestateValue}
              totalcount={tableState}
              rowsPerPage={PageSize}
              paginationChangeEvent={() => {}}
              triggerEvent={() => {}}
            />
          </Grid>
        </Grid>
      </form>
    );
  };

  export default SampleForm;
`;
  const transformedCode = Babel.transform(codeString, {
    presets: ['react', 'es2015']
  }).code;

  const Component = eval(transformedCode);
  return <Component />;
};

export default SampleForm;
