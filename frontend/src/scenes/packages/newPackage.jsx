import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Box,
  FormControl,
  InputLabel,
  Button,
  useTheme,
  Select,
  MenuItem,
  TextField,
  OutlinedInput,
  Grid,
  Divider,
  Autocomplete,
} from "@mui/material";
import { GetCustomersList } from "api/customers";
import { GetRouteByProvince, GetRouteList } from "api/routes";
import { StorePackage } from "api/packages";
import { GetStationDetailById } from "api/stations";
import { StoreTrackingLog } from "api/trackingLogs";
import { user } from "localStorage";
import { getScanText, playCorrectSound, playIncorrectSound } from "utils";

const NewPackage = () => {
  const theme = useTheme();
  // Data to send to back-end
  const [trackingNumber, setTrackingNumber] = useState("");
  const [description, setDescription] = useState("");
  const [orderId, setOrderId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [routeId, setRouteId] = useState("");
  const [customer, setCustomer] = useState({});
  const [shippingFee, setShippingFee] = useState(0);
  // const [status, setStatus] = useState("Started");
  const status = "Started";

  const [remark, setRemark] = useState("");
  const [amount, setAmount] = useState(0);
  // const [paymentStatus, setPaymentStatus] = useState(false);
  const paymentStatus = false;

  // Data for front-end
  const [searchCustomer, setSearchCustomer] = useState("");
  const [customerList, setCustomerList] = useState([]);
  const [routeList, setRouteList] = useState([]);

  const clearForm = () => {
    setTrackingNumber("");
    setDescription("");
    setOrderId("");
    setAmount(0);
    setQuantity(1);
    setShippingFee(0);
    setRemark("");
  };

  const formSubmiteedHandler = (e) => {
    e.preventDefault();
    // console.log(customer.id);
    // return

    StorePackage(
      trackingNumber,
      description,
      orderId,
      customer.id,
      amount,
      quantity,
      shippingFee,
      routeId,
      status,
      remark,
      paymentStatus
    ).then((res) => {
      console.log(res);
      let data = res.result;
      if (res.status === 200) {
        clearForm();
        playCorrectSound();
        let account = user.name;
        GetStationDetailById("STD").then((res) => {
          if (res.status === 200) {
            StoreTrackingLog(
              data._id,
              data.tracking,
              res.data.name,
              res.data.message,
              data.remark,
              account
            ).then((res) => {
              // console.log(res);
              if (res.status === 200) {
                console.log(`Trackinglog has ben saved for started station.`);
              } else {
                Swal.fire({
                  title: "Error!",
                  icon: "error",
                  text: `Trackinglog saving failed, please check with developer!`,
                  showConfirmButton: true,
                });
              }
            });
          }
        });

        Swal.fire({
          title: "Created!",
          icon: "success",
          text: `${trackingNumber} has been created`,
          timer: 1500,
        });
      } else if (res.status === 400) {
        playIncorrectSound();
        Swal.fire({
          title: "Error!",
          icon: "error",
          text: `Status ${res.status} - ${res.data.message}`,
          showConfirmButton: true,
        });
      } else {
        playIncorrectSound();
        Swal.fire({
          icon: "error",
          text: res.message,
          showConfirmButton: true,
        });
      }
    });
  };

  // Set parameters for GetCustomersList()
  const page = 0;
  const pageSize = 20;
  const sort = {
    field: "name",
    sort: "asc",
  };

  useEffect(() => {
    setSearchCustomer("");
    GetRouteList().then((res) => {
      setRouteList(res.data);
    });
  }, []);

  useEffect(() => {
    GetCustomersList(page, pageSize, sort, searchCustomer).then((res) => {
      if (res.status === 200) {
        setCustomerList(res.data.customers);
      } else {
        console.log(res.message);
      }
    });
  }, [searchCustomer]);

  useEffect(() => {
    if (customer) {
      // console.log(customer);
      GetRouteByProvince(customer.pr_id).then((res) => {
        if (res.data) {
          setRouteId(res.data);
        }
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [customer]);

  return (
    <form onSubmit={formSubmiteedHandler}>
      <Box width="40vw">
        <Grid container spacing={2}>
          <Grid item md={12}>
            <FormControl fullWidth>
              <Autocomplete
                onInput={(e) => setSearchCustomer(e.target.value)}
                onChange={(e, value) => {
                  if (value) {
                    setCustomer({
                      _id: value._id,
                      id: value.id,
                      name: value.name,
                      whatsapp: value.whatsapp,
                      pr_id: value.province.pr_id,
                    });
                    console.log(customer);
                  }
                }}
                disablePortal
                id="combo-box-customer"
                options={customerList}
                getOptionLabel={(option) =>
                  option.name + " - " + option.whatsapp || ""
                }
                renderInput={(params) => (
                  <TextField {...params} label="Customer" />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item md={12}>
            <FormControl fullWidth>
              <InputLabel>Route</InputLabel>
              <Select
                id="route"
                value={!routeId ? "" : routeId}
                label="Route"
                onChange={(event) => setRouteId(event.target.value)}
                required
              >
                {routeList &&
                  routeList.map(({ id, name, description }) => {
                    return (
                      <MenuItem key={id} value={id}>
                        {id} ({name} - {description})
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={12}>
            <Divider sx={{ mt: 2, mb: 2 }} />
          </Grid>
          <Grid item md={6}>
            <FormControl fullWidth>
              <InputLabel>Tracking Number</InputLabel>
              <OutlinedInput
                label="Tracking Number"
                id="trackingNumber"
                value={trackingNumber}
                required={true}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    setTrackingNumber(getScanText(trackingNumber));
                    document.getElementById("shippingFee").select();
                    document.getElementById("shippingFee").focus();
                    e.preventDefault();
                  }
                }}
              />
            </FormControl>
          </Grid>
          <Grid item md={6}>
            <FormControl fullWidth>
              <InputLabel>Order ID</InputLabel>
              <OutlinedInput
                type="text"
                label="Order ID"
                value={orderId}
                id="orderId"
                onChange={(e) => setOrderId(e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid item md={12}>
            <FormControl fullWidth>
              <TextField
                multiline
                maxRows={5}
                label="Description"
                value={description}
                id="decscription"
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
          </Grid>

          <Grid item md={12}>
            <FormControl fullWidth>
              <TextField
                multiline
                maxRows={5}
                label="Remark"
                value={remark}
                id="remark"
                onChange={(e) => setRemark(e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <FormControl fullWidth>
              <InputLabel>Amount</InputLabel>
              <OutlinedInput
                type="number"
                label="Amount"
                value={amount}
                id="amount"
                onChange={(e) => setAmount(e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <FormControl fullWidth>
              <InputLabel>Quantity</InputLabel>
              <OutlinedInput
                type="number"
                value={quantity}
                label="Quantity"
                id="quantity"
                onChange={(e) => setQuantity(e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <FormControl fullWidth>
              <InputLabel>Shipping Fee</InputLabel>
              <OutlinedInput
                value={shippingFee}
                type="number"
                label="Shipping Fee"
                id="shippingFee"
                onChange={(e) => setShippingFee(e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid item md={12}>
            <Divider sx={{ mt: 2 }} />
          </Grid>
          <Grid item md={6}>
            <FormControl>
              <Button
                variant="contained"
                // disabled={!villageId || !districtId || !provinceId}
                sx={{
                  borderRadius: 1,
                  backgroundColor: theme.palette.secondary[300],
                  color: theme.palette.primary[500],
                  padding: "10px 50px",
                  mt: "15px",
                  "&:hover": {
                    backgroundColor: theme.palette.secondary[600],
                    color: theme.palette.primary[500],
                  },
                }}
                size="large"
              >
                Clear Form
              </Button>
            </FormControl>
          </Grid>
          <Grid
            item
            md={6}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <FormControl>
              <Button
                variant="contained"
                // disabled={!villageId || !districtId || !provinceId}
                type="submit"
                sx={{
                  borderRadius: 1,
                  backgroundColor: theme.palette.secondary[300],
                  color: theme.palette.primary[500],
                  padding: "10px 50px",
                  mt: "15px",
                  "&:hover": {
                    backgroundColor: theme.palette.secondary[600],
                    color: theme.palette.primary[500],
                  },
                }}
                size="large"
              >
                Submit
              </Button>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

export default NewPackage;
