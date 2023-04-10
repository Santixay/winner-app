import { api } from "./config";

export async function StorePackage(
  tracking,
  description = "",
  orderId = "",
  customerId = "",
  amount = 0,
  quantity = 1,
  shippingFee = 0,
  routeId,
  status = "Started",
  remark = "",
  paymentStatus = false,
  station = "STD",
  whatsappStatus = false
) {
  try {
    let upperCaseTracking = tracking.toUpperCase();
    const response = await api()
      .post("/package/store", {
        tracking: upperCaseTracking,
        description,
        orderId,
        customerId,
        amount,
        quantity,
        shippingFee,
        routeId,
        status,
        remark,
        paymentStatus,
        station,
        whatsappStatus,
      })
      .then((res) => res.data)
      .catch((error) => error.response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function GetPackageList(page, pageSize, sort, search) {
  try {
    const response = await api().get("/package/list", {
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

export async function GetPackagesSumByStatus(customerId) {
  try {
    const response = await api().get("/package/sum-by-status", {
      params: {
        customerId,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}
export async function GetPackagesByCustomerId(customerId, sort, search) {
  try {
    const response = await api().get("/package/customer", {
      params: {
        customerId,
        sort: JSON.stringify(sort),
        search,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}
export async function GetPackagesByStationAndDate(
  from = "",
  to = "",
  station = "",
  page,
  pageSize,
  sort,
  search
) {
  // from & to format is YYYY-MM-DD
  // station - if empty will return all stations
  try {
    const response = await api().get("/package/list-by-station-and-date", {
      params: {
        from,
        to,
        station,
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

export async function GetSumPackagesForWhatsApp(station, search) {
  try {
    const response = await api().get("/package/sumpackages", {
      params: {
        station,
        search,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function GetSumPackagesForDelivered(station, search) {
  try {
    const response = await api().get("/package/sumpackages-delivered", {
      params: {
        station,
        search,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function GetPackageDetailByTracking(tracking) {
  try {
    const response = await api().get("/package/tracking", {
      params: {
        tracking: tracking,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function DeletePackage(id) {
  try {
    const url = "/package/delete/" + id;
    console.log(url);
    const responseData = await api()
      .delete("/package/delete/" + id)
      .then((res) => res.data)
      .catch((error) => error.response);
    return responseData;
  } catch (error) {
    console.error(error);
  }
}

export async function PatchPackage(
  _id,
  tracking,
  description,
  orderId,
  customerId,
  amount,
  quantity,
  shippingFee,
  routeId,
  station,
  status,
  remark,
  paymentStatus,
  whatsappStatus
) {
  try {
    let upperCaseTracking = tracking.toUpperCase();
    const responseData = await api()
      .patch("/package/patch", {
        _id,
        tracking: upperCaseTracking,
        description,
        orderId,
        customerId,
        amount,
        quantity,
        shippingFee,
        routeId,
        station,
        status,
        remark,
        paymentStatus,
        whatsappStatus,
      })
      .then((res) => res.data)
      .catch((error) => error.response);
    return responseData;
  } catch (error) {
    console.error(error);
  }
}

export async function PatchPackageSomeInfo(
  _id,
  station,
  status,
  remark,
  paymentStatus,
  whatsappStatus
) {
  try {
    const response = api()
      .patch("/package/patch", {
        _id,
        station,
        status,
        remark,
        paymentStatus,
        whatsappStatus,
      })
      .then((res) => res.data)
      .catch((error) => error.response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function PatchShippingFee(
  _id,
  tracking,
  orderId,
  description,
  remark,
  amount,
  quantity,
  shippingFee
) {
  try {
    let upperCaseTracking = tracking.toUpperCase();
    const response = await api()
      .patch("/package/patch", {
        _id,
        tracking: upperCaseTracking,
        orderId,
        description,
        remark,
        amount,
        quantity,
        shippingFee,
      })
      .then((res) => res.data)
      .catch((error) => error.response);
    return response;
  } catch (error) {
    console.log(error);
  }
}
