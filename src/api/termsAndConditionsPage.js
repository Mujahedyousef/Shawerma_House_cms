import API from '../services/API';

export const getTermsAndConditionsPageSettings = async () => {
  try {
    const response = await API.get('/terms-and-conditions-page/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching terms and conditions page settings:', error);
    throw error;
  }
};

export const updateTermsAndConditionsPageSettings = async (data) => {
  try {
    const formData = new FormData();
    
    // Append text fields
    formData.append('titleEn', data.titleEn);
    formData.append('titleAr', data.titleAr);
    formData.append('descriptionEn', data.descriptionEn);
    formData.append('descriptionAr', data.descriptionAr);
    formData.append('contentEn', data.contentEn || '');
    formData.append('contentAr', data.contentAr || '');
    
    // Append hero image if provided
    if (data.heroImage && data.heroImage instanceof File) {
      formData.append('heroImage', data.heroImage);
    } else if (data.heroImageUrl) {
      formData.append('heroImageUrl', data.heroImageUrl);
    }

    const response = await API.put('/terms-and-conditions-page/settings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating terms and conditions page settings:', error);
    throw error;
  }
};
