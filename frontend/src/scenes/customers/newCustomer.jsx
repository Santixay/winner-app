import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Box,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Button,
  useTheme,
  Select,
  MenuItem,
  TextField,
  OutlinedInput,
} from "@mui/material";

import { QueryProvinces, QueryDistrists, QueryVillages } from "api/general";

import { StoreCustomer } from "api/customers";

const NewCustomer = () => {
  const theme = useTheme();

  const [provinces, setProvinces] = useState([]);
  const [provinceId, setProvinceId] = useState("");
  const [districts, setDistricts] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [villages, setVillages] = useState([]);
  const [villageId, setVillageId] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [remark, setRemark] = useState("");

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

  function clearForm() {
    setProvinceId("");
    setVillageId("");
    setVillages([]);
    setDistrictId("");
    setDistricts([]);
    setName("");
    setWhatsapp("");
    setRemark("");
  }

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

    StoreCustomer(
      name,
      whatsapp,
      provinceObj,
      districtObj,
      villageObj,
      remark
    ).then((res) => {
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
    });
  };

  return (
    <form onSubmit={formSubmittedHandler}>
      <Box width="30vw">
        <Box>
          <FormControl fullWidth>
            <InputLabel>Name</InputLabel>
            <OutlinedInput
              id="name"
              label="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              required={true}
            />
          </FormControl>
        </Box>
        <Box mt={2}>
          <FormControl fullWidth>
            <InputLabel htmlFor="whatsapp">Whatsapp</InputLabel>
            <OutlinedInput
              type="number"
              id="whatsapp"
              value={whatsapp}
              label="Whatsapp"
              onChange={(e) => {
                setWhatsapp(e.target.value);
              }}
              required={true}
            />
            <FormHelperText id="whatsapp-helper-text">
              Whatsapp number example: 8562077790708.
            </FormHelperText>
          </FormControl>
        </Box>
        <Box mt={2}>
          <FormControl fullWidth>
            <InputLabel>Province / ແຂວງ</InputLabel>
            <Select
              id="province"
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

        <Box mt={2}>
          <FormControl fullWidth>
            <InputLabel>District / ເມືອງ</InputLabel>
            <Select
              id="districts"
              // defaultValue=""
              value={!districtId ? "" : districtId}
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
          </FormControl>
        </Box>

        <Box mt={2}>
          <FormControl fullWidth>
            <InputLabel> Village / ບ້ານ </InputLabel>
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
                      {vill_name} {!!vill_name_en ? ` / ${vill_name_en}` : ""}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Box>
        <Box mt={2}>
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

        <Box mt={2}>
          <FormControl>
            <Button
              variant="contained"
              disabled={!villageId || !districtId || !provinceId}
              type="submit"
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

export default NewCustomer;
