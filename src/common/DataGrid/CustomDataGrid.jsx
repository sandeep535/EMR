import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Paper, Box, Typography, Tooltip, IconButton, Icon, Chip
} from '@mui/material';
import Moment from 'react-moment';

function CustomDataGrid(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(props.rowsPerPage || 10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (props.paginationChangeEvent) props.paginationChangeEvent(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function getValueFromObj(obj, header) {
    const keys = header.datakey.split(',');
    let finalResult = '';
    for (const keyString of keys) {
      const trimmed = keyString.trim();
      if (!trimmed) { finalResult += ' '; continue; }
      const parts = trimmed.split('.');
      let result = obj;
      for (const part of parts) result = result ? result[part] : '';
      if (header.mappingData && result) {
        finalResult += ' ' + header.mappingData[result];
      } else {
        finalResult += ' ' + (result ?? '');
      }
    }
    return finalResult.trim();
  }

  const rows = props.tableData || [];

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: props.maxHeight || 480 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {props.tableHeaders.map((col, i) => (
                <TableCell key={i} width={col.width}
                  sx={{
                    fontWeight: 700,
                    fontSize: 12,
                    color: '#fff',
                    bgcolor: '#673AB7',
                    borderBottom: '2px solid #512DA8',
                    whiteSpace: 'nowrap',
                    px: 2,
                    py: 1.2,
                    '&:first-of-type': { borderRadius: '8px 0 0 0' },
                    '&:last-of-type': { borderRadius: '0 8px 0 0' },
                  }}>
                  {col.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={props.tableHeaders.length}
                  sx={{ py: 5, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, color: 'text.disabled' }}>
                    <Typography variant="body2">No records found</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : rows.map((row, rowIdx) => (
              <TableRow key={rowIdx}
                hover
                sx={{
                  bgcolor: rowIdx % 2 === 0 ? '#fff' : '#f9fbff',
                  '&:hover': { bgcolor: '#ede7f6' },
                  '&:last-child td': { border: 0 },
                  transition: 'background-color 0.15s',
                }}>
                {props.tableHeaders.map((col, colIdx) => (
                  <TableCell key={colIdx}
                    sx={{ fontSize: 12, px: 2, py: 1, color: '#333', borderBottom: '1px solid #f0f0f0' }}>
                    {col.isActions ? (
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {col.actions.map((action, aIdx) => (
                          <Tooltip key={aIdx} title={action.label || action.icon}>
                            <IconButton size="small"
                              onClick={() => props.triggerEvent && props.triggerEvent(row, action)}
                              sx={{
                                color: action.color || '#1976d2',
                                '&:hover': { bgcolor: '#e3f2fd' },
                                p: 0.5,
                              }}>
                              <Icon sx={{ fontSize: 18 }}>{action.icon}</Icon>
                            </IconButton>
                          </Tooltip>
                        ))}
                      </Box>
                    ) : col.isDateFiled ? (
                      getValueFromObj(row, col) ? (
                        <Moment format={col.dateFormat || 'DD-MMM-YYYY'}>
                          {new Date(getValueFromObj(row, col))}
                        </Moment>
                      ) : '-'
                    ) : col.isChip ? (
                      <Chip
                        label={getValueFromObj(row, col)}
                        size="small"
                        sx={{ fontSize: 11, height: 20, bgcolor: col.chipColor || '#e3f2fd', color: col.chipTextColor || '#1976d2', fontWeight: 600 }}
                      />
                    ) : (
                      <Typography variant="body2" sx={{ fontSize: 12 }}>
                        {getValueFromObj(row, col) || '-'}
                      </Typography>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {props.rowsPerPage && (
        <Box sx={{ borderTop: '1px solid #e0e0e0', bgcolor: '#fafafa' }}>
          <TablePagination
            component="div"
            count={props.totalcount ? Number(props.totalcount) : rows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20, 50]}
            sx={{
              '.MuiTablePagination-toolbar': { minHeight: 40 },
              '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': { fontSize: 12 },
            }}
          />
        </Box>
      )}
    </Paper>
  );
}

export default CustomDataGrid;
