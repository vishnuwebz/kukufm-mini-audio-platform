import apiClient from "./client";

export const getSeriesList = async (params = {}) => {
  const response = await apiClient.get("/content/series/", { params });
  return response.data;
};

export const getSeriesDetail = async (slug) => {
  const response = await apiClient.get(`/content/series/${slug}/`);
  return response.data;
};

export const getEpisodeDetail = async (id) => {
  const response = await apiClient.get(`/content/episodes/${id}/`);
  return response.data;
};

export const getCategories = async () => {
  const response = await apiClient.get("/content/categories/");
  return response.data;
};

export const getLanguages = async () => {
  const response = await apiClient.get("/content/languages/");
  return response.data;
};