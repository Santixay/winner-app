import { api } from "./config";


export async function StoreTrackingLog(
  packageId,
  tracking,
  station,
  description,
  remark,
  actionByUser,
  validflag = true
) {
  try {
    const response = await api()
      .post("/trackinglog/store", {
        packageId,
        tracking,
        station,
        description,
        remark,
        actionByUser,
        validflag,
      })
      .then((res) => res.data)
      .catch((error) => error.response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function GetTrackingLogList(page, pageSize, sort, search) {
  try {
    const response = await api().get("/trackinglog/list", {
      params: {
        page,
        pageSize,
        sort: JSON.stringify(sort),
        search,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function GetTrackingLog(tracking) {
    try {
      const response = await api().get("/trackinglog/log", {
        params: {
          tracking: tracking,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }