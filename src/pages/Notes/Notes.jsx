import React, { useEffect, forwardRef, useImperativeHandle, useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import DemoPaper from '../../Utils/CustomCssUtil';

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
      <DemoPaper square={false}>
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

      </DemoPaper>
    </>
  )
});
export default Notes;