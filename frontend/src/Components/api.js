import axios from "axios";
import clientURL from "../secret";

const api = axios.create({
  baseURL: `${clientURL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
