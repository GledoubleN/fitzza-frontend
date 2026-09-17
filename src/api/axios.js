import axios from "src/api/axios.js";

export const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
})