import React, { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PaymentsIcon from "@mui/icons-material/Payments";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import SLTabs from "../../CoreComponents/SLTabs";
import PendingBillsList from "./PendingBillsList";
import GeneratedBillsList from "./GeneratedBillsList";
import PendingPayments from "../Paymemts/PendingPayments";
import PaidPayments from "../Paymemts/PaidPayments";

const tabLabels = [
  <Box key="pending" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    <PendingActionsIcon sx={{ fontSize: 16 }} /> Pending Bills
  </Box>,
  <Box key="generated" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    <ReceiptLongIcon sx={{ fontSize: 16 }} /> Generated Bills
  </Box>,
  <Box key="ppayments" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    <HourglassEmptyIcon sx={{ fontSize: 16 }} /> Pending Payments
  </Box>,
  <Box key="paid" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    <CheckCircleIcon sx={{ fontSize: 16 }} /> Paid Payments
  </Box>,
];

const BillsTabs = ({ clientId }) => {
  const [selectedBill, setSelectedBill] = useState(null);

  const tabContents = [
    <PendingBillsList key="pending" clientId={clientId} />,
    <GeneratedBillsList key="generated" clientId={clientId} />,
    <PendingPayments key="ppayments" clientId={clientId} onBillSelect={setSelectedBill} />,
    <PaidPayments key="paid" clientId={clientId} selectedBillNumber={selectedBill?.billNumber} />,
  ];

  return (
    <Box sx={{ m: 1 }}>
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ px: 2, py: 1.5, bgcolor: "#f5f7fa", borderBottom: "1px solid #e0e0e0", display: "flex", alignItems: "center", gap: 1 }}>
          <ReceiptLongIcon sx={{ color: "#1976d2", fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight={600}>Billing & Payments</Typography>
        </Box>
        <Box sx={{ px: 2, pt: 1 }}>
          <SLTabs tabLabels={tabLabels} tabContents={tabContents} />
        </Box>
      </Paper>
    </Box>
  );
};

export default BillsTabs;
