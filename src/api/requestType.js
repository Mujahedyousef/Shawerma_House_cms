import API from '../services/API';

export const getAllRequestTypes = async () => {
  try {
    const response = await API.get('/request-types');
    return response.data;
  } catch (error) {
    console.error('Error fetching request types:', error);
    throw error;
  }
};

export const getActiveRequestTypes = async () => {
  try {
    const response = await API.get('/request-types/active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active request types:', error);
    throw error;
  }
};

export const createRequestType = async (data) => {
  try {
    const response = await API.post('/request-types', data);
    return response.data;
  } catch (error) {
    console.error('Error creating request type:', error);
    throw error;
  }
};

export const updateRequestType = async (id, data) => {
  try {
    const response = await API.put(`/request-types/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating request type:', error);
    throw error;
  }
};

export const deleteRequestType = async (id) => {
  try {
    const response = await API.delete(`/request-types/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting request type:', error);
    throw error;
  }
};
