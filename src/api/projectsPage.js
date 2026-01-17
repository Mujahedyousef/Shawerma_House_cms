import API from '../services/API';

export const getProjectsPageSettings = async () => {
  try {
    const response = await API.get('/projects-page/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching projects page settings:', error);
    throw error;
  }
};

export const updateProjectsPageSettings = async (data) => {
  try {
    const formData = new FormData();
    
    // Append text fields
    formData.append('heroTitleEn', data.heroTitleEn);
    formData.append('heroTitleAr', data.heroTitleAr);
    formData.append('heroDescriptionEn', data.heroDescriptionEn || '');
    formData.append('heroDescriptionAr', data.heroDescriptionAr || '');
    
    // Append hero image if provided
    if (data.heroImage && data.heroImage instanceof File) {
      formData.append('heroImage', data.heroImage);
    } else if (data.heroImageUrl) {
      formData.append('heroImageUrl', data.heroImageUrl);
    }

    const response = await API.put('/projects-page/settings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating projects page settings:', error);
    throw error;
  }
};

export const getAllHeroButtons = async () => {
  try {
    const response = await API.get('/projects-page/hero-buttons');
    return response.data;
  } catch (error) {
    console.error('Error fetching hero buttons:', error);
    throw error;
  }
};

export const getHeroButtonById = async (id) => {
  try {
    const response = await API.get(`/projects-page/hero-buttons/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hero button:', error);
    throw error;
  }
};

export const createHeroButton = async (data) => {
  try {
    const response = await API.post('/projects-page/hero-buttons', data);
    return response.data;
  } catch (error) {
    console.error('Error creating hero button:', error);
    throw error;
  }
};

export const updateHeroButton = async (id, data) => {
  try {
    const response = await API.put(`/projects-page/hero-buttons/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating hero button:', error);
    throw error;
  }
};

export const deleteHeroButton = async (id) => {
  try {
    const response = await API.delete(`/projects-page/hero-buttons/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting hero button:', error);
    throw error;
  }
};










