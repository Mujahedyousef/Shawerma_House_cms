import API from '../services/API';

export const getContactPageSettings = async () => {
  try {
    const response = await API.get('/contact-page/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching contact page settings:', error);
    throw error;
  }
};

export const updateContactPageSettings = async (data) => {
  try {
    const formData = new FormData();
    
    // Append text fields
    formData.append('titleEn', data.titleEn);
    formData.append('titleAr', data.titleAr);
    formData.append('descriptionEn', data.descriptionEn);
    formData.append('descriptionAr', data.descriptionAr);
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('email', data.email);
    formData.append('workingHoursEn', data.workingHoursEn);
    formData.append('workingHoursAr', data.workingHoursAr);
    formData.append('locationEn', data.locationEn);
    formData.append('locationAr', data.locationAr);
    
    // Append hero image if provided
    if (data.heroImage && data.heroImage instanceof File) {
      formData.append('heroImage', data.heroImage);
    } else if (data.heroImageUrl) {
      formData.append('heroImageUrl', data.heroImageUrl);
    }
    
    // Append map coordinates if provided
    if (data.mapLatitude !== undefined && data.mapLatitude !== null && data.mapLatitude !== '') {
      formData.append('mapLatitude', data.mapLatitude);
    }
    if (data.mapLongitude !== undefined && data.mapLongitude !== null && data.mapLongitude !== '') {
      formData.append('mapLongitude', data.mapLongitude);
    }

    const response = await API.put('/contact-page/settings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating contact page settings:', error);
    throw error;
  }
};
