import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";

import Box from "@mui/material/Box";
import { IconButton, useTheme } from "@mui/material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

const InactiveCustomer = () => {
  const theme = useTheme();

  const initialData = [
    {
      vill_id: "10101",
      vill_name: "ໜອງປິງ1",
      vill_name_en: "Nongping1",
      dt_id: "101",
    },
    {
      vill_id: "10102",
      vill_name: "ໜອງປິງ2",
      vill_name_en: "Nongping2",
      dt_id: "101",
    },
    {
      vill_id: "10103",
      vill_name: "ໜອງປິງ3",
      vill_name_en: "Nongping3",
      dt_id: "101",
    },
    {
      vill_id: "10104",
      vill_name: "ໜອງປິງ4",
      vill_name_en: "Nongping4",
      dt_id: "101",
    },
  ];

  const columns = [
    {
      field: "vill_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "vill_name",
      headerName: "vill_name",
      flex: 1,
    },
    {
      field: "vill_name_en",
      headerName: "vill_name_en",
      flex: 1,
    },
    {
      field: "dt_id",
      headerName: "dt_id",
      flex: 1,
    },

    {
      field: "edit",
      headerName: "Edit",
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
  ];
  const [rows, setRows] = React.useState(initialData);

  const buttonEditHandler = (cellValues) => {
    // setRows((prevRows) => {
    //   const rowToUpdateIndex = randomInt(0, rows.length - 1);
    //   return prevRows.map((row, index) =>
    //     index === rowToUpdateIndex
    //       ? { ...row, username: randomUserName() }
    //       : row
    //   );
    // });
  };

  const buttonDeleteHandler = (event,cellValues) => {
    // console.log("🚀 ~ file: inactiveCustomer.jsx:109 ~ buttonDeleteHandler ~ cellValues", cellValues)
    setRows(() => {
      return rows.filter(
        (item) => item.vill_id !== cellValues.id
      );
    });

    console.log(rows)
    
  };

  //   const handleAddRow = (cellValues) => {
  //     setRows((prevRows) => [...prevRows, createRandomRow()]);
  //   };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ height: 400, mt: 1 }}>
        <DataGrid
          rows={rows || []}
          getRowId={(row) => row.vill_id}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default InactiveCustomer;
