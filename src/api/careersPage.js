import API from '../services/API';

export const getCareersPageSettings = async () => {
  try {
    const response = await API.get('/careers-page/page-settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching Careers page settings:', error);
    throw error;
  }
};

export const updateCareersPageSettings = async (data) => {
  try {
    const formData = new FormData();

    formData.append('heroTitleEn', data.heroTitleEn);
    formData.append('heroTitleAr', data.heroTitleAr);
    formData.append('heroDescriptionEn', data.heroDescriptionEn);
    formData.append('heroDescriptionAr', data.heroDescriptionAr);
    formData.append('whyWorkWithUsTitleEn', data.whyWorkWithUsTitleEn || '');
    formData.append('whyWorkWithUsTitleAr', data.whyWorkWithUsTitleAr || '');

    if (data.heroImage && data.heroImage instanceof File) {
      formData.append('heroImage', data.heroImage);
    }

    const response = await API.put('/careers-page/page-settings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating Careers page settings:', error);
    throw error;
  }
};

export const createJobBenefit = async (data) => {
  try {
    const response = await API.post('/careers-page/job-benefits', data);
    return response.data;
  } catch (error) {
    console.error('Error creating job benefit:', error);
    throw error;
  }
};

export const updateJobBenefit = async (id, data) => {
  try {
    const response = await API.put(`/careers-page/job-benefits/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating job benefit:', error);
    throw error;
  }
};

export const deleteJobBenefit = async (id) => {
  try {
    const response = await API.delete(`/careers-page/job-benefits/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting job benefit:', error);
    throw error;
  }
};

export const createJobListing = async (data) => {
  try {
    const response = await API.post('/careers-page/job-listings', data);
    return response.data;
  } catch (error) {
    console.error('Error creating job listing:', error);
    throw error;
  }
};

export const updateJobListing = async (id, data) => {
  try {
    const response = await API.put(`/careers-page/job-listings/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating job listing:', error);
    throw error;
  }
};

export const deleteJobListing = async (id) => {
  try {
    const response = await API.delete(`/careers-page/job-listings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting job listing:', error);
    throw error;
  }
};

export const createWhyWorkWithUsItem = async (data) => {
  try {
    const response = await API.post('/careers-page/why-work-with-us', data);
    return response.data;
  } catch (error) {
    console.error('Error creating why work with us item:', error);
    throw error;
  }
};

export const updateWhyWorkWithUsItem = async (id, data) => {
  try {
    const response = await API.put(`/careers-page/why-work-with-us/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating why work with us item:', error);
    throw error;
  }
};

export const deleteWhyWorkWithUsItem = async (id) => {
  try {
    const response = await API.delete(`/careers-page/why-work-with-us/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting why work with us item:', error);
    throw error;
  }
};

export const getAllJobApplications = async () => {
  try {
    const response = await API.get('/careers-page/job-applications');
    return response.data;
  } catch (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }
};

export const getJobApplicationsByJobId = async (jobId) => {
  try {
    const response = await API.get(`/careers-page/job-applications/job/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job applications by job ID:', error);
    throw error;
  }
};
