import React, { useState, useEffect } from 'react';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../global/DataManager';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns =[{
    id: 'name', label: 'Service Name'
},{
   id: 'price', label: 'Price'
},{
   id: 'Status', label: 'Status'
}]
export default function ServiceMasterList() {
    const [serviceMasterList, setServiceMasterList] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    useEffect(() => {
        getAllMasterData();
    }, []);

    const handleChangePage = (newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };


    async function getAllMasterData(){
        var payLoad = {
            method: APIS.GET_ALL_SERVICE_MASTER_DATA.METHOD,
            url: APIS.GET_ALL_SERVICE_MASTER_DATA.URL,
            paramas: [0,10]
          }
          let result = await sendRequest(payLoad);
          if (result) {
            setServiceMasterList(result)
          }
    }
   
    return (
        <>
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
                    {serviceMasterList && serviceMasterList.map((service, index) => (
                      <TableRow key={service.serviceid}>
                        <TableCell>{(service) ? service.servicename :''}</TableCell>
                        <TableCell>{(service.price) ? service.price :''}</TableCell>
                        <TableCell>{(service.active && service.active ==1) ?"Active" :'In-active'}</TableCell>
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
                count={serviceMasterList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
        </>
    )
}

