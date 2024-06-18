import React, { forwardRef, useImperativeHandle, useState } from 'react';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material'
import CommonCard from '../../common/CommonCard';


const Notes = forwardRef((props, ref) => {
  const [description, setDescription] = useState("");
  useImperativeHandle(
    ref,
    () => {
      return {
        getFormData: () => {
          return {
            description
          }
        },
        setFormData1: (data) => {
          setDescription(data.description);
        }
      }
    },
    [description],
  );

  return (
    <>
      <CommonCard title={props.label}>
        <Box sx={{ m: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} >
              <TextField
                fullWidth
                type="text"
                size="small"
                variant="outlined"
                required
                multiline
                rows={3}
                name={props.label}
                onChange={e => setDescription(e.target.value)}
                value={description}
              />
            </Grid>
          </Grid>
        </Box>
      </CommonCard>

    </>
  )
});
export default Notes;