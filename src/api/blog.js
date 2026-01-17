import API from '../services/API';

export const getAllBlogs = async () => {
  try {
    const response = await API.get('/blogs-page/all-blogs');
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

export const getBlogById = async (id) => {
  try {
    const response = await API.get(`/blogs-page/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
};

export const createBlog = async (data) => {
  try {
    const formData = new FormData();
    
    formData.append('titleEn', data.titleEn);
    formData.append('titleAr', data.titleAr);
    if (data.descriptionEn) {
      formData.append('descriptionEn', data.descriptionEn);
    }
    if (data.descriptionAr) {
      formData.append('descriptionAr', data.descriptionAr);
    }
    if (data.contentEn) {
      formData.append('contentEn', data.contentEn);
    }
    if (data.contentAr) {
      formData.append('contentAr', data.contentAr);
    }
    if (data.conclusionEn) {
      formData.append('conclusionEn', data.conclusionEn);
    }
    if (data.conclusionAr) {
      formData.append('conclusionAr', data.conclusionAr);
    }
    formData.append('date', data.date);
    formData.append('order', data.order || 0);
    formData.append('isActive', data.isActive ? 'true' : 'false');
    
    if (data.authorEn) {
      formData.append('authorEn', data.authorEn);
    }
    
    if (data.authorAr) {
      formData.append('authorAr', data.authorAr);
    }
    
    if (data.link) {
      formData.append('link', data.link);
    }
    
    if (data.categoryId) {
      formData.append('categoryId', data.categoryId);
    }
    
    if (data.statusId) {
      formData.append('statusId', data.statusId);
    }
    if (data.showInHero !== undefined) {
      formData.append('showInHero', data.showInHero ? 'true' : 'false');
    }
    
    if (data.image && data.image instanceof File) {
      formData.append('image', data.image);
    }

    const response = await API.post('/blogs-page/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

export const updateBlog = async (id, data) => {
  try {
    const formData = new FormData();
    
    formData.append('titleEn', data.titleEn);
    formData.append('titleAr', data.titleAr);
    if (data.descriptionEn !== undefined) {
      formData.append('descriptionEn', data.descriptionEn || '');
    }
    if (data.descriptionAr !== undefined) {
      formData.append('descriptionAr', data.descriptionAr || '');
    }
    if (data.contentEn !== undefined) {
      formData.append('contentEn', data.contentEn || '');
    }
    if (data.contentAr !== undefined) {
      formData.append('contentAr', data.contentAr || '');
    }
    if (data.conclusionEn !== undefined) {
      formData.append('conclusionEn', data.conclusionEn || '');
    }
    if (data.conclusionAr !== undefined) {
      formData.append('conclusionAr', data.conclusionAr || '');
    }
    formData.append('date', data.date);
    formData.append('order', data.order || 0);
    formData.append('isActive', data.isActive ? 'true' : 'false');
    
    if (data.authorEn !== undefined) {
      formData.append('authorEn', data.authorEn || '');
    }
    
    if (data.authorAr !== undefined) {
      formData.append('authorAr', data.authorAr || '');
    }
    
    if (data.link !== undefined) {
      formData.append('link', data.link || '');
    }
    
    if (data.categoryId !== undefined) {
      formData.append('categoryId', data.categoryId || '');
    }
    
    if (data.statusId !== undefined) {
      formData.append('statusId', data.statusId || '');
    }
    if (data.showInHero !== undefined) {
      formData.append('showInHero', data.showInHero ? 'true' : 'false');
    }
    
    if (data.image && data.image instanceof File) {
      formData.append('image', data.image);
    }

    const response = await API.put(`/blogs-page/blogs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

export const deleteBlog = async (id) => {
  try {
    const response = await API.delete(`/blogs-page/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

export const getBlogsPageSettings = async () => {
  try {
    const response = await API.get('/blogs-page/page-settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs page settings:', error);
    throw error;
  }
};

export const updateBlogsPageSettings = async (data) => {
  try {
    const formData = new FormData();
    
    formData.append('titleEn', data.titleEn);
    formData.append('titleAr', data.titleAr);
    formData.append('descriptionEn', data.descriptionEn);
    formData.append('descriptionAr', data.descriptionAr);
    if (data.heroSectionDescriptionEn !== undefined) {
      formData.append('heroSectionDescriptionEn', data.heroSectionDescriptionEn || '');
    }
    if (data.heroSectionDescriptionAr !== undefined) {
      formData.append('heroSectionDescriptionAr', data.heroSectionDescriptionAr || '');
    }
    if (data.gridSectionTitleEn !== undefined) {
      formData.append('gridSectionTitleEn', data.gridSectionTitleEn || '');
    }
    if (data.gridSectionTitleAr !== undefined) {
      formData.append('gridSectionTitleAr', data.gridSectionTitleAr || '');
    }
    
    if (data.heroImage && data.heroImage instanceof File) {
      formData.append('heroImage', data.heroImage);
    } else if (data.heroImageUrl) {
      formData.append('heroImageUrl', data.heroImageUrl);
    }

    const response = await API.put('/blogs-page/page-settings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating blogs page settings:', error);
    throw error;
  }
};
