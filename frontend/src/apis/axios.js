import axios from "axios";
import { API_URL } from "../config/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let activeGetToken = null;

export const setTokenResolver = (resolver) => {
  activeGetToken = resolver;
};

axiosInstance.interceptors.request.use(
  async (config) => {
    if (activeGetToken) {
      try {
        const token = await activeGetToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Error fetching token for API request:", e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
