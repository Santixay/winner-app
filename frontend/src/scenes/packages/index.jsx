import React from "react";
import { Box } from "@mui/material";
import Header from "components/Header";
import TabsNavigator from "components/TabsNavigator";
import NewPackage from "./newPackage";
import PackageList from "./packageList";
import InactivePackage from "./inactivePackage";



const Packages = () => {

  const tabItems = [
    {
      text: "Package list",
      component: <PackageList/>
    },
    {
      text: "New Package",
      component: <NewPackage/>
    },
    {
      text: "Inactive Packages",
      component: <InactivePackage/>
    },
  ];

  return (
    <Box m="0 1rem">
      <Header title="Packages"/>
      <TabsNavigator tabItems={tabItems} />
    </Box>
  );
};

export default Packages;
