import API from '../services/API';

export const getActiveStartProjectSection = async () => {
  const response = await API.get('/start-project-section/active');
  return response.data;
};

export const getStartProjectSectionById = async (id) => {
  const response = await API.get(`/start-project-section/${id}`);
  return response.data;
};

export const createStartProjectSection = async (data) => {
  const formData = new FormData();
  formData.append('titleEn', data.titleEn);
  formData.append('titleAr', data.titleAr);
  formData.append('descriptionEn', data.descriptionEn);
  formData.append('descriptionAr', data.descriptionAr);
  formData.append('button1TextEn', data.button1TextEn);
  formData.append('button1TextAr', data.button1TextAr);
  formData.append('button1Link', data.button1Link || '');
  formData.append('button2TextEn', data.button2TextEn);
  formData.append('button2TextAr', data.button2TextAr);
  formData.append('button2Link', data.button2Link || '');
  formData.append('isActive', data.isActive !== undefined ? data.isActive : true);
  
  if (data.backgroundImage instanceof File) {
    formData.append('backgroundImage', data.backgroundImage);
  } else if (data.backgroundImageUrl) {
    formData.append('backgroundImageUrl', data.backgroundImageUrl);
  }

  const response = await API.post('/start-project-section', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateStartProjectSection = async (id, data) => {
  const formData = new FormData();
  if (data.titleEn !== undefined) formData.append('titleEn', data.titleEn);
  if (data.titleAr !== undefined) formData.append('titleAr', data.titleAr);
  if (data.descriptionEn !== undefined) formData.append('descriptionEn', data.descriptionEn);
  if (data.descriptionAr !== undefined) formData.append('descriptionAr', data.descriptionAr);
  if (data.button1TextEn !== undefined) formData.append('button1TextEn', data.button1TextEn);
  if (data.button1TextAr !== undefined) formData.append('button1TextAr', data.button1TextAr);
  if (data.button1Link !== undefined) formData.append('button1Link', data.button1Link || '');
  if (data.button2TextEn !== undefined) formData.append('button2TextEn', data.button2TextEn);
  if (data.button2TextAr !== undefined) formData.append('button2TextAr', data.button2TextAr);
  if (data.button2Link !== undefined) formData.append('button2Link', data.button2Link || '');
  if (data.isActive !== undefined) formData.append('isActive', data.isActive);
  
  if (data.backgroundImage instanceof File) {
    formData.append('backgroundImage', data.backgroundImage);
  } else if (data.backgroundImageUrl !== undefined) {
    formData.append('backgroundImageUrl', data.backgroundImageUrl || '');
  }

  const response = await API.put(`/start-project-section/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteStartProjectSection = async (id) => {
  const response = await API.delete(`/start-project-section/${id}`);
  return response.data;
};
