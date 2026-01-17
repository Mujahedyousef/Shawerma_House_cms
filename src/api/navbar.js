import API from '../services/API';

export const getNavbarSettings = async () => {
  const response = await API.get('/navbar/settings');
  return response.data;
};

export const updateNavbarSettings = async (logoFile) => {
  const formData = new FormData();
  if (logoFile) {
    formData.append('logo', logoFile);
  }

  const response = await API.put('/navbar/settings', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getAllNavbarLinks = async () => {
  const response = await API.get('/navbar/links');
  return response.data;
};

export const getNavbarLinkById = async (id) => {
  const response = await API.get(`/navbar/links/${id}`);
  return response.data;
};

export const createNavbarLink = async (data) => {
  const response = await API.post('/navbar/links', data);
  return response.data;
};

export const updateNavbarLink = async (id, data) => {
  const response = await API.put(`/navbar/links/${id}`, data);
  return response.data;
};

export const deleteNavbarLink = async (id) => {
  const response = await API.delete(`/navbar/links/${id}`);
  return response.data;
};

