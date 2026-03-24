import React, { useEffect, useState, useContext } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Tooltip, IconButton } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Moment from "react-moment";
import APIS from "../../Utils/APIS";
import { sendRequest } from "../global/DataManager";
import { useReactToPrint } from "react-to-print";
import { FunctionalComponentToPrint } from "../../components/Print/ComponentToPrint";
import Invoice from "../../components/Invoice/Invoice";
import AppContext from "../../components/Context/AppContext";

const headers = [
  { key: "billNumber", label: "Bill No." },
  { key: "billDate", label: "Bill Date", isDate: true },
  { key: "billAmountBeforeDiscount", label: "Total Amt" },
  { key: "visitDiscountPercentage", label: "Disc %" },
  { key: "visitDiscount", label: "Disc Amt" },
  { key: "billAmount", label: "Net Amount" },
  { key: "paymentAmount", label: "Paid Amt" },
  { key: "action", label: "" },
];

export default function GeneratedBillsList({ clientId }) {
  const [rows, setRows] = useState([]);
  const [enablePrint, setEnablePrint] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});
  const appContextValue = useContext(AppContext);
  const componentRef = React.useRef();

  useEffect(() => { if (clientId) fetchBills(); }, [clientId]);

  async function fetchBills() {
    const result = await sendRequest({
      method: APIS.BILL_SEARCH.METHOD,
      url: `${APIS.BILL_SEARCH.URL}?clientId=${clientId}`,
    });
    setRows(Array.isArray(result) ? result : []);
  }

  const handlePrint = useReactToPrint({ content: () => componentRef.current, onAfterPrint: () => setEnablePrint(false) });

  function printInvoice(row) {
    const v = appContextValue.selectedVisitDeatils;
    setInvoiceData({
      patientName: v ? `${v.clientid.firstname} ${v.clientid.lastname}` : "",
      patientId: v?.clientid?.seqid || clientId,
      date: new Date().toLocaleDateString(),
      phoneNumber: v?.clientid?.contact || "",
      doctorName: v ? `${v.doctor.firstname} ${v.doctor.lastname}` : "",
      invoiceNumber: row.billNumber,
      patientAddress: "",
      services: row.services || [],
      totalAmount: row.billAmount,
    });
    setEnablePrint(true);
    setTimeout(handlePrint, 100);
  }

  const totalBilled = rows.reduce((sum, r) => sum + (r.billAmount || 0), 0);
  const totalPaid = rows.reduce((sum, r) => sum + (r.paymentAmount || 0), 0);

  return (
    <Box>
      {rows.length > 0 && (
        <Box sx={{ px: 2, py: 1, borderBottom: "1px solid #f0f0f0", display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip icon={<ReceiptLongIcon />} label={`${rows.length} bill(s)`} size="small" sx={{ bgcolor: "#e3f2fd", color: "#1976d2", fontWeight: 600 }} />
          <Chip label={`Total Billed: ₹${totalBilled.toLocaleString()}`} size="small" sx={{ bgcolor: "#f3e5f5", color: "#6a1b9a", fontWeight: 600 }} />
          <Chip label={`Total Paid: ₹${totalPaid.toLocaleString()}`} size="small" sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 600 }} />
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
                <TableCell colSpan={headers.length} align="center" sx={{ py: 3, color: "text.disabled", fontSize: 13 }}>No generated bills</TableCell>
              </TableRow>
            ) : rows.map((row, i) => (
              <TableRow key={i} hover sx={{ "&:last-child td": { border: 0 } }}>
                {headers.map(h => (
                  <TableCell key={h.key} sx={{ fontSize: 12 }}>
                    {h.isDate ? <Moment format="DD-MMM-YYYY">{new Date(row[h.key])}</Moment>
                      : h.key === "action" ? (
                        <Tooltip title="Print Invoice">
                          <IconButton size="small" onClick={() => printInvoice(row)}>
                            <PrintIcon sx={{ fontSize: 16, color: "#1976d2" }} />
                          </IconButton>
                        </Tooltip>
                      ) : row[h.key] ?? "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {enablePrint && (
        <FunctionalComponentToPrint ref={componentRef}>
          <Box sx={{ width: "100%" }}><Invoice invoiceData={invoiceData} /></Box>
        </FunctionalComponentToPrint>
      )}
    </Box>
  );
}
