import React, { useEffect, useState, useContext } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, IconButton, Dialog, DialogTitle, DialogContent, Typography, Chip } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import Moment from "react-moment";
import AppContext from "../../components/Context/AppContext";
import APIS from "../../Utils/APIS";
import { sendRequest } from "../global/DataManager";
import AddPayment from "./AddPayment";

const headers = [
  { key: "billNumber", label: "Bill No." },
  { key: "billDate", label: "Bill Date", isDate: true },
  { key: "billAmountBeforeDiscount", label: "Total Amt" },
  { key: "visitDiscountPercentage", label: "Disc %" },
  { key: "visitDiscount", label: "Disc Amt" },
  { key: "billAmount", label: "Net Amount" },
  { key: "action", label: "" },
];

export default function PendingPayments({ clientId }) {
  const [rows, setRows] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const appContextValue = useContext(AppContext);

  useEffect(() => { fetchBills(); }, []);

  async function fetchBills() {
    const visitid = appContextValue.selectedVisitDeatils?.visitid;
    if (!visitid) return;
    const result = await sendRequest({ method: APIS.GET_GENERATE_BILL.METHOD, url: APIS.GET_GENERATE_BILL.URL, paramas: [visitid] });
    setRows(result || []);
  }

  const totalPending = rows.reduce((sum, r) => sum + (r.billAmount || 0), 0);

  return (
    <Box>
      {rows.length > 0 && (
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #f0f0f0' }}>
          <Chip label={`Total Pending: ₹${totalPending.toLocaleString()}`} size="small"
            sx={{ bgcolor: '#fff3e0', color: '#e65100', fontWeight: 600 }} />
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
                <TableCell colSpan={headers.length} align="center" sx={{ py: 3, color: "text.disabled", fontSize: 13 }}>No pending payments</TableCell>
              </TableRow>
            ) : rows.map((row, i) => (
              <TableRow key={i} hover sx={{ "&:last-child td": { border: 0 } }}>
                {headers.map((h) => (
                  <TableCell key={h.key} sx={{ fontSize: 12 }}>
                    {h.isDate ? <Moment format="DD-MMM-YYYY">{new Date(row[h.key])}</Moment>
                      : h.key === "action" ? (
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Tooltip title="Add Payment">
                            <IconButton size="small" onClick={() => setSelectedBill(row)}>
                              <AddCircleOutlineIcon sx={{ fontSize: 16, color: "#1976d2" }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Print">
                            <IconButton size="small">
                              <PrintIcon sx={{ fontSize: 16, color: "#757575" }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : row[h.key] ?? "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Payment Dialog */}
      <Dialog open={!!selectedBill} onClose={() => setSelectedBill(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.5, px: 2, borderBottom: "1px solid #e0e0e0" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AddCircleOutlineIcon sx={{ color: "#1976d2" }} />
            <Typography fontWeight={600}>Add Payment</Typography>
            {selectedBill && <Chip label={`Bill #${selectedBill.billNumber}`} size="small" sx={{ bgcolor: "#e3f2fd", color: "#1976d2" }} />}
          </Box>
          <IconButton size="small" onClick={() => setSelectedBill(null)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <AddPayment />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
