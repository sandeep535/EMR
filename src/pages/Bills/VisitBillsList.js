import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tabs,
  Tab,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PaymentIcon from "@mui/icons-material/Payment";
import APIS from "../../Utils/APIS";
import { sendRequest } from "../global/DataManager";
import SLTabs from "../../CoreComponents/SLTabs";
import { generateBill } from "../../Utils/UtilService";
import Translations from "../../resources/translations";
import AutocompleteField from "../../CoreComponents/AutocompleteField";
import SLTextField from "../../CoreComponents/SLTextField";

const visitStatus = {
  1: "Visit Not Started",
  2: "Visit In-active",
  3: "Visit In progress",
  4: "Visit Complted",
};

const VisitBillsList = ({ clientId }) => {
  const [pendingbilltableData, setpendingbilltableData] = useState([]);
  const [openPayDialog, setOpenPayDialog] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [enteredAmount, setEnteredAmount] = useState("");
  const [value, setValue] = useState(0);
  const [paymentTypeOptions, setPaymentTypeOptions] = React.useState([]);

  useEffect(() => {
    getPendingBillsByClientId(clientId, "Pending");
    getPaymentTypeList();
  }, [clientId]);

  const tabLabels = [
    "Pending Bills",
    "Generated Bills",
    "Pending Payments",
    "Paid Payments",
  ];

  async function getPaymentTypeList() {
    var payLoad = {
      method: APIS.GET_MASTER_DATA_BASED_ON_CODE.METHOD,
      url: APIS.GET_MASTER_DATA_BASED_ON_CODE.URL,
      paramas: ["PAYMENT_MODE"],
    };
    let result = await sendRequest(payLoad);
    if (result) {
      setPaymentTypeOptions(result);
    }
  }

  async function getPendingBillsByClientId(clientId, status = "Pending") {
    var payLoad = {
      method: APIS.GET_PENDING_BILLS_CLIENTID.METHOD,
      url: APIS.GET_PENDING_BILLS_CLIENTID.URL,
      paramas: [clientId, status],
    };
    let result = await sendRequest(payLoad);
    if (result && result) {
      setpendingbilltableData(result);
    } else {
      setpendingbilltableData([]);
    }
  }

  const handleGenerated = async (visit) => {
    let result = await generateBill(visit.visitid, visit.clientid.seqid);
    if (result.status == "succuss") {
      getPendingBillsByClientId(
        clientId,
        value === 0 ? "Pending" : "Generated"
      );
    }
  };

  const handleClosePay = () => {
    setOpenPayDialog(false);
    setSelectedVisit(null);
    setPaymentMethod(null);
    setEnteredAmount("");
  };

  const handleConfirmPayment = async () => {
    if (!selectedVisit) return;
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    const amountNum = Number(enteredAmount);
    if (!amountNum || amountNum <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const payLoad = {
      method: APIS.PAY_BILL.METHOD,
      url: APIS.PAY_BILL.URL,
      paramas:[selectedVisit.billid],
      body: {
        bill:{
          billId:selectedVisit.service[0].billId,
        }
      },
    };

    let response = await sendRequest(payLoad);
    if (response?.success || response?.status === "succuss") {
      alert(`Payment successful for Visit #${selectedVisit.visitid}`);
      // Refresh lists - likely move to Paid Payments tab
      getPendingBillsByClientId(clientId, value === 2 ? "PendingPayments" : "Pending");
      handleClosePay();
    } else {
      alert("Payment failed, please try again!");
    }
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
    const status = newValue === 0 ? "Pending" : newValue === 1 ? "Generated" : newValue === 2 ? "PendingPayments" : "Paid";
    getPendingBillsByClientId(clientId, status);
  };

  const handleOpenPay = (visit) => {
    setSelectedVisit(visit);
    setEnteredAmount(String(visit.visittotalamount - (visit.visitdiscount || 0)));
    setOpenPayDialog(true);
  };

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="common tabs component"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        {tabLabels.map((label, index) => (
          <Tab
            key={index}
            label={label}
            id={`tab-${index}`}
            aria-controls={`tabpanel-${index}`}
          />
        ))}
      </Tabs>
      <Grid container spacing={3}>
        {pendingbilltableData.map((visit) => (
          <Grid item xs={12} md={6} key={visit.visitid}>
            <Card sx={{ borderRadius: 2, boxShadow: 3, p: 1 }}>
              <CardContent sx={{ p: 2 }}>
                {/* Header */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary"
                  >
                    Visit #{visit.visitid}
                  </Typography>
                  <Chip
                    label={visitStatus[visit.status]}
                    color={visit.status === "Closed" ? "success" : "warning"}
                    size="small"
                  />
                </Box>

                <Typography variant="caption" color="text.secondary">
                  {new Date(visit.visitdate).toLocaleDateString()} | Token:{" "}
                  {visit.token}
                </Typography>

                <Divider sx={{ my: 1 }} />

                {/* Doctor + Client Info in two columns */}
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocalHospitalIcon fontSize="small" color="primary" />
                      <Typography variant="body2" fontWeight="bold">
                        Dr. {visit.doctor?.firstname} {visit.doctor?.lastname}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PersonIcon fontSize="small" color="secondary" />
                      <Typography variant="body2" fontWeight="bold" noWrap>
                        {visit.clientid?.firstname} {visit.clientid?.lastname}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Typography variant="caption" color="text.secondary">
                  📞 {visit.clientid?.contact}
                </Typography>

                <Divider sx={{ my: 1 }} />

                {/* Services - scrollable small list */}
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                  <MedicalServicesIcon fontSize="small" color="error" />
                  <Typography variant="body2" fontWeight="bold">
                    Services
                  </Typography>
                </Box>
                <Box sx={{ maxHeight: 100, overflowY: "auto" }}>
                  <List dense disablePadding>
                    {visit.services.map((service) => (
                      <ListItem
                        key={service.serviceid.serviceid}
                        sx={{
                          borderBottom: "1px dashed #eee",
                          py: 0.2,
                        }}
                      >
                        <ListItemText
                          primaryTypographyProps={{ variant: "body2" }}
                          secondaryTypographyProps={{ variant: "caption" }}
                          primary={service.serviceid.servicename}
                          secondary={`₹${service.serviceid.price}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Totals + Pay button */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="caption" color="error">
                      Discount: -₹{visit.visitdiscount || 0}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="primary"
                    >
                      Total: ₹{visit.visittotalamount}
                    </Typography>
                  </Box>
                  {value === 1 ? (
                    <Chip label="Generated" color="success" size="small" />
                  ) : value === 0 ? (
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      startIcon={<PaymentIcon />}
                      onClick={() => handleGenerated(visit)}
                    >
                      Generate Bill
                    </Button>
                  ) : value === 2 ? (
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      startIcon={<PaymentIcon />}
                      onClick={() => handleOpenPay(visit)}
                    >
                      Pay Now
                    </Button>
                  ) : null}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Payment Dialog */}
      <Dialog open={openPayDialog} onClose={handleClosePay}>
        <DialogTitle>Pay Bill - Visit #{selectedVisit?.visitid}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={2}>
            Select payment method:
          </Typography>
          <AutocompleteField
            label={Translations.visitCreation.paymenttype}
            options={paymentTypeOptions}
            placeholder={Translations.visitCreation.paymenttype}
            mapvalues={{ id: "id", value: "masterdatavalue" }}
            isMultiSelect={false}
            id={"paymenttype-combo-box-demo"}
            value={paymentMethod}
            onChange={setPaymentMethod}
          />
          <Box mt={2}>
            <SLTextField
              label="Amount"
              type="number"
              value={enteredAmount}
              onChange={(e) => setEnteredAmount(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePay}>Cancel</Button>
          <Button
            onClick={handleConfirmPayment}
            variant="contained"
            color="primary"
          >
            Confirm Pay
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VisitBillsList;
