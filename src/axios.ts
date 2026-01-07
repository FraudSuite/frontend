import axios from "axios";

const api = axios.create({
  baseURL: "hhttps://fraud-api-ehjw.onrender.com", // change if needed
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
