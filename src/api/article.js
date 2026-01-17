import API from '../services/API';

export const getAllArticles = async () => {
  try {
    const response = await API.get('/articles');
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

export const getActiveArticles = async () => {
  try {
    const response = await API.get('/articles/active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active articles:', error);
    throw error;
  }
};

export const getArticleById = async (id) => {
  try {
    const response = await API.get(`/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
};

export const createArticle = async (data) => {
  try {
    const formData = new FormData();
    
    // Append text fields
    formData.append('titleEn', data.titleEn);
    formData.append('titleAr', data.titleAr);
    formData.append('date', data.date);
    formData.append('order', data.order || 0);
    formData.append('isActive', data.isActive ? 'true' : 'false');
    if (data.link) {
      formData.append('link', data.link);
    }
    
    // Append image file if provided
    if (data.image && data.image instanceof File) {
      formData.append('image', data.image);
    } else if (data.imageUrl) {
      formData.append('imageUrl', data.imageUrl);
    }

    const response = await API.post('/articles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
};

export const updateArticle = async (id, data) => {
  try {
    const formData = new FormData();
    
    // Append text fields
    formData.append('titleEn', data.titleEn);
    formData.append('titleAr', data.titleAr);
    if (data.date) {
      formData.append('date', data.date);
    }
    if (data.order !== undefined) {
      formData.append('order', data.order);
    }
    if (data.isActive !== undefined) {
      formData.append('isActive', data.isActive ? 'true' : 'false');
    }
    if (data.link !== undefined) {
      formData.append('link', data.link || '');
    }
    
    // Append image file if provided
    if (data.image && data.image instanceof File) {
      formData.append('image', data.image);
    } else if (data.imageUrl) {
      formData.append('imageUrl', data.imageUrl);
    }

    const response = await API.put(`/articles/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
};

export const deleteArticle = async (id) => {
  try {
    const response = await API.delete(`/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
};

export const getSectionSettings = async () => {
  try {
    const response = await API.get('/articles/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching articles section settings:', error);
    throw error;
  }
};

export const updateSectionSettings = async (data) => {
  try {
    const response = await API.put('/articles/settings/update', data);
    return response.data;
  } catch (error) {
    console.error('Error updating articles section settings:', error);
    throw error;
  }
};
