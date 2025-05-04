import axios from "axios";

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
//export const API_BASE_URL = "https://10shiblogapi.work";
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    console.log("Request made with token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
