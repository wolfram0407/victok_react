import axios from "axios";

const token =
  localStorage.getItem("token") ?? sessionStorage.getItem("token") ?? null;

export const API = axios.create({
  // baseURL:
  //   process.env.NODE_ENV === "production"
  //     ? "http://victok2023.cafe24.com/api"
  // : "http://192.168.0.177:4000/api",
  // baseURL: "http://192.168.0.177:4000/api",
  // baseURL: "http://localhost:4000/api",
  // baseURL: "http://victok2023.cafe24.com/api",
  baseURL: "https://victok.co.kr/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});
