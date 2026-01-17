import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getAllBrands = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/brands`);
  return response.data;
};

export const getActiveBrands = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/brands/active`);
  return response.data;
};

export const getBrandById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/api/brands/${id}`);
  return response.data;
};

export const createBrand = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/api/brands`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateBrand = async (id, formData) => {
  const response = await axios.put(`${API_BASE_URL}/api/brands/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteBrand = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/api/brands/${id}`);
  return response.data;
};
