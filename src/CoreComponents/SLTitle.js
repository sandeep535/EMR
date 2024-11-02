import React from 'react';
import { Typography, Grid, Paper } from '@mui/material';

const SLTitle = ({ variant, title, justifyContent }) => {
    return (
        <Grid container >
            <Grid item xs={12} >
                <Paper style={{ padding: '5px', textAlign: justifyContent }}><Typography variant={variant}>{title}</Typography></Paper>
            </Grid>
        </Grid>
    );
};

export default SLTitle;
