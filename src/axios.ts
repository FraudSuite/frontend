import axios from "axios";

const api = axios.create({
  baseURL: "https://hiremeai-backend.onrender.com", // change if needed
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
