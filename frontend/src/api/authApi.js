import apiClient from "./client";

export const getCsrfToken = async () => {
  const response = await apiClient.get("/auth/csrf/");
  return response.data;
};

export const registerUser = async (payload) => {
  await getCsrfToken();
  const response = await apiClient.post("/auth/register/", payload);
  return response.data;
};

export const loginUser = async (payload) => {
  await getCsrfToken();
  const response = await apiClient.post("/auth/login/", payload);
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post("/auth/logout/");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get("/auth/me/");
  return response.data;
};