import React, { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Icon from '@mui/material/Icon';
import Moment from 'react-moment';

const styles ={
    headerCell: {
      backgroundColor: '#f0f0f0', 
      fontWeight: 'bold', 
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
        let isMultipleKeys = header.datakey.split(",");
        let finalResult ="";
        for(var k=0;k<isMultipleKeys.length;k++){
            keyString =isMultipleKeys[k];
            if (keyString) {
                let spliKey = keyString.split(".");
                if (spliKey.length == 1) {
                    if (header.mappingData) {
                        finalResult = finalResult +" "+header.mappingData[obj[keyString]];
                    } else {
                        finalResult = finalResult +" "+obj[keyString];
                    }
    
                } else {
                    var result = obj;
                    for (var i = 0; i < spliKey.length; i++) {
                        result = (result)?result[spliKey[i]]:"";
                    }
                    if (header.mappingData && result) {
                        finalResult = finalResult +" "+header.mappingData[result];
                    } else {
                        finalResult = finalResult +" "+result;
                    }
                }
                
            } else {
                finalResult =finalResult+ " ";
            }
        }
        return finalResult.trim();
       

    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead className={styles.headerCell}>
                        <TableRow>
                            {props.tableHeaders.map((headerColumn,index) => (
                                <TableCell key={index.toString()} width={headerColumn.width}>{headerColumn.name}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.tableData.map((row,index) => (
                            <TableRow key={index.toString()}>
                                {props.tableHeaders.map((rowHeader,index) => (
                                    <TableCell  key={index.toString()} component="th" scope="row">
                                        {rowHeader.isActions && rowHeader.actions.map((action,index) => {
                                            return <Icon key ={index.toString()} style={{ color: 'black', cursor: 'pointer' }} onClick={() => {
                                                props.triggerEvent(row, action)
                                            }}>{action.icon}</Icon>
                                        })}
                                        {rowHeader.isDateFiled && <Moment format="DD-MMM-YYYY">
                                                {new Date(getValueFromObj(row, rowHeader))}
                                            </Moment>}
                                        {!rowHeader.isActions && !rowHeader.isDateFiled && getValueFromObj(row, rowHeader)}
                                        
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