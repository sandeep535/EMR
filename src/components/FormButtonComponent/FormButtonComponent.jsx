
import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';

const FormButtonComponent = (props) => {

    return (
        <Box display="flex" justifyContent="flex-end"  marginTop="5px" borderTop="2px solid #dee2e6;" >
            <Box marginTop="5px"  >
                <Button type="submit" color="primary" variant="contained">
                    {props.button1}
                </Button>
                <Button color="secondary" variant="contained" onClick={() => { props.clearFormEvent() }}>
                    {props.button2}
                </Button>
            </Box>
        </Box>
    );

}
export default FormButtonComponent;