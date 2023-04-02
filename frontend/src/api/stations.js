import { api } from "./config";

export async function GetStationList() {
  try {
    const response = await api().get("/station/list");
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function GetFinalStationList() {
  try {
    const response = await api().get("/station/final");
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function GetStationDetailById(id) {
  try {
    const response = await api().get("station/detail", {
      params: {
        id: id,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}