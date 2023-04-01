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
  IconButton,
  Divider,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ClearOutlined } from "@mui/icons-material";
import uuid from "react-uuid";

import { StoreRole, GetApiLinks } from "api/role.js";

function NewRole() {
  const initialArray = [];

  const theme = useTheme();
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [permission, setPermission] = useState(initialArray);
  const [remark, setRemark] = useState("");
  const [apiLinks, setApiLinks] = useState(null);
  const [currentLinks, setCurrentLinks] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [seletedPath, setSelectedPath] = useState("");
  const dynamicHeight = Math.min(permission.length * 5 + 12, 70) + "vh";
  //   const methods = ['GET','POST','PUT','PATCH','STORE','DELETE']

  function clearForm() {
    setRole("");
    setDescription("");
    setPermission([]);
    setRemark("");
    setCurrentLinks(apiLinks);
  }

  useEffect(() => {
    setPermission([]);
    GetApiLinks().then((res) => {
      if (res.status === 200) {
        // console.log(res);
        setApiLinks(res.data);
        setCurrentLinks(res.data);
      } else {
        console.log(res);
      }
    });
  }, []);

  useEffect(
    function updateCurentLink() {
      var newArray = structuredClone(apiLinks);
      if (permission.length > 0) {
        permission.forEach((perm) => {
          newArray.forEach((api, index) => {
            if (selectedMethod === perm.method && api.path === perm.path) {
              newArray.splice(index, 1);
            }
          });
        });
        if (newArray.length > 0) {
          setSelectedPath(newArray[0].path);
        } else {
          setSelectedPath("");
        }
        setCurrentLinks(newArray);
      }
    },
    [permission, selectedMethod, apiLinks]
  );

  const formSubmittedHandler = (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    permission.forEach((obj) => {
      delete obj["id"];
    });
    // console.log(role, description, remark, permission);

    StoreRole(role, description, permission, remark).then((res) => {
      if (res.status === 200) {
        clearForm();
        Swal.fire({
          title: "Created!",
          icon: "success",
          text: `${role} has been created`,
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
    });
  };
  const buttonAddLinkHandler = (method, path) => {
    var obj = { id: uuid(), method, path };
    setPermission([...permission, obj]);
  };

  const buttonRemoveHandler = (objPermission) => {
    let newArray = [];
    // remove objPermission from stations (datagrid)
    newArray = permission.filter((item) => item.id !== objPermission.id);
    setPermission(newArray);
  };
  const columns = [
    {
      field: "method",
      headerName: "Method",
      flex: 1,
    },
    {
      field: "path",
      headerName: "Path",
      flex: 2,
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
      <Grid container spacing={2} width="700px">
        <Grid item md={4}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <OutlinedInput
              id="role"
              label="Role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
              }}
              required
            />
          </FormControl>
        </Grid>
        <Grid item md={8}>
          <FormControl fullWidth>
            <InputLabel>Description</InputLabel>
            <OutlinedInput
              id="description"
              label="Description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              required
            />
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
        <Grid item md={12}>
          <Divider />
        </Grid>
        <Grid item md={12}>
          <Typography variant="h5">Add permission</Typography>
        </Grid>
        <Grid item md={3}>
          <FormControl fullWidth>
            <InputLabel>Select Method</InputLabel>
            <Select
              id="methodList"
              defaultValue=""
              label="Select Method"
              onChange={(event) => setSelectedMethod(event.target.value)}
            >
              <MenuItem key="GET" value="GET">
                GET
              </MenuItem>
              <MenuItem key="POST" value="POST">
                POST
              </MenuItem>
              <MenuItem key="PUT" value="PUT">
                PUT
              </MenuItem>
              <MenuItem key="PATCH" value="PATCH">
                PATCH
              </MenuItem>
              <MenuItem key="STORE" value="STORE">
                STORE
              </MenuItem>
              <MenuItem key="DELETE" value="DELETE">
                DELETE
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={7}>
          <FormControl fullWidth>
            <InputLabel>Select API link</InputLabel>
            <Select
              id="apiLinks"
              value={currentLinks ? seletedPath : ""}
              defaultValue=""
              label="Select API link"
              onChange={(event) => setSelectedPath(event.target.value)}
            >
              {currentLinks &&
                currentLinks.map(({ _id, path }) => {
                  return (
                    <MenuItem key={_id} value={path}>
                      {path}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={2}>
          <FormControl fullWidth>
            <Button
              variant="contained"
              disabled={seletedPath === "" || selectedMethod === ""}
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
              onClick={() => buttonAddLinkHandler(selectedMethod, seletedPath)}
            >
              Add
            </Button>
          </FormControl>
        </Grid>
        <Grid
          item
          md={12}
          height={dynamicHeight}
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
            rows={permission || []}
            rowCount={permission ? permission.length : 0}
            hideFooter={true}
          ></DataGrid>
        </Grid>
        <Grid item md={12}>
          <Box display={"flex"} justifyContent={"flex-end"}>
            <FormControl>
              <Button
                type="submit"
                variant="contained"
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
        </Grid>
      </Grid>
    </form>
  );
}

export default NewRole;
