import React, { useEffect, useState, useContext } from "react";
import { Box, Paper, Typography, Chip, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, IconButton } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PrintIcon from "@mui/icons-material/Print";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Moment from "react-moment";
import { generateBill } from "../../Utils/UtilService";
import AppContext from "../../components/Context/AppContext";
import Translations from "../../resources/translations";
import APIS from "../../Utils/APIS";
import { sendRequest } from "../global/DataManager";
import Invoice from "../../components/Invoice/Invoice";
import { useReactToPrint } from "react-to-print";
import { FunctionalComponentToPrint } from "../../components/Print/ComponentToPrint";
import SLButton from "../../CoreComponents/SLButton";

const SectionHeader = ({ icon, title, action }) => (
  <Box sx={{ px: 2, py: 1.2, bgcolor: "#f5f7fa", borderBottom: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {icon}
      <Typography variant="subtitle2" fontWeight={600} color="text.secondary">{title}</Typography>
    </Box>
    {action}
  </Box>
);

const StyledTable = ({ headers, rows, onAction }) => (
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
            <TableCell colSpan={headers.length} align="center" sx={{ py: 3, color: "text.disabled", fontSize: 13 }}>No records found</TableCell>
          </TableRow>
        ) : rows.map((row, i) => (
          <TableRow key={i} hover sx={{ "&:last-child td": { border: 0 } }}>
            {headers.map((h) => (
              <TableCell key={h.key} sx={{ fontSize: 12 }}>
                {h.isDate ? <Moment format="DD-MMM-YYYY">{new Date(row[h.key])}</Moment>
                  : h.isAction ? (
                    <Tooltip title="Print Invoice">
                      <IconButton size="small" onClick={() => onAction(row)}>
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
);

const generatedHeaders = [
  { key: "billNumber", label: "Bill No." },
  { key: "billDate", label: "Bill Date", isDate: true },
  { key: "billAmountBeforeDiscount", label: "Total Amount" },
  { key: "visitDiscountPercentage", label: "Discount %" },
  { key: "visitDiscount", label: "Discount Amt" },
  { key: "billAmount", label: "Net Amount" },
  { key: "action", label: "", isAction: true },
];

const pendingHeaders = [
  { key: "serviceid.servicename", label: "Service" },
  { key: "serviceprice", label: "Price" },
  { key: "quantity", label: "Qty" },
  { key: "servicediscount", label: "Discount" },
];

export default function BillsList() {
  const [pendingBills, setPendingBills] = useState([]);
  const [generatedBills, setGeneratedBills] = useState([]);
  const [enablePrint, setEnablePrint] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});
  const appContextValue = useContext(AppContext);
  const componentRef = React.useRef();

  useEffect(() => { getPendingBills(); getGeneratedBills(); }, []);

  function getPendingBills() {
    const copy = { ...appContextValue.selectedVisitDeatils };
    setPendingBills((copy.services || []).filter((s) => !s.billId));
  }

  async function getGeneratedBills() {
    const visitid = appContextValue.selectedVisitDeatils?.visitid;
    if (!visitid) return;
    const result = await sendRequest({ method: APIS.GET_GENERATE_BILL.METHOD, url: APIS.GET_GENERATE_BILL.URL, paramas: [visitid] });
    setGeneratedBills(result || []);
  }

  async function clickGenerateBill() {
    const result = await generateBill(
      appContextValue.selectedVisitDeatils.visitid,
      appContextValue.selectedVisitDeatils.clientid.seqid
    );
    if (result.status === "succuss") {
      let copy = { ...appContextValue.selectedVisitDeatils };
      copy.services.forEach((s) => { if (!s.billId) s.billId = result.result; });
      appContextValue.setSelectedVisitDeatils(copy);
      getPendingBills();
      getGeneratedBills();
    }
  }

  const handlePrint = useReactToPrint({ content: () => componentRef.current, onAfterPrint: () => setEnablePrint(false) });

  function printInvoice(row) {
    const v = appContextValue.selectedVisitDeatils;
    setInvoiceData({
      patientName: `${v.clientid.firstname} ${v.clientid.lastname}`,
      patientId: v.clientid.seqid,
      date: new Date().toLocaleDateString(),
      phoneNumber: v.clientid.contact,
      doctorName: `${v.doctor.firstname} ${v.doctor.lastname}`,
      invoiceNumber: row.billNumber,
      patientAddress: "",
      services: row.services,
      totalAmount: row.billAmount,
    });
    setEnablePrint(true);
    setTimeout(handlePrint, 100);
  }

  const totalBilled = generatedBills.reduce((sum, b) => sum + (b.billAmount || 0), 0);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1.5 }}>

      {/* Summary chips */}
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
        <Chip icon={<ReceiptLongIcon />} label={`Generated Bills: ${generatedBills.length}`} size="small" sx={{ bgcolor: "#e3f2fd", color: "#1976d2", fontWeight: 600 }} />
        <Chip icon={<PendingActionsIcon />} label={`Pending Services: ${pendingBills.length}`} size="small" sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600 }} />
        <Chip icon={<CreditCardIcon />} label={`Total Billed: ₹${totalBilled.toLocaleString()}`} size="small" sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 600 }} />
      </Box>

      {/* Generated Bills */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <SectionHeader
          icon={<ReceiptLongIcon sx={{ fontSize: 18, color: "#1976d2" }} />}
          title="GENERATED BILLS"
        />
        <StyledTable headers={generatedHeaders} rows={generatedBills} onAction={printInvoice} />
      </Paper>

      {/* Pending Services */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <SectionHeader
          icon={<PendingActionsIcon sx={{ fontSize: 18, color: "#e65100" }} />}
          title="PENDING SERVICES"
          action={
            <SLButton variant="contained" size="small" onClick={clickGenerateBill}
              sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}>
              Generate Bill
            </SLButton>
          }
        />
        <StyledTable headers={pendingHeaders} rows={pendingBills.map(s => ({
          "serviceid.servicename": s.serviceid?.servicename,
          serviceprice: s.serviceprice,
          quantity: s.quantity,
          servicediscount: s.servicediscount,
        }))} onAction={() => {}} />
      </Paper>

      {enablePrint && (
        <FunctionalComponentToPrint ref={componentRef}>
          <Box sx={{ width: "100%" }}><Invoice invoiceData={invoiceData} /></Box>
        </FunctionalComponentToPrint>
      )}
    </Box>
  );
}
