import React from "react";
import { useParams } from "react-router-dom";
import MyInfo from "./myInfo";
import MyStatus from "./myStatus";
import MyPackages from "./myPackages";

function CustomerMain() {
  const { id } = useParams();
  console.log(id);
  return (
    <div>
      <h3> CustomerMain </h3>
      <h5>{id}</h5>
      <MyInfo id={id}/>
      <MyStatus id={id}/>
      <MyPackages id={id}/>
    </div>
  );
}

export default CustomerMain;
