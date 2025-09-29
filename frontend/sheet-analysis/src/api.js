// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api" // local dev
      : "https://datasense-excel-analysis.onrender.com/api", // production
  withCredentials: false,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
