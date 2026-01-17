import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getAllProductTypes = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/product-types`);
  return response.data;
};

export const getActiveProductTypes = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/product-types/active`);
  return response.data;
};

export const getProductTypeById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/api/product-types/${id}`);
  return response.data;
};

export const createProductType = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/api/product-types`, data);
  return response.data;
};

export const updateProductType = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/api/product-types/${id}`, data);
  return response.data;
};

export const deleteProductType = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/api/product-types/${id}`);
  return response.data;
};
