import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getAboutUsPageSettings,
  updateAboutUsPageSettings,
  createMetric,
  updateMetric,
  deleteMetric,
  createNavigationButton,
  updateNavigationButton,
  deleteNavigationButton,
  createStoryItem,
  updateStoryItem,
  deleteStoryItem,
  createCoreValue,
  updateCoreValue,
  deleteCoreValue,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  createAward,
  updateAward,
  deleteAward,
} from '../api/aboutUs';
import { showSuccess, showError, showConfirm } from '../utils/i18nHelpers';

const AboutUsPageManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [pageSettings, setPageSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('settings'); // 'settings', 'metrics', 'buttons', 'story', 'core-values', 'team', 'awards'
  const [editingMetric, setEditingMetric] = useState(null);
  const [showMetricForm, setShowMetricForm] = useState(false);
  const [editingButton, setEditingButton] = useState(null);
  const [showButtonForm, setShowButtonForm] = useState(false);
  const [editingStoryItem, setEditingStoryItem] = useState(null);
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [editingCoreValue, setEditingCoreValue] = useState(null);
  const [showCoreValueForm, setShowCoreValueForm] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  const [showTeamMemberForm, setShowTeamMemberForm] = useState(false);
  const [editingAward, setEditingAward] = useState(null);
  const [showAwardForm, setShowAwardForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const settingsData = await getAboutUsPageSettings();
      setPageSettings(settingsData.data);
    } catch (error) {
      console.error('Error fetching About Us page settings:', error);
      showError('failedToLoad', t('sidebar.aboutUsPage'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const heroImageFile = formData.get('heroImage');
    const visionImageFile = formData.get('visionImage');
    const visionQuoteAuthorImageFile = formData.get('visionQuoteAuthorImage');
    const messageImageFile = formData.get('messageImage');

    const data = {
      heroTitleEn: formData.get('heroTitleEn'),
      heroTitleAr: formData.get('heroTitleAr'),
      heroDescriptionEn: formData.get('heroDescriptionEn'),
      heroDescriptionAr: formData.get('heroDescriptionAr'),
      visionSectionTitleEn: formData.get('visionSectionTitleEn'),
      visionSectionTitleAr: formData.get('visionSectionTitleAr'),
      visionTextEn: formData.get('visionTextEn'),
      visionTextAr: formData.get('visionTextAr'),
      visionQuoteTextEn: formData.get('visionQuoteTextEn') || null,
      visionQuoteTextAr: formData.get('visionQuoteTextAr') || null,
      visionQuoteAuthorNameEn: formData.get('visionQuoteAuthorNameEn') || null,
      visionQuoteAuthorNameAr: formData.get('visionQuoteAuthorNameAr') || null,
      visionQuoteAuthorTitleEn: formData.get('visionQuoteAuthorTitleEn') || null,
      visionQuoteAuthorTitleAr: formData.get('visionQuoteAuthorTitleAr') || null,
      messageSectionTitleEn: formData.get('messageSectionTitleEn') || '',
      messageSectionTitleAr: formData.get('messageSectionTitleAr') || '',
      messageTextEn: formData.get('messageTextEn') || '',
      messageTextAr: formData.get('messageTextAr') || '',
      messageBannerTextEn: formData.get('messageBannerTextEn') || '',
      messageBannerTextAr: formData.get('messageBannerTextAr') || '',
      ourStorySectionTitleEn: formData.get('ourStorySectionTitleEn') || '',
      ourStorySectionTitleAr: formData.get('ourStorySectionTitleAr') || '',
      ourStorySectionSubtitleEn: formData.get('ourStorySectionSubtitleEn') || '',
      ourStorySectionSubtitleAr: formData.get('ourStorySectionSubtitleAr') || '',
      coreValuesSectionTitleEn: formData.get('coreValuesSectionTitleEn') || '',
      coreValuesSectionTitleAr: formData.get('coreValuesSectionTitleAr') || '',
      coreValuesSectionSubtitleEn: formData.get('coreValuesSectionSubtitleEn') || '',
      coreValuesSectionSubtitleAr: formData.get('coreValuesSectionSubtitleAr') || '',
      teamSectionTitleEn: formData.get('teamSectionTitleEn') || '',
      teamSectionTitleAr: formData.get('teamSectionTitleAr') || '',
      teamSectionSubtitleEn: formData.get('teamSectionSubtitleEn') || '',
      teamSectionSubtitleAr: formData.get('teamSectionSubtitleAr') || '',
      awardsSectionTitleEn: formData.get('awardsSectionTitleEn') || '',
      awardsSectionTitleAr: formData.get('awardsSectionTitleAr') || '',
      awardsSectionSubtitleEn: formData.get('awardsSectionSubtitleEn') || '',
      awardsSectionSubtitleAr: formData.get('awardsSectionSubtitleAr') || '',
      heroImage: heroImageFile instanceof File && heroImageFile.size > 0 ? heroImageFile : null,
      visionImage: visionImageFile instanceof File && visionImageFile.size > 0 ? visionImageFile : null,
      visionQuoteAuthorImage: visionQuoteAuthorImageFile instanceof File && visionQuoteAuthorImageFile.size > 0 ? visionQuoteAuthorImageFile : null,
      messageImage: messageImageFile instanceof File && messageImageFile.size > 0 ? messageImageFile : null,
    };

    try {
      await updateAboutUsPageSettings(data);
      showSuccess('updated', t('sidebar.aboutUsPage'));
      fetchData();
    } catch (error) {
      console.error('Error updating settings:', error);
      showError('failedToUpdate', t('sidebar.aboutUsPage'));
    }
  };

  const handleCreateMetric = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      valueEn: formData.get('valueEn'),
      valueAr: formData.get('valueAr'),
      labelEn: formData.get('labelEn'),
      labelAr: formData.get('labelAr'),
      order: parseInt(formData.get('order')) || (pageSettings?.metrics?.length || 0),
    };

    try {
      await createMetric(data);
      showSuccess('created', t('pages.aboutUs.metric'));
      fetchData();
      setShowMetricForm(false);
      e.target.reset();
    } catch (error) {
      console.error('Error creating metric:', error);
      showError('failedToCreate', t('pages.aboutUs.metric'));
    }
  };

  const handleUpdateMetric = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      valueEn: formData.get('valueEn'),
      valueAr: formData.get('valueAr'),
      labelEn: formData.get('labelEn'),
      labelAr: formData.get('labelAr'),
      order: parseInt(formData.get('order')) || 0,
    };

    try {
      await updateMetric(editingMetric.id, data);
      showSuccess('updated', t('pages.aboutUs.metric'));
      fetchData();
      setEditingMetric(null);
      setShowMetricForm(false);
    } catch (error) {
      console.error('Error updating metric:', error);
      showError('failedToUpdate', t('pages.aboutUs.metric'));
    }
  };

  const handleDeleteMetric = async (id) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteMetric(id);
      showSuccess('deleted', t('pages.aboutUs.metric'));
      fetchData();
    } catch (error) {
      console.error('Error deleting metric:', error);
      showError('failedToDelete', t('pages.aboutUs.metric'));
    }
  };

  const handleCreateButton = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      labelEn: formData.get('labelEn'),
      labelAr: formData.get('labelAr'),
      targetSectionId: formData.get('targetSectionId') || null,
      order: parseInt(formData.get('order')) || (pageSettings?.navigationButtons?.length || 0),
    };

    try {
      await createNavigationButton(data);
      showSuccess('created', t('pages.aboutUs.navigationButton'));
      fetchData();
      setShowButtonForm(false);
      e.target.reset();
    } catch (error) {
      console.error('Error creating navigation button:', error);
      showError('failedToCreate', t('pages.aboutUs.navigationButton'));
    }
  };

  const handleUpdateButton = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      labelEn: formData.get('labelEn'),
      labelAr: formData.get('labelAr'),
      targetSectionId: formData.get('targetSectionId') || null,
      order: parseInt(formData.get('order')) || 0,
    };

    try {
      await updateNavigationButton(editingButton.id, data);
      showSuccess('updated', t('pages.aboutUs.navigationButton'));
      fetchData();
      setEditingButton(null);
      setShowButtonForm(false);
    } catch (error) {
      console.error('Error updating navigation button:', error);
      showError('failedToUpdate', t('pages.aboutUs.navigationButton'));
    }
  };

  const handleDeleteButton = async (id) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteNavigationButton(id);
      showSuccess('deleted', t('pages.aboutUs.navigationButton'));
      fetchData();
    } catch (error) {
      console.error('Error deleting navigation button:', error);
      showError('failedToDelete', t('pages.aboutUs.navigationButton'));
    }
  };

  const handleCreateStoryItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      year: parseInt(formData.get('year')),
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      descriptionEn: formData.get('descriptionEn'),
      descriptionAr: formData.get('descriptionAr'),
      order: parseInt(formData.get('order')) || (pageSettings?.storyItems?.length || 0),
    };

    try {
      await createStoryItem(data);
      showSuccess('created', t('pages.aboutUs.storyItem'));
      fetchData();
      setShowStoryForm(false);
      e.target.reset();
    } catch (error) {
      console.error('Error creating story item:', error);
      showError('failedToCreate', t('pages.aboutUs.storyItem'));
    }
  };

  const handleUpdateStoryItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      year: parseInt(formData.get('year')),
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      descriptionEn: formData.get('descriptionEn'),
      descriptionAr: formData.get('descriptionAr'),
      order: parseInt(formData.get('order')) || 0,
    };

    try {
      await updateStoryItem(editingStoryItem.id, data);
      showSuccess('updated', t('pages.aboutUs.storyItem'));
      fetchData();
      setEditingStoryItem(null);
      setShowStoryForm(false);
    } catch (error) {
      console.error('Error updating story item:', error);
      showError('failedToUpdate', t('pages.aboutUs.storyItem'));
    }
  };

  const handleDeleteStoryItem = async (id) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteStoryItem(id);
      showSuccess('deleted', t('pages.aboutUs.storyItem'));
      fetchData();
    } catch (error) {
      console.error('Error deleting story item:', error);
      showError('failedToDelete', t('pages.aboutUs.storyItem'));
    }
  };

  const handleCreateCoreValue = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const imageFile = formData.get('image');
    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      descriptionEn: formData.get('descriptionEn'),
      descriptionAr: formData.get('descriptionAr'),
      order: parseInt(formData.get('order')) || (pageSettings?.coreValues?.length || 0),
      image: imageFile instanceof File && imageFile.size > 0 ? imageFile : null,
    };

    try {
      await createCoreValue(data);
      showSuccess('created', t('pages.aboutUs.coreValue'));
      fetchData();
      setShowCoreValueForm(false);
      e.target.reset();
    } catch (error) {
      console.error('Error creating core value:', error);
      showError('failedToCreate', t('pages.aboutUs.coreValue'));
    }
  };

  const handleUpdateCoreValue = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const imageFile = formData.get('image');
    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      descriptionEn: formData.get('descriptionEn'),
      descriptionAr: formData.get('descriptionAr'),
      order: parseInt(formData.get('order')) || 0,
      image: imageFile instanceof File && imageFile.size > 0 ? imageFile : null,
    };

    try {
      await updateCoreValue(editingCoreValue.id, data);
      showSuccess('updated', t('pages.aboutUs.coreValue'));
      fetchData();
      setEditingCoreValue(null);
      setShowCoreValueForm(false);
    } catch (error) {
      console.error('Error updating core value:', error);
      showError('failedToUpdate', t('pages.aboutUs.coreValue'));
    }
  };

  const handleDeleteCoreValue = async (id) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteCoreValue(id);
      showSuccess('deleted', t('pages.aboutUs.coreValue'));
      fetchData();
    } catch (error) {
      console.error('Error deleting core value:', error);
      showError('failedToDelete', t('pages.aboutUs.coreValue'));
    }
  };

  const handleCreateTeamMember = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const imageFile = formData.get('image');
    const parentId = formData.get('parentId') || null;
    const data = {
      nameEn: formData.get('nameEn'),
      nameAr: formData.get('nameAr'),
      jobTitleEn: formData.get('jobTitleEn'),
      jobTitleAr: formData.get('jobTitleAr'),
      parentId: parentId === 'none' ? null : parentId,
      level: parseInt(formData.get('level')) || 0,
      order: parseInt(formData.get('order')) || (pageSettings?.teamMembers?.length || 0),
      image: imageFile instanceof File && imageFile.size > 0 ? imageFile : null,
    };

    try {
      await createTeamMember(data);
      showSuccess('created', t('pages.aboutUs.teamMember'));
      fetchData();
      setShowTeamMemberForm(false);
      e.target.reset();
    } catch (error) {
      console.error('Error creating team member:', error);
      showError('failedToCreate', t('pages.aboutUs.teamMember'));
    }
  };

  const handleUpdateTeamMember = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const imageFile = formData.get('image');
    const parentId = formData.get('parentId') || null;
    const data = {
      nameEn: formData.get('nameEn'),
      nameAr: formData.get('nameAr'),
      jobTitleEn: formData.get('jobTitleEn'),
      jobTitleAr: formData.get('jobTitleAr'),
      parentId: parentId === 'none' ? null : parentId,
      level: parseInt(formData.get('level')) || 0,
      order: parseInt(formData.get('order')) || 0,
      image: imageFile instanceof File && imageFile.size > 0 ? imageFile : null,
    };

    try {
      await updateTeamMember(editingTeamMember.id, data);
      showSuccess('updated', t('pages.aboutUs.teamMember'));
      fetchData();
      setEditingTeamMember(null);
      setShowTeamMemberForm(false);
    } catch (error) {
      console.error('Error updating team member:', error);
      showError('failedToUpdate', t('pages.aboutUs.teamMember'));
    }
  };

  const handleDeleteTeamMember = async (id) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteTeamMember(id);
      showSuccess('deleted', t('pages.aboutUs.teamMember'));
      fetchData();
    } catch (error) {
      console.error('Error deleting team member:', error);
      showError('failedToDelete', t('pages.aboutUs.teamMember'));
    }
  };

  const handleCreateAward = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const logoFile = formData.get('logo');
    const data = {
      year: parseInt(formData.get('year')),
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      descriptionEn: formData.get('descriptionEn'),
      descriptionAr: formData.get('descriptionAr'),
      order: parseInt(formData.get('order')) || (pageSettings?.awards?.length || 0),
      logo: logoFile instanceof File && logoFile.size > 0 ? logoFile : null,
    };

    try {
      await createAward(data);
      showSuccess('created', t('pages.aboutUs.award'));
      fetchData();
      setShowAwardForm(false);
      e.target.reset();
    } catch (error) {
      console.error('Error creating award:', error);
      showError('failedToCreate', t('pages.aboutUs.award'));
    }
  };

  const handleUpdateAward = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const logoFile = formData.get('logo');
    const data = {
      year: parseInt(formData.get('year')),
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      descriptionEn: formData.get('descriptionEn'),
      descriptionAr: formData.get('descriptionAr'),
      order: parseInt(formData.get('order')) || 0,
      logo: logoFile instanceof File && logoFile.size > 0 ? logoFile : null,
    };

    try {
      await updateAward(editingAward.id, data);
      showSuccess('updated', t('pages.aboutUs.award'));
      fetchData();
      setEditingAward(null);
      setShowAwardForm(false);
    } catch (error) {
      console.error('Error updating award:', error);
      showError('failedToUpdate', t('pages.aboutUs.award'));
    }
  };

  const handleDeleteAward = async (id) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteAward(id);
      showSuccess('deleted', t('pages.aboutUs.award'));
      fetchData();
    } catch (error) {
      console.error('Error deleting award:', error);
      showError('failedToDelete', t('pages.aboutUs.award'));
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:5000${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-admin-bg)]" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-admin-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--color-admin-text-muted)] font-medium">{t('pages.aboutUs.loadingSettings')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-admin-bg)] p-4 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-admin-text)] mb-2">{t('pages.aboutUs.title')}</h1>
          <p className="text-[var(--color-admin-text-muted)]">{t('pages.aboutUs.description')}</p>
        </div>

        {/* Tabs */}
        <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] p-1.5 mb-6 inline-flex gap-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'settings'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.aboutUs.pageSettings')}
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'metrics'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.aboutUs.metrics')} <span className="ml-1 opacity-80">({pageSettings?.metrics?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('buttons')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'buttons'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.aboutUs.navigationButtons')} <span className="ml-1 opacity-80">({pageSettings?.navigationButtons?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('story')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'story'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.aboutUs.storyItems')} <span className="ml-1 opacity-80">({pageSettings?.storyItems?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('core-values')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'core-values'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.aboutUs.coreValues')} <span className="ml-1 opacity-80">({pageSettings?.coreValues?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'team'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.aboutUs.teamMembers')} <span className="ml-1 opacity-80">({pageSettings?.teamMembers?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('awards')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'awards'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.aboutUs.awardsCertificates')} <span className="ml-1 opacity-80">({pageSettings?.awards?.length || 0})</span>
          </button>
        </div>

        {/* Settings Tab */}
        {activeTab === 'settings' && pageSettings && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.aboutUs.pageSettings')}</h2>
            </div>
            <form onSubmit={handleUpdateSettings} className="p-6 space-y-6">
              {/* Hero Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[var(--color-admin-text)] border-b border-[var(--color-admin-border)] pb-2">
                  {t('pages.aboutUs.heroSection')}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.heroTitleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                    </label>
                    <input
                      type="text"
                      name="heroTitleEn"
                      defaultValue={pageSettings.heroTitleEn || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.heroTitleAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                    </label>
                    <input
                      type="text"
                      name="heroTitleAr"
                      defaultValue={pageSettings.heroTitleAr || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.aboutUs.heroDescriptionEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <textarea
                    name="heroDescriptionEn"
                    defaultValue={pageSettings.heroDescriptionEn || ''}
                    rows="4"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.aboutUs.heroDescriptionAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <textarea
                    name="heroDescriptionAr"
                    defaultValue={pageSettings.heroDescriptionAr || ''}
                    rows="4"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.aboutUs.heroImage')}
                  </label>
                  {pageSettings.heroImageUrl && (
                    <div className="mb-3">
                      <img
                        src={getImageUrl(pageSettings.heroImageUrl)}
                        alt={t('pages.aboutUs.heroImageAlt')}
                        className="w-full max-w-md h-48 object-cover rounded-lg border border-[var(--color-admin-border)]"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    name="heroImage"
                    accept="image/*"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                  />
                </div>
              </div>

              {/* Vision Section */}
              <div className="space-y-6 pt-6 border-t border-[var(--color-admin-border)]">
                <h3 className="text-lg font-semibold text-[var(--color-admin-text)] border-b border-[var(--color-admin-border)] pb-2">
                  {t('pages.aboutUs.visionSection')}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.visionTitleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                    </label>
                    <input
                      type="text"
                      name="visionSectionTitleEn"
                      defaultValue={pageSettings.visionSectionTitleEn || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.visionTitleAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                    </label>
                    <input
                      type="text"
                      name="visionSectionTitleAr"
                      defaultValue={pageSettings.visionSectionTitleAr || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.aboutUs.visionTextEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <textarea
                    name="visionTextEn"
                    defaultValue={pageSettings.visionTextEn || ''}
                    rows="6"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.aboutUs.visionTextAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <textarea
                    name="visionTextAr"
                    defaultValue={pageSettings.visionTextAr || ''}
                    rows="6"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.aboutUs.visionImage')}
                  </label>
                  {pageSettings.visionImageUrl && (
                    <div className="mb-3">
                      <img
                        src={getImageUrl(pageSettings.visionImageUrl)}
                        alt={t('pages.aboutUs.visionImageAlt')}
                        className="w-full max-w-md h-48 object-cover rounded-lg border border-[var(--color-admin-border)]"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    name="visionImage"
                    accept="image/*"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                  />
                </div>

                {/* Vision Quote Section */}
                <div className="pt-4 border-t border-[var(--color-admin-border)]">
                  <h4 className="text-md font-semibold text-[var(--color-admin-text)] mb-4">{t('pages.aboutUs.quoteTestimonialOverlay')}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.quoteTextEn')}
                      </label>
                      <textarea
                        name="visionQuoteTextEn"
                        defaultValue={pageSettings.visionQuoteTextEn || ''}
                        rows="3"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.quoteTextAr')}
                      </label>
                      <textarea
                        name="visionQuoteTextAr"
                        defaultValue={pageSettings.visionQuoteTextAr || ''}
                        rows="3"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.authorNameEn')}
                      </label>
                      <input
                        type="text"
                        name="visionQuoteAuthorNameEn"
                        defaultValue={pageSettings.visionQuoteAuthorNameEn || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.authorNameAr')}
                      </label>
                      <input
                        type="text"
                        name="visionQuoteAuthorNameAr"
                        defaultValue={pageSettings.visionQuoteAuthorNameAr || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.authorTitleEn')}
                      </label>
                      <input
                        type="text"
                        name="visionQuoteAuthorTitleEn"
                        defaultValue={pageSettings.visionQuoteAuthorTitleEn || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.authorTitleAr')}
                      </label>
                      <input
                        type="text"
                        name="visionQuoteAuthorTitleAr"
                        defaultValue={pageSettings.visionQuoteAuthorTitleAr || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.authorImage')}
                    </label>
                    {pageSettings.visionQuoteAuthorImageUrl && (
                      <div className="mb-3">
                        <img
                          src={getImageUrl(pageSettings.visionQuoteAuthorImageUrl)}
                          alt={t('pages.aboutUs.authorImageAlt')}
                          className="w-24 h-24 object-cover rounded-full border border-[var(--color-admin-border)]"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      name="visionQuoteAuthorImage"
                      accept="image/*"
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Message Section */}
              <div className="space-y-6 pt-6 border-t border-[var(--color-admin-border)]">
                <h3 className="text-lg font-semibold text-[var(--color-admin-text)] border-b border-[var(--color-admin-border)] pb-2">
                  {t('pages.aboutUs.messageSection')}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.messageTitleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                    </label>
                    <input
                      type="text"
                      name="messageSectionTitleEn"
                      defaultValue={pageSettings.messageSectionTitleEn || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.messageTitleAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                    </label>
                    <input
                      type="text"
                      name="messageSectionTitleAr"
                      defaultValue={pageSettings.messageSectionTitleAr || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.aboutUs.messageTextEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <textarea
                    name="messageTextEn"
                    defaultValue={pageSettings.messageTextEn || ''}
                    rows="6"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.aboutUs.messageTextAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <textarea
                    name="messageTextAr"
                    defaultValue={pageSettings.messageTextAr || ''}
                    rows="6"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.aboutUs.messageBannerTextEn')}
                  </label>
                  <textarea
                    name="messageBannerTextEn"
                    defaultValue={pageSettings.messageBannerTextEn || ''}
                    rows="6"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.aboutUs.messageBannerTextAr')}
                  </label>
                  <textarea
                    name="messageBannerTextAr"
                    defaultValue={pageSettings.messageBannerTextAr || ''}
                    rows="6"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.aboutUs.messageImage')}
                  </label>
                  {pageSettings.messageImageUrl && (
                    <div className="mb-3">
                      <img
                        src={getImageUrl(pageSettings.messageImageUrl)}
                        alt={t('pages.aboutUs.messageImageAlt')}
                        className="w-full max-w-md h-48 object-cover rounded-lg border border-[var(--color-admin-border)]"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    name="messageImage"
                    accept="image/*"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                  />
                </div>
              </div>

              {/* Story Section */}
              <div className="space-y-6 pt-6 border-t border-[var(--color-admin-border)]">
                <h3 className="text-lg font-semibold text-[var(--color-admin-text)] border-b border-[var(--color-admin-border)] pb-2">
                  {t('pages.aboutUs.ourStorySection')}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.storyTitleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                    </label>
                    <input
                      type="text"
                      name="ourStorySectionTitleEn"
                      defaultValue={pageSettings.ourStorySectionTitleEn || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.storyTitleAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                    </label>
                    <input
                      type="text"
                      name="ourStorySectionTitleAr"
                      defaultValue={pageSettings.ourStorySectionTitleAr || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.storySubtitleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                    </label>
                    <input
                      type="text"
                      name="ourStorySectionSubtitleEn"
                      defaultValue={pageSettings.ourStorySectionSubtitleEn || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.storySubtitleAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                    </label>
                    <input
                      type="text"
                      name="ourStorySectionSubtitleAr"
                      defaultValue={pageSettings.ourStorySectionSubtitleAr || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Core Values Section */}
              <div className="space-y-6 pt-6 border-t border-[var(--color-admin-border)]">
                <h3 className="text-lg font-semibold text-[var(--color-admin-text)] border-b border-[var(--color-admin-border)] pb-2">
                  {t('pages.aboutUs.coreValuesSection')}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.coreValuesTitleEn')}
                    </label>
                    <input
                      type="text"
                      name="coreValuesSectionTitleEn"
                      defaultValue={pageSettings.coreValuesSectionTitleEn || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.coreValuesTitleAr')}
                    </label>
                    <input
                      type="text"
                      name="coreValuesSectionTitleAr"
                      defaultValue={pageSettings.coreValuesSectionTitleAr || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.coreValuesSubtitleEn')}
                    </label>
                    <input
                      type="text"
                      name="coreValuesSectionSubtitleEn"
                      defaultValue={pageSettings.coreValuesSectionSubtitleEn || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.coreValuesSubtitleAr')}
                    </label>
                    <input
                      type="text"
                      name="coreValuesSectionSubtitleAr"
                      defaultValue={pageSettings.coreValuesSectionSubtitleAr || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Team Section */}
              <div className="space-y-6 pt-6 border-t border-[var(--color-admin-border)]">
                <h3 className="text-lg font-semibold text-[var(--color-admin-text)] border-b border-[var(--color-admin-border)] pb-2">
                  {t('pages.aboutUs.teamSection')}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.teamTitleEn')}
                    </label>
                    <input
                      type="text"
                      name="teamSectionTitleEn"
                      defaultValue={pageSettings.teamSectionTitleEn || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.teamTitleAr')}
                    </label>
                    <input
                      type="text"
                      name="teamSectionTitleAr"
                      defaultValue={pageSettings.teamSectionTitleAr || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.teamSubtitleEn')}
                    </label>
                    <input
                      type="text"
                      name="teamSectionSubtitleEn"
                      defaultValue={pageSettings.teamSectionSubtitleEn || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.teamSubtitleAr')}
                    </label>
                    <input
                      type="text"
                      name="teamSectionSubtitleAr"
                      defaultValue={pageSettings.teamSectionSubtitleAr || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Awards Section */}
              <div className="space-y-6 pt-6 border-t border-[var(--color-admin-border)]">
                <h3 className="text-lg font-semibold text-[var(--color-admin-text)] border-b border-[var(--color-admin-border)] pb-2">
                  {t('pages.aboutUs.awardsCertificates')}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.awardsTitleEn')}
                    </label>
                    <input
                      type="text"
                      name="awardsSectionTitleEn"
                      defaultValue={pageSettings.awardsSectionTitleEn || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.awardsTitleAr')}
                    </label>
                    <input
                      type="text"
                      name="awardsSectionTitleAr"
                      defaultValue={pageSettings.awardsSectionTitleAr || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.awardsSubtitleEn')}
                    </label>
                    <input
                      type="text"
                      name="awardsSectionSubtitleEn"
                      defaultValue={pageSettings.awardsSectionSubtitleEn || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.aboutUs.awardsSubtitleAr')}
                    </label>
                    <input
                      type="text"
                      name="awardsSectionSubtitleAr"
                      defaultValue={pageSettings.awardsSectionSubtitleAr || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-[var(--color-admin-border)]">
                <button
                  type="submit"
                  className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg"
                >
                  {t('pages.aboutUs.saveSettings')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <>
            {!showMetricForm && !editingMetric && (
              <div className="mb-6">
                <button
                  onClick={() => setShowMetricForm(true)}
                  className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  + {t('pages.aboutUs.addNewMetric')}
                </button>
              </div>
            )}

            {(showMetricForm || editingMetric) && (
              <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden mb-6">
                <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
                  <h2 className="text-xl font-bold text-[var(--color-admin-text)]">
                    {editingMetric ? t('pages.aboutUs.editMetric') : t('pages.aboutUs.addNewMetric')}
                  </h2>
                </div>
                <form onSubmit={editingMetric ? handleUpdateMetric : handleCreateMetric} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.valueEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="valueEn"
                        defaultValue={editingMetric?.valueEn || ''}
                        placeholder={t('pages.aboutUs.valuePlaceholder')}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.valueAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="valueAr"
                        defaultValue={editingMetric?.valueAr || ''}
                        placeholder={t('pages.aboutUs.valuePlaceholder')}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.labelEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="labelEn"
                        defaultValue={editingMetric?.labelEn || ''}
                        placeholder={t('pages.aboutUs.labelPlaceholderEn')}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.labelAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="labelAr"
                        defaultValue={editingMetric?.labelAr || ''}
                        placeholder={t('pages.aboutUs.labelPlaceholderAr')}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.orderLabel')}
                      </label>
                      <input
                        type="number"
                        name="order"
                        defaultValue={editingMetric?.order || pageSettings?.metrics?.length || 0}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMetricForm(false);
                        setEditingMetric(null);
                      }}
                      className="px-6 py-3 border border-[var(--color-admin-border)] rounded-xl font-semibold text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)] transition-all"
                    >
                      {t('pages.aboutUs.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg"
                    >
                      {editingMetric ? t('pages.aboutUs.updateMetric') : t('pages.aboutUs.createMetric')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Metrics List */}
            <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
              <div className="p-6 border-b border-[var(--color-admin-border)]">
                <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.aboutUs.metrics')} ({pageSettings?.metrics?.length || 0})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--color-admin-muted)]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.orderLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.valueEnLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.valueArLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.labelEnLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.labelArLabel')}</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-admin-border)]">
                    {pageSettings?.metrics?.map((metric) => (
                      <tr key={metric.id} className="hover:bg-[var(--color-admin-muted)] transition-colors">
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{metric.order}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{metric.valueEn}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{metric.valueAr}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{metric.labelEn}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{metric.labelAr}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingMetric(metric);
                                setShowMetricForm(true);
                              }}
                              className="px-4 py-2 bg-[var(--color-admin-primary)] text-white rounded-lg hover:bg-[var(--color-admin-primary-dark)] transition-all text-sm"
                            >
                              {t('pages.aboutUs.edit')}
                            </button>
                            <button
                              onClick={() => handleDeleteMetric(metric.id)}
                              className="px-4 py-2 bg-[var(--color-admin-danger)] text-white rounded-lg hover:bg-red-700 transition-all text-sm"
                            >
                              {t('pages.aboutUs.delete')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Navigation Buttons Tab */}
        {activeTab === 'buttons' && (
          <>
            {!showButtonForm && !editingButton && (
              <div className="mb-6">
                <button
                  onClick={() => setShowButtonForm(true)}
                  className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  + {t('pages.aboutUs.addNewNavigationButton')}
                </button>
              </div>
            )}

            {(showButtonForm || editingButton) && (
              <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden mb-6">
                <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
                  <h2 className="text-xl font-bold text-[var(--color-admin-text)]">
                    {editingButton ? t('pages.aboutUs.editNavigationButton') : t('pages.aboutUs.addNewNavigationButton')}
                  </h2>
                </div>
                <form onSubmit={editingButton ? handleUpdateButton : handleCreateButton} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.labelEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="labelEn"
                        defaultValue={editingButton?.labelEn || ''}
                        placeholder={t('pages.aboutUs.buttonLabelPlaceholderEn')}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.labelAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="labelAr"
                        defaultValue={editingButton?.labelAr || ''}
                        placeholder={t('pages.aboutUs.buttonLabelPlaceholderAr')}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.targetSectionId')}
                      </label>
                      <input
                        type="text"
                        name="targetSectionId"
                        defaultValue={editingButton?.targetSectionId || ''}
                        placeholder={t('pages.aboutUs.targetSectionPlaceholder')}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.orderLabel')}
                      </label>
                      <input
                        type="number"
                        name="order"
                        defaultValue={editingButton?.order || pageSettings?.navigationButtons?.length || 0}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowButtonForm(false);
                        setEditingButton(null);
                      }}
                      className="px-6 py-3 border border-[var(--color-admin-border)] rounded-xl font-semibold text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)] transition-all"
                    >
                      {t('pages.aboutUs.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg"
                    >
                      {editingButton ? t('pages.aboutUs.updateButton') : t('pages.aboutUs.createButton')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Navigation Buttons List */}
            <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
              <div className="p-6 border-b border-[var(--color-admin-border)]">
                <h2 className="text-xl font-bold text-[var(--color-admin-text)]">
                  {t('pages.aboutUs.navigationButtons')} ({pageSettings?.navigationButtons?.length || 0})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--color-admin-muted)]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.orderLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.labelEnLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.labelArLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.targetSection')}</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-admin-border)]">
                    {pageSettings?.navigationButtons?.map((button) => (
                      <tr key={button.id} className="hover:bg-[var(--color-admin-muted)] transition-colors">
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{button.order}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{button.labelEn}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{button.labelAr}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{button.targetSectionId || '-'}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingButton(button);
                                setShowButtonForm(true);
                              }}
                              className="px-4 py-2 bg-[var(--color-admin-primary)] text-white rounded-lg hover:bg-[var(--color-admin-primary-dark)] transition-all text-sm"
                            >
                              {t('pages.aboutUs.edit')}
                            </button>
                            <button
                              onClick={() => handleDeleteButton(button.id)}
                              className="px-4 py-2 bg-[var(--color-admin-danger)] text-white rounded-lg hover:bg-red-700 transition-all text-sm"
                            >
                              {t('pages.aboutUs.delete')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Story Items Tab */}
        {activeTab === 'story' && (
          <>
            {!showStoryForm && !editingStoryItem && (
              <div className="mb-6">
                <button
                  onClick={() => setShowStoryForm(true)}
                  className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  + {t('pages.aboutUs.addNewStoryItem')}
                </button>
              </div>
            )}

            {(showStoryForm || editingStoryItem) && (
              <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden mb-6">
                <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
                  <h2 className="text-xl font-bold text-[var(--color-admin-text)]">
                    {editingStoryItem ? t('pages.aboutUs.editStoryItem') : t('pages.aboutUs.addNewStoryItem')}
                  </h2>
                </div>
                <form onSubmit={editingStoryItem ? handleUpdateStoryItem : handleCreateStoryItem} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.yearLabel')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="number"
                        name="year"
                        defaultValue={editingStoryItem?.year || ''}
                        placeholder={t('pages.aboutUs.yearPlaceholder')}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.orderLabel')}
                      </label>
                      <input
                        type="number"
                        name="order"
                        defaultValue={editingStoryItem?.order || pageSettings?.storyItems?.length || 0}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.titleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="titleEn"
                        defaultValue={editingStoryItem?.titleEn || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.titleAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="titleAr"
                        defaultValue={editingStoryItem?.titleAr || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.descriptionEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <textarea
                        name="descriptionEn"
                        defaultValue={editingStoryItem?.descriptionEn || ''}
                        rows="4"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.descriptionAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <textarea
                        name="descriptionAr"
                        defaultValue={editingStoryItem?.descriptionAr || ''}
                        rows="4"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowStoryForm(false);
                        setEditingStoryItem(null);
                      }}
                      className="px-6 py-3 border border-[var(--color-admin-border)] rounded-xl font-semibold text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)] transition-all"
                    >
                      {t('pages.aboutUs.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg"
                    >
                      {editingStoryItem ? t('pages.aboutUs.updateStoryItem') : t('pages.aboutUs.createStoryItem')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Story Items List */}
            <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
              <div className="p-6 border-b border-[var(--color-admin-border)]">
                <h2 className="text-xl font-bold text-[var(--color-admin-text)]">
                  {t('pages.aboutUs.storyItems')} ({pageSettings?.storyItems?.length || 0})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--color-admin-muted)]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.orderLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.yearLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.titleEnLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.titleArLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.descriptionEnLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.descriptionArLabel')}</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-admin-border)]">
                    {pageSettings?.storyItems?.map((item) => (
                      <tr key={item.id} className="hover:bg-[var(--color-admin-muted)] transition-colors">
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{item.order}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)] font-semibold">{item.year}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{item.titleEn}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{item.titleAr}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)] max-w-xs truncate">{item.descriptionEn}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)] max-w-xs truncate">{item.descriptionAr}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingStoryItem(item);
                                setShowStoryForm(true);
                              }}
                              className="px-4 py-2 bg-[var(--color-admin-primary)] text-white rounded-lg hover:bg-[var(--color-admin-primary-dark)] transition-all text-sm"
                            >
                              {t('pages.aboutUs.edit')}
                            </button>
                            <button
                              onClick={() => handleDeleteStoryItem(item.id)}
                              className="px-4 py-2 bg-[var(--color-admin-danger)] text-white rounded-lg hover:bg-red-700 transition-all text-sm"
                            >
                              {t('pages.aboutUs.delete')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Core Values Tab */}
        {activeTab === 'core-values' && (
          <>
            {!showCoreValueForm && !editingCoreValue && (
              <div className="mb-6">
                <button
                  onClick={() => setShowCoreValueForm(true)}
                  className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  + {t('pages.aboutUs.addNewCoreValue')}
                </button>
              </div>
            )}

            {(showCoreValueForm || editingCoreValue) && (
              <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden mb-6">
                <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
                  <h2 className="text-xl font-bold text-[var(--color-admin-text)]">
                    {editingCoreValue ? t('pages.aboutUs.editCoreValue') : t('pages.aboutUs.addNewCoreValue')}
                  </h2>
                </div>
                <form onSubmit={editingCoreValue ? handleUpdateCoreValue : handleCreateCoreValue} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.titleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="titleEn"
                        defaultValue={editingCoreValue?.titleEn || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.titleAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="titleAr"
                        defaultValue={editingCoreValue?.titleAr || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.descriptionEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <textarea
                        name="descriptionEn"
                        defaultValue={editingCoreValue?.descriptionEn || ''}
                        rows="4"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.descriptionAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <textarea
                        name="descriptionAr"
                        defaultValue={editingCoreValue?.descriptionAr || ''}
                        rows="4"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.orderLabel')}
                      </label>
                      <input
                        type="number"
                        name="order"
                        defaultValue={editingCoreValue?.order || pageSettings?.coreValues?.length || 0}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.imageLabel')}
                      </label>
                      {editingCoreValue?.imageUrl && (
                        <div className="mb-3">
                          <img
                            src={getImageUrl(editingCoreValue.imageUrl)}
                            alt={editingCoreValue.titleEn}
                            className="w-full max-w-md h-48 object-cover rounded-lg border border-[var(--color-admin-border)]"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCoreValueForm(false);
                        setEditingCoreValue(null);
                      }}
                      className="px-6 py-3 border border-[var(--color-admin-border)] rounded-xl font-semibold text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)] transition-all"
                    >
                      {t('pages.aboutUs.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg"
                    >
                      {editingCoreValue ? t('pages.aboutUs.updateCoreValue') : t('pages.aboutUs.createCoreValue')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Core Values List */}
            <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
              <div className="p-6 border-b border-[var(--color-admin-border)]">
                <h2 className="text-xl font-bold text-[var(--color-admin-text)]">
                  {t('pages.aboutUs.coreValues')} ({pageSettings?.coreValues?.length || 0})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--color-admin-muted)]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.orderLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.imageLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.titleEnLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.titleArLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.descriptionEnLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.descriptionArLabel')}</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-admin-border)]">
                    {pageSettings?.coreValues?.map((value) => (
                      <tr key={value.id} className="hover:bg-[var(--color-admin-muted)] transition-colors">
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{value.order}</td>
                        <td className="px-6 py-4">
                          {value.imageUrl ? (
                            <img
                              src={getImageUrl(value.imageUrl)}
                              alt={value.titleEn}
                              className="w-16 h-16 object-cover rounded-lg border border-[var(--color-admin-border)]"
                            />
                          ) : (
                            <span className="text-[var(--color-admin-text-muted)] text-sm">{t('pages.aboutUs.noImage')}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{value.titleEn}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{value.titleAr}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)] max-w-xs truncate">{value.descriptionEn}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)] max-w-xs truncate">{value.descriptionAr}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingCoreValue(value);
                                setShowCoreValueForm(true);
                              }}
                              className="px-4 py-2 bg-[var(--color-admin-primary)] text-white rounded-lg hover:bg-[var(--color-admin-primary-dark)] transition-all text-sm"
                            >
                              {t('pages.aboutUs.edit')}
                            </button>
                            <button
                              onClick={() => handleDeleteCoreValue(value.id)}
                              className="px-4 py-2 bg-[var(--color-admin-danger)] text-white rounded-lg hover:bg-red-700 transition-all text-sm"
                            >
                              {t('pages.aboutUs.delete')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Team Members Tab */}
        {activeTab === 'team' && (
          <>
            {!showTeamMemberForm && !editingTeamMember && (
              <div className="mb-6">
                <button
                  onClick={() => setShowTeamMemberForm(true)}
                  className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  + {t('pages.aboutUs.addNewTeamMember')}
                </button>
              </div>
            )}

            {(showTeamMemberForm || editingTeamMember) && (
              <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden mb-6">
                <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
                  <h2 className="text-xl font-bold text-[var(--color-admin-text)]">
                    {editingTeamMember ? t('pages.aboutUs.editTeamMember') : t('pages.aboutUs.addNewTeamMember')}
                  </h2>
                </div>
                <form onSubmit={editingTeamMember ? handleUpdateTeamMember : handleCreateTeamMember} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.nameEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="nameEn"
                        defaultValue={editingTeamMember?.nameEn || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.nameAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="nameAr"
                        defaultValue={editingTeamMember?.nameAr || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.jobTitleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="jobTitleEn"
                        defaultValue={editingTeamMember?.jobTitleEn || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.jobTitleAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="jobTitleAr"
                        defaultValue={editingTeamMember?.jobTitleAr || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.parentReportsTo')}
                      </label>
                      <select
                        name="parentId"
                        defaultValue={editingTeamMember?.parentId || 'none'}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      >
                        <option value="none">{t('pages.aboutUs.noneTopLevel')}</option>
                        {pageSettings?.teamMembers
                          ?.filter(member => !editingTeamMember || member.id !== editingTeamMember.id)
                          .map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.nameEn} - {member.jobTitleEn} ({t('pages.aboutUs.levelLabel')} {member.level})
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.levelLabel')}
                      </label>
                      <input
                        type="number"
                        name="level"
                        defaultValue={editingTeamMember?.level || 0}
                        min="0"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                      <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">
                        {t('pages.aboutUs.levelDescription')}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.orderLabel')}
                      </label>
                      <input
                        type="number"
                        name="order"
                        defaultValue={editingTeamMember?.order || pageSettings?.teamMembers?.length || 0}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.imageLabel')}
                      </label>
                      {editingTeamMember?.imageUrl && (
                        <div className="mb-3">
                          <img
                            src={getImageUrl(editingTeamMember.imageUrl)}
                            alt={editingTeamMember.nameEn}
                            className="w-full max-w-md h-48 object-cover rounded-lg border border-[var(--color-admin-border)]"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowTeamMemberForm(false);
                        setEditingTeamMember(null);
                      }}
                      className="px-6 py-3 border border-[var(--color-admin-border)] rounded-xl font-semibold text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)] transition-all"
                    >
                      {t('pages.aboutUs.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg"
                    >
                      {editingTeamMember ? t('pages.aboutUs.updateTeamMember') : t('pages.aboutUs.createTeamMember')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Team Members List */}
            <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
              <div className="p-6 border-b border-[var(--color-admin-border)]">
                <h2 className="text-xl font-bold text-[var(--color-admin-text)]">
                  {t('pages.aboutUs.teamMembers')} ({pageSettings?.teamMembers?.length || 0})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--color-admin-muted)]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.orderLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.levelLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.imageLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.nameEnLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.nameArLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.jobTitleEnLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.jobTitleArLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.reportsTo')}</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-admin-border)]">
                    {pageSettings?.teamMembers
                      ?.sort((a, b) => {
                        if (a.level !== b.level) return a.level - b.level;
                        return a.order - b.order;
                      })
                      .map((member) => {
                        const parent = pageSettings?.teamMembers?.find(m => m.id === member.parentId);
                        return (
                          <tr key={member.id} className="hover:bg-[var(--color-admin-muted)] transition-colors">
                            <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{member.order}</td>
                            <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">
                              <span className="px-2 py-1 bg-[var(--color-admin-primary)]/20 text-[var(--color-admin-primary)] rounded text-xs font-semibold">
                                {t('pages.aboutUs.levelLabel')} {member.level}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {member.imageUrl ? (
                                <img
                                  src={getImageUrl(member.imageUrl)}
                                  alt={member.nameEn}
                                  className="w-16 h-16 object-cover rounded-full border border-[var(--color-admin-border)]"
                                />
                              ) : (
                                <span className="text-[var(--color-admin-text-muted)] text-sm">{t('pages.aboutUs.noImage')}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{member.nameEn}</td>
                            <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{member.nameAr}</td>
                            <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{member.jobTitleEn}</td>
                            <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{member.jobTitleAr}</td>
                            <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">
                              {parent ? `${parent.nameEn} (${parent.jobTitleEn})` : '-'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingTeamMember(member);
                                    setShowTeamMemberForm(true);
                                  }}
                                  className="px-4 py-2 bg-[var(--color-admin-primary)] text-white rounded-lg hover:bg-[var(--color-admin-primary-dark)] transition-all text-sm"
                                >
                                  {t('pages.aboutUs.edit')}
                                </button>
                                <button
                                  onClick={() => handleDeleteTeamMember(member.id)}
                                  className="px-4 py-2 bg-[var(--color-admin-danger)] text-white rounded-lg hover:bg-red-700 transition-all text-sm"
                                >
                                  {t('pages.aboutUs.delete')}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Awards Tab */}
        {activeTab === 'awards' && (
          <>
            {!showAwardForm && !editingAward && (
              <div className="mb-6">
                <button
                  onClick={() => setShowAwardForm(true)}
                  className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  + {t('pages.aboutUs.addNewAward')}
                </button>
              </div>
            )}

            {(showAwardForm || editingAward) && (
              <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden mb-6">
                <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
                  <h2 className="text-xl font-bold text-[var(--color-admin-text)]">
                    {editingAward ? t('pages.aboutUs.editAward') : t('pages.aboutUs.addNewAward')}
                  </h2>
                </div>
                <form onSubmit={editingAward ? handleUpdateAward : handleCreateAward} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.yearLabel')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="number"
                        name="year"
                        defaultValue={editingAward?.year || new Date().getFullYear()}
                        min="1900"
                        max="2100"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.orderLabel')}
                      </label>
                      <input
                        type="number"
                        name="order"
                        defaultValue={editingAward?.order || pageSettings?.awards?.length || 0}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.titleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="titleEn"
                        defaultValue={editingAward?.titleEn || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.titleAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="titleAr"
                        defaultValue={editingAward?.titleAr || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.descriptionEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <textarea
                        name="descriptionEn"
                        defaultValue={editingAward?.descriptionEn || ''}
                        rows="4"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.descriptionAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <textarea
                        name="descriptionAr"
                        defaultValue={editingAward?.descriptionAr || ''}
                        rows="4"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.aboutUs.logo')}
                      </label>
                      {editingAward?.logoUrl && (
                        <div className="mb-3">
                          <img
                            src={getImageUrl(editingAward.logoUrl)}
                            alt={editingAward.titleEn}
                            className="w-full max-w-md h-48 object-contain rounded-lg border border-[var(--color-admin-border)] bg-gray-50 p-4"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        name="logo"
                        accept="image/*"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAwardForm(false);
                        setEditingAward(null);
                      }}
                      className="px-6 py-3 border border-[var(--color-admin-border)] rounded-xl font-semibold text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)] transition-all"
                    >
                      {t('pages.aboutUs.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg"
                    >
                      {editingAward ? t('pages.aboutUs.updateAward') : t('pages.aboutUs.createAward')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Awards List */}
            <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
              <div className="p-6 border-b border-[var(--color-admin-border)]">
                <h2 className="text-xl font-bold text-[var(--color-admin-text)]">
                  {t('pages.aboutUs.awardsCertificates')} ({pageSettings?.awards?.length || 0})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--color-admin-muted)]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.orderLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.yearLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.logoLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.titleEnLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.titleArLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.descriptionEnLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.descriptionArLabel')}</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.aboutUs.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-admin-border)]">
                    {pageSettings?.awards?.map((award) => (
                      <tr key={award.id} className="hover:bg-[var(--color-admin-muted)] transition-colors">
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{award.order}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)] font-semibold">{award.year}</td>
                        <td className="px-6 py-4">
                          {award.logoUrl ? (
                            <img
                              src={getImageUrl(award.logoUrl)}
                              alt={award.titleEn}
                              className="w-16 h-16 object-contain bg-gray-50 rounded-lg border border-[var(--color-admin-border)] p-2"
                            />
                          ) : (
                            <span className="text-[var(--color-admin-text-muted)] text-sm">{t('pages.aboutUs.noLogo')}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{award.titleEn}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{award.titleAr}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)] max-w-xs truncate">{award.descriptionEn}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)] max-w-xs truncate">{award.descriptionAr}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingAward(award);
                                setShowAwardForm(true);
                              }}
                              className="px-4 py-2 bg-[var(--color-admin-primary)] text-white rounded-lg hover:bg-[var(--color-admin-primary-dark)] transition-all text-sm"
                            >
                              {t('pages.aboutUs.edit')}
                            </button>
                            <button
                              onClick={() => handleDeleteAward(award.id)}
                              className="px-4 py-2 bg-[var(--color-admin-danger)] text-white rounded-lg hover:bg-red-700 transition-all text-sm"
                            >
                              {t('pages.aboutUs.delete')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AboutUsPageManager;
