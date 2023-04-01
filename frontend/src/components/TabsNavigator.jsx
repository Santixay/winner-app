import React, { useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import { Box, Tab } from "@mui/material";

const TabsNavigator = ({ tabItems }) => {
  // tabItems must look like this
  //  [
  //   {
  //     text: "Customer list",
  //     component: <CustomerList/>
  //   },
  //   {
  //     text: "New Customer",
  //     component: <NewCustomer/>
  //   },
  //  ]

  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={activeTab.toString()}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {tabItems.map(({ text }, index) => {
              return <Tab key={index.toString()} value={index.toString()} label={text} />;
            })}
          </TabList>
        </Box>
          {tabItems.map(({ component }, index) => {
          return <TabPanel key={index.toString()} value={index.toString()}>{component}</TabPanel>;
        })}
      </TabContext>
    </Box>
  );
};
export default TabsNavigator;
