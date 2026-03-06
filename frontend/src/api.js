import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("miniEkartToken");
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers = config.headers || {};
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore storage failures
  }
  return config;
});

export async function getProducts({ search = "", page = 1, limit = 12 } = {}) {
  const params = { page, limit };
  if (search) params.search = search;
  const res = await api.get("/api/products", { params });
  return res.data;
}

export async function getProductById(id) {
  const res = await api.get(`/api/products/${id}`);
  return res.data;
}

export async function getCart() {
  const res = await api.get("/api/cart");
  return res.data;
}

export async function addToCart(productId, quantity = 1) {
  const res = await api.post("/api/cart", { productId, quantity });
  return res.data;
}

export async function updateCartItem(id, action) {
  const res = await api.patch(`/api/cart/${id}`, { action });
  return res.data;
}

export async function removeCartItem(id) {
  const res = await api.delete(`/api/cart/${id}`);
  return res.data;
}

export async function login(credentials) {
  const res = await api.post("/api/auth/login", credentials);
  return res.data;
}

export async function register(credentials) {
  const res = await api.post("/api/auth/register", credentials);
  return res.data;
}


