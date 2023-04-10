import { Box, Grid, Typography } from "@mui/material";
import { GetCustomerInfo } from "api/customers";
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

function MyInfo(props) {
  const [customer, setCustomer] = useState(null);
  const { id } = props;
  useEffect(() => {
    GetCustomerInfo(id)
      .then((res) => {
        if (res.status && res.status === 200) {
          setCustomer(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Box marginTop={2}>
      <Grid width={!isMobile ? '700px' : 'auto'} container spacing={2}>
        <Grid item md={2}>
          #ID - Name:{" "}
          <Typography color="secondary">
            {id} - {customer && customer.name}
          </Typography>
        </Grid>
        <Grid item md={2}>
          Whatsapp:{" "}
          <Typography color="secondary">
            {customer && customer.whatsapp}
          </Typography>
        </Grid>
        {!isMobile && (
          <>
            <Grid item md={2}>
              Staus:{" "}
              <Typography color="secondary">
                {customer && customer.validflag ? "Active" : "In-active"}
              </Typography>
            </Grid>
            <Grid item md={6}>
              Address:{" "}
              <Typography color="secondary">
                {customer &&
                  customer.province.pr_name +
                    ", " +
                    customer.district.dt_name +
                    ", " +
                    customer.village.vill_name}
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}

export default MyInfo;
