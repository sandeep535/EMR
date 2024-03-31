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
import userIcon from '../../resources/image-icon.png';

export default function ClientBanner(props) {
    useEffect(() => {
        // Assuming status is received through props
    
    }, []);

    const status = props.visitData.status;
    // Function to determine the border color based on status
    const getBorderColor = () => { 
        switch (status) {
            case 1:
                return '#3498db'; // Change this to your desired color
            case 2:
                return '#f0776c';
            case 3:
                return '#1abc9c';  // Change this to your desired color
            default:
                return '#ffd071'; // Default border color
        }
    }
    return (
        <>
            {props.clientData &&
                <Grid container spacing={2} className='client-banner'>
                    <Grid item xs={1} className='grid-item' style={{border:`5px solid ${getBorderColor()}`}}>
                    <img src={userIcon} style={{height:'65px',width:'90px',margin:'-5px',marginBottom:'-10px'}}></img>
                    </Grid>
                    <Grid item xs={11} className='grid-item' style={{border:`5px solid ${getBorderColor()}`}}>
                        <Grid container spacing={2} style={{ marginTop: '-10px' ,marginLeft:'0px'}}>
                            <Grid item xs={4} container alignItems="center">
                                <Typography sx={styles.div} variant="h6" style={{ marginRight: '1rem' }}> Name:</Typography>
                                <Typography sx={styles.div} variant="h6" component="div"><strong>{(props.clientData.firstname + " " + props.clientData.lastname).toUpperCase()}</strong></Typography>
                            </Grid>
                            <Grid item xs={4} container alignItems="center">
                                <Typography sx={styles.div} variant="h6"  style={{ marginRight: '1rem' }}> Age:</Typography>
                                <Typography sx={styles.div} variant="h6" component="div"> <strong>{props.clientData.age}</strong></Typography>
                            </Grid>
                            <Grid item xs={4} container alignItems="center">
                                <Typography sx={styles.div} variant="h6"  style={{ marginRight: '1rem' }}> Gender:</Typography>
                                <Typography sx={styles.div} variant="h6" component="div"> <strong>{(props.clientData.gender.lookupvalue).toUpperCase()}</strong></Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} >
                            <Grid item xs={12} container alignItems="center"  style={{ marginTop: '5px',marginLeft:'15px' }}>
                                <Typography sx={styles.div} variant="h6"  style={{ marginRight: '1rem' }}> Visit Reason:</Typography>
                                <Typography sx={styles.div} variant="h6"  component="div"> <strong>{props.visitData.reason}</strong></Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    
                </Grid>
               
            }
        </>
    );
}
