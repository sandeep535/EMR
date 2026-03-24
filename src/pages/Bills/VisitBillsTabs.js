import React, { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import SLTabs from "../../CoreComponents/SLTabs";
import BillsList from "./BillsList";
import VisitPendingPayments from "../Paymemts/VisitPendingPayments";

const tabLabels = [
  <Box key="bills" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    <ReceiptLongIcon sx={{ fontSize: 16 }} /> Bills
  </Box>,
  <Box key="ppayments" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    <HourglassEmptyIcon sx={{ fontSize: 16 }} /> Payments
  </Box>,
];

const VisitBillsTabs = () => {
  const tabContents = [
    <BillsList key="bills" />,
    <VisitPendingPayments key="ppayments" />,
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

export default VisitBillsTabs;
