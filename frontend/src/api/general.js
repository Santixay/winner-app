import { api } from "./config";

export async function QueryProvinces() {
  try {
    const response = await api().get("/location/provinces");
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function QueryDistrists(pr_id) {
  try {
    const response = await api().get("/location/districts?pr_id=" + pr_id);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function QueryVillages(dt_id) {
  try {
    const response = await api().get("/location/villages?dt_id=" + dt_id);
    return response;
  } catch (error) {
    console.error(error);
  }
}
