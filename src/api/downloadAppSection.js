import API from '../services/API';

export const getActiveDownloadAppSection = async () => {
  const response = await API.get('/download-app-section/active');
  return response.data;
};

export const getDownloadAppSectionById = async (id) => {
  const response = await API.get(`/download-app-section/${id}`);
  return response.data;
};

export const createDownloadAppSection = async (data) => {
  const response = await API.post('/download-app-section', data);
  return response.data;
};

export const updateDownloadAppSection = async (id, data) => {
  const response = await API.put(`/download-app-section/${id}`, data);
  return response.data;
};

export const deleteDownloadAppSection = async (id) => {
  const response = await API.delete(`/download-app-section/${id}`);
  return response.data;
};

export const uploadDownloadAppImage = async (sectionId, imageType, file) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('imageType', imageType);

  const response = await API.post(`/download-app-section/${sectionId}/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

