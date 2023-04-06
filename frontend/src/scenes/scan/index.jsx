import React, { useEffect, useState } from "react";
import Header from "components/Header";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DesktopDatePicker } from "@mui/x-date-pickers";

import moment from "moment-timezone";
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FlexBetween from "components/FlexBetween";
import { useTheme } from "@emotion/react";
import { GetRouteDetail } from "api/routes";
import { StoreTrackingLog } from "api/trackingLogs";
import {
  GetPackageDetailByTracking,
  GetPackagesByStationAndDate,
  PatchPackageSomeInfo,
} from "api/packages";

import { GetStationDetailById } from "api/stations";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import {
  getScanText,
  playAlertSound,
  playCorrectSound,
  playIncorrectSound,
  selectAndFocus,
} from "utils";
import { user, defaultStation } from "localStorage";

const Scan = () => {
  const theme = useTheme();
  const [tracking, setTracking] = useState("");
  const [stationList, setStationList] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [nextStation, setNextStation] = useState("");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [rows, setRows] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [succesCount, setSuccessCount] = useState(0);

  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const _user = user();
  const _defaultStation = defaultStation();

  function RefreshPackagesList(
    from,
    to,
    station,
    page,
    pageSize,
    sort,
    search
  ) {
    GetPackagesByStationAndDate(
      from,
      to,
      station,
      page,
      pageSize,
      sort,
      search
    ).then((res) => {
      // console.log(res);

      if (res.status === 200) {
        setRows(res.data.packages);
        setTotalCount(res.data.totalCount);
      } else {
        console.log(res.message);
      }
    });
  }

  useEffect(() => {
    let newFromDate = moment(fromDate).format("YYYY-MM-DD");
    let newToDate = moment(toDate).format("YYYY-MM-DD");
    // console.log(`From: ${newFromDate} - To: ${newToDate}`);
    if (selectedStation) {
      RefreshPackagesList(
        newFromDate,
        newToDate,
        selectedStation.id,
        page,
        pageSize,
        sort,
        search
      );
    }
  }, [
    fromDate,
    toDate,
    selectedStation,
    page,
    pageSize,
    sort,
    search,
    succesCount,
  ]);

  useEffect(() => {
    setStationList(_user.stations);
    setSelectedStation(_defaultStation);
  }, []);

  async function checkIsStationValid(
    currentStation,
    routeId,
    selectedStationId
  ) {
    let isStationValid = false;
    await GetRouteDetail(routeId).then((res) => {
      if (res.status === 200) {
        let data = res.data.navigator.filter((obj) => {
          return obj.station === currentStation;
        })[0];
        if (data) {
          setNextStation(data.nextStation);
          isStationValid = data.nextStation === selectedStationId;
        }
      }
    });
    return isStationValid;
  }

  const formSubmitHandler = (e) => {
    e.preventDefault();
    GetPackageDetailByTracking(tracking).then(async (res) => {
      if (res.status === 200) {
        let data = res.data; //Get current station and routeId from package
        const isValidStation = await checkIsStationValid(
          data.station,
          data.routeId,
          selectedStation.id
        );

        if (isValidStation) {
          PatchPackageSomeInfo(
            data._id,
            selectedStation.id,
            selectedStation.parcelStatus,
            data.remark,
            data.paymentStatus,
            data.whatsappStatus
          ).then((res) => {
            if (res.status === 200) {
              // let account = "Test account"; //This should be get from current logged in account
              playCorrectSound();
              let actionBy = _user.name;
              StoreTrackingLog(
                data._id,
                data.tracking,
                selectedStation.name,
                selectedStation.message,
                data.remark,
                actionBy
              ).then((res) => {
                // console.log(res);
                if (res.status === 200) {
                  Swal.fire({
                    icon: "success",
                    title: `Success!`,
                    text: `This package has been updated`,
                    timer: 1500,
                  });
                }
                setTracking("");
                setSuccessCount(succesCount + 1);
              });
            }
          });
        } else {
          console.log(res);
          playIncorrectSound();
          Swal.fire({
            icon: "warning",
            title: `Wrong Station - ${data.station}`,
            text: `The next station must be [${nextStation}]`,
            timer: 1500,
          });
          selectAndFocus("tracking");
        }
      } else if (res.status === 204) {
        playAlertSound();
        Swal.fire({
          title: "Data not found",
          icon: "warning",
          text: "This tacking number doesn't exist",
          timer: 1500,
        });
        selectAndFocus("tracking");
      } else {
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
      flex: 0.7,
    },
    {
      field: "tracking",
      headerName: "Tracking",
      flex: 0.7,
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
      headerName: "Shipping",
      flex: 0.3,
    },
    // {
    //   field: "station",
    //   headerName: "Station",
    //   flex: 0.3,
    // },
    {
      field: "status",
      headerName: "Status",
      flex: 0.4,
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 1,
      valueGetter: (params) =>
        moment(params.row.updatedAt)
          .tz("Asia/Vientiane")
          .format("DD/MM/YYYY, h:mm:ss A"),
    },
  ];

  return (
    <Box m="0 1rem">
      <Grid container spacing={2}>
        <Grid item md={12}>
          <Header title="Scan package" />
        </Grid>
        <Grid item md={12}>
          <FlexBetween>
            {/* Scan package section */}
            <Grid container spacing={2}>
              <Grid item md={4}>
                <FormControl fullWidth>
                  <InputLabel>Select station</InputLabel>
                  <Select
                    label="Select station"
                    value={selectedStation ? selectedStation.id : ""}
                    onChange={(e) => {
                      GetStationDetailById(e.target.value).then((res) => {
                        if (res.status === 200) {
                          setSelectedStation(res.data);
                          selectAndFocus("tracking");
                          // console.log("Select station", res.data);
                        }
                      });
                    }}
                    required
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
                      id="tracking"
                      autoFocus
                      value={tracking}
                      onChange={(e) => setTracking(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setTracking(getScanText(tracking));
                          formSubmitHandler(e);
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
            {/* Filter Date for datagrid section */}
            <Grid container spacing={2} justifyContent="flex-end">
              <Grid item>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DesktopDatePicker
                    label="Filter From"
                    inputFormat="DD/MM/yyyy"
                    value={fromDate}
                    maxDate={toDate}
                    onChange={(newValue) => setFromDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DesktopDatePicker
                    label="Filter To"
                    inputFormat="DD/MM/yyyy"
                    minDate={fromDate}
                    value={toDate}
                    onChange={(newValue) => setToDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </FlexBetween>
        </Grid>
        <Grid item md={12}>
          <Divider />
        </Grid>
        <Grid item md={12}>
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default Scan;
