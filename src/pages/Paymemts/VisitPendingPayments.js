import React, { useEffect, useState, useContext, useRef } from "react";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tooltip, IconButton, Dialog, DialogTitle, DialogContent, Typography, Chip, Paper, Collapse
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Moment from "react-moment";
import { useReactToPrint } from "react-to-print";
import AppContext from "../../components/Context/AppContext";
import APIS from "../../Utils/APIS";
import { sendRequest } from "../global/DataManager";
import AddPayment from "./AddPayment";
import Invoice from "../../components/Invoice/Invoice";
import { FunctionalComponentToPrint } from "../../components/Print/ComponentToPrint";

const pendingHeaders = [
  { key: "expand", label: "" },
  { key: "billNumber", label: "Bill No." },
  { key: "billDate", label: "Bill Date", isDate: true },
  { key: "billAmountBeforeDiscount", label: "Total Amt" },
  { key: "visitDiscountPercentage", label: "Disc %" },
  { key: "visitDiscount", label: "Disc Amt" },
  { key: "billAmount", label: "Net Amount" },
  { key: "paymentAmount", label: "Paid Amount" },
  { key: "action", label: "" },
];

const paidHeaders = [
  { key: "paymentId", label: "#" },
  { key: "paymentDate", label: "Payment Date", isDate: true },
  { key: "paymentAmount", label: "Amount Paid" },
  { key: "paymentMode", label: "Mode" },
  { key: "transactionNumber", label: "Txn No." },
  { key: "remarks", label: "Remarks" },
];

function BillRow({ row, onAddPayment, onPrint }) {
  const [open, setOpen] = useState(false);
  const [payments, setPayments] = useState(null);
  const [loading, setLoading] = useState(false);
  const totalPaid = (payments || []).reduce((s, p) => s + (p.paymentAmount || 0), 0);
  const remaining = (row.billAmount || 0) - (row.paymentAmount || 0);
  const fullyPaid = row.paymentAmount >= row.billAmount;

  async function fetchPayments() {
    setLoading(true);
    const result = await sendRequest({
      method: APIS.BILL_SEARCH.METHOD,
      url: `${APIS.BILL_SEARCH.URL}?billNumber=${row.billNumber}`,
    });
    const bill = Array.isArray(result) ? result[0] : result;
    const fetched = bill?.payments || [];
    setPayments(fetched);
    setLoading(false);
    return { bill, payments: fetched };
  }

  async function handleExpand() {
    const next = !open;
    setOpen(next);
    if (next && payments === null) await fetchPayments();
  }

  async function handlePrint(e) {
    e.stopPropagation();
    let billData, pmts;
    if (payments !== null) {
      pmts = payments;
      billData = row;
    } else {
      const res = await fetchPayments();
      pmts = res.payments;
      billData = res.bill || row;
    }
    onPrint(billData, pmts);
  }

  return (
    <>
      <TableRow hover sx={{ bgcolor: open ? "#f0f7ff" : "inherit", "&:last-child td": { border: 0 } }}>
        <TableCell sx={{ width: 32, p: 0.5 }}>
          <IconButton size="small" onClick={handleExpand}>
            {open ? <KeyboardArrowUpIcon sx={{ fontSize: 16 }} /> : <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontSize: 12 }}>{row.billNumber}</TableCell>
        <TableCell sx={{ fontSize: 12 }}><Moment format="DD-MMM-YYYY">{new Date(row.billDate)}</Moment></TableCell>
        <TableCell sx={{ fontSize: 12 }}>{row.billAmountBeforeDiscount ?? "-"}</TableCell>
        <TableCell sx={{ fontSize: 12 }}>{row.visitDiscountPercentage ?? "-"}</TableCell>
        <TableCell sx={{ fontSize: 12 }}>{row.visitDiscount ?? "-"}</TableCell>
        <TableCell sx={{ fontSize: 12 }}>{row.billAmount ?? "-"}</TableCell>
        <TableCell sx={{ fontSize: 12 }}>
          <Chip label={`₹${row.paymentAmount || 0}`} size="small"
            sx={{ bgcolor: fullyPaid ? "#e8f5e9" : "#fff3e0", color: fullyPaid ? "#2e7d32" : "#e65100", fontWeight: 600, fontSize: 11 }} />
        </TableCell>
        <TableCell sx={{ fontSize: 12 }}>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Tooltip title="Add Payment">
              <span>
                <IconButton size="small" onClick={e => { e.stopPropagation(); onAddPayment(row, () => setPayments(null)); }} disabled={fullyPaid}>
                  <AddCircleOutlineIcon sx={{ fontSize: 16, color: fullyPaid ? "#ccc" : "#1976d2" }} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Print Invoice">
              <IconButton size="small" onClick={handlePrint}>
                <PrintIcon sx={{ fontSize: 16, color: "#757575" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={pendingHeaders.length} sx={{ py: 0, px: 0 }}>
          <Collapse in={open} unmountOnExit>
            <Box sx={{ bgcolor: "#f8fffe", borderTop: "1px solid #e0f2f1", borderBottom: "1px solid #e0f2f1", px: 3, py: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 16, color: "#2e7d32" }} />
                <Typography variant="caption" fontWeight={600} color="#2e7d32">PAID PAYMENTS</Typography>
                {payments !== null && payments.length > 0 && (
                  <>
                    <Chip label={`Total Paid: ₹${totalPaid.toLocaleString()}`} size="small"
                      sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 600, fontSize: 11 }} />
                    <Chip label={`Remaining: ₹${remaining.toLocaleString()}`} size="small"
                      sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600, fontSize: 11 }} />
                  </>
                )}
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f0faf4" }}>
                    {paidHeaders.map(h => (
                      <TableCell key={h.key} sx={{ fontWeight: 600, fontSize: 11, color: "text.secondary", borderBottom: "2px solid #c8e6c9" }}>{h.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={paidHeaders.length} align="center" sx={{ py: 2, fontSize: 12, color: "text.secondary" }}>Loading...</TableCell></TableRow>
                  ) : payments !== null && payments.length === 0 ? (
                    <TableRow><TableCell colSpan={paidHeaders.length} align="center" sx={{ py: 2, fontSize: 12, color: "text.disabled" }}>No payments recorded</TableCell></TableRow>
                  ) : (payments || []).map((p, i) => (
                    <TableRow key={i} sx={{ "&:last-child td": { border: 0 } }}>
                      {paidHeaders.map(h => (
                        <TableCell key={h.key} sx={{ fontSize: 11 }}>
                          {h.isDate ? <Moment format="DD-MMM-YYYY">{new Date(p[h.key])}</Moment>
                            : h.key === "paymentMode" ? p.paymentMode?.masterdatavalue ?? "-"
                            : p[h.key] ?? "-"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function VisitPendingPayments() {
  const [rows, setRows] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [resetPayments, setResetPayments] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [enablePrint, setEnablePrint] = useState(false);
  const appContextValue = useContext(AppContext);
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => setEnablePrint(false),
  });

  useEffect(() => { fetchBills(); }, []);

  async function fetchBills() {
    const visitid = appContextValue.selectedVisitDeatils?.visitid;
    if (!visitid) return;
    const result = await sendRequest({
      method: APIS.GET_GENERATE_BILL.METHOD,
      url: APIS.GET_GENERATE_BILL.URL,
      paramas: [visitid],
    });
    setRows(result || []);
  }

  function triggerPrint(bill, payments) {
    const v = appContextValue.selectedVisitDeatils;
    setInvoiceData({
      patientName: v ? `${v.clientid.firstname} ${v.clientid.lastname}` : "",
      patientId: v?.clientid?.seqid || "",
      phoneNumber: v?.clientid?.contact || "",
      patientAddress: "",
      doctorName: v ? `${v.doctor.firstname} ${v.doctor.lastname}` : "",
      invoiceNumber: bill.billNumber,
      billDate: bill.billDate ? new Date(bill.billDate).toLocaleDateString('en-IN') : "",
      services: bill.services || [],
      billAmountBeforeDiscount: bill.billAmountBeforeDiscount,
      visitDiscount: bill.visitDiscount,
      visitDiscountPercentage: bill.visitDiscountPercentage,
      billAmount: bill.billAmount,
      payments,
    });
    setEnablePrint(true);
    setTimeout(handlePrint, 100);
  }

  const totalPending = rows.reduce((sum, r) => sum + ((r.billAmount || 0) - (r.paymentAmount || 0)), 0);

  return (
    <Box>
      {rows.length > 0 && (
        <Box sx={{ px: 2, py: 1, borderBottom: "1px solid #f0f0f0", display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip label={`${rows.length} bill(s)`} size="small" sx={{ bgcolor: "#e3f2fd", color: "#1976d2", fontWeight: 600 }} />
          <Chip label={`Total Remaining: ₹${totalPending.toLocaleString()}`} size="small"
            sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600 }} />
        </Box>
      )}

      <Box sx={{ px: 2, py: 1.2, bgcolor: "#fff8f0", borderBottom: "1px solid #ffe0b2", display: "flex", alignItems: "center", gap: 1 }}>
        <HourglassEmptyIcon sx={{ fontSize: 18, color: "#e65100" }} />
        <Typography variant="subtitle2" fontWeight={600} color="#e65100">BILLS — expand to view payments, click print for invoice</Typography>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#fafafa" }}>
              {pendingHeaders.map(h => (
                <TableCell key={h.key} sx={{ fontWeight: 600, fontSize: 12, color: "text.secondary", borderBottom: "2px solid #e0e0e0" }}>{h.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={pendingHeaders.length} align="center" sx={{ py: 3, color: "text.disabled", fontSize: 13 }}>No bills found</TableCell>
              </TableRow>
            ) : rows.map((row, i) => (
              <BillRow
                key={i}
                row={row}
                onAddPayment={(bill, reset) => { setSelectedBill(bill); setResetPayments(() => reset); }}
                onPrint={triggerPrint}
              />
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
          <AddPayment
            billId={selectedBill?.billId}
            billAmount={selectedBill?.billAmount}
            paidAmount={selectedBill?.paymentAmount}
            onSuccess={() => { setSelectedBill(null); if (resetPayments) resetPayments(); fetchBills(); }}
          />
        </DialogContent>
      </Dialog>

      {/* Print */}
      {enablePrint && invoiceData && (
        <FunctionalComponentToPrint ref={componentRef}>
          <Invoice invoiceData={invoiceData} />
        </FunctionalComponentToPrint>
      )}
    </Box>
  );
}
