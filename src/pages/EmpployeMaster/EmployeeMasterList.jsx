import React, { useEffect, useState, useContext } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { sendRequest } from '../global/DataManager';
import APIS from '../../Utils/APIS';

const columns =[{
     id: 'name', label: 'Name'
},{
    id: 'gnder', label: 'Gender'
},{
    id: 'Role', label: 'Role'
}]
export default function EmployeeMasterList() {
    const [employeeList, setEmployeeList] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
    const handleChangePage = (newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    useEffect(() => {
        getEmpData();
    }, []);

    async function getEmpData(){
        var payLoad = {
            method: APIS.GET_EMP_ALL_DATA.METHOD,
            url: APIS.GET_EMP_ALL_DATA.URL,
            paramas: [0,20]
        }
        let result = await sendRequest(payLoad);
        if (result && result.size != 0) {
           setEmployeeList(result);
        }
    }
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {employeeList && employeeList.map((emp, index) => (
                      <TableRow key={emp.id}>
                        <TableCell>{(emp) ? emp.firstname +" "+ emp.lastname :''}</TableCell>
                        <TableCell>{(emp.gender) ? emp.gender.lookupvalue :''}</TableCell>
                        <TableCell>{(emp.role) ? emp.role.masterdatavalue :''}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow key={"12111"}>
                      <TableCell>{
                      }</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={employeeList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}