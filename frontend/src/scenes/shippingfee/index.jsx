import React, { useState } from "react";
import Header from "components/Header";
import {
  InputBase,
  Box,
  IconButton,
  useTheme,
  Button,
  Grid,
  FormControl,
  TextField,
  InputLabel,
  Divider,
  OutlinedInput,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FlexBetween from "components/FlexBetween";
import {
  GetPackageDetailByTracking,
  PatchShippingFee,
} from "api/packages";
import Swal from "sweetalert2";
import { playAlertSound, playCorrectSound, playIncorrectSound } from "utils";

function selectAndFocus(elementId) {
  document.getElementById(elementId).select();
  document.getElementById(elementId).focus();
}

const ShippingFee = () => {
  const theme = useTheme();
  const [tracking, setTracking] = useState("");
  const [searchTracking, setSearchTracking] = useState("");

  // Data to send to back-end
  const [packageId, setPackageId] = useState("");
  const [description, setDescription] = useState("");
  const [orderId, setOrderId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [shippingFee, setShippingFee] = useState(0);

  const [remark, setRemark] = useState("");
  const [amount, setAmount] = useState(0);

  function clearForm() {
    setPackageId("");
    setTracking("");
    setOrderId("");
    setDescription("");
    setRemark("");
    setAmount("");
    setQuantity(0);
    setShippingFee(0);
    setSearchTracking("");
    document.getElementById("searchTracking").focus();
  }

  const formSearchTrackingHandler = (e) => {
    e.preventDefault();
    GetPackageDetailByTracking(searchTracking).then(async (res) => {
      if (res.status === 200) {
        let data = res.data; //Get current station and routeId from package
        console.log(res.data);
        setPackageId(data._id);
        setTracking(data.tracking);
        setOrderId(data.orderId);
        setDescription(data.description);
        setRemark(data.remark);
        setAmount(data.amount);
        setQuantity(data.quantity);
        setShippingFee(data.shippingFee);
        document.getElementById("shippingFee").select();
        document.getElementById("shippingFee").focus();
      } else if (res.status === 204) {
        playAlertSound()
        Swal.fire({
          title: "Data not found",
          icon: "warning",
          text: "This tacking number doesn't exist",
          timer: 1500,
        });
        selectAndFocus("tracking");
      } else {
        playIncorrectSound();
        Swal.fire({
          title: "Error",
          icon: "error",
          text: res.message,
          timer: 1500,
        });
        selectAndFocus("tracking");
      }
    });
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    PatchShippingFee(
      packageId,
      tracking,
      orderId,
      description,
      remark,
      amount,
      quantity,
      shippingFee
    ).then((res) => {
      if (res.status === 200) {
        playCorrectSound();
        Swal.fire({
          icon: "success",
          title: `Success!`,
          text: `This package has been updated`,
          timer: 1500,
        });
        
      }
    }).finally(clearForm());
  };
  return (
    <Box m="0 1rem">
      <Grid container spacing={2}>
        <Grid item md={6}>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <Header title="Shipping Fee" />
            </Grid>
            <Grid item md={12}>
              {/* Scan package section */}
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <FormControl fullWidth>
                    <FlexBetween
                      backgroundColor={theme.palette.background.alt}
                      borderRadius="9px"
                      gap="3rem"
                      p="0.5rem 1rem"
                    >
                      <InputBase
                        placeholder="Tracking number"
                        id="searchTracking"
                        autoFocus
                        value={searchTracking}
                        onChange={(e) => setSearchTracking(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            formSearchTrackingHandler(e);
                          }
                        }}
                      />
                      <IconButton onClick={formSubmitHandler}>
                        <SearchIcon />
                      </IconButton>
                    </FlexBetween>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={12}>
              <Divider />
            </Grid>
            <Grid item md={12}>
              {/*  Form section  */}
              <form onSubmit={formSubmitHandler}>
                <Grid container spacing={2}>
                  <Grid item md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Tracking Number</InputLabel>
                      <OutlinedInput
                        label="Tracking Number"
                        id="tracking"
                        value={tracking}
                        required={true}
                        onChange={(e) => setTracking(e.target.value)}
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
                </Grid>
                <Grid item md={12}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <FormControl>
                      <Button
                        variant="contained"
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
                  </Box>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShippingFee;
