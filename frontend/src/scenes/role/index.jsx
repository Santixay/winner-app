import React from 'react'
import { Box } from "@mui/material";
import Header from "components/Header";
import TabsNavigator from "components/TabsNavigator";
import RoleList from './RoleList';
import NewRole from './NewRole';

function Roles() {
    const tabItems = [
        {
          text: "Role list",
          component: <RoleList/>
        },
        {
          text: "New Role",
          component: <NewRole />
        }
      ];
  return (
    <Box m="0 1rem">
      <Header title="Role Managements"/>
      <TabsNavigator tabItems={tabItems} />
    </Box>
  )
}

export default Roles