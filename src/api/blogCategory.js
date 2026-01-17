import API from '../services/API';

export const getAllBlogCategories = async () => {
  try {
    const response = await API.get('/blog-categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    throw error;
  }
};

export const getActiveBlogCategories = async () => {
  try {
    const response = await API.get('/blog-categories/active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active blog categories:', error);
    throw error;
  }
};

export const createBlogCategory = async (data) => {
  try {
    const response = await API.post('/blog-categories', data);
    return response.data;
  } catch (error) {
    console.error('Error creating blog category:', error);
    throw error;
  }
};

export const updateBlogCategory = async (id, data) => {
  try {
    const response = await API.put(`/blog-categories/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating blog category:', error);
    throw error;
  }
};

export const deleteBlogCategory = async (id) => {
  try {
    const response = await API.delete(`/blog-categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting blog category:', error);
    throw error;
  }
};
