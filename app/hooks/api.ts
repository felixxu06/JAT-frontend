import axios from "axios";

// Use Vite's import.meta.env for environment variables in frontend
const apiBaseUrl = "http://localhost:8080/api/";
console.log("API Base URL:", apiBaseUrl);
export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
