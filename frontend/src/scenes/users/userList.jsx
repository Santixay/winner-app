import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Box,
  useTheme,
  IconButton,
  Dialog,
  Grid,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Slide,
  Link,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ClearOutlined from "@mui/icons-material/ClearOutlined";
import { DataGrid } from "@mui/x-data-grid";
import { GetUsersList, PatchUser, PatchUserPassword } from "api/users";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { GetStationDetailById, GetStationList } from "api/stations";
import { CloseOutlined } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserList = () => {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  // for edit dialog form
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [stations, setStations] = useState([]);
  const [stationList, setStationList] = useState(null);
  const [selectedStation, setSelectedStation] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [remark, setRemark] = useState("");
  const [validflag, setValidflag] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [newPsasword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfrimNewPassword] = useState("");

  function clearForm() {
    setName("");
    setEmail("");
    setWhatsapp("");
    setRole("user");
    setStations([]);
    setWhatsapp("");
    setRemark("");
    setNewPassword("");
    setConfrimNewPassword("");
  }

  useEffect(() => {
    GetStationList().then((res) => {
      if (res.status === 200) {
        let data = res.data;
        // console.log(res.data);
        for (var i in data) {
          let a = data[i].id;
          if (stations && stations.length > 0) {
            for (var j in stations) {
              let b = stations[j].id;
              if (a === b) {
                data.splice(i, 1);
              }
            }
          }
        }
        setStationList(data);
      } else {
        console.log(res);
      }
    });
  }, [editDialogOpen]);

  const formResetPasswordHandler = (e) => {
    e.preventDefault();
    if (
      newPsasword &&
      confirmNewPassword &&
      newPsasword === confirmNewPassword
    ) {
      PatchUserPassword(userId, newPsasword).then((res) => {
        if (res.status === 200) {
          Swal.fire({
            title: "Updated!",
            icon: "success",
            text: `Password has been reset`,
            timer: 1500,
          });
          setResetPasswordDialogOpen(false);
          setNewPassword("");
          setConfrimNewPassword("");
        }
      });
    }
  };

  const formSubmittedHandler = (e) => {
    e.preventDefault();
    PatchUser(
      userId,
      name,
      email,
      whatsapp,
      role,
      stations,
      remark,
      validflag
    ).then((res) => {
      if (res.status === 200) {
        // update object data in rows
        let objIndex = rows.findIndex((obj) => obj._id === userId);
        rows[objIndex].name = name;
        rows[objIndex].email = email;
        rows[objIndex].whatsapp = whatsapp;
        rows[objIndex].role = role;
        rows[objIndex].stations = stations;
        rows[objIndex].remark = remark;
        rows[objIndex].validflag = validflag;

        Swal.fire({
          title: "Updated!",
          icon: "success",
          text: `${name} has been created`,
          timer: 1500,
        });
        setEditDialogOpen(false);
        clearForm();
      } else if (res.status === 400) {
        Swal.fire({
          title: "Error!",
          icon: "error",
          text: `Status ${res.status} - ${res.data.message}`,
          showConfirmButton: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          text: res.message,
          showConfirmButton: true,
        });
      }
    });
  };

  const buttonAddStatioHandler = () => {
    GetStationDetailById(selectedStation).then((res) => {
      //   console.log(res);
      // Set new station that we just added
      let newStation = {
        id: res.data.id,
        name: res.data.name,
        default: true,
        parcelStatus: res.data.parcelStatus,
      };

      let newArray = [];
      // Remove station that we added from stationList
      newArray = stationList.slice();
      newArray = newArray.filter((item) => item.id !== newStation.id);
      setStationList(newArray);
      newArray.length > 0
        ? setSelectedStation(newArray[0].id)
        : setSelectedStation("");

      // Clear newArray data
      newArray = [];
      // If station is not empty, get data
      if (stations.length > 0) {
        newStation.default = false;
        newArray = stations.slice();
      }
      //add new Station to newArray  and setStation to the newArray that we have added a station
      newArray.push(newStation);
      setStations(newArray);
    });
  };

  const updateDefaultStation = (stationId) => {
    // find index of the stationID that passed from datagrid
    let objIndex = stations.findIndex((obj) => obj.id === stationId);
    // if station.default is false, set all station to be false first
    // and then update new station.default to true
    if (!stations[objIndex].default) {
      for (var i in stations) {
        stations[i].default = false;
      }
    } else {
      if (objIndex + 1 < stations.length) {
        stations[objIndex + 1].default = true;
      } else {
        stations[0].default = true;
      }
    }
    stations[objIndex].default = !stations[objIndex].default;
  };

  const buttonRemoveHandler = (objStation) => {
    let newArray = [];
    // remove objStation from stations (datagrid)
    newArray = stations.filter((item) => item.id !== objStation.id);
    // if objStaion.defalut is true and newAryy not empty
    // set at another station to be default
    if (objStation.default && newArray.length > 0) {
      newArray[0].default = true;
    }
    setStations(newArray);

    // Add remove station back to stationList
    newArray = [];
    if (stationList.length > 0) {
      newArray = stationList.slice();
    }
    newArray.push(objStation);
    setStationList(newArray);
  };
  const editDialogColumns = [
    {
      field: "id",
      headerName: "Station ID",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Station Name",
      flex: 2,
    },
    {
      field: "default",
      headerName: "Default",
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <FormControlLabel
            control={
              <Switch
                color="secondary"
                disabled={stations.length === 1}
                checked={cellValues.row.default}
                onChange={() => updateDefaultStation(cellValues.row.id)}
              />
            }
            label={cellValues.row.default ? "Yes" : "No"}
          />
        );
      },
    },

    {
      field: "remove",
      headerName: "Remove",
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <IconButton
            variant="outline"
            sx={{ "&:hover": { color: theme.palette.error.main } }}
            onClick={() => buttonRemoveHandler(cellValues.row)}
          >
            <ClearOutlined />
          </IconButton>
        );
      },
    },
  ];

  useEffect(() => {
    GetUsersList(search).then((res) => {
      if (res.status === 200) {
        // console.log(res);
        setRows(res.data);
      }
    });
  }, [search]);

  const buttonEditHandler = (event, cellValues) => {
    // console.log(cellValues.row);
    const { _id, name, email, whatsapp, role, stations, validflag, remark } =
      cellValues.row;

    setUserId(_id);
    setName(name);
    setEmail(email);
    setWhatsapp(whatsapp);
    setRole(role);
    setStations(stations);
    setValidflag(validflag);
    setRemark(remark);
    setEditDialogOpen(true);
  };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
      hide: true,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
    },
    {
      field: "whatsapp",
      headerName: "whatsapp",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.7,
    },
    {
      field: "stations",
      headerName: "Stations",
      flex: 1.5,
      renderCell: (cellValues) => {
        let stations = cellValues.row.stations;
        let stationStr = "";
        for (var i in stations) {
          if (i > 0) {
            stationStr += ", ";
          }
          stationStr += stations[i].id;
        }

        return stationStr;
      },
    },
    {
      field: "defaultStation",
      headerName: "Default",
      flex: 0.7,
      renderCell: (cellValues) => {
        let stations = cellValues.row.stations;
        let stationStr = "";
        for (var i in stations) {
          if (stations[i].default === true) {
            stationStr = stations[i].id;
          }
        }

        return stationStr;
      },
    },
    {
      field: "validflag",
      headerName: "Validflag",
      flex: 0.5,
      renderCell: (cellValues) => {
        return cellValues.row.validflag ? (
          <ToggleOnIcon color="secondary" fontSize="large" />
        ) : (
          <ToggleOffIcon fontSize="large" />
        );
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.3,
      renderCell: (cellValues) => {
        return (
          <IconButton
            variant="outline"
            onClick={(event) => {
              buttonEditHandler(event, cellValues);
            }}
            sx={{ "&:hover": { color: theme.palette.warning.main } }}
          >
            <ModeEditOutlineIcon />
          </IconButton>
        );
      },
    },
  ];

  return (
    <Box
      height="80vh"
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
        getRowId={(row) => row._id}
        rows={rows || []}
        columns={columns}
        rowCount={rows.length || 0}
        rowsPerPageOptions={[20, 50, 100]}
        pagination
        // page={page}
        // pageSize={pageSize}
        // paginationMode="server"
        // sortingMode="server"
        // onPageChange={(newPage) => setPage(newPage)}
        // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        // onSortModelChange={(newSortModel) => setSort(...newSortModel)}
        components={{ Toolbar: DataGridCustomToolbar }}
        componentsProps={{
          toolbar: { searchInput, setSearchInput, setSearch },
        }}
      />
      <Dialog
        open={resetPasswordDialogOpen}
        // TransitionComponent={Transition}
        maxWidth="sm"
        keepMounted
        style={{ zIndex: 1310 }}
        // overlayStye={theme.palette.primary[600]}
        onClose={() => {
          setResetPasswordDialogOpen(false);
          // clearForm();
        }}
        PaperProps={{
          style: {
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.primary[700]
                : theme.palette.grey[200],
            // boxShadow: 'none',
          },
        }}
      >
        <form onSubmit={formResetPasswordHandler}>
          <DialogTitle>
            Reset password
            <IconButton
              aria-label="close"
              onClick={() => setResetPasswordDialogOpen(false)}
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
            <Grid container spacing={2} marginTop={1}>
              <Grid item md={12}>
                <FormControl fullWidth>
                  <InputLabel>New Password</InputLabel>
                  <OutlinedInput
                    type="password"
                    id="newPsasword"
                    label="New Password"
                    value={newPsasword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                    }}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item md={12}>
                <FormControl fullWidth>
                  <InputLabel>Confirm New Password</InputLabel>
                  <OutlinedInput
                    type="password"
                    id="confirmNewPassword"
                    value={confirmNewPassword}
                    label="Confirm New Password"
                    onChange={(e) => {
                      setConfrimNewPassword(e.target.value);
                    }}
                    required
                  />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Box margin={2}>
              <FormControl>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={
                    stations.length <= 0 || !name || !whatsapp || !email
                  }
                  sx={{
                    borderRadius: 1,
                    backgroundColor: theme.palette.secondary[300],
                    color: theme.palette.primary[500],
                    padding: "10px 50px",
                    marginLeft: "auto",
                    "&:hover": {
                      backgroundColor: theme.palette.secondary[600],
                      color: theme.palette.primary[500],
                    },
                  }}
                  size="large"
                >
                  Reset
                </Button>
              </FormControl>
            </Box>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={editDialogOpen}
        TransitionComponent={Transition}
        maxWidth="sm"
        keepMounted
        style={{ zIndex: 1300 }}
        // overlayStye={theme.palette.primary[600]}
        onClose={() => {
          setEditDialogOpen(false);
          clearForm();
        }}
        PaperProps={{
          style: {
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.primary[700]
                : theme.palette.grey[200],
          },
        }}
      >
        <form onSubmit={formSubmittedHandler}>
          <DialogTitle>
            Edit User
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
            <Grid container spacing={2} marginTop={1}>
              <Grid item md={6}>
                <FormControl fullWidth>
                  <InputLabel>Name</InputLabel>
                  <OutlinedInput
                    id="name"
                    label="Name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item md={6}>
                <FormControl fullWidth>
                  <InputLabel>Whatsapp</InputLabel>
                  <OutlinedInput
                    type="number"
                    id="whatsapp"
                    value={whatsapp}
                    label="Whatsapp"
                    onChange={(e) => {
                      setWhatsapp(e.target.value);
                    }}
                    required
                  />
                  <FormHelperText> example: 8562077790708</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item md={9}>
                <FormControl fullWidth>
                  <InputLabel>Email</InputLabel>
                  <OutlinedInput
                    value={email}
                    label="Email"
                    type="email"
                    // placeholder="Description"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </FormControl>
                <FormHelperText>
                  <Link
                    component="button"
                    variant="body2"
                    color="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      setResetPasswordDialogOpen(true);
                    }}
                  >
                    Reset password
                  </Link>
                </FormHelperText>
              </Grid>
              <Grid item md={3}>
                <InputLabel>Validflag</InputLabel>
                <FormControlLabel
                  control={
                    <Switch
                      color="secondary"
                      checked={validflag || false}
                      onChange={() => setValidflag(!validflag)}
                    />
                  }
                  label={validflag ? "Enabled" : "Disabled"}
                />
              </Grid>
              <Grid item md={12}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    id="role"
                    value={role}
                    label="role"
                    onChange={(event) => setRole(event.target.value)}
                    required
                  >
                    <MenuItem key="user" value="user">
                      User - Can create packages, customers, scan and so on.
                    </MenuItem>
                    <MenuItem key="admin" value="admin">
                      Admin - Can create/modify packages, customers, scan and so
                      on.
                    </MenuItem>
                    <MenuItem key="superadmin" value="superadmin">
                      Super admin - Can create/modify users, stations, routes
                      and so on.
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={12}>
                <FormControl fullWidth>
                  <TextField
                    value={remark}
                    multiline
                    maxRows={5}
                    label="Remark / ໝາຍເຫດ"
                    id="remark"
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item md={9}>
                <FormControl fullWidth>
                  <InputLabel>Select Station</InputLabel>
                  <Select
                    id="stationList"
                    value={stationList ? selectedStation : ""}
                    defaultValue=""
                    label="Select Station"
                    onChange={(event) => setSelectedStation(event.target.value)}
                  >
                    {stationList &&
                      stationList.map(({ id, name }) => {
                        return (
                          <MenuItem key={id} value={id}>
                            {id} - {name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={3}>
                <FormControl fullWidth>
                  <Button
                    variant="contained"
                    disabled={selectedStation === ""}
                    sx={{
                      borderRadius: 1,
                      backgroundColor: theme.palette.secondary[300],
                      color: theme.palette.primary[500],
                      padding: "15px 0",
                      "&:hover": {
                        backgroundColor: theme.palette.secondary[600],
                        color: theme.palette.primary[500],
                      },
                    }}
                    size="large"
                    onClick={buttonAddStatioHandler}
                  >
                    Add station
                  </Button>
                </FormControl>
              </Grid>
              <Grid
                item
                md={12}
                height={300}
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
                  columns={editDialogColumns}
                  getRowId={(row) => row.id}
                  rows={stations || []}
                  rowCount={stations ? stations.length : 0}
                  hideFooter={true}
                ></DataGrid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Box margin={2}>
              <FormControl>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={
                    stations.length <= 0 || !name || !whatsapp || !email
                  }
                  sx={{
                    borderRadius: 1,
                    backgroundColor: theme.palette.secondary[300],
                    color: theme.palette.primary[500],
                    padding: "10px 50px",
                    marginLeft: "auto",
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
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UserList;
