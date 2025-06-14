import React, { useEffect, useState, useContext, useRef } from "react";
import { Box } from "@mui/material";
import AppContext from "../../components/Context/AppContext";
import CommonCard from "../../common/CommonCard";
import Translations from "../../resources/translations";
import CustomDataGrid from "../../common/DataGrid/CustomDataGrid";
import APIS from "../../Utils/APIS";
import { sendRequest } from "../global/DataManager";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import AddPayment from "./AddPayment";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const pendingPaymentsListHeaders = [
  {
    name: Translations.BILLS_LIST.BILLNO,
    datakey: "billNumber",
    width: "20%",
  },
  {
    name: Translations.BILLS_LIST.BILLDATE,
    width: "20%",
    datakey: "billDate",
    isDateFiled: true,
  },
  {
    name: Translations.BILLS_LIST.BILLAMOUNT,
    width: "20%",
    datakey: "billAmount",
  },
  {
    name: Translations.BILLS_LIST.TOTALAMOUNT,
    width: "10%",
    datakey: "billAmountBeforeDiscount",
  },
  {
    name: Translations.BILLS_LIST.DISCOUNTINPERCENTAGE,
    width: "10%",
    datakey: "visitDiscountPercentage",
  },
  {
    name: Translations.BILLS_LIST.DISCOUNTAMOUNT,
    width: "10%",
    datakey: "visitDiscount",
  },
  {
    name: Translations.DIAGNOSIS_MASTER.ACTIONS,
    width: "10%",
    isActions: true,
    actions: [
      {
        icon: "add",
      },
      {
        icon: "print",
      },
    ],
  },
];
export default function PendingPayments(props) {
  const [billtableData, setBilltableData] = useState([]);
  const [isPaymentPopupDisplay, setIsPaymentPopupDisplay] = useState(false);
  const appContextValue = useContext(AppContext);

  useEffect(() => {
    getBills();
  }, []);

  async function getBills() {
    let visitid = "";
    if (props && props.visitId) {
      visitid = props.visitId;
    } else {
      visitid = appContextValue.selectedVisitDeatils.visitid;
    }
    var payLoad = {
      method: APIS.GET_GENERATE_BILL.METHOD,
      url: APIS.GET_GENERATE_BILL.URL,
      paramas: [visitid],
    };
    let result = await sendRequest(payLoad);
    if (result && result) {
      setBilltableData(result);
    } else {
      setBilltableData([]);
    }
  }
  const handleClose = () => {
    setIsPaymentPopupDisplay(false);
  };
  return (
    <>
      <Box sx={{ flexGrow: 1, m: 1 }}>
        <CommonCard title={Translations.PAYMENTS_SCREEN.TITLE}>
          <CustomDataGrid
            tableHeaders={pendingPaymentsListHeaders}
            tableData={billtableData}
            triggerEvent={(row, action) => {
              console.log("row", row, "action", action);
              setIsPaymentPopupDisplay(true);
            }}
          ></CustomDataGrid>
        </CommonCard>

        <Box>
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={isPaymentPopupDisplay}
            maxWidth="lg"
          >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
             Payment
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={(theme) => ({
                position: "absolute",
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent dividers>
              <AddPayment/>
            </DialogContent>
            {/* <DialogActions>
              <Button autoFocus onClick={handleClose}>
                Save changes
              </Button>
            </DialogActions> */}
          </BootstrapDialog>
        </Box>
      </Box>
    </>
  );
}
