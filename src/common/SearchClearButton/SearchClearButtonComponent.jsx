
import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import Translations from '../../resources/translations';
import Button from '@mui/material/Button';

const SearchClearButtonComponent = (props) => {
    
    return (
        <Box display="flex" justifyContent="center">
            <Button type="submit" color="primary" variant="contained" onClick={() => { props.clickbtton1()}}>
                {props.button1}
            </Button>
            <Button color="secondary" variant="contained" onClick={() => { props.clickbtton2()}}>
                {props.button2}
            </Button>

        </Box>
    );

}
export default SearchClearButtonComponent;