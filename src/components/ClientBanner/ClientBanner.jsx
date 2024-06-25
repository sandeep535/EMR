import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import styles from './ClientBannerCss';
import userIcon from '../../resources/image-icon.png';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

export default function ClientBanner(props) {
    useEffect(() => {
    }, []);
    const status = props.visitData.status;
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
                <Grid container spacing={1} className='client-banner'>
                    <Grid item xs={1} className='grid-item custom-grid-img' >
                        <PersonAddAltIcon style={{ fontSize: 50 }} />
                        {/* <img alt="User Image" src={userIcon} style={{ height: '65px', width: '90px', margin: '-5px', marginBottom: '-10px' }}></img> */}
                    </Grid>
                    <Grid item xs={11} className='grid-item  custom-grid-client'>
                        <Grid container spacing={1}>
                            <Grid item xs={4} container alignItems="center">
                                <Typography sx={styles.div}> Name:</Typography>
                                <Typography sx={styles.div}><strong>{(props.clientData.firstname + " " + props.clientData.lastname)}</strong></Typography>
                            </Grid>
                            <Grid item xs={4} container alignItems="center">
                                <Typography sx={styles.div}> Age:</Typography>
                                <Typography sx={styles.div}> <strong>{props.clientData.age}</strong></Typography>
                            </Grid>
                            <Grid item xs={4} container alignItems="center">
                                <Typography sx={styles.div}> Gender:</Typography>
                                <Typography sx={styles.div}> <strong>{(props.clientData.gender.lookupvalue)}</strong></Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} >
                            <Grid item xs={12} container alignItems="center">
                                <Typography sx={styles.div}> Visit Reason:</Typography>
                                <Typography sx={styles.div}> <strong>{props.visitData.reason}</strong></Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>



            }
        </>
    );
}
