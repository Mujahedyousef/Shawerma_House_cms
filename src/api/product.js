import API from '../services/API';

export const getActiveProducts = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      if (Array.isArray(filters[key])) {
        filters[key].forEach(val => queryParams.append(key, val));
      } else {
        queryParams.append(key, filters[key]);
      }
    }
  });
  
  const response = await API.get(`/products/active?${queryParams.toString()}`);
  return response.data;
};

export const getAllProducts = async () => {
  const response = await API.get('/products');
  return response.data;
};

export const getProductById = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (formData) => {
  const response = await API.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateProduct = async (id, formData) => {
  const response = await API.put(`/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await API.delete(`/products/${id}`);
  return response.data;
};

export const getProductFilterOptions = async () => {
  const response = await API.get('/products/filter-options');
  return response.data;
};

export const getProductsPageSettings = async () => {
  const response = await API.get('/products/page-settings');
  return response.data;
};

export const updateProductsPageSettings = async (formData) => {
  const response = await API.put('/products/page-settings', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
