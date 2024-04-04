
import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FormLabel from "@mui/material/FormLabel";

export default function PrintTextFormar(props) {
    function normalStringValue(data, headers) {
        var splitString = headers.split(".");
        if (splitString.length === 1) {
            return data[headers];
        }
        if (splitString.length > 1) {
            var obj = data;
            splitString.map(item => {
                obj = obj[item];
                
            });
            return obj;
        }
    }
    return (
        <>
            <Typography variant="h3" component="h3">{props.title}</Typography>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    {(props && props.headers.map(header => {
                       return ( <Grid item xs={header.width}>
                           <Typography variant="h5" component="h5">{header.label}</Typography>
                           <FormLabel component="legend">
                               {normalStringValue(props.data, header.dataValue)}
                           </FormLabel> 
                        </Grid>)
                    }))}
                </Grid>
            </Box>
        </>
    )
}