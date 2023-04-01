import React from "react";
import { Box } from "@mui/material";
import Header from "components/Header";
import TabsNavigator from "components/TabsNavigator";
import InactiveUsers from "./inactiveUsers";
import NewUser from "./newUser";
import UserList from "./userList";


const Users = () => {

  const tabItems = [
    {
      text: "Users list",
      component: <UserList/>
    },
    {
      text: "New User",
      component: <NewUser/>
    },
    // {
    //   text: "Inactive users",
    //   component: <InactiveUsers/>
    // },
  ];

  return (
    <Box m="0 1rem">
      <Header title="User Managements"/>
      <TabsNavigator tabItems={tabItems} />
    </Box>
  );
};

export default Users;
