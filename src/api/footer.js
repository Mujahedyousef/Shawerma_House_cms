import API from '../services/API';

export const getFooterSettings = async () => {
  const response = await API.get('/footer/settings');
  return response.data;
};

export const updateFooterSettings = async (data) => {
  const response = await API.put('/footer/settings', data);
  return response.data;
};

export const getAllFooterLinks = async () => {
  const response = await API.get('/footer/links');
  return response.data;
};

export const getFooterLinkById = async (id) => {
  const response = await API.get(`/footer/links/${id}`);
  return response.data;
};

export const createFooterLink = async (data) => {
  const response = await API.post('/footer/links', data);
  return response.data;
};

export const updateFooterLink = async (id, data) => {
  const response = await API.put(`/footer/links/${id}`, data);
  return response.data;
};

export const deleteFooterLink = async (id) => {
  const response = await API.delete(`/footer/links/${id}`);
  return response.data;
};

export const getAllSocialMedia = async () => {
  const response = await API.get('/footer/social-media');
  return response.data;
};

export const getSocialMediaById = async (id) => {
  const response = await API.get(`/footer/social-media/${id}`);
  return response.data;
};

export const createSocialMedia = async (data) => {
  const response = await API.post('/footer/social-media', data);
  return response.data;
};

export const updateSocialMedia = async (id, data) => {
  const response = await API.put(`/footer/social-media/${id}`, data);
  return response.data;
};

export const deleteSocialMedia = async (id) => {
  const response = await API.delete(`/footer/social-media/${id}`);
  return response.data;
};
