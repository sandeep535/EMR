import React, { useEffect, useState } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Tooltip, IconButton, List, ListItem, ListItemText, Collapse, Typography } from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SLButton from "../../CoreComponents/SLButton";
import Moment from "react-moment";
import APIS from "../../Utils/APIS";
import { sendRequest } from "../global/DataManager";
import { generateBill } from "../../Utils/UtilService";

const headers = [
  { key: "expand", label: "" },
  { key: "visitid", label: "Visit #" },
  { key: "visitdate", label: "Visit Date", isDate: true },
  { key: "doctor", label: "Doctor" },
  { key: "visittotalamount", label: "Total Amt" },
  { key: "visitdiscount", label: "Discount" },
  { key: "action", label: "" },
];

function Row({ visit, onGenerated }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow hover sx={{ "& td": { borderBottom: open ? 0 : undefined } }}>
        <TableCell sx={{ width: 32, p: 0.5 }}>
          <IconButton size="small" onClick={() => setOpen(o => !o)}>
            {open ? <KeyboardArrowUpIcon sx={{ fontSize: 16 }} /> : <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontSize: 12 }}>{visit.visitid}</TableCell>
        <TableCell sx={{ fontSize: 12 }}><Moment format="DD-MMM-YYYY">{new Date(visit.visitdate)}</Moment></TableCell>
        <TableCell sx={{ fontSize: 12 }}>{visit.doctor ? `Dr. ${visit.doctor.firstname} ${visit.doctor.lastname}` : "-"}</TableCell>
        <TableCell sx={{ fontSize: 12 }}>₹{visit.visittotalamount}</TableCell>
        <TableCell sx={{ fontSize: 12 }}>₹{visit.visitdiscount || 0}</TableCell>
        <TableCell sx={{ fontSize: 12 }}>
          <SLButton size="small" variant="contained" onClick={() => onGenerated(visit)}
            sx={{ textTransform: "none", fontWeight: 600, fontSize: 11, py: 0.3 }}>
            Generate Bill
          </SLButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={headers.length} sx={{ py: 0, bgcolor: "#fafafa" }}>
          <Collapse in={open} unmountOnExit>
            <Box sx={{ px: 3, py: 1 }}>
              <Typography variant="caption" fontWeight={600} color="text.secondary">SERVICES</Typography>
              <List dense disablePadding>
                {(visit.services || []).map((s, i) => (
                  <ListItem key={i} sx={{ py: 0.2, borderBottom: "1px dashed #eee" }}>
                    <ListItemText
                      primaryTypographyProps={{ variant: "body2" }}
                      secondaryTypographyProps={{ variant: "caption" }}
                      primary={s.serviceid?.servicename}
                      secondary={`₹${s.serviceid?.price || s.serviceprice || 0}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function PendingBillsList({ clientId }) {
  const [rows, setRows] = useState([]);

  useEffect(() => { if (clientId) fetchPending(); }, [clientId]);

  async function fetchPending() {
    const result = await sendRequest({
      method: APIS.GET_PENDING_BILLS_CLIENTID.METHOD,
      url: APIS.GET_PENDING_BILLS_CLIENTID.URL,
      paramas: [clientId, "Pending"],
    });
    setRows(result || []);
  }

  async function handleGenerate(visit) {
    const res = await generateBill(visit.visitid, visit.clientid?.seqid || clientId);
    if (res.status === "succuss") fetchPending();
  }

  return (
    <Box>
      {rows.length > 0 && (
        <Box sx={{ px: 2, py: 1, borderBottom: "1px solid #f0f0f0" }}>
          <Chip label={`${rows.length} visit(s) pending billing`} size="small"
            sx={{ bgcolor: "#fff3e0", color: "#e65100", fontWeight: 600 }} />
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
                <TableCell colSpan={headers.length} align="center" sx={{ py: 3, color: "text.disabled", fontSize: 13 }}>No pending bills</TableCell>
              </TableRow>
            ) : rows.map((visit, i) => (
              <Row key={i} visit={visit} onGenerated={handleGenerate} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
