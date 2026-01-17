import API from '../services/API';

export const getFAQPageSettings = async () => {
  try {
    const response = await API.get('/faq-page/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching FAQ page settings:', error);
    throw error;
  }
};

export const updateFAQPageSettings = async (data) => {
  try {
    const response = await API.put('/faq-page/settings', data);
    return response.data;
  } catch (error) {
    console.error('Error updating FAQ page settings:', error);
    throw error;
  }
};

export const getAllFAQItems = async () => {
  try {
    const response = await API.get('/faq-page/items');
    return response.data;
  } catch (error) {
    console.error('Error fetching FAQ items:', error);
    throw error;
  }
};

export const getFAQItemById = async (id) => {
  try {
    const response = await API.get(`/faq-page/items/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching FAQ item:', error);
    throw error;
  }
};

export const createFAQItem = async (data) => {
  try {
    const response = await API.post('/faq-page/items', data);
    return response.data;
  } catch (error) {
    console.error('Error creating FAQ item:', error);
    throw error;
  }
};

export const updateFAQItem = async (id, data) => {
  try {
    const response = await API.put(`/faq-page/items/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating FAQ item:', error);
    throw error;
  }
};

export const deleteFAQItem = async (id) => {
  try {
    const response = await API.delete(`/faq-page/items/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting FAQ item:', error);
    throw error;
  }
};
