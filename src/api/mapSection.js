import API from '../services/API';

// Map Section APIs
export const getActiveMapSection = async () => {
  const response = await API.get('/map-section/active');
  return response.data;
};

export const getMapSectionById = async (id) => {
  const response = await API.get(`/map-section/${id}`);
  return response.data;
};

export const createMapSection = async (data) => {
  const response = await API.post('/map-section', data);
  return response.data;
};

export const updateMapSection = async (id, data) => {
  const response = await API.put(`/map-section/${id}`, data);
  return response.data;
};

export const deleteMapSection = async (id) => {
  const response = await API.delete(`/map-section/${id}`);
  return response.data;
};

// Branch APIs
export const getBranches = async (mapSectionId) => {
  const response = await API.get(`/map-section/${mapSectionId}/branches`);
  return response.data;
};

export const getBranchById = async (id) => {
  const response = await API.get(`/map-section/branches/${id}`);
  return response.data;
};

export const createBranch = async (data) => {
  const response = await API.post('/map-section/branches', data);
  return response.data;
};

export const updateBranch = async (id, data) => {
  const response = await API.put(`/map-section/branches/${id}`, data);
  return response.data;
};

export const deleteBranch = async (id) => {
  const response = await API.delete(`/map-section/branches/${id}`);
  return response.data;
};


