import API from '../services/API';

export const getAllProductOrders = async () => {
  const response = await API.get('/product-orders');
  return response.data;
};

export const getProductOrderById = async (id) => {
  const response = await API.get(`/product-orders/${id}`);
  return response.data;
};

export const updateProductOrder = async (id, data) => {
  const response = await API.put(`/product-orders/${id}`, data);
  return response.data;
};

export const deleteProductOrder = async (id) => {
  const response = await API.delete(`/product-orders/${id}`);
  return response.data;
};
