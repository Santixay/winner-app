import { api } from "./config";

export async function StoreCustomer(
  name,
  whatsapp,
  province,
  district,
  village,
  remark = "",
  validflag = true
) {
  try {
    const responseData = await api
      .post( "/customer/store", {
        name,
        whatsapp,
        province,
        district,
        village,
        remark,
        validflag,
      })
      .then((res) => res.data)
      .catch((error) => error.response);
    return responseData;
  } catch (error) {
    console.log(error);
  }
}

export async function PatchCustomer(
  _id,
  name,
  whatsapp,
  province,
  district,
  village,
  validflag,
  remark
) {
  try {
    const responseData = await api
      .patch( "/customer/patch", {
        _id,
        name,
        whatsapp,
        province,
        district,
        village,
        validflag,
        remark,
      })
      .then((res) => res.data)
      .catch((error) => error.response);
    return responseData;
  } catch (error) {
    console.error(error);
  }
}

export async function DeleteCustomer(id) {
  try {
    const url =  "/customer/delete/" + id;
    console.log(url);
    const responseData = await api
      .delete( "/customer/delete/" + id)
      .then((res) => res.data)
      .catch((error) => error.response);
    return responseData;
  } catch (error) {
    console.error(error);
  }
}

export async function GetCustomersList(
  page = 0,
  pageSize = 20,
  sort = {},
  search = ""
) {
  try {
    const response = await api.get( "/customer/list", {
      params: {
        page,
        pageSize,
        sort: JSON.stringify(sort),
        search,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}
