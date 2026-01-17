import API from '../services/API';

export const getActiveProjectsSection = async () => {
  const response = await API.get('/projects-section/active');
  return response.data;
};

export const getAllProjects = async () => {
  const response = await API.get('/projects-section/projects');
  return response.data;
};

export const getProjectById = async (id) => {
  const response = await API.get(`/projects-section/projects/${id}`);
  return response.data;
};

export const createProject = async (data) => {
  const formData = new FormData();
  formData.append('titleEn', data.titleEn);
  formData.append('titleAr', data.titleAr);
  if (data.descriptionEn !== undefined) formData.append('descriptionEn', data.descriptionEn || '');
  if (data.descriptionAr !== undefined) formData.append('descriptionAr', data.descriptionAr || '');
  if (data.contentEn !== undefined) formData.append('contentEn', data.contentEn || '');
  if (data.contentAr !== undefined) formData.append('contentAr', data.contentAr || '');
  if (data.specifications !== undefined && data.specifications) {
    formData.append('specifications', data.specifications);
  }
  formData.append('productsCount', data.productsCount);
  formData.append('order', data.order || 0);
  formData.append('isActive', data.isActive !== undefined ? data.isActive : true);
  formData.append('buttonTextEn', data.buttonTextEn || '');
  formData.append('buttonTextAr', data.buttonTextAr || '');
  
  if (data.image instanceof File) {
    formData.append('image', data.image);
  } else if (data.imageUrl) {
    formData.append('imageUrl', data.imageUrl);
  }
  
  if (data.heroImage instanceof File) {
    formData.append('heroImage', data.heroImage);
  } else if (data.heroImageUrl) {
    formData.append('heroImageUrl', data.heroImageUrl);
  }

  if (data.projectsSectionId) {
    formData.append('projectsSectionId', data.projectsSectionId);
  }

  const response = await API.post('/projects-section/projects', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateProject = async (id, data) => {
  const formData = new FormData();
  if (data.titleEn) formData.append('titleEn', data.titleEn);
  if (data.titleAr) formData.append('titleAr', data.titleAr);
  if (data.descriptionEn !== undefined) formData.append('descriptionEn', data.descriptionEn || '');
  if (data.descriptionAr !== undefined) formData.append('descriptionAr', data.descriptionAr || '');
  if (data.contentEn !== undefined) formData.append('contentEn', data.contentEn || '');
  if (data.contentAr !== undefined) formData.append('contentAr', data.contentAr || '');
  if (data.specifications !== undefined && data.specifications !== null) {
    formData.append('specifications', data.specifications);
  }
  if (data.productsCount !== undefined) formData.append('productsCount', data.productsCount);
  if (data.order !== undefined) formData.append('order', data.order);
  if (data.isActive !== undefined) formData.append('isActive', data.isActive);
  if (data.buttonTextEn !== undefined) formData.append('buttonTextEn', data.buttonTextEn);
  if (data.buttonTextAr !== undefined) formData.append('buttonTextAr', data.buttonTextAr);
  
  if (data.image instanceof File) {
    formData.append('image', data.image);
  } else if (data.imageUrl) {
    formData.append('imageUrl', data.imageUrl);
  }
  
  if (data.heroImage instanceof File) {
    formData.append('heroImage', data.heroImage);
  } else if (data.heroImageUrl !== undefined) {
    formData.append('heroImageUrl', data.heroImageUrl || '');
  }

  const response = await API.put(`/projects-section/projects/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await API.delete(`/projects-section/projects/${id}`);
  return response.data;
};

export const uploadProjectLogo = async (projectId, file, order) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('order', order);

  const response = await API.post(`/projects-section/projects/${projectId}/logos`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteProjectLogo = async (logoId) => {
  const response = await API.delete(`/projects-section/projects/logos/${logoId}`);
  return response.data;
};

export const createSectionSettings = async (data) => {
  const response = await API.post('/projects-section/settings', data);
  return response.data;
};

export const updateSectionSettings = async (id, data) => {
  const response = await API.put(`/projects-section/settings/${id}`, data);
  return response.data;
};

export const uploadProjectGalleryImages = async (projectId, files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('galleryImages', file);
  });

  const response = await API.post(`/projects-section/projects/${projectId}/gallery-images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteProjectGalleryImage = async (imageId) => {
  const response = await API.delete(`/projects-section/projects/gallery-images/${imageId}`);
  return response.data;
};
