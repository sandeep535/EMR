import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../global/DataManager';
import Translations from '../../resources/translations';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';

export default function VistStatistics() {
    return (
        <Box sx={{ p: 1 }}>
            <Grid container spacing={1}  >
                <Grid item xs={3} >
                    <Box sx={{ maxWidth: 275 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography align="center" color="text.secondary" gutterBottom variant="h1" component="div">
                                    No of Patients
                                </Typography>
                                <Typography align="center" color="text.secondary" gutterBottom variant="h1" component="div">
                                    300
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
                <Grid>
                    <BarChart
                        xAxis={[
                            {
                                id: 'barCategories',
                                data: ['bar A', 'bar B', 'bar C'],
                                scaleType: 'band',
                            },
                        ]}
                        series={[
                            {
                                data: [2, 5, 30],
                            },
                        ]}
                        width={500}
                        height={250}
                    />
                </Grid>

            </Grid>
        </Box>



    )
}