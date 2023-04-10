import React, { useEffect, useState } from "react";
import Header from "components/Header";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import { useTheme } from "@emotion/react";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import SendIcon from "@mui/icons-material/Send";

import { copyTextToClipboard } from "utils";
import { PatchPackageSomeInfo, GetSumPackagesForDelivered } from "api/packages";
import { GetStationDetailById, GetFinalStationList } from "api/stations";
import { StoreTrackingLog } from "api/trackingLogs";
import { SendMessage } from "api/whatsapp";
import { isMobile } from "react-device-detect";

const Delivered = () => {
  const theme = useTheme();
  const [stationList, setStationList] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [nextStation, setNextStation] = useState("");
  const [rows, setRows] = useState(null);
  const [succesCount, setSuccessCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  function RefreshPackagesList(station, search) {
    setIsLoading(true);
    GetSumPackagesForDelivered(station, search).then((res) => {
      setIsLoading(false);
      if (res.status === 200) {
        // console.log(res.data);
        setRows(res.data);
      } else {
        setRows([]);
      }
    });
  }

  useEffect(() => {
    if (selectedStation) {
      RefreshPackagesList(selectedStation.id, search);
    }
  }, [selectedStation, search]);

  useEffect(() => {
    if (succesCount > 0) {
      RefreshPackagesList(selectedStation.id, search);

      Swal.fire({
        icon: "success",
        title: `Success!`,
        text: `This package has been updated`,
        timer: 1500,
      });
    }
  }, [succesCount]);

  useEffect(() => {
    GetFinalStationList().then((res) => {
      setStationList(res.data);
      // Set default station, for better should query from database
      let defaultStation = "VTE";
      GetStationDetailById(defaultStation).then((res) => {
        if (res.status === 200) {
          setSelectedStation(res.data);
        }
      });

      GetStationDetailById("END").then((res) => {
        if (res.status === 200) {
          //   console.log(res.data);
          setNextStation(res.data);
        }
      });
    });
  }, []);

  const sendWhatsappMessage = (message, data) => {
    setIsSending(true);
    let phone = data._id.customer.whatsapp;
    // console.log(data)
    // return;
    SendMessage(phone, message).then((res) => {

      if (res.status === 200) {
        console.log(res.data.message);
        const packageDetail = data.packageDetail;
        console.log(packageDetail);

        for (let index = 0; index < packageDetail.length; index++) {
          // console.log(`index: ${index} data.lengthL: ${data.packageDetail.length - 1}` )
          PatchPackageSomeInfo(
            packageDetail[index]._id,
            nextStation.id,
            nextStation.parcelStatus,
            data.remark,
            true,
            true
          ).then((res) => {
            if (res.status === 200) {
              let user = "Test account";
              StoreTrackingLog(
                packageDetail[index]._id,
                packageDetail[index].tracking,
                nextStation.name,
                nextStation.message,
                packageDetail[index].remark,
                user
              ).then((res) => {
                if (
                  res.status === 200 &&
                  index === data.packageDetail.length - 1
                ) {
                  setSuccessCount(succesCount + 1);
                }
              });
            } else {
              console.log(res.message);
            }
          });
        }
      }
      setIsSending(false);
    });
  };

  const updatePackage = (data) => {
    data.packageDetail.map((packageDetail, index) => {
      console.log(packageDetail);
      PatchPackageSomeInfo(
        packageDetail._id,
        nextStation.id,
        nextStation.parcelStatus,
        data.remark,
        true,
        true
      ).then((res) => {
        let user = "Test account";
        if (res.status === 200) {
          StoreTrackingLog(
            packageDetail._id,
            packageDetail.tracking,
            nextStation.name,
            nextStation.message,
            packageDetail.remark,
            user
          ).then((res) => {
            if (res.status === 200 && index === data.packageDetail.length - 1) {
              setSuccessCount(succesCount + 1);
            }
          });
        }
      });
    });
  };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
      valueGetter: (params) => params.row._id.customer._id,
      hide: true,
    },
    {
      field: "customer",
      headerName: "Customer",
      flex: 0.5,
      valueGetter: (params) => params.row._id.customer.name,
    },
    {
      field: "whatsapp",
      headerName: "Whatsapp",
      flex: 0.5,
      valueGetter: (params) => params.row._id.customer.whatsapp,
    },

    {
      field: "smsMessage",
      headerName: "Message",
      flex: 2,
      hide: isMobile,
    },
    {
      field: "totalPackages",
      headerName: "item(s).",
      flex: 0.3,
    },
    {
      field: "totalShippingFee",
      headerName: "Shipping fee",
      flex: 0.3,
    },
    {
      field: "copy",
      headerName: "Copy",
      flex: 0.2,
      hide: isMobile,
      renderCell: (cellValues) => {
        return (
          <IconButton
            variant="outlined"
            onClick={() => {
              copyTextToClipboard(cellValues.row.smsMessage);
            }}
            sx={{ "&:hover": { color: theme.palette.warning.main } }}
          >
            <ContentCopyIcon />
          </IconButton>
        );
      },
    },
    {
      field: "send",
      headerName: "Send",
      flex: 0.2,
      renderCell: (cellValues) => {
        return (
          <IconButton
            variant="outlined"
            disabled={isLoading}
            onClick={() => {
              sendWhatsappMessage(cellValues.row.smsMessage, cellValues.row);
            }}
            sx={{ "&:hover": { color: theme.palette.warning.main } }}
          >
            <SendIcon />
          </IconButton>
        );
      },
    },
    {
      field: "success",
      headerName: "Success",
      flex: 0.2,
      hide: isMobile,
      renderCell: (cellValues) => {
        return (
          <IconButton
            variant="outlined"
            onClick={() => {
              updatePackage(cellValues.row);
            }}
            sx={{ "&:hover": { color: theme.palette.warning.main } }}
          >
            <CheckIcon />
          </IconButton>
        );
      },
    },
  ];

  return (
    <Box m="0 1rem">
      <Grid container spacing={2}>
        <Grid item md={12}>
          <Header
            title="Delivered"
            subtitle="update status once customers pickup their parcels."
          />
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
              loading={isLoading}
              getRowId={(row) => row._id.customer._id}
              rows={rows || []}
              columns={columns}
              rowCount={(rows && rows.length) || 0}
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

export default Delivered;
