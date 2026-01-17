import API from '../services/API';

export const getGeneralSettings = async () => {
  const response = await API.get('/general-settings/settings');
  return response.data;
};

export const updateGeneralSettings = async (data) => {
  const response = await API.put('/general-settings/settings', data);
  return response.data;
};
