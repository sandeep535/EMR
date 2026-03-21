import React, { useEffect, useState, useContext } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Moment from "react-moment";

const headers = [
  { key: "billNumber", label: "Bill No." },
  { key: "billDate", label: "Bill Date", isDate: true },
  { key: "paymentDate", label: "Payment Date", isDate: true },
  { key: "paymentAmount", label: "Amount Paid" },
  { key: "paymentMethod", label: "Method" },
];

export default function PaidPayments({ clientId }) {
  const [rows, setRows] = useState([]);

  // TODO: fetch paid payments by clientId when API is available

  const totalPaid = rows.reduce((sum, r) => sum + (r.paymentAmount || 0), 0);

  return (
    <Box>
      {rows.length > 0 && (
        <Box sx={{ px: 2, py: 1, borderBottom: "1px solid #f0f0f0" }}>
          <Chip icon={<CheckCircleIcon />} label={`Total Paid: ₹${totalPaid.toLocaleString()}`} size="small"
            sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 600 }} />
        </Box>
      )}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#fafafa" }}>
              {headers.map((h) => (
                <TableCell key={h.key} sx={{ fontWeight: 600, fontSize: 12, color: "text.secondary", borderBottom: "2px solid #e0e0e0" }}>{h.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headers.length} align="center" sx={{ py: 3, color: "text.disabled", fontSize: 13 }}>No paid payments found</TableCell>
              </TableRow>
            ) : rows.map((row, i) => (
              <TableRow key={i} hover sx={{ "&:last-child td": { border: 0 } }}>
                {headers.map((h) => (
                  <TableCell key={h.key} sx={{ fontSize: 12 }}>
                    {h.isDate ? <Moment format="DD-MMM-YYYY">{new Date(row[h.key])}</Moment> : row[h.key] ?? "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
