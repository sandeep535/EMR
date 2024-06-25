import React, { forwardRef, useImperativeHandle, useState } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import CommonCard from '../../common/CommonCard';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    name: yup.string().max(500)
  })
  .required()
const Notes = forwardRef((props, ref) => {
  const [description, setDescription] = useState("");
  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    mode: 'onChange',
    defaultValues: { name: "" },
    resolver: yupResolver(schema),
  })
  useImperativeHandle(
    ref,
    () => {
      return {
        getFormData: () => {
          return {
            description
          }
        },
        setFormData: (data) => {
          setValue("name", data, { shouldTouch: true, shouldDirty: true })
          setDescription(data);
        },
        submitFormmData: () => {
          handleSubmit(notesHandle)();
        }
      }
    },
    [description],
  );
  const notesHandle = async (data) => {
    setDescription(data.name);
  }
  return (
    <>
      <CommonCard title={props.label}>
        <form onSubmit={handleSubmit(notesHandle)}  >
          <Grid container spacing={1}>
            <Grid item xs={12} >
              <Controller
                name="name"
                control={control}
                render={({ field }) =>
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    type="text"
                    size="small"
                    variant="outlined"
                    label={props.label}
                    error={errors.name?.message}
                    helperText={errors.name?.message}
                  />
                }
              />
            </Grid>
          </Grid>
        </form>
      </CommonCard>

    </>
  )
});
export default Notes;