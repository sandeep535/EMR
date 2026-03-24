import React, { useEffect, useState } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Moment from "react-moment";
import APIS from "../../Utils/APIS";
import { sendRequest } from "../global/DataManager";

const headers = [
  { key: "billNumber", label: "Bill No." },
  { key: "paymentId", label: "#" },
  { key: "paymentDate", label: "Payment Date", isDate: true },
  { key: "paymentAmount", label: "Amount Paid" },
  { key: "paymentMode", label: "Mode" },
  { key: "transactionNumber", label: "Txn No." },
  { key: "remarks", label: "Remarks" },
];

// Visit context : payments[] prop passed directly (already flattened with billNumber)
// Client context: clientId + selectedBillNumber — fetches all, optionally filters
export default function PaidPayments({ payments, clientId, selectedBillNumber }) {
  const [fetched, setFetched] = useState([]);

  useEffect(() => {
    if (clientId) fetchPayments();
  }, [clientId]);

  async function fetchPayments() {
    const result = await sendRequest({
      method: APIS.BILL_SEARCH.METHOD,
      url: `${APIS.BILL_SEARCH.URL}?clientId=${clientId}`,
    });
    const bills = Array.isArray(result) ? result : [];
    const flat = [];
    bills.forEach(bill => {
      (bill.payments || []).forEach(p => {
        flat.push({ ...p, billNumber: bill.billNumber });
      });
    });
    setFetched(flat);
  }

  const rows = clientId
    ? (selectedBillNumber ? fetched.filter(p => p.billNumber === selectedBillNumber) : fetched)
    : (payments || []);

  const totalPaid = rows.reduce((sum, p) => sum + (p.paymentAmount || 0), 0);

  return (
    <Box>
      {rows.length > 0 && (
        <Box sx={{ px: 2, py: 1, borderBottom: "1px solid #f0f0f0", display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip icon={<CheckCircleIcon />} label={`Total Paid: ₹${totalPaid.toLocaleString()}`} size="small"
            sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 600 }} />
          {clientId && selectedBillNumber && (
            <Chip label={`Bill: ${selectedBillNumber}`} size="small"
              sx={{ bgcolor: "#e3f2fd", color: "#1976d2", fontWeight: 600 }} />
          )}
        </Box>
      )}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#fafafa" }}>
              {headers.map(h => (
                <TableCell key={h.key} sx={{ fontWeight: 600, fontSize: 12, color: "text.secondary", borderBottom: "2px solid #e0e0e0" }}>{h.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headers.length} align="center" sx={{ py: 3, color: "text.disabled", fontSize: 13 }}>
                  No paid payments found
                </TableCell>
              </TableRow>
            ) : rows.map((row, i) => (
              <TableRow key={i} hover sx={{ "&:last-child td": { border: 0 } }}>
                {headers.map(h => (
                  <TableCell key={h.key} sx={{ fontSize: 12 }}>
                    {h.isDate
                      ? <Moment format="DD-MMM-YYYY">{new Date(row[h.key])}</Moment>
                      : h.key === "paymentMode"
                        ? row.paymentMode?.masterdatavalue ?? "-"
                        : row[h.key] ?? "-"}
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
