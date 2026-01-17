import API from '../services/API';

export const getActiveHeroSection = async () => {
  const response = await API.get('/hero-section/active');
  return response.data;
};

export const getHeroSectionById = async (id) => {
  const response = await API.get(`/hero-section/${id}`);
  return response.data;
};

export const createHeroSection = async (data) => {
  const response = await API.post('/hero-section', data);
  return response.data;
};

export const updateHeroSection = async (id, data) => {
  const response = await API.put(`/hero-section/${id}`, data);
  return response.data;
};

export const uploadHeroMedia = async (heroSectionId, file, type, order) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  formData.append('order', order);

  const response = await API.post(`/hero-section/${heroSectionId}/media`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteHeroMedia = async (mediaId) => {
  const response = await API.delete(`/hero-section/media/${mediaId}`);
  return response.data;
};

export const addHeroStat = async (heroSectionId, statData) => {
  const response = await API.post(`/hero-section/${heroSectionId}/stats`, statData);
  return response.data;
};

export const updateHeroStat = async (statId, statData) => {
  const response = await API.put(`/hero-section/stats/${statId}`, statData);
  return response.data;
};

export const deleteHeroStat = async (statId) => {
  const response = await API.delete(`/hero-section/stats/${statId}`);
  return response.data;
};

