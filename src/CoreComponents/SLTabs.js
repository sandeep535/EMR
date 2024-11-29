import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";

// TabPanel to display the content of each tab
const TabPanel = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const SLTabs = ({ tabLabels, tabContents }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%",padding:0 }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="common tabs component"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        {tabLabels.map((label, index) => (
          <Tab key={index} label={label} id={`tab-${index}`} aria-controls={`tabpanel-${index}`} />
        ))}
      </Tabs>
      {tabContents.map((content, index) => (
        <TabPanel key={index} value={value} index={index}>
            {content}
         
        </TabPanel>
      ))}
    </Box>
  );
};

export default SLTabs;
