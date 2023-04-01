import { api } from "./config";

export async function GetRoleList() {
  try {
    const response = await api.get("/role/list");
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function GetRoleDetail(routeId) {
  try {
    const response = await api.get("/role/detail", {
      params: {
        id: routeId,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function PatchRole(
  _id,
  role,
  description,
  permission,
  remark,
  validflag
) {
  try {
    const response = await api
      .patch("/role/patch", {
        _id,
        role,
        description,
        permission,
        remark,
        validflag,
      })
      .then((res) => res.data)
      .catch((error) => error.response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function StoreRole(role, description, permission, remark) {
  try {
    const response = await api
      .post("/role/store", {
        role,
        description,
        permission,
        remark,
      })
      .then((res) => res.data)
      .catch((error) => error.response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function GetApiLinks() {
  try {
    const response = await api.get("/apilink/list");
    return response;
  } catch (error) {
    console.error(error);
  }
}
