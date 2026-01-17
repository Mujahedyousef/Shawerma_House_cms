import API from '../services/API';

export const getActiveCategories = async () => {
  const response = await API.get('/categories/active');
  return response.data;
};

export const getAllCategories = async () => {
  const response = await API.get('/categories');
  return response.data;
};

export const getCategoryById = async id => {
  const response = await API.get(`/categories/${id}`);
  return response.data;
};

export const createCategory = async data => {
  const formData = new FormData();
  formData.append('titleEn', data.titleEn);
  formData.append('titleAr', data.titleAr);
  formData.append('productCount', data.productCount);
  formData.append('gridClasses', data.gridClasses);
  formData.append('order', data.order || 0);
  formData.append('isActive', data.isActive !== undefined ? data.isActive : true);

  if (data.image instanceof File) {
    formData.append('image', data.image);
  } else if (data.imageUrl) {
    formData.append('imageUrl', data.imageUrl);
  }

  const response = await API.post('/categories', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateCategory = async (id, data) => {
  const formData = new FormData();
  if (data.titleEn) formData.append('titleEn', data.titleEn);
  if (data.titleAr) formData.append('titleAr', data.titleAr);
  if (data.productCount !== undefined) formData.append('productCount', data.productCount);
  if (data.gridClasses) formData.append('gridClasses', data.gridClasses);
  if (data.order !== undefined) formData.append('order', data.order);
  if (data.isActive !== undefined) formData.append('isActive', data.isActive);

  if (data.image instanceof File) {
    formData.append('image', data.image);
  } else if (data.imageUrl) {
    formData.append('imageUrl', data.imageUrl);
  }

  const response = await API.put(`/categories/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteCategory = async id => {
  const response = await API.delete(`/categories/${id}`);
  return response.data;
};

export const getCategoriesSectionSettings = async () => {
  const response = await API.get('/categories-section/settings');
  return response.data;
};

export const updateCategoriesSectionSettings = async data => {
  const response = await API.put('/categories-section/settings', data);
  return response.data;
};
