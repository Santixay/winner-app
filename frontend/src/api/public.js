import axios from "axios";
const baseUrl = process.env.REACT_APP_BASE_URL + "/public";

export async function Authen(token) {
  try {
    const response = await axios.post(baseUrl + "/authen", {token});
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function Login(email, password) {
  console.log('login api called')
  try {
    console.log(email, password);
    const response = await axios.post(baseUrl + "/login", {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function GetPackageDetailByTracking(tracking) {
  try {
    const response = await axios.get(baseUrl + "/package-detail", {
      params: {
        tracking: tracking,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function GetTrackingLog(tracking) {
  try {
    const response = await axios.get(baseUrl + "/trackinglog", {
      params: {
        tracking: tracking,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function GetRouteDetail(routeId) {
  try {
    const response = await await axios.get(baseUrl + "/route-detail", {
      params: {
        id: routeId,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}