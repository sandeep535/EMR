import React, { forwardRef } from 'react';
import { Box, Divider, Typography } from '@mui/material';

const SLPrintTemplate = forwardRef(({ header, footer, children }, ref) => {
  return (
    <div ref={ref}>
      <header>
        <Box sx={{
          textAlign: 'center',
          width: '100%',
        }}>
          <Typography variant="h5">{"Header Content"}</Typography>
          <Divider />
        </Box>
      </header>
      <main className="print-content">
        <Box>
          {children}
        </Box>
      </main>
      <footer>
        <Box className="print-footer"
          sx={{
            textAlign: 'center',
            position: 'fixed',
            bottom: 0,
            width: '100%',
          }}
        >
          <Divider />
          <Typography variant="body2">{"Footer Content"}</Typography>
        </Box>
      </footer>
    </div>
  );
});
SLPrintTemplate.displayName = "SLPrintTemplate";
export default SLPrintTemplate;
