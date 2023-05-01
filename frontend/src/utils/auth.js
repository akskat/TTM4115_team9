import api from "../services/api";

export async function register(username, password, role) {
  try {
    const response = await api.post("/auth/register", {
      username,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function login(username, password) {
  try {
    const response = await api.post("/auth/login", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}
