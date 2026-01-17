import API from '../services/API';

export const getThemeSettings = async () => {
  const response = await API.get('/theme/settings');
  return response.data;
};

export const updateThemeSettings = async (data) => {
  const response = await API.put('/theme/settings', data);
  return response.data;
};

