import React, { useEffect, forwardRef, useImperativeHandle, useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import DemoPaper from '../../Utils/CustomCssUtil';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material'


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
     <Box display="grid" gap="10px">
        <Card variant="outlined">
            <CardContent>
                <Typography sx={{ fontSize: 16 }}  className='card-header'>
                {props.label}
                </Typography>
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
                      label={props.label}
                      name={props.label}
                      onChange={e => setDescription(e.target.value)}
                      value={description}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
        </Box>
    </>
  )
});
export default Notes;