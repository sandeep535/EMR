import React, { useRef } from 'react';
import { Button, Typography } from '@mui/material';
import ReactToPrint from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
import SLPrintTemplate from './SLPrintTemplate';
import Tooltip from '@mui/material/Tooltip';
import { Box } from '@mui/material';

const SLCommonPrintComponent = ({ header, footer, printContent }) => {
  const printRef = useRef();

  return (
    <Box>
      <ReactToPrint
        trigger={() => (
            <Tooltip title="Print">
            <PrintIcon />
        </Tooltip>
        )}
        content={() => printRef.current}
      />
      <div >
        <SLPrintTemplate ref={printRef} header={header} footer={footer}>
          {printContent} 
        </SLPrintTemplate>
      </div>
    </Box>
  );
};

export default SLCommonPrintComponent;
