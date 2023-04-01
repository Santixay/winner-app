import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Grid,
  FormControl,
  Autocomplete,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  OutlinedInput,
  FormControlLabel,
  Switch,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import {
  ClearOutlined,
  CloseOutlined,
  ModeEditOutlineOutlined,
} from "@mui/icons-material";
import { GetCustomersList } from "api/customers";
import { GetRouteByProvince, GetRouteList, GetRouteDetail } from "api/routes";
import { GetPackageList, DeletePackage, PatchPackage } from "api/packages";
import Swal from "sweetalert2";
import { getScanText } from "utils";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PackageList = () => {
  const theme = useTheme();

  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Data to send to back-end
  const [packageId, setPackageId] = useState("");
  const [tracking, setTracking] = useState("");
  const [description, setDescription] = useState("");
  const [orderId, setOrderId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [routeId, setRouteId] = useState("");
  const [customer, setCustomer] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [status, setStatus] = useState("");
  const [station, setStation] = useState("");
  // const [tempStation, setTempStation] = useState("");
  const [whatsappStatus, setWhatsappStatus] = useState(false);

  const [remark, setRemark] = useState("");
  const [amount, setAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(false);

  // Data for front-end
  const [searchCustomer, setSearchCustomer] = useState("");
  const [customerList, setCustomerList] = useState([]);
  const [routeList, setRouteList] = useState([]);
  const [stationList, setStationList] = useState(null);

  // values to set in DataGrid
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  function RefreshPackageList(page, pageSize, sort, search) {
    setIsLoading(true)
    GetPackageList(page, pageSize, sort, search).then((res) => {
      if (res.status === 200) {
        setRows(res.data.packages);
        setTotalCount(res.data.total);
      } else {
        console.log(res.message);
      }
      setIsLoading(false)
    });
  }

  useEffect(() => {
    // setSearchCustomer("");
    GetRouteList().then((res) => {
      setRouteList(res.data);
    });
  }, []);
  useEffect(() => {
    if (routeId) {
      GetRouteDetail(routeId).then((res) => {
        if (res.status === 200) {
          setStationList(res.data.navigator);
          /* eslint-disable */
          // let isStationExist =
          //   Object.keys(
          //     res.data.navigator.filter((obj) => {
          //       return obj.station === station;
          //     })
          //   ).length !== 0;
          // if (isStationExist) {
          //   setStation(tempStation);
          // } else {
          //   setStation(null);
          // }
        }
      });
    }
  }, [routeId]);

  useEffect(() => {
    // console.log(sort)
    RefreshPackageList(page, pageSize, sort, search);
  }, [search, page, pageSize, sort]);

  useEffect(() => {
    GetCustomersList(undefined, undefined, undefined, searchCustomer).then(
      (res) => {
        if (res.status === 200) {
          setCustomerList(res.data.customers);
          let selectedCustomer = res.data.customers.filter((obj) => {
            return obj.name === searchCustomer;
          });
          // Set customer if selectedCustomer is not empty
          let isSelectCustomerExist =
            Object.keys(selectedCustomer).length !== 0;
          if (isSelectCustomerExist) {
            let customerObj = {
              _id: selectedCustomer[0]._id,
              id: selectedCustomer[0].id,             
              name: selectedCustomer[0].name,
              whatsapp: selectedCustomer[0].whatsapp,
              pr_id: selectedCustomer[0].province.pr_id,
            };
            setCustomer(customerObj);
          } else {
            setCustomer(null);
          }
        } else {
          console.log(res.message);
        }
      }
    );
  }, [searchCustomer]);

  useEffect(() => {
    if (customer) {
      GetRouteByProvince(customer.pr_id).then((res) => {
        if (res.data) {
          setRouteId(res.data);
        }
      });
    }
  }, [customer]);

  const buttonEditHandler = (event, cellValues) => {
    const {
      _id,
      tracking,
      description,
      orderId,
      customer,
      amount,
      quantity,
      shippingFee,
      routeId,
      station,
      status,
      remark,
      paymentStatus,
      whatsappStatus,
    } = cellValues.row;
    setSearchCustomer(customer.name);
    setEditDialogOpen(true);
    setPackageId(_id);
    setTracking(tracking);
    setDescription(description);
    setOrderId(orderId);
    // setCustomer(customer);
    setRouteId(routeId);
    setAmount(amount);
    setQuantity(quantity);
    setShippingFee(shippingFee);
    setStatus(status);
    setRemark(remark);
    setPaymentStatus(paymentStatus);
    setStation(station);
    // setTempStation(station);
    setWhatsappStatus(whatsappStatus);
  };

  const buttonDeleteHandler = (event, cellValues) => {
    console.log("delete button clicked");
    Swal.fire({
      title: `Delete ${cellValues.row.tracking} ?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        DeletePackage(cellValues.row._id).then((res) => {
          if (res.status === 200) {
            // DELETE SELECTED ROW FROM ARRAY "data.packages"
            setRows(() => {
              return rows.filter((item) => item._id !== cellValues.id);
            });

            Swal.fire({
              title: "Deleted!",
              text: res.message,
              icon: "success",
              timer: 1500,
            });
          } else if (res.status === 400) {
            Swal.fire({
              backdrop: true,
              toast: false,
              icon: "error",
              text: `Status ${res.status} - ${res.data.message}`,
              showConfirmButton: true,
            });
          } else {
            Swal.fire({
              backdrop: true,
              toast: false,
              icon: "error",
              text: res.message,
              showConfirmButton: true,
            });
          }
        });
      }
    });
  };

  const formSubmiteedHandler = (e) => {
    e.preventDefault();
    PatchPackage(
      packageId,
      tracking,
      description,
      orderId,
      customer.id,
      amount,
      quantity,
      shippingFee,
      routeId,
      station,
      status,
      remark,
      paymentStatus,
      whatsappStatus
    ).then((res) => {
      // console.log(res);
      if (res.status === 200) {
        // update object data in rows
        let objIndex = rows.findIndex((obj) => obj._id === packageId);
        rows[objIndex].tracking = tracking;
        rows[objIndex].description = description;
        rows[objIndex].orderId = orderId;
        rows[objIndex].customer = customer;
        rows[objIndex].amount = amount;
        rows[objIndex].quantity = quantity;
        rows[objIndex].shippingFee = shippingFee;
        rows[objIndex].routeId = routeId;
        rows[objIndex].station = station;
        rows[objIndex].status = status;
        rows[objIndex].remark = remark;
        rows[objIndex].paymentStatus = paymentStatus;
        rows[objIndex].whatsappStatus = whatsappStatus;

        setEditDialogOpen(false);
        Swal.fire({
          title: "Updated!",
          icon: "success",
          text: res.message,
          timer: 1500,
        });
      } else if (res.status === 400) {
        Swal.fire({
          title: "Error!",
          icon: "error",
          text: `Status ${res.status} - ${res.data.message}`,
        });
      } else {
        Swal.fire({
          title: "Error!",
          icon: "error",
          text: res.message,
        });
      }
    });
  };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
      hide: true,
    },
    {
      field: "customer",
      headerName: "Customer",
      flex: 0.5,
      valueGetter: (params) => params.row.customer.name,
    },
    {
      field: "orderId",
      headerName: "Order ID",
      flex: 0.5,
    },
    {
      field: "tracking",
      headerName: "Tracking",
      flex: 0.5,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
    },
    {
      field: "routeId",
      headerName: "Route ID",
      flex: 0.3,
    },
    // {
    //   field: "amount",
    //   headerName: "Amount",
    //   flex: 0.5,
    // },
    // {
    //   field: "quantity",
    //   headerName: "QTY",
    //   flex: 0.5,
    // },
    {
      field: "shippingFee",
      headerName: "Shipping fee",
      flex: 0.3,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
    },
    {
      field: "station",
      headerName: "Station",
      flex: 0.5,
    },

    {
      field: "edit",
      headerName: "Edit",
      flex: 0.2,
      renderCell: (cellValues) => {
        return (
          <IconButton
            variant="outline"
            onClick={(event) => {
              buttonEditHandler(event, cellValues);
            }}
            sx={{ "&:hover": { color: theme.palette.warning.main } }}
          >
            <ModeEditOutlineOutlined />
          </IconButton>
        );
      },
    },
    {
      field: "del",
      headerName: "Delete",
      flex: 0.2,

      renderCell: (cellValues) => {
        return (
          <IconButton
            variant="outline"
            sx={{ "&:hover": { color: theme.palette.error.main } }}
            onClick={(event) => buttonDeleteHandler(event, cellValues)}
          >
            <ClearOutlined />
          </IconButton>
        );
      },
    },
  ];

  return (
    <Box>
      {/*  Data Grid  */}
      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading}
          getRowId={(row) => row._id}
          rows={rows || []}
          columns={columns}
          rowCount={totalCount || 0}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
        />
      </Box>

      {/* Edit Package Dialog */}
      <Box>
        <Dialog
          open={editDialogOpen}
          TransitionComponent={Transition}
          maxWidth="sm"
          keepMounted
          onClose={() => {
            setEditDialogOpen(false);
            // setCustomer(null);
          }}
          aria-describedby="alert-dialog-slide-description"
        >
          <form onSubmit={formSubmiteedHandler}>
            <DialogTitle>
              Edit Package
              <IconButton
                aria-label="close"
                onClick={() => setEditDialogOpen(false)}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                }}
              >
                <CloseOutlined />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} mt={2}>
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
                        }
                      }}
                      disablePortal
                      id="combo-box-customer"
                      options={customerList}
                      value={customer}
                      isOptionEqualToValue={(option, value) => {
                        return option._id === value._id;
                      }}
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
                <Grid item md={6}>
                  <InputLabel>
                    <Grid container paddingLeft={2} paddingRight={4}>
                      <Grid item md={5}>
                        Station
                      </Grid>
                      <Grid item md={2}></Grid>
                      <Grid item md={5}>
                        Next Station
                      </Grid>
                    </Grid>
                  </InputLabel>
                  <Select
                    fullWidth
                    value={stationList ? station : ""}
                    onChange={(e) => setStation(e.target.value)}
                  >
                    {stationList &&
                      stationList.map(
                        ({ _id, station, stationName, nextStationName }) => {
                          return (
                            <MenuItem key={_id} value={station}>
                              <Grid container>
                                <Grid item md={5}>
                                  {stationName}
                                </Grid>
                                <Grid item md={2}>
                                  {" => "}
                                </Grid>
                                <Grid item md={5}>
                                  {nextStationName ? nextStationName : ""}
                                </Grid>
                              </Grid>
                            </MenuItem>
                          );
                        }
                      )}
                  </Select>
                </Grid>
                <Grid item md={3}>
                  <InputLabel>Payment Status</InputLabel>
                  <FormControlLabel
                    control={
                      <Switch
                        color="secondary"
                        checked={paymentStatus}
                        onChange={() => setPaymentStatus(!paymentStatus)}
                      />
                    }
                    label={paymentStatus ? "ຈ່າຍແລ້ວ" : "ຍັງບໍ່ໄດ້ຈ່າຍ"}
                  />
                </Grid>
                <Grid item md={3}>
                  <InputLabel>Whatsapp Status</InputLabel>
                  <FormControlLabel
                    control={
                      <Switch
                        color="secondary"
                        checked={whatsappStatus || false}
                        onChange={() => setWhatsappStatus(!whatsappStatus)}
                      />
                    }
                    label={whatsappStatus ? "ສົ່ງແລ້ວ" : "ຍັງບໍ່ໄດ້ສົ່ງ"}
                  />
                </Grid>
                <Grid item md={12}>
                  <Divider sx={{ mt: 2, mb: 2 }} />
                </Grid>
                <Grid item md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tracking Number</InputLabel>
                    <OutlinedInput
                      label="Tracking Number"
                      id="tracking"
                      value={tracking}
                      required={true}
                      onChange={(e) => setTracking(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                          setTracking(getScanText(tracking));
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
              </Grid>
            </DialogContent>
            <DialogActions>
              <FormControl>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    borderRadius: 1,
                    backgroundColor: theme.palette.secondary[300],
                    color: theme.palette.primary[500],
                    padding: "10px 50px",
                    m: "15px",
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
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Box>
  );
};

export default PackageList;
