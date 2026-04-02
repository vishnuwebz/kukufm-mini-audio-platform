import apiClient from "./client";

export const updateListeningProgress = async (payload) => {
  const response = await apiClient.post("/listening/progress/", payload);
  return response.data;
};

export const getContinueListening = async () => {
  const response = await apiClient.get("/listening/continue-listening/");
  return response.data;
};