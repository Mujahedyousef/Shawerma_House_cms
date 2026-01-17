import API from '../services/API';

export const getAllColors = async () => {
  const response = await API.get('/colors');
  return response.data;
};

export const getActiveColors = async () => {
  const response = await API.get('/colors/active');
  return response.data;
};

export const getColorById = async (id) => {
  const response = await API.get(`/colors/${id}`);
  return response.data;
};

export const createColor = async (data) => {
  const response = await API.post('/colors', data);
  return response.data;
};

export const updateColor = async (id, data) => {
  const response = await API.put(`/colors/${id}`, data);
  return response.data;
};

export const deleteColor = async (id) => {
  const response = await API.delete(`/colors/${id}`);
  return response.data;
};
