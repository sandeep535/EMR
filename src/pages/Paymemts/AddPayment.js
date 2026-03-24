import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Grid, Box, FormControl } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import SLTextField from "../../CoreComponents/SLTextField";
import { AddPaymentSchema } from "../../common/YupSchema/formSchema";
import SLDatePicker from "../../CoreComponents/SLDatePicker";
import AutocompleteField from "../../CoreComponents/AutocompleteField";
import { sendRequest } from "../global/DataManager";
import APIS from "../../Utils/APIS";
import dayjs from "dayjs";

const AddPayment = ({ billId, billAmount, paidAmount, onSuccess }) => {
  const { handleSubmit, reset, control, watch, formState: { errors } } = useForm({
    resolver: yupResolver(AddPaymentSchema),
    defaultValues: { paymentDate: dayjs() },
  });
  const [paymentModeOptions, setPaymentModeOptions] = useState([]);

  const remaining = Number(billAmount || 0) - Number(paidAmount || 0);
  const enteredAmount = Number(watch('paymentAmount'));
  const isAmountExceeded = enteredAmount > remaining;

  useEffect(() => {
    sendRequest({ method: APIS.GET_MASTER_DATA_BASED_ON_CODE.METHOD, url: APIS.GET_MASTER_DATA_BASED_ON_CODE.URL, paramas: ['PAYMENT_MODE'] })
      .then(result => { if (result) setPaymentModeOptions(result); });
  }, []);

  const onSubmit = async (data) => {
    const payload = {
      method: APIS.PAY_BILL.METHOD,
      url: APIS.PAY_BILL.URL,
      paramas: [billId],
      data: {
        paymentDate: data.paymentDate ? new Date(data.paymentDate).toISOString().split('T')[0] : null,
        paymentAmount: Number(data.paymentAmount),
        paymentMode: data.paymentMethod?.id,
        transactionNumber: data.transactionNumber,
        remarks: data.remarks,
      },
    };
    const result = await sendRequest(payload);
    if (result) {
      reset();
      if (onSuccess) onSuccess();
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SLDatePicker
              name="paymentDate"
              label="Payment Date"
              control={control}
              error={errors.paymentDate}
            />
          </Grid>
          <Grid item xs={6}>
            <SLTextField
              name="paymentAmount"
              label="Payment Amount"
              control={control}
              placeholder="Payment Amount"
              error={isAmountExceeded ? { message: `Amount cannot exceed bill amount of ₹${billAmount}` } : errors.paymentAmount}
            />
            {isAmountExceeded && (
              <Box sx={{ color: '#d32f2f', fontSize: 11, mt: 0.5, ml: 0.5 }}>
                Amount cannot exceed remaining balance of ₹{remaining}
              </Box>
            )}
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <AutocompleteField
                name="paymentMethod"
                label="Payment Mode"
                control={control}
                options={paymentModeOptions}
                placeholder="Payment Mode"
                mapvalues={{ id: 'id', value: 'masterdatavalue' }}
                isMultiSelect={false}
                id="paymentMethod-combo-box"
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <SLTextField
              name="transactionNumber"
              label="Transaction Number"
              control={control}
              placeholder="Transaction Number"
            />
          </Grid>
          <Grid item xs={12}>
            <SLTextField
              name="remarks"
              label="Remarks"
              control={control}
              placeholder="Remarks"
            />
          </Grid>
          <Grid item xs={12} textAlign="right">
            <Button type="button" variant="outlined" onClick={() => reset()} sx={{ mr: 1, textTransform: 'none' }}>Clear</Button>
            <Button type="submit" variant="contained" disabled={isAmountExceeded} sx={{ textTransform: 'none', fontWeight: 600 }}>Save Payment</Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddPayment;
