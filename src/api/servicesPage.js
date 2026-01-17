import API from '../services/API';

export const getServicesPageSettings = async () => {
  const response = await API.get('/services-page/page-settings');
  return response.data;
};

export const updateServicesPageSettings = async (formData) => {
  const response = await API.put('/services-page/page-settings', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
