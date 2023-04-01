import axios from "axios";
import { token } from "localStorage";
const baseUrl = process.env.REACT_APP_BASE_URL;

export const api = axios.create({
  baseURL: baseUrl,
  headers: { Authorization: `Bearer ${token}` },
});
