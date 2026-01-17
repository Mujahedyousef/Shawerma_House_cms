import API from '../services/API';

export const getActiveTestimonial = async () => {
  const response = await API.get('/testimonials/active');
  return response.data;
};

export const getAllTestimonials = async () => {
  const response = await API.get('/testimonials');
  return response.data;
};

export const getTestimonialById = async (id) => {
  const response = await API.get(`/testimonials/${id}`);
  return response.data;
};

export const createTestimonial = async (formData) => {
  const response = await API.post('/testimonials', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateTestimonial = async (id, formData) => {
  const response = await API.put(`/testimonials/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteTestimonial = async (id) => {
  const response = await API.delete(`/testimonials/${id}`);
  return response.data;
};

export const addTestimonialProfile = async (testimonialId, formData) => {
  const response = await API.post(`/testimonials/${testimonialId}/profiles`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateTestimonialProfile = async (profileId, formData) => {
  const response = await API.put(`/testimonials/profiles/${profileId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteTestimonialProfile = async (profileId) => {
  const response = await API.delete(`/testimonials/profiles/${profileId}`);
  return response.data;
};
