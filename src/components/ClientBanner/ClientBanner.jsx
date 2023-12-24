import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Box } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Translations from '../../resources/translations';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Typography from '@mui/material/Typography';
import styles from './ClientBannerCss';

export default function ClientBanner(props) {
    debugger
    useEffect(() => {

    }, []);


    return (
        <>
            {props.clientData &&
                <Box sx={styles.wrapper}>
                    <Box sx={styles.subWraper}>
                        <Box sx={styles.subWraper}>
                            <Typography sx={styles.div} variant="h6"> Name:</Typography>
                            <Typography sx={styles.div} variant="h6"> <strong>{props.clientData.firstname + " " + props.clientData.lastname}</strong></Typography>
                        </Box>
                        <Box sx={styles.subWraper}>
                            <Typography sx={styles.div} variant="h6"> Age:</Typography>
                            <Typography sx={styles.div} variant="h6"> <strong>{props.clientData.age}</strong></Typography>
                        </Box>
                        <Box sx={styles.subWraper}>
                            <Typography sx={styles.div} variant="h6"> Gender:</Typography>
                            <Typography sx={styles.div} variant="h6"> <strong>{props.clientData.gender.lookupvalue}</strong></Typography>
                        </Box>
                    </Box>
                    <Box sx={styles.subWraper}>
                        <Box sx={styles.subWraper}>
                            <Typography sx={styles.div} variant="h6"> Visit Reason:</Typography>
                            <Typography sx={styles.div} variant="h6"> <strong>{props.visitData.reason}</strong></Typography>
                        </Box>
                    </Box>

                </Box>
            }
        </>
    );
}
