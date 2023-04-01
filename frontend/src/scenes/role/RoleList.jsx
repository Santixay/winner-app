import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import uuid from "react-uuid";

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
  Divider,
  Typography,
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
import { GetApiLinks, GetRoleList, PatchRole } from "api/role";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function RoleList() {
  const initialArray = [];

  const theme = useTheme();
  const [rows, setRows] = useState([]);
  // for edit dialog form

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [roleId, setRoleId] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [permission, setPermission] = useState(initialArray);
  const [remark, setRemark] = useState("");
  const [validflag, setValidflag] = useState(false);

  const [apiLinks, setApiLinks] = useState(null);
  const [currentLinks, setCurrentLinks] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [seletedPath, setSelectedPath] = useState("");
  const dynamicHeight = Math.min(permission.length * 5 + 12, 70) + "vh";

  useEffect(() => {
    setPermission([]);
    getRoles();
    getApis();
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
        console.log(newArray);
        setCurrentLinks(newArray);
      }
    },
    [permission, selectedMethod, apiLinks]
  );

  function getRoles() {
    GetRoleList().then((res) => {
      if (res.status === 200) {
        setRows(res.data);
      } else {
        console.log(res);
      }
    });
  }
  function getApis() {
    GetApiLinks().then((res) => {
      if (res.status === 200) {
        console.log(res);
        setApiLinks(res.data);
        setCurrentLinks(res.data);
      } else {
        console.log(res);
      }
    });
  }
  function clearForm() {
    setRoleId("");
    setRole("");
    setDescription("");
    setPermission([]);
    setRemark("");
    setCurrentLinks(apiLinks);
  }

  const formSubmittedHandler = (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    permission.forEach((obj) => {
      delete obj["_id"];
    });

    PatchRole(roleId, role, description, permission, remark, validflag).then(
      (res) => {
        if (res.status === 200) {
          clearForm();
          Swal.fire({
            title: "Updated!",
            icon: "success",
            text: `${role} has been updated`,
            timer: 1500,
          });
          setEditDialogOpen(false);
          getRoles();
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

  const buttonAddLinkHandler = (method, path) => {
    var obj = { _id: uuid(), method, path };
    setPermission([...permission, obj]);
  };

  const buttonRemoveHandler = (objPermission) => {
    console.log(objPermission);
    console.log(permission);
    let newArray = [];
    // // remove objPermission from stations (datagrid)
    newArray = permission.filter((item) => item._id !== objPermission._id);
    console.log("newArray", newArray);
    setPermission(newArray);
  };

  const buttonEditHandler = (event, cellValues) => {
    console.log(cellValues.row);
    const { _id, role, description, remark, permission, validflag } =
      cellValues.row;
    setRoleId(_id);
    setRole(role);
    setDescription(description);
    setPermission(permission);
    setRemark(remark);
    setValidflag(validflag);
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
      field: "role",
      headerName: "Role",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 3,
    },
    {
      field: "remark",
      headerName: "Remark",
      flex: 2,
    },
    {
      field: "validflag",
      headerName: "Validflag",
      flex: 1,
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
      flex: 0.5,
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

  const permissionColumns = [
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
    <Box
      height="60vh"
      width="800px"
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
        // components={{ Toolbar: DataGridCustomToolbar }}
        // componentsProps={{
        //   toolbar: { searchInput, setSearchInput, setSearch },
        // }}
        hideFooter={true}
      />
      <Dialog
        open={editDialogOpen}
        TransitionComponent={Transition}
        maxWidth="md"
        keepMounted
        // style={{ zIndex: 1300 }}
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
        <DialogTitle>
          Edit role
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
        <Box margin={3}>
          <form onSubmit={formSubmittedHandler}>
            <Grid container spacing={2}>
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
                    onClick={() =>
                      buttonAddLinkHandler(selectedMethod, seletedPath)
                    }
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
                  columns={permissionColumns}
                  getRowId={(row) => row._id}
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
        </Box>
      </Dialog>
    </Box>
  );
}

export default RoleList;
