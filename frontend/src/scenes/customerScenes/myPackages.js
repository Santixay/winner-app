import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { GetPackagesByCustomerId } from "api/packages";
import { DataGridCustomToolbarClientMode } from "components/DataGridCustomToolbar";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import FlexBetween from "components/FlexBetween";
import MyInfo from "./myInfo";

function MyPackages(props) {
  const theme = useTheme();
  const { id } = props;
  const statusList = ["All", "Started", "Arrived", "Delivered", "END"];

  const [rows, setRows] = useState(null);
  const [filteredRows, setFilteredRows] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("Arrived");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    statusChangedHandler(status);
  }, [status]);

  function statusChangedHandler(status) {
    console.log(status);
  }

  function refreshRows(id) {
    setIsLoading(true);
    GetPackagesByCustomerId(id)
      .then((res) => {
        // console.log(res);
        if (res.status && res.status === 200) {
          setRows(res.data.packages);
        } else {
          Swal.fire(`Error - ${res.status}`, res, "error");
          console.log(res);
        }
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    refreshRows(id);
  }, [id]);

  useEffect(
    function filterStatus() {
      if (rows) {
        let newArr =
          status === "All"
            ? rows
            : rows.filter((el) => {
                return el.status === status;
              });

        if (search) {
          newArr = newArr.filter((el) => {
            return (
              el.tracking.toLowerCase().includes(search.toLowerCase()) ||
              el.description.toLowerCase().includes(search.toLowerCase()) ||
              el.orderId.toLowerCase().includes(search.toLowerCase())
            );
          });
        }

        setFilteredRows(newArr);
      }
    },
    [rows, status, search]
  );

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
      hide: true,
    },
    {
      field: "orderId",
      headerName: "Order ID",
      flex: 1,
    },
    {
      field: "tracking",
      headerName: "Tracking",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 3,
      renderCell: (cellValues) => {
        return cellValues.row.description
          ? cellValues.row.description
          : cellValues.row.remark
          ? <Typography color='secondary'>Remark: {cellValues.row.remark} </Typography> 
          : "-";
      },
    },
    {
      field: "routeId",
      headerName: "Route ID",
      flex: 0.5,
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
      flex: 0.5,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.7,
    },
    {
      field: "station",
      headerName: "Station",
      flex: 0.7,
    },
    {
      field: "updatedAt",
      headerName: "Updated at",
      flex: 1,
      renderCell: (cellValues) => {
        return cellValues.row.updatedAt
          ? moment(cellValues.row.updatedAt)
              .tz("Asia/Vientiane")
              .format("DD/MM/YYYY, hh:mm:ss")
          : "-";
      },
    },
  ];

  return (
    <Box marginRight={2}>
      <Box>
        <FlexBetween>
          <Box>
            <MyInfo id={id} />
          </Box>

          <Box width="250px">
            <FormControl fullWidth>
              <InputLabel>Select status</InputLabel>
              <Select
                label="Select status"
                value={status ? status : ""}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statusList &&
                  statusList.map((item) => {
                    return (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </Box>
        </FlexBetween>
      </Box>
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
          rows={filteredRows || []}
          columns={columns}
          rowCount={filteredRows ? filteredRows.length : 0}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="client"
          sortingMode="client"
          filterMode="client"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          // onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          components={{ Toolbar: DataGridCustomToolbarClientMode }}
          componentsProps={{
            toolbar: { search, setSearch },
          }}
        />
      </Box>
    </Box>
  );
}

export default MyPackages;
