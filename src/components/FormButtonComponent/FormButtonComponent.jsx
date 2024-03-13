
import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import Translations from '../../resources/translations';
import Button from '@mui/material/Button';

const FormButtonComponent = (props) => {
    
    return (
        <Box display="flex" justifyContent="center" mt="20px">
            <Button type="submit" color="primary" variant="contained">
                {props.button1}
            </Button>
            <Button color="secondary" variant="contained" onClick={() => { props.clearFormEvent()}}>
                {props.button2}
            </Button>

        </Box>
    );

}
export default FormButtonComponent;