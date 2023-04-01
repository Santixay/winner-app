import { api } from "./config";

export async function GetRouteList() {
  try {
    const response = await api.get("/route/list");
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function GetRouteDetail(routeId) {
  try {
    const response = await api.get("/route/detail", {
      params: {
        id: routeId,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function GetRouteByProvince(pr_id) {
  try {
    const response = await api.get(
      "/location/get-route-by-province",
      {
        params: {
          id: pr_id,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}
