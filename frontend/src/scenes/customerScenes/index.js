import React from "react";
import { useParams } from "react-router-dom";
import MyPackages from "./myPackages";
import { Box } from "@mui/material";
import Header from "components/Header";

function CustomerMain() {
  const { id } = useParams();
  console.log(id);
  return (
    <Box marginLeft={2}>
      <Header title="Customer Info" />     
      <MyPackages id={id} />
    </Box>
  );
}

export default CustomerMain;
