import axios from "axios";
import clientUrl from "../../secret";

const api = axios.create({
  baseURL: `${clientUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
