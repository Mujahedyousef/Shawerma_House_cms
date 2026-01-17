import API from '../services/API';

export const getAllContactRequests = async () => {
  try {
    const response = await API.get('/contact-requests');
    return response.data;
  } catch (error) {
    console.error('Error fetching contact requests:', error);
    throw error;
  }
};

export const getContactRequestById = async (id) => {
  try {
    const response = await API.get(`/contact-requests/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching contact request:', error);
    throw error;
  }
};

export const updateContactRequest = async (id, data) => {
  try {
    const response = await API.put(`/contact-requests/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating contact request:', error);
    throw error;
  }
};

export const deleteContactRequest = async (id) => {
  try {
    const response = await API.delete(`/contact-requests/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting contact request:', error);
    throw error;
  }
};
