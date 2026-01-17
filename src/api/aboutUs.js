import API from '../services/API';

export const getAboutUsPageSettings = async () => {
  try {
    const response = await API.get('/about-us-page/page-settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching About Us page settings:', error);
    throw error;
  }
};

export const updateAboutUsPageSettings = async (data) => {
  try {
    const formData = new FormData();

    formData.append('heroTitleEn', data.heroTitleEn);
    formData.append('heroTitleAr', data.heroTitleAr);
    formData.append('heroDescriptionEn', data.heroDescriptionEn);
    formData.append('heroDescriptionAr', data.heroDescriptionAr);
    formData.append('visionSectionTitleEn', data.visionSectionTitleEn);
    formData.append('visionSectionTitleAr', data.visionSectionTitleAr);
    formData.append('visionTextEn', data.visionTextEn);
    formData.append('visionTextAr', data.visionTextAr);

    if (data.visionQuoteTextEn) {
      formData.append('visionQuoteTextEn', data.visionQuoteTextEn);
    }
    if (data.visionQuoteTextAr) {
      formData.append('visionQuoteTextAr', data.visionQuoteTextAr);
    }
    if (data.visionQuoteAuthorNameEn) {
      formData.append('visionQuoteAuthorNameEn', data.visionQuoteAuthorNameEn);
    }
    if (data.visionQuoteAuthorNameAr) {
      formData.append('visionQuoteAuthorNameAr', data.visionQuoteAuthorNameAr);
    }
    if (data.visionQuoteAuthorTitleEn) {
      formData.append('visionQuoteAuthorTitleEn', data.visionQuoteAuthorTitleEn);
    }
    if (data.visionQuoteAuthorTitleAr) {
      formData.append('visionQuoteAuthorTitleAr', data.visionQuoteAuthorTitleAr);
    }

    formData.append('messageSectionTitleEn', data.messageSectionTitleEn || '');
    formData.append('messageSectionTitleAr', data.messageSectionTitleAr || '');
    formData.append('messageTextEn', data.messageTextEn || '');
    formData.append('messageTextAr', data.messageTextAr || '');
    formData.append('messageBannerTextEn', data.messageBannerTextEn || '');
    formData.append('messageBannerTextAr', data.messageBannerTextAr || '');
    formData.append('ourStorySectionTitleEn', data.ourStorySectionTitleEn || '');
    formData.append('ourStorySectionTitleAr', data.ourStorySectionTitleAr || '');
    formData.append('ourStorySectionSubtitleEn', data.ourStorySectionSubtitleEn || '');
    formData.append('ourStorySectionSubtitleAr', data.ourStorySectionSubtitleAr || '');
    formData.append('coreValuesSectionTitleEn', data.coreValuesSectionTitleEn || '');
    formData.append('coreValuesSectionTitleAr', data.coreValuesSectionTitleAr || '');
    formData.append('coreValuesSectionSubtitleEn', data.coreValuesSectionSubtitleEn || '');
    formData.append('coreValuesSectionSubtitleAr', data.coreValuesSectionSubtitleAr || '');
    formData.append('teamSectionTitleEn', data.teamSectionTitleEn || '');
    formData.append('teamSectionTitleAr', data.teamSectionTitleAr || '');
    formData.append('teamSectionSubtitleEn', data.teamSectionSubtitleEn || '');
    formData.append('teamSectionSubtitleAr', data.teamSectionSubtitleAr || '');
    formData.append('awardsSectionTitleEn', data.awardsSectionTitleEn || '');
    formData.append('awardsSectionTitleAr', data.awardsSectionTitleAr || '');
    formData.append('awardsSectionSubtitleEn', data.awardsSectionSubtitleEn || '');
    formData.append('awardsSectionSubtitleAr', data.awardsSectionSubtitleAr || '');

    if (data.heroImage && data.heroImage instanceof File) {
      formData.append('heroImage', data.heroImage);
    }
    if (data.visionImage && data.visionImage instanceof File) {
      formData.append('visionImage', data.visionImage);
    }
    if (data.visionQuoteAuthorImage && data.visionQuoteAuthorImage instanceof File) {
      formData.append('visionQuoteAuthorImage', data.visionQuoteAuthorImage);
    }
    if (data.messageImage && data.messageImage instanceof File) {
      formData.append('messageImage', data.messageImage);
    }

    const response = await API.put('/about-us-page/page-settings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating About Us page settings:', error);
    throw error;
  }
};

export const createMetric = async (data) => {
  try {
    const response = await API.post('/about-us-page/metrics', data);
    return response.data;
  } catch (error) {
    console.error('Error creating metric:', error);
    throw error;
  }
};

export const updateMetric = async (id, data) => {
  try {
    const response = await API.put(`/about-us-page/metrics/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating metric:', error);
    throw error;
  }
};

export const deleteMetric = async (id) => {
  try {
    const response = await API.delete(`/about-us-page/metrics/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting metric:', error);
    throw error;
  }
};

export const createNavigationButton = async (data) => {
  try {
    const response = await API.post('/about-us-page/navigation-buttons', data);
    return response.data;
  } catch (error) {
    console.error('Error creating navigation button:', error);
    throw error;
  }
};

export const updateNavigationButton = async (id, data) => {
  try {
    const response = await API.put(`/about-us-page/navigation-buttons/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating navigation button:', error);
    throw error;
  }
};

export const deleteNavigationButton = async (id) => {
  try {
    const response = await API.delete(`/about-us-page/navigation-buttons/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting navigation button:', error);
    throw error;
  }
};

export const createStoryItem = async (data) => {
  try {
    const response = await API.post('/about-us-page/story-items', data);
    return response.data;
  } catch (error) {
    console.error('Error creating story item:', error);
    throw error;
  }
};

export const updateStoryItem = async (id, data) => {
  try {
    const response = await API.put(`/about-us-page/story-items/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating story item:', error);
    throw error;
  }
};

export const deleteStoryItem = async (id) => {
  try {
    const response = await API.delete(`/about-us-page/story-items/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting story item:', error);
    throw error;
  }
};

export const createCoreValue = async (data) => {
  try {
    const formData = new FormData();
    formData.append('titleEn', data.titleEn);
    formData.append('titleAr', data.titleAr);
    formData.append('descriptionEn', data.descriptionEn);
    formData.append('descriptionAr', data.descriptionAr);
    formData.append('order', data.order || 0);
    if (data.image && data.image instanceof File) {
      formData.append('image', data.image);
    }
    const response = await API.post('/about-us-page/core-values', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating core value:', error);
    throw error;
  }
};

export const updateCoreValue = async (id, data) => {
  try {
    const formData = new FormData();
    formData.append('titleEn', data.titleEn);
    formData.append('titleAr', data.titleAr);
    formData.append('descriptionEn', data.descriptionEn);
    formData.append('descriptionAr', data.descriptionAr);
    formData.append('order', data.order || 0);
    if (data.image && data.image instanceof File) {
      formData.append('image', data.image);
    }
    const response = await API.put(`/about-us-page/core-values/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating core value:', error);
    throw error;
  }
};

export const deleteCoreValue = async (id) => {
  try {
    const response = await API.delete(`/about-us-page/core-values/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting core value:', error);
    throw error;
  }
};

export const createTeamMember = async (data) => {
  try {
    const formData = new FormData();
    formData.append('nameEn', data.nameEn);
    formData.append('nameAr', data.nameAr);
    formData.append('jobTitleEn', data.jobTitleEn);
    formData.append('jobTitleAr', data.jobTitleAr);
    formData.append('parentId', data.parentId || '');
    formData.append('level', data.level || 0);
    formData.append('order', data.order || 0);
    if (data.image && data.image instanceof File) {
      formData.append('image', data.image);
    }
    const response = await API.post('/about-us-page/team-members', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating team member:', error);
    throw error;
  }
};

export const updateTeamMember = async (id, data) => {
  try {
    const formData = new FormData();
    formData.append('nameEn', data.nameEn);
    formData.append('nameAr', data.nameAr);
    formData.append('jobTitleEn', data.jobTitleEn);
    formData.append('jobTitleAr', data.jobTitleAr);
    formData.append('parentId', data.parentId || '');
    formData.append('level', data.level || 0);
    formData.append('order', data.order || 0);
    if (data.image && data.image instanceof File) {
      formData.append('image', data.image);
    }
    const response = await API.put(`/about-us-page/team-members/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating team member:', error);
    throw error;
  }
};

export const deleteTeamMember = async (id) => {
  try {
    const response = await API.delete(`/about-us-page/team-members/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting team member:', error);
    throw error;
  }
};

export const createAward = async (data) => {
  try {
    const formData = new FormData();
    formData.append('year', data.year);
    formData.append('titleEn', data.titleEn);
    formData.append('titleAr', data.titleAr);
    formData.append('descriptionEn', data.descriptionEn);
    formData.append('descriptionAr', data.descriptionAr);
    formData.append('order', data.order || 0);
    if (data.logo && data.logo instanceof File) {
      formData.append('logo', data.logo);
    }
    const response = await API.post('/about-us-page/awards', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating award:', error);
    throw error;
  }
};

export const updateAward = async (id, data) => {
  try {
    const formData = new FormData();
    formData.append('year', data.year);
    formData.append('titleEn', data.titleEn);
    formData.append('titleAr', data.titleAr);
    formData.append('descriptionEn', data.descriptionEn);
    formData.append('descriptionAr', data.descriptionAr);
    formData.append('order', data.order || 0);
    if (data.logo && data.logo instanceof File) {
      formData.append('logo', data.logo);
    }
    const response = await API.put(`/about-us-page/awards/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating award:', error);
    throw error;
  }
};

export const deleteAward = async (id) => {
  try {
    const response = await API.delete(`/about-us-page/awards/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting award:', error);
    throw error;
  }
};