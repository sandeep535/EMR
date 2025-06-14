import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Grid, Typography, Box } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SLTextField from "../../CoreComponents/SLTextField";
import { AddPaymentSchema } from "../../common/YupSchema/formSchema";
import CommonCard from "../../common/CommonCard";
import SLDatePicker from "../../CoreComponents/SLDatePicker";

const AddPayment = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddPaymentSchema),
  });

  const onSubmit = (data) => {
    console.log("Payment Data:", data);
  };

  return (
    <Box sx={{ p: 1 }}>
      
        <Box display="grid" >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1}>
              {/* Left Column */}

              <Grid item xs={6} spacing={1}>
                <SLTextField
                  name="billNumber"
                  label={"Bill / Invoice Number"}
                  control={control}
                  placeholder={"Bill / Invoice Number"}
                />
              </Grid>
              <Grid item xs={6} spacing={1}>
              <SLDatePicker
                name="paymentDate"
                label={"Payment Date"}
                control={control}
                error={errors.dob}
                onChange={(date) => {
                  console.log(date);
                  //  calculateAge(date);
                }}
              />
              </Grid>
              <Grid item xs={6} spacing={1}>
              <SLTextField
                name="paymentAmount"
                label={"Payment Amount"}
                control={control}
                placeholder={"Payment Amount"}
              />
                </Grid>
                <Grid item xs={6} spacing={1}>
              <SLTextField
                name="paymentFrom"
                label={"Payment From"}
                control={control}
                placeholder={"Payment From"}
              />
                </Grid>
              <Grid item xs={6} spacing={1}>
              <SLTextField
                name="depositAmount"
                label={"Deposit Amount"}
                control={control}
                placeholder={"Deposit Amount"}
              />
                </Grid>
                <Grid item xs={6} spacing={1}>
              <SLTextField
                name="Notes"
                label={"Notes"}
                control={control}
                placeholder={"Notes"}
              />
                </Grid>
              <Grid item xs={6} spacing={1}>

              {/* Right Column */}
              
                <SLDatePicker
                  name="billDate"
                  label={"Bill / Invoice Number Date"}
                  control={control}
                  error={errors.billDate}
                  onChange={(date) => {
                    console.log(date);
                    //  calculateAge(date);
                  }}
                />
                </Grid>
                <Grid item xs={6} spacing={1}>
                <SLTextField
                  name="paymentMethod"
                  label={"Payment Method"}
                  control={control}
                  placeholder={"Payment Method"}
                />
                </Grid>
                <Grid item xs={6} spacing={1}>
                <SLTextField
                  name="chequeNumber"
                  label={"Cheque Number"}
                  control={control}
                  placeholder={"Cheque Number"}
                />
                </Grid>
                <Grid item xs={6} spacing={1}>
                <SLTextField
                  name="payingEntity"
                  label={"Paying Entity"}
                  control={control}
                  placeholder={"Paying Entity"}
                />
                </Grid>
                <Grid item xs={6} spacing={1}>
                <SLTextField
                  name="paymentCategory"
                  label={"Payment Category"}
                  control={control}
                  placeholder={"Payment Category"}
                />
                </Grid>
                <Grid item xs={6} spacing={1}>
                <SLTextField
                  name="payerId"
                  label={"Payer ID"}
                  control={control}
                  placeholder={"Payer ID"}
                />
                </Grid>
                <Grid item xs={6} spacing={1}>
                <SLTextField
                  name="depositDate"
                  label={"Deposit Date"}
                  control={control}
                  placeholder={"Deposit Date"}
                />
                </Grid>
                <Grid item xs={6} spacing={1}>
                <SLTextField
                  name="Ddiscount"
                  label={"Discount"}
                  control={control}
                  placeholder={"Discount"}
                />
                </Grid>
            

              <Grid item xs={12} textAlign="center">
                <Button type="submit" variant="contained" sx={{ mr: 2 }}>
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => reset()}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      
    </Box>
  );
};

export default AddPayment;
