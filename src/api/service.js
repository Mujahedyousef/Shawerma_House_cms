import API from '../services/API';

export const getAllServices = async () => {
  const response = await API.get('/services');
  return response.data;
};

export const getActiveServices = async () => {
  const response = await API.get('/services/active');
  return response.data;
};

export const getServiceById = async (id) => {
  const response = await API.get(`/services/${id}`);
  return response.data;
};

export const createService = async (formData) => {
  const response = await API.post('/services', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateService = async (id, formData) => {
  const response = await API.put(`/services/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteService = async (id) => {
  const response = await API.delete(`/services/${id}`);
  return response.data;
};

