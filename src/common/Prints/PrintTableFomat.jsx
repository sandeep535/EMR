
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


export default function PrintTableFomat(props) {
    useEffect(() => {

    }, []);
    function stringFormaton(data, headers) {
        let stringValue = "";
        headers.map(item => {
            stringValue = stringValue + "" + data[item] + "-"
        })
        return stringValue;
    }
    function normalStringValue(data, headers) {
        var splitString = headers.split(".");
        if (splitString.length == 1) {
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
            <Typography variant="h5" component="h3">{props.title}</Typography>
            <Box sx={{ flexGrow: 1 }}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {(props && props.headers.map(header => {
                                    return (
                                        <TableCell >{header.label}</TableCell>
                                    )
                                }))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(props && props.data.map(data => {
                                return (
                                    <TableRow key={Math.random()}>
                                        {(props && props.headers.map(header => {
                                            return (
                                                <>
                                                    {(header.isSingleValue) && <TableCell>{normalStringValue(data, header.dataValue)}</TableCell>}
                                                    {(!header.isSingleValue) && <TableCell>{stringFormaton(data, header.dataValue)}</TableCell>}
                                                </>
                                            )
                                        }))}
                                    </TableRow>
                                )
                            }))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}
