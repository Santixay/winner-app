import { api } from "./config";

export async function GetUsersList(search = "") {
  try {
    const response = await api.get("/user/list", {
      params: {
        search,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function StoreUser(
  name,
  email,
  password,
  whatsapp,
  role,
  stations,
  remark
) {
  try {
    const response = await api
      .post("/user/store", {
        name,
        email,
        password,
        whatsapp,
        role,
        stations,
        remark,
      })
      .then((res) => res.data)
      .catch((error) => error.response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function PatchUser(
  _id,
  name,
  email,
  whatsapp,
  role = "user",
  stations,
  remark,
  validflag
) {
  try {
    const response = await api
      .patch("/user/patch", {
        _id,
        name,
        email,
        whatsapp,
        role,
        stations,
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

export async function PatchUserPassword(_id, password) {
  try {
    const response = await api
      .patch("/user/patch", {
        _id,
        password,
      })
      .then((res) => res.data)
      .catch((error) => error.response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function GetUserDetail(userId) {
  try {
    const response = await api
      .get("/user/" + userId)
      .then((res) => res.data)
      .catch((error) => error.response);
    return response;
  } catch (error) {
    console.log(error);
  }
}
