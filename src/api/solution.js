import API from '../services/API';

export const getActiveSolutions = async () => {
  const response = await API.get('/solutions/active');
  return response.data;
};

export const getAllSolutions = async () => {
  const response = await API.get('/solutions');
  return response.data;
};

export const getSolutionById = async (id) => {
  const response = await API.get(`/solutions/${id}`);
  return response.data;
};

export const createSolution = async (formData) => {
  const response = await API.post('/solutions', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateSolution = async (id, formData) => {
  const response = await API.put(`/solutions/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteSolution = async (id) => {
  const response = await API.delete(`/solutions/${id}`);
  return response.data;
};

export const uploadSolutionImage = async (id, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await API.post(`/solutions/${id}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getSectionSettings = async () => {
  const response = await API.get('/solutions/settings');
  return response.data;
};

export const updateSectionSettings = async (data) => {
  const response = await API.put('/solutions/settings/update', data);
  return response.data;
};


