import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { QueryProvinces, QueryDistrists, QueryVillages } from "api/general";
import {
  PatchCustomer,
  DeleteCustomer,
  GetCustomersList,
} from "api/customers";
import {
  Box,
  useTheme,
  Button,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  IconButton,
  styled,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Switch,
} from "@mui/material";
// import { useGetCustomersQuery } from "state/api";
import { DataGrid } from "@mui/x-data-grid";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  zIndex: 1,
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const CustomerList = () => {
  const theme = useTheme();

  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [customerId, setCustomerId] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [provinceId, setProvinceId] = useState("");
  const [districts, setDistricts] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [villages, setVillages] = useState([]);
  const [villageId, setVillageId] = useState("");
  const [remark, setRemark] = useState("");
  const [validflag, setValidflag] = useState(true);

  useEffect(() => {
    QueryProvinces().then((res) => setProvinces(res.data));
  }, []);

  useEffect(() => {
    if (provinceId) {
      setVillageId("");
      setVillages([]);
      setDistrictId("");
      setDistricts([]);
      QueryDistrists(provinceId).then((res) => setDistricts(res.data));
    }
  }, [provinceId]);

  useEffect(() => {
    if (districtId) {
      setVillageId("");
      QueryVillages(districtId).then((res) => setVillages(res.data));
    }
  }, [districtId]);

  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");

  // values to set in DataGrid
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  function RefreshCutomersList(page, pageSize, sort, search) {
    setIsLoading(true);
    GetCustomersList(page, pageSize, sort, search).then((res) => {
      if (res.status === 200) {
        setRows(res.data.customers);
        setTotalCount(res.data.total);
        setIsLoading(false);
      } else {
        console.log(res.message);
      }
      setIsLoading(false)
    });
  }

  useEffect(() => {
    // console.log(sort)
    RefreshCutomersList(page, pageSize, sort, search);
  }, [search, page, pageSize, sort]);

  const buttonEditHandler = (event, cellValues) => {
    const {
      _id,
      name: customerName,
      whatsapp,
      province,
      district,
      village,
      remark,
      validflag,
    } = cellValues.row;

    setProvinceId(province.pr_id);
    QueryDistrists(province.pr_id).then((res) => {
      setDistricts(res.data);
      setDistrictId(district.dt_id);
    });
    QueryVillages(district.dt_id).then((res) => {
      setVillages(res.data);
      setVillageId(village.vill_id);
    });

    setName(customerName);
    setWhatsapp(whatsapp);
    setCustomerId(_id);
    setRemark(remark);
    setValidflag(validflag)
    setOpenEditDialog(true);
  };

  const buttonDeleteHandler = (event, cellValues) => {
    Swal.fire({
      title: `Delete ${cellValues.row.name} ?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteCustomer(cellValues.row._id).then((res) => {
          if (res.status === 200) {
            // DELETE SELECTED ROW FROM ARRAY "data.customers"
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

  const formSubmittedHandler = (e) => {
    e.preventDefault();
    const provinceObj = provinces.find(
      (item) => item.pr_id === provinceId.toString()
    );
    const districtObj = districts.find(
      (item) => item.dt_id === districtId.toString()
    );
    const villageObj = villages.find(
      (item) => item.vill_id === villageId.toString()
    );

    PatchCustomer(
      customerId,
      name,
      whatsapp,
      provinceObj,
      districtObj,
      villageObj,
      validflag,
      remark
    ).then((res) => {
      if (res.status === 200) {
        // update object data in rows
        let objIndex = rows.findIndex((obj) => obj._id === customerId);
        rows[objIndex].name = name;
        rows[objIndex].whatsapp = whatsapp;
        rows[objIndex].province = provinceObj;
        rows[objIndex].district = districtObj;
        rows[objIndex].village = villageObj;
        rows[objIndex].validflag = validflag;
        rows[objIndex].remark = remark;

        setOpenEditDialog(false);
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
      hide: true
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
    },
    {
      field: "whatsapp",
      headerName: "WhatsApp",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      valueGetter: (params) => {
        let address = params.row.province.pr_name;
        address +=  params.row.district.dt_name ? ", " + params.row.district.dt_name : ""
        address += params.row.village.vill_name ? ", " + params.row.village.vill_name: ""
        return address
      },
    },
    {
      field: "remark",
      headerName: "Remark",
      flex: 1
    },
    {
      field: "validflag",
      headerName: "Validflag",
      flex: 0.5,
      // renderCell: (cellValues)=>{
      //   return cellValues.validflag ? <ToggleOnIcon/> : <ToggleOffIcon/> 
      // }
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
            <ModeEditOutlineIcon />
          </IconButton>
        );
      },
    },

    {
      field: "del",
      headerName: "Delete",
      flex: 0.3,
      
      renderCell: (cellValues) => {
        return (
          <IconButton
            variant="outline"
            sx={{ "&:hover": { color: theme.palette.error.main } }}
            onClick={(event) => buttonDeleteHandler(event, cellValues)}
          >
            <ClearOutlinedIcon />
          </IconButton>
        );
      },
    },
    // {
    //   field: "phoneNumber",
    //   headerName: "Phone Number",
    //   flex: 0.5,
    //   renderCell: (params) => {
    //     return params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
    //   },
    // },
  ];

  return (
    <Box
      // width="100%"
      height="85vh"
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

      <div>
        <form onSubmit={formSubmittedHandler}>
          <BootstrapDialog
            onClose={() => setOpenEditDialog(false)}
            aria-labelledby="customized-dialog-title"
            open={openEditDialog}
            TransitionComponent={Transition}
          >
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={() => setOpenEditDialog(false)}
            >
              Edit Customer
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <Box>
                <FormControl fullWidth={true} margin="normal">
                  <InputLabel htmlFor="name">Name</InputLabel>
                  <Input
                    id="name"
                    aria-describedby="name-helper-text"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    required={true}
                    value={name}
                  />
                  <FormHelperText id="name-helper-text">
                    Customer name.
                  </FormHelperText>
                </FormControl>
              </Box>
              <Box>
                <FormControl fullWidth={true} margin="normal">
                  <InputLabel htmlFor="whatsapp">Whatsapp</InputLabel>
                  <Input
                    type="number"
                    id="whatsapp"
                    aria-describedby="whatsapp-helper-text"
                    onChange={(e) => {
                      setWhatsapp(e.target.value);
                    }}
                    required={true}
                    value={whatsapp}
                  />
                  <FormHelperText id="whatsapp-helper-text">
                    Whatsapp number example: 8562077790708.
                  </FormHelperText>
                </FormControl>
              </Box>
              <Box>
                <FormControl fullWidth={true} margin="normal">
                  <InputLabel>Province / ແຂວງ</InputLabel>
                  <Select
                    id="province"
                    defaultValue=""
                    value={!provinceId ? "" : provinceId}
                    label="Province / ແຂວງ"
                    onChange={(event) => setProvinceId(event.target.value)}
                    required={true}
                  >
                    {provinces &&
                      provinces.map(({ pr_id, pr_name, pr_name_en }) => {
                        return (
                          <MenuItem key={pr_id} value={pr_id}>
                            {pr_name} / {pr_name_en}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <FormControl fullWidth={true} margin="normal">
                  <InputLabel>District / ເມືອງ</InputLabel>
                  {districts && (
                    <Select
                      id="districts"
                      // defaultValue=""
                      defaultValue=""
                      value={districtId === "" ? "" : districtId}
                      label="District / ເມືອງ"
                      onChange={(event) => setDistrictId(event.target.value)}
                      disabled={!Boolean(provinceId)}
                      required={true}
                    >
                      {districts &&
                        districts.map(({ dt_id, dt_name, dt_name_en }) => {
                          return (
                            <MenuItem key={dt_id} value={dt_id}>
                              {dt_name} / {dt_name_en}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  )}
                </FormControl>
              </Box>

              <Box>
                <FormControl fullWidth={true} margin="normal">
                  <InputLabel> Village / ບ້ານ </InputLabel>
                  {villages && (
                    <Select
                      id="villages"
                      value={!villageId ? "" : villageId}
                      label="Village / ບ້ານ"
                      onChange={(event) => setVillageId(event.target.value)}
                      disabled={!districtId}
                      required={true}
                    >
                      {villages &&
                        villages.map(({ vill_id, vill_name, vill_name_en }) => {
                          return (
                            <MenuItem key={vill_id} value={vill_id}>
                              {vill_name}{" "}
                              {!!vill_name_en ? ` / ${vill_name_en}` : ""}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  )}
                </FormControl>
              </Box>
              <Box>
                <FormControl fullWidth>
                  <TextField
                    value={remark}
                    multiline
                    maxRows={5}
                    label="Remark / ໝາຍເຫດ"
                    // placeholder="Description"
                    id="remark"
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      color="secondary"
                      checked={validflag}
                      onChange={() => setValidflag(!validflag)}
                    />
                  }
                  label="Validflag"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <FormControl>
                <Button
                  disabled={!villageId || !districtId || !provinceId}
                  variant="contained"
                  color="secondary"
                  autoFocus
                  // type="submit"
                  size="large"
                  onClick={formSubmittedHandler}
                >
                  Save changes
                </Button>
              </FormControl>
            </DialogActions>
          </BootstrapDialog>
        </form>
      </div>
    </Box>
  );
};

export default CustomerList;
