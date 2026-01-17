import API from '../services/API';

export const getActiveBrandsSection = async () => {
  const response = await API.get('/brands-section/active');
  return response.data;
};

export const getBrandsSectionById = async (id) => {
  const response = await API.get(`/brands-section/${id}`);
  return response.data;
};

export const createBrandsSection = async (data) => {
  const response = await API.post('/brands-section', data);
  return response.data;
};

export const updateBrandsSection = async (id, data) => {
  const response = await API.put(`/brands-section/${id}`, data);
  return response.data;
};

export const uploadBrandLogo = async (brandsSectionId, file, order, nameEn, nameAr) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('order', order);
  formData.append('nameEn', nameEn || 'Brand');
  formData.append('nameAr', nameAr || 'علامة تجارية');

  const response = await API.post(`/brands-section/${brandsSectionId}/logos`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateBrandLogo = async (logoId, data) => {
  const response = await API.put(`/brands-section/logos/${logoId}`, data);
  return response.data;
};

export const deleteBrandLogo = async (logoId) => {
  const response = await API.delete(`/brands-section/logos/${logoId}`);
  return response.data;
};

export const getSectionSettings = async () => {
  const response = await API.get('/brands-section/settings');
  return response.data;
};

export const updateSectionSettings = async (data) => {
  const response = await API.put('/brands-section/settings', data);
  return response.data;
};