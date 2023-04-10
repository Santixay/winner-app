import React, { useEffect, useState } from "react";
import Header from "components/Header";
import {
  InputBase,
  Box,
  IconButton,
  useTheme,
  Grid,
  FormControl,
  Divider,
  Typography,
  TableContainer,
  TableHead,
  TableBody,
  Table,
  TableRow,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import SearchIcon from "@mui/icons-material/Search";
import FlexBetween from "components/FlexBetween";
import { GetRouteDetail } from "api/routes";
import { GetPackageDetailByTracking } from "api/packages";
import { GetTrackingLog } from "api/trackingLogs";
import Swal from "sweetalert2";

// Steper Component
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import moment from "moment";
import { getScanText, selectAndFocus } from "utils";

const Tracking = () => {
  const theme = useTheme();
  const [searchTracking, setSearchTracking] = useState("");
  const [currentStation, setCurrentStation] = useState("");
  // Set default steps
  const [steps, setSteps] = useState([
    { station: "Start" },
    { station: "Warehouse" },
    { station: "Arrived" },
    { station: "End" },
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [navigator, setNavigator] = useState(null);
  const [trackingLog, setTrackingLog] = useState(null);
  const [packageDetail, setPackageDetail] = useState(null);

  useEffect(() => {
    if (navigator) {
      //Get current step
      let temp = [];
      navigator.map(({ station, status, stationName, message }, index) => {
        temp.push({ station: stationName });
        if (station === currentStation) {
          setCurrentStep(index);
        }
      });
      setSteps(temp);
      let newTracking = getScanText(searchTracking);
      GetTrackingLog(newTracking).then((res) => {
        // console.log(res);
        if (res.status === 200) {
          setTrackingLog(res.data);
        }
      });
      //   console.log(trackingLog);
    }
  }, [navigator]);

  const formSearchTrackingHandler = (e) => {
    e.preventDefault();
    let newTracking = getScanText(searchTracking);
    setSearchTracking(newTracking);

    GetPackageDetailByTracking(newTracking).then(async (res) => {
      if (res.status === 200) {
        //Get currentSation and routeId from package detail
        setPackageDetail(res.data);
        setCurrentStation(res.data.station);
        GetRouteDetail(res.data.routeId).then((res) => {
          if (res.status === 200) {
            // set Steps from route.navogator
            setNavigator(res.data.navigator);
          } else {
            // setNavigator(null);
            console.log(res.message);
          }
        });
      } else if (res.status === 204) {
        Swal.fire({
          title: "Data not found",
          icon: "warning",
          text: "This tacking number doesn't exist",
          timer: 1500,
        });
        selectAndFocus("searchTracking");
        setCurrentStep(0);
        setSteps([]);
      } else {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: res.message,
          timer: 1500,
        });
        selectAndFocus("searchTracking");
      }
    });
  };

  return (
    <Box m="0 1rem">
      <Grid container spacing={2}>
        <Grid item md={12}>
          <Header
            title="Tracking"
            subtitle="Enter tracking number to see the transactions"
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={1}>
        <Grid item md={12}>
          {/* Scan package section */}
          <Grid container spacing={2}>
            <Grid item md={3}>
              <FormControl fullWidth>
                <FlexBetween
                  backgroundColor={theme.palette.background.alt}
                  borderRadius="9px"
                  gap="3rem"
                  p="0.5rem 1rem"
                >
                  <InputBase
                    placeholder="Tracking number"
                    id="searchTracking"
                    autoFocus
                    value={searchTracking}
                    onChange={(e) => setSearchTracking(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        formSearchTrackingHandler(e);
                      }
                    }}
                  />
                  <IconButton onClick={formSearchTrackingHandler}>
                    <SearchIcon />
                  </IconButton>
                </FlexBetween>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={12}>
          <Divider />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item md={12} mt={4}>
          {/*  Tracking details section  */}
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Stepper
              alternativeLabel
              activeStep={currentStep}
              //   connector={<ColorlibConnector />}
            >
              {steps.map(({ station }) => (
                <Step
                  key={station}
                  sx={{
                    "& .MuiStepLabel-root .Mui-completed": {
                      color: "secondary.dark", // circle color (COMPLETED)
                    },
                    "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel":
                      {
                        color: "grey.500", // Just text label (COMPLETED)
                      },
                    "& .MuiStepLabel-root .Mui-active": {
                      color: "secondary.main", // circle color (ACTIVE)
                    },
                    "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel":
                      {
                        color: "common.white", // Just text label (ACTIVE)
                      },
                    "& .MuiStepLabel-root .Mui-active .MuiStepIcon-text": {
                      fill: "black", // circle's number (ACTIVE)
                    },
                  }}
                >
                  <StepLabel>{station}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Stack>
        </Grid>
        <Grid item md={12}>
          <Box
            height="60vh"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              "& > :not(style)": {
                m: 1,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary[400]
                    : theme.palette.grey[200],
                borderRadius: 1,
              },
            }}
            justifyContent="center"
          >
            <TableContainer>
              <Table
                sx={{
                  [`& .${tableCellClasses.root}`]: {
                    borderBottom: "none",
                    // borderRight: "solid 0.1rem",
                    borderColor: theme.palette.grey[600],
                    paddingTop: 1,
                  },
                }}
              >
                {packageDetail && (
                  <TableHead>
                    <TableRow>
                      <TableCell width={250} style={{ verticalAlign: "top" }}>
                        <Typography color="secondary">
                          Order: {packageDetail.orderId}
                        </Typography>
                        <Typography>
                          Tracking: {packageDetail.tracking}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ verticalAlign: "top" }}>
                        <Typography>
                          {packageDetail.customer.name} -{" "}
                          {packageDetail.customer.whatsapp} (Owner)
                        </Typography>
                        <Typography>{packageDetail.description}</Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell align="right">
                        <Typography>Transactions:</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography>Description:</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                )}
                <TableBody>
                  {trackingLog &&
                    trackingLog.map((item, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell
                            align="right"
                            style={{ verticalAlign: "top" }}
                          >
                            <Typography>
                              {moment(item.createdAt)
                                .tz("Asia/Vientiane")
                                .format("DD/MM/YYYY")}
                            </Typography>
                            <Typography>
                              {moment(item.createdAt)
                                .tz("Asia/Vientiane")
                                .format("h:mm:ss A")}
                            </Typography>
                          </TableCell>
                          <TableCell style={{ verticalAlign: "top" }}>
                            <Typography color="secondary">
                              {item.station}
                            </Typography>
                            <Typography>{item.description}</Typography>
                            <Typography
                              sx={{ fontStyle: "italic" }}
                              color={theme.palette.grey[500]}
                            >
                              Action by {item.actionByUser}.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Tracking;
