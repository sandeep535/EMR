import React, { useState, useRef, useEffect } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Icon from '@mui/material/Icon';


const styles ={
    headerCell: {
      // Add your custom styles here
      backgroundColor: '#f0f0f0', // Example background color
      fontWeight: 'bold', // Example font weight
    },
  };
  

 function CustomDataGrid(props) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(props.rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        props.paginationChangeEvent(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    useEffect(() => {

    }, []);

    function getValueFromObj(obj, header) {
        let keyString = header.datakey;
        if (keyString) {
            let spliKey = keyString.split(".");
            if (spliKey.length == 1) {
                if (header.mappingData) {
                    return header.mappingData[obj[keyString]];
                } else {
                    return obj[keyString];
                }

            } else {
                var result = obj;
                for (var i = 0; i < spliKey.length; i++) {
                    result = result[spliKey[i]]
                }
                if (header.mappingData) {
                    return header.mappingData[result];
                } else {
                    return result;
                }

            }
        } else {
            return "";
        }

    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead className={styles.headerCell}>
                        <TableRow>
                            {props.tableHeaders.map((headerColumn) => (
                                <TableCell width={headerColumn.width}>{headerColumn.name}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.tableData.map((row) => (
                            <TableRow>
                                {props.tableHeaders.map((rowHeader) => (
                                    <TableCell component="th" scope="row">
                                        {rowHeader.isActions && rowHeader.actions.map(action => {
                                            return <Icon style={{ color: 'black', cursor: 'pointer' }} onClick={() => {
                                                props.triggerEvent(row, action)
                                            }}>{action.icon}</Icon>
                                        })}
                                        {!rowHeader.isActions && getValueFromObj(row, rowHeader)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        {props.tableData.length == 0 && <TableRow> <TableCell colSpan={6} ><p style={{fontWeight:'normal'}}>No records found</p></TableCell>
                        </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
            {props.rowsPerPage && (
                <TablePagination
                    component="div"
                    count={props.totalcount ? props.totalcount : 100}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}

        </>
    )
}
export default CustomDataGrid;