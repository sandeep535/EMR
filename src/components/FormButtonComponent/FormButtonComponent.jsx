
import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import Translations from '../../resources/translations';
import { Button } from "@material-ui/core";

const FormButtonComponent = (props) => {
    
    return (
        <Box display="flex" justifyContent="center" mt="20px">
            <Button type="submit" color="secondary" variant="contained">
                {props.button1}
            </Button>
            <Button color="secondary" variant="contained" onClick={() => { }}>
                {props.button2}
            </Button>

        </Box>
    );

}
export default FormButtonComponent;