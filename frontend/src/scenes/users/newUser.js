import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Box,
  FormControl,
  InputLabel,
  FormHelperText,
  Button,
  useTheme,
  Select,
  MenuItem,
  TextField,
  OutlinedInput,
  Grid,
  IconButton,
  FormControlLabel,
  Switch,
} from "@mui/material";

import { StoreUser } from "api/users";
import { GetStationDetailById, GetStationList } from "api/stations";
import { DataGrid } from "@mui/x-data-grid";
import { ClearOutlined } from "@mui/icons-material";

const NewUser = () => {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [stations, setStations] = useState([]);
  const [stationList, setStationList] = useState(null);
  const [selectedStation, setSelectedStation] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [remark, setRemark] = useState("");

  function clearForm() {
    setName("");
    setPassword("");
    setEmail("");
    setWhatsapp("");
    setRole("user");
    setStations([]);
    setWhatsapp("");
    setRemark("");
  }

  useEffect(() => {
    GetStationList().then((res) => {
      if (res.status === 200) {
        setStationList(res.data);
      } else {
        console.log(res);
      }
    });
  }, []);

  const formSubmittedHandler = (e) => {
    e.preventDefault();

    StoreUser(name, email, password, whatsapp, role, stations, remark).then(
      (res) => {
        console.log(res);
        if (res.status === 200) {
          clearForm();
          Swal.fire({
            title: "Created!",
            icon: "success",
            text: `${name} has been created`,
            timer: 1500,
          });
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
      }
    );
  };

  const buttonAddStationHandler = () => {
    GetStationDetailById(selectedStation).then((res) => {
      //   console.log(res);
      // Set new station that we just added
      let newStation = {
        id: res.data.id,
        name: res.data.name,
        default: true,
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

  const columns = [
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

  return (
    <form onSubmit={formSubmittedHandler}>
      <Grid container spacing={2}>
        {/* Left side */}
        <Grid item md={8}>
          <Grid container spacing={2}>
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
            <Grid item md={6}>
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
            </Grid>
            <Grid item md={6}>
              <FormControl fullWidth>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  autoComplete="new-password"
                  value={password}
                  type="password"
                  label="Password"
                  // placeholder="Description"
                  id="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
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
                    Super admin - Can create/modify users, stations, routes and
                    so on.
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
                  onClick={buttonAddStationHandler}
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
                columns={columns}
                getRowId={(row) => row.id}
                rows={stations || []}
                rowCount={stations ? stations.length : 0}
                hideFooter={true}
              ></DataGrid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box width="40vw">
        <Box mt={2}>
          <FormControl>
            <Button
              variant="contained"
              type="submit"
              disabled={
                stations.length <= 0 ||
                !name ||
                !whatsapp ||
                !email ||
                !password
              }
              sx={{
                borderRadius: 1,
                backgroundColor: theme.palette.secondary[300],
                color: theme.palette.primary[500],
                padding: "10px 50px",
                mt: "15px",
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
      </Box>
    </form>
  );
};

export default NewUser;
