import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// JWT automatically attach
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const authAPI = {
  register: (data) => api.post("/auth/register", data),

  login: (data) => api.post("/auth/login", data),

  profile: () => api.get("/auth/profile"),
};

export const transactionAPI = {
  getBalance: () => api.get("/transactions/balance"),

  sendMoney: (data) =>
    api.post("/transactions/send", data),

  getHistory: () =>
    api.get("/transactions/history"),
};

export default api;