import { ChildCare } from '@mui/icons-material';
import React from 'react';
import Box from '@mui/material/Box';

export const ComponentToPrint = React.forwardRef((props, ref) => {
    return (
        <Box ref={ref} m="10px">
            <Box>
                Header
            </Box>
                {props.children}
            <Box>
                Footer
            </Box>
        </Box>
    );
});