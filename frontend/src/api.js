import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

export async function getProducts({ search = "", page = 1, limit = 12 } = {}) {
  const params = { page, limit };
  if (search) params.search = search;
  const res = await api.get("/api/products", { params });
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

