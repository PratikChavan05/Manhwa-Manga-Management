import axios from "axios";

const API_BASE = "/api/manga";

export const getMangaStats = async () => {
  const res = await axios.get(`${API_BASE}/stats`);
  return res.data;
};

export const getMangas = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};

export const getMangaById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};

export const addManga = async (data) => {
  const res = await axios.post(API_BASE, data);
  return res.data;
};

export const updateManga = async (id, data) => {
  const res = await axios.put(`${API_BASE}/${id}`, data);
  return res.data;
};

export const deleteManga = async (id) => {
  const res = await axios.delete(`${API_BASE}/${id}`);
  return res.data;
};

export const searchMangas = async (params) => {
  const res = await axios.get(`${API_BASE}/search`, { params });
  return res.data;
};

export const bulkUpdateStatus = async (mangaIds, status) => {
  const res = await axios.put(`${API_BASE}/bulk-update`, { mangaIds, status });
  return res.data;
};
export const updateMangaChapter = async (id, data) => {
  try {
    // Correctly makes a PUT request to the chapter-specific endpoint
    const response = await axios.put(`/api/manga/${id}/chapter`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating manga chapter:", error);
    throw error;
  }
};