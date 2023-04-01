import React from "react";
import { Box } from "@mui/material";
import Header from "components/Header";
import TabsNavigator from "components/TabsNavigator";
import CustomerList from "./customerList";
import NewCustomer from "./newCustomer";
import InactiveCustomer from "./inactiveCustomer";

const Customers = () => {

  const tabItems = [
    {
      text: "Customer list",
      component: <CustomerList/>
    },
    {
      text: "New Customer",
      component: <NewCustomer/>
    },
    {
      text: "Inactive Customer",
      component: <InactiveCustomer/>
    },
  ];

  return (
    <Box m="0 1rem">
      <Header title="CUSTOMERS"/>
      <TabsNavigator tabItems={tabItems} />
    </Box>
  );
};

export default Customers;
