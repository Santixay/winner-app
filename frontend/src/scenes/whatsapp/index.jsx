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
import { GetStationDetailById, GetFinalStationList } from "api/stations";
import { SendMessage } from "api/whatsapp";
import { PatchPackageSomeInfo, GetSumPackagesForWhatsApp } from "api/packages";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import { copyTextToClipboard } from "utils";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import SendIcon from "@mui/icons-material/Send";

const WhatsApp = () => {
  const theme = useTheme();
  const [stationList, setStationList] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [rows, setRows] = useState(null);
  const [succesCount, setSuccessCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  function RefreshPackagesList(station, search) {
    setIsLoading(true);
    GetSumPackagesForWhatsApp(station, search).then((res) => {
      if (res.status === 200) {
        // console.log(res.data);
        setRows(res.data);
      } else {
        setRows([]);
        // console.log(res);
      }
      setIsLoading(false);
    });
  }

  useEffect(() => {
    if (selectedStation) {
      RefreshPackagesList(selectedStation.id, search);
    }
  }, [
    selectedStation,
    // succesCount,
    search,
  ]);

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
    });
  }, []);

  useEffect(() => {
    if (succesCount > 0 && selectedStation) {
      RefreshPackagesList(selectedStation.id, search);

      Swal.fire({
        icon: "success",
        title: `Success!`,
        text: `This package has been updated`,
        timer: 3000,
      });
    }
  }, [succesCount, selectedStation, search]);

  const sendWhatsappMessage = (message, data) => {
    setIsSending(true);
    let phone = data._id.customer.whatsapp;

    SendMessage(phone, message).then((res) => {
      if (res.status === 200) {
        // console.log(res.data.message);
        const packageDetail = data.packageDetail;
        // console.log(packageDetail);

        for (let index = 0; index < packageDetail.length; index++) {
          // console.log(`index: ${index} data.lengthL: ${data.packageDetail.length - 1}` )
          PatchPackageSomeInfo(
            packageDetail[index]._id,
            selectedStation.id,
            selectedStation.parcelStatus,
            data.remark,
            false,
            true
          ).then((res) => {
            if (res.status === 200 && index === data.packageDetail.length - 1) {
              setSuccessCount(succesCount + 1);
              console.log(`Packages has been updated`);
            }
            if (res.status !== 200) {
              console.log(res.message);
            }
          });
        }
      }
      setIsSending(false);
    });
  };

  const updatePackage = (data) => {
    console.log(`Update package`);
    const packageDetail = data.packageDetail;
    for (let index = 0; index < packageDetail.length; index++) {
      PatchPackageSomeInfo(
        packageDetail[index]._id,
        selectedStation.id,
        selectedStation.parcelStatus,
        data.remark,
        false,
        true
      ).then((res) => {
        if (res.status === 200 && index === data.packageDetail.length - 1) {
          setSuccessCount(succesCount + 1);
        }
        if (res.status !== 200) {
          console.log(res);
        }
      });
    }
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
      // renderCell: (cellValues) => {
      //   return (
      //     <IconButton
      //       variant="outlined"
      //       onClick={() => {
      //         copyTextToClipboard(cellValues.row.customer.whatsapp);
      //       }}
      //       sx={{ "&:hover": { color: theme.palette.warning.main } }}
      //     >
      //       {cellValues.row.customer.whatsapp}
      //     </IconButton>
      //   );
      // },
    },

    {
      field: "smsMessage",
      headerName: "Message",
      flex: 2,
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
            disabled={isSending}
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
          <Header title="WhatsApp" subtitle="send notification to customers" />
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
              // onSortModelChange={(newSortModel) => setSort(...newSortModel)}
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

export default WhatsApp;
