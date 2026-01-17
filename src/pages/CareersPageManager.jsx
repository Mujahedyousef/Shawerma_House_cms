import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import RichTextEditor from '../components/RichTextEditor';
import {
  getCareersPageSettings,
  updateCareersPageSettings,
  createJobBenefit,
  updateJobBenefit,
  deleteJobBenefit,
  createJobListing,
  updateJobListing,
  deleteJobListing,
  createWhyWorkWithUsItem,
  updateWhyWorkWithUsItem,
  deleteWhyWorkWithUsItem,
  getAllJobApplications,
} from '../api/careersPage';
import { showSuccess, showError, showConfirm } from '../utils/i18nHelpers';

const CareersPageManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [pageSettings, setPageSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('settings'); // 'settings', 'benefits', 'listings', 'why-work-with-us', 'applications'
  const [editingBenefit, setEditingBenefit] = useState(null);
  const [showBenefitForm, setShowBenefitForm] = useState(false);
  const [editingJobListing, setEditingJobListing] = useState(null);
  const [showJobListingForm, setShowJobListingForm] = useState(false);
  const [editingWhyWorkWithUsItem, setEditingWhyWorkWithUsItem] = useState(null);
  const [showWhyWorkWithUsForm, setShowWhyWorkWithUsForm] = useState(false);
  const [jobApplications, setJobApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  // Rich text editor states for job listings
  const [jobDescriptionEn, setJobDescriptionEn] = useState('');
  const [jobDescriptionAr, setJobDescriptionAr] = useState('');
  const [jobRequirementsEn, setJobRequirementsEn] = useState('');
  const [jobRequirementsAr, setJobRequirementsAr] = useState('');
  const [jobResponsibilitiesEn, setJobResponsibilitiesEn] = useState('');
  const [jobResponsibilitiesAr, setJobResponsibilitiesAr] = useState('');

  useEffect(() => {
    fetchData();
    if (activeTab === 'applications') {
      fetchApplications();
    }
  }, [activeTab]);

  useEffect(() => {
    if (editingJobListing) {
      setJobDescriptionEn(editingJobListing.descriptionEn || '');
      setJobDescriptionAr(editingJobListing.descriptionAr || '');
      setJobRequirementsEn(editingJobListing.requirementsEn || '');
      setJobRequirementsAr(editingJobListing.requirementsAr || '');
      setJobResponsibilitiesEn(editingJobListing.responsibilitiesEn || '');
      setJobResponsibilitiesAr(editingJobListing.responsibilitiesAr || '');
    } else {
      setJobDescriptionEn('');
      setJobDescriptionAr('');
      setJobRequirementsEn('');
      setJobRequirementsAr('');
      setJobResponsibilitiesEn('');
      setJobResponsibilitiesAr('');
    }
  }, [editingJobListing]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const settingsData = await getCareersPageSettings();
      setPageSettings(settingsData.data);
    } catch (error) {
      console.error('Error fetching Careers page settings:', error);
      showError('failedToLoad', t('sidebar.careersPage'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const heroImageFile = formData.get('heroImage');

    const data = {
      heroTitleEn: formData.get('heroTitleEn'),
      heroTitleAr: formData.get('heroTitleAr'),
      heroDescriptionEn: formData.get('heroDescriptionEn'),
      heroDescriptionAr: formData.get('heroDescriptionAr'),
      whyWorkWithUsTitleEn: formData.get('whyWorkWithUsTitleEn') || '',
      whyWorkWithUsTitleAr: formData.get('whyWorkWithUsTitleAr') || '',
      heroImage: heroImageFile instanceof File && heroImageFile.size > 0 ? heroImageFile : null,
    };

    try {
      await updateCareersPageSettings(data);
      showSuccess('updated', t('sidebar.careersPage'));
      fetchData();
    } catch (error) {
      console.error('Error updating settings:', error);
      showError('failedToUpdate', t('sidebar.careersPage'));
    }
  };

  const handleCreateBenefit = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      textEn: formData.get('textEn'),
      textAr: formData.get('textAr'),
      order: parseInt(formData.get('order')) || pageSettings?.jobBenefits?.length || 0,
    };

    try {
      await createJobBenefit(data);
      showSuccess('created', t('pages.careers.jobBenefit'));
      fetchData();
      setShowBenefitForm(false);
      e.target.reset();
    } catch (error) {
      console.error('Error creating job benefit:', error);
      showError('failedToCreate', t('pages.careers.jobBenefit'));
    }
  };

  const handleUpdateBenefit = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      textEn: formData.get('textEn'),
      textAr: formData.get('textAr'),
      order: parseInt(formData.get('order')) || 0,
    };

    try {
      await updateJobBenefit(editingBenefit.id, data);
      showSuccess('updated', t('pages.careers.jobBenefit'));
      fetchData();
      setEditingBenefit(null);
      setShowBenefitForm(false);
    } catch (error) {
      console.error('Error updating job benefit:', error);
      showError('failedToUpdate', t('pages.careers.jobBenefit'));
    }
  };

  const handleDeleteBenefit = async id => {
    if (!showConfirm('delete')) return;

    try {
      await deleteJobBenefit(id);
      showSuccess('deleted', t('pages.careers.jobBenefit'));
      fetchData();
    } catch (error) {
      console.error('Error deleting job benefit:', error);
      showError('failedToDelete', t('pages.careers.jobBenefit'));
    }
  };

  const fetchApplications = async () => {
    try {
      setApplicationsLoading(true);
      const response = await getAllJobApplications();
      setJobApplications(response.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      showError('failedToLoad', t('pages.careers.applications'));
    } finally {
      setApplicationsLoading(false);
    }
  };

  const handleCreateJobListing = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      requiredExperienceEn: formData.get('requiredExperienceEn'),
      requiredExperienceAr: formData.get('requiredExperienceAr'),
      locationEn: formData.get('locationEn'),
      locationAr: formData.get('locationAr'),
      jobTypeEn: formData.get('jobTypeEn'),
      jobTypeAr: formData.get('jobTypeAr'),
      descriptionEn: jobDescriptionEn,
      descriptionAr: jobDescriptionAr,
      requirementsEn: jobRequirementsEn,
      requirementsAr: jobRequirementsAr,
      responsibilitiesEn: jobResponsibilitiesEn,
      responsibilitiesAr: jobResponsibilitiesAr,
      order: parseInt(formData.get('order')) || pageSettings?.jobListings?.length || 0,
    };

    try {
      await createJobListing(data);
      showSuccess('created', t('pages.careers.jobListing'));
      fetchData();
      setShowJobListingForm(false);
      e.target.reset();
      setJobDescriptionEn('');
      setJobDescriptionAr('');
      setJobRequirementsEn('');
      setJobRequirementsAr('');
      setJobResponsibilitiesEn('');
      setJobResponsibilitiesAr('');
    } catch (error) {
      console.error('Error creating job listing:', error);
      showError('failedToCreate', t('pages.careers.jobListing'));
    }
  };

  const handleUpdateJobListing = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      requiredExperienceEn: formData.get('requiredExperienceEn'),
      requiredExperienceAr: formData.get('requiredExperienceAr'),
      locationEn: formData.get('locationEn'),
      locationAr: formData.get('locationAr'),
      jobTypeEn: formData.get('jobTypeEn'),
      jobTypeAr: formData.get('jobTypeAr'),
      descriptionEn: jobDescriptionEn,
      descriptionAr: jobDescriptionAr,
      requirementsEn: jobRequirementsEn,
      requirementsAr: jobRequirementsAr,
      responsibilitiesEn: jobResponsibilitiesEn,
      responsibilitiesAr: jobResponsibilitiesAr,
      order: parseInt(formData.get('order')) || 0,
    };

    try {
      await updateJobListing(editingJobListing.id, data);
      showSuccess('updated', t('pages.careers.jobListing'));
      fetchData();
      setEditingJobListing(null);
      setShowJobListingForm(false);
      setJobDescriptionEn('');
      setJobDescriptionAr('');
      setJobRequirementsEn('');
      setJobRequirementsAr('');
      setJobResponsibilitiesEn('');
      setJobResponsibilitiesAr('');
    } catch (error) {
      console.error('Error updating job listing:', error);
      showError('failedToUpdate', t('pages.careers.jobListing'));
    }
  };

  const handleDeleteJobListing = async id => {
    if (!showConfirm('delete')) return;

    try {
      await deleteJobListing(id);
      showSuccess('deleted', t('pages.careers.jobListing'));
      fetchData();
    } catch (error) {
      console.error('Error deleting job listing:', error);
      showError('failedToDelete', t('pages.careers.jobListing'));
    }
  };

  const handleCreateWhyWorkWithUsItem = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      descriptionEn: formData.get('descriptionEn'),
      descriptionAr: formData.get('descriptionAr'),
      order: parseInt(formData.get('order')) || pageSettings?.whyWorkWithUsItems?.length || 0,
    };

    try {
      await createWhyWorkWithUsItem(data);
      showSuccess('created', t('pages.careers.whyWorkWithUsItem'));
      fetchData();
      setShowWhyWorkWithUsForm(false);
      e.target.reset();
    } catch (error) {
      console.error('Error creating why work with us item:', error);
      showError('failedToCreate', t('pages.careers.whyWorkWithUsItem'));
    }
  };

  const handleUpdateWhyWorkWithUsItem = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      descriptionEn: formData.get('descriptionEn'),
      descriptionAr: formData.get('descriptionAr'),
      order: parseInt(formData.get('order')) || 0,
    };

    try {
      await updateWhyWorkWithUsItem(editingWhyWorkWithUsItem.id, data);
      showSuccess('updated', t('pages.careers.whyWorkWithUsItem'));
      fetchData();
      setEditingWhyWorkWithUsItem(null);
      setShowWhyWorkWithUsForm(false);
    } catch (error) {
      console.error('Error updating why work with us item:', error);
      showError('failedToUpdate', t('pages.careers.whyWorkWithUsItem'));
    }
  };

  const handleDeleteWhyWorkWithUsItem = async id => {
    if (!showConfirm('delete')) return;

    try {
      await deleteWhyWorkWithUsItem(id);
      showSuccess('deleted', t('pages.careers.whyWorkWithUsItem'));
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
      showError('failedToDelete', t('pages.careers.whyWorkWithUsItem'));
    }
  };

  const getImageUrl = imageUrl => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:5000${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-admin-bg)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-admin-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--color-admin-text-muted)] font-medium">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-admin-bg)] p-4 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-admin-text)] mb-2">{t('pages.careers.title')}</h1>
          <p className="text-[var(--color-admin-text-muted)]">{t('pages.careers.description')}</p>
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
            {t('pages.careers.pageSettings')}
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'benefits'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.careers.jobBenefits')} <span className="ml-1 opacity-80">({pageSettings?.jobBenefits?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'listings'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.careers.jobListings')} <span className="ml-1 opacity-80">({pageSettings?.jobListings?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('why-work-with-us')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'why-work-with-us'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.careers.whyWorkWithUs')} <span className="ml-1 opacity-80">({pageSettings?.whyWorkWithUsItems?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'applications'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.careers.applications')} <span className="ml-1 opacity-80">({jobApplications.length})</span>
          </button>
        </div>

        {/* Settings Tab */}
        {activeTab === 'settings' && pageSettings && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.careers.pageSettings')}</h2>
            </div>
            <form onSubmit={handleUpdateSettings} className="p-6 space-y-6">
              {/* Hero Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[var(--color-admin-text)] border-b border-[var(--color-admin-border)] pb-2">{t('pages.careers.heroSection')}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.careers.heroTitleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
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
                      {t('pages.careers.heroTitleAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                    </label>
                    <input
                      type="text"
                      name="heroTitleAr"
                      defaultValue={pageSettings.heroTitleAr || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.careers.heroDescriptionEn')} <span className="text-[var(--color-admin-danger)]">*</span>
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
                      {t('pages.careers.heroDescriptionAr')} <span className="text-[var(--color-admin-danger)]">*</span>
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
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.careers.heroImage')}</label>
                    {pageSettings.heroImageUrl && (
                      <div className="mb-3">
                        <img
                          src={getImageUrl(pageSettings.heroImageUrl)}
                          alt="Hero"
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
              </div>

              {/* Why Work With Us Section */}
              <div className="space-y-6 pt-6 border-t border-[var(--color-admin-border)]">
                <h3 className="text-lg font-semibold text-[var(--color-admin-text)] border-b border-[var(--color-admin-border)] pb-2">
                  {t('pages.careers.whyWorkWithUsSection')}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.careers.sectionTitleEn')}</label>
                    <input
                      type="text"
                      name="whyWorkWithUsTitleEn"
                      defaultValue={pageSettings.whyWorkWithUsTitleEn || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.careers.sectionTitleAr')}</label>
                    <input
                      type="text"
                      name="whyWorkWithUsTitleAr"
                      defaultValue={pageSettings.whyWorkWithUsTitleAr || ''}
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
                  {t('pages.careers.saveSettings')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Job Benefits Tab */}
        {activeTab === 'benefits' && (
          <>
            {!showBenefitForm && !editingBenefit && (
              <div className="mb-6">
                <button
                  onClick={() => setShowBenefitForm(true)}
                  className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  + {t('pages.careers.addJobBenefit')}
                </button>
              </div>
            )}

            {(showBenefitForm || editingBenefit) && (
              <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden mb-6">
                <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
                  <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{editingBenefit ? t('pages.careers.editJobBenefit') : t('pages.careers.addJobBenefit')}</h2>
                </div>
                <form onSubmit={editingBenefit ? handleUpdateBenefit : handleCreateBenefit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.careers.textEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="textEn"
                        defaultValue={editingBenefit?.textEn || ''}
                        placeholder="e.g., Distinguished Salaries"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.careers.textAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="textAr"
                        defaultValue={editingBenefit?.textAr || ''}
                        placeholder="e.g., رواتب مميزة"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.careers.orderLabel')}</label>
                      <input
                        type="number"
                        name="order"
                        defaultValue={editingBenefit?.order || pageSettings?.jobBenefits?.length || 0}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowBenefitForm(false);
                        setEditingBenefit(null);
                      }}
                      className="px-6 py-3 border border-[var(--color-admin-border)] rounded-xl font-semibold text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)] transition-all"
                    >
                      {t('pages.careers.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg"
                    >
                      {editingBenefit ? t('pages.careers.updateBenefit') : t('pages.careers.createBenefit')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Benefits List */}
            <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
              <div className="p-6 border-b border-[var(--color-admin-border)]">
                <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.careers.jobBenefits')} ({pageSettings?.jobBenefits?.length || 0})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--color-admin-muted)]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.orderLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.textEnLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.textArLabel')}</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-admin-border)]">
                    {pageSettings?.jobBenefits?.map(benefit => (
                      <tr key={benefit.id} className="hover:bg-[var(--color-admin-muted)] transition-colors">
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{benefit.order}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{benefit.textEn}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{benefit.textAr}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingBenefit(benefit);
                                setShowBenefitForm(true);
                              }}
                              className="px-4 py-2 bg-[var(--color-admin-primary)] text-white rounded-lg hover:bg-[var(--color-admin-primary-dark)] transition-all text-sm"
                            >
                              {t('pages.careers.edit')}
                            </button>
                            <button
                              onClick={() => handleDeleteBenefit(benefit.id)}
                              className="px-4 py-2 bg-[var(--color-admin-danger)] text-white rounded-lg hover:bg-red-700 transition-all text-sm"
                            >
                              {t('pages.careers.delete')}
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

        {/* Job Listings Tab */}
        {activeTab === 'listings' && (
          <>
            {!showJobListingForm && !editingJobListing && (
              <div className="mb-6">
                <button
                  onClick={() => setShowJobListingForm(true)}
                  className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  + {t('pages.careers.addJobListing')}
                </button>
              </div>
            )}

            {(showJobListingForm || editingJobListing) && (
              <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden mb-6">
                <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
                  <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{editingJobListing ? t('pages.careers.editJobListing') : t('pages.careers.addJobListing')}</h2>
                </div>
                <form onSubmit={editingJobListing ? handleUpdateJobListing : handleCreateJobListing} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.careers.jobTitleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="titleEn"
                        defaultValue={editingJobListing?.titleEn || ''}
                        placeholder="e.g., Application Developer"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.careers.jobTitleAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="titleAr"
                        defaultValue={editingJobListing?.titleAr || ''}
                        placeholder="e.g., مطور تطبيقات"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.careers.requiredExperienceEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="requiredExperienceEn"
                        defaultValue={editingJobListing?.requiredExperienceEn || ''}
                        placeholder="e.g., 1-2 years"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.careers.requiredExperienceAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="requiredExperienceAr"
                        defaultValue={editingJobListing?.requiredExperienceAr || ''}
                        placeholder="e.g., سنة - سنتين"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.careers.locationEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="locationEn"
                        defaultValue={editingJobListing?.locationEn || ''}
                        placeholder="e.g., Riyadh - Saudi Arabia"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.careers.locationAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="locationAr"
                        defaultValue={editingJobListing?.locationAr || ''}
                        placeholder="e.g., الرياض - السعودية"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.careers.jobTypeEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="jobTypeEn"
                        defaultValue={editingJobListing?.jobTypeEn || ''}
                        placeholder="e.g., Full-time, Part-time"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.careers.jobTypeAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="jobTypeAr"
                        defaultValue={editingJobListing?.jobTypeAr || ''}
                        placeholder="e.g., دوام كامل، جزئي"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.careers.orderLabel')}</label>
                      <input
                        type="number"
                        name="order"
                        defaultValue={editingJobListing?.order || pageSettings?.jobListings?.length || 0}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                    </div>
                  </div>

                  {/* Rich Text Editors */}
                  <div className="space-y-6 pt-6 border-t border-[var(--color-admin-border)]">
                    <h3 className="text-lg font-semibold text-[var(--color-admin-text)]">{t('pages.careers.jobDetails')}</h3>

                    {/* Description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.careers.descriptionEn')}</label>
                        <RichTextEditor value={jobDescriptionEn} onChange={setJobDescriptionEn} placeholder="Enter job description in English..." dir="ltr" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.careers.descriptionAr')}</label>
                        <RichTextEditor value={jobDescriptionAr} onChange={setJobDescriptionAr} placeholder="أدخل وصف الوظيفة بالعربية..." dir="rtl" />
                      </div>
                    </div>

                    {/* Responsibilities */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.careers.responsibilitiesEn')}</label>
                        <RichTextEditor
                          value={jobResponsibilitiesEn}
                          onChange={setJobResponsibilitiesEn}
                          placeholder="Enter responsibilities and tasks in English..."
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.careers.responsibilitiesAr')}</label>
                        <RichTextEditor
                          value={jobResponsibilitiesAr}
                          onChange={setJobResponsibilitiesAr}
                          placeholder="أدخل المسؤوليات والمهام بالعربية..."
                          dir="rtl"
                        />
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.careers.jobRequirementsEn')}</label>
                        <RichTextEditor
                          value={jobRequirementsEn}
                          onChange={setJobRequirementsEn}
                          placeholder="Enter job requirements in English..."
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.careers.jobRequirementsAr')}</label>
                        <RichTextEditor value={jobRequirementsAr} onChange={setJobRequirementsAr} placeholder="أدخل المتطلبات الوظيفية بالعربية..." dir="rtl" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowJobListingForm(false);
                        setEditingJobListing(null);
                        setJobDescriptionEn('');
                        setJobDescriptionAr('');
                        setJobRequirementsEn('');
                        setJobRequirementsAr('');
                        setJobResponsibilitiesEn('');
                        setJobResponsibilitiesAr('');
                      }}
                      className="px-6 py-3 border border-[var(--color-admin-border)] rounded-xl font-semibold text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)] transition-all"
                    >
                      {t('pages.careers.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg"
                    >
                      {editingJobListing ? t('pages.careers.updateJobListing') : t('pages.careers.createJobListing')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Job Listings List */}
            <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
              <div className="p-6 border-b border-[var(--color-admin-border)]">
                <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.careers.jobListings')} ({pageSettings?.jobListings?.length || 0})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--color-admin-muted)]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.orderLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.titleEnLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.titleArLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.experience')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.location')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.jobType')}</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-admin-border)]">
                    {pageSettings?.jobListings?.map(job => (
                      <tr key={job.id} className="hover:bg-[var(--color-admin-muted)] transition-colors">
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{job.order}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{job.titleEn}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{job.titleAr}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{job.requiredExperienceEn}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{job.locationEn}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{job.jobTypeEn}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingJobListing(job);
                                setShowJobListingForm(true);
                              }}
                              className="px-4 py-2 bg-[var(--color-admin-primary)] text-white rounded-lg hover:bg-[var(--color-admin-primary-dark)] transition-all text-sm"
                            >
                              {t('pages.careers.edit')}
                            </button>
                            <button
                              onClick={() => handleDeleteJobListing(job.id)}
                              className="px-4 py-2 bg-[var(--color-admin-danger)] text-white rounded-lg hover:bg-red-700 transition-all text-sm"
                            >
                              {t('pages.careers.delete')}
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

        {/* Why Work With Us Tab */}
        {activeTab === 'why-work-with-us' && (
          <>
            {!showWhyWorkWithUsForm && !editingWhyWorkWithUsItem && (
              <div className="mb-6">
                <button
                  onClick={() => setShowWhyWorkWithUsForm(true)}
                  className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  + {t('pages.careers.addItem')}
                </button>
              </div>
            )}

            {(showWhyWorkWithUsForm || editingWhyWorkWithUsItem) && (
              <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden mb-6">
                <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
                  <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{editingWhyWorkWithUsItem ? t('pages.careers.editItem') : t('pages.careers.addItem')}</h2>
                </div>
                <form onSubmit={editingWhyWorkWithUsItem ? handleUpdateWhyWorkWithUsItem : handleCreateWhyWorkWithUsItem} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.careers.jobTitleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="titleEn"
                        defaultValue={editingWhyWorkWithUsItem?.titleEn || ''}
                        placeholder="e.g., Motivating Work Environment"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.careers.jobTitleAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="titleAr"
                        defaultValue={editingWhyWorkWithUsItem?.titleAr || ''}
                        placeholder="e.g., بيئة عمل محفّزة"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.careers.descriptionEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <textarea
                        name="descriptionEn"
                        defaultValue={editingWhyWorkWithUsItem?.descriptionEn || ''}
                        rows="4"
                        placeholder="e.g., We believe in teamwork, and we support creativity..."
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.careers.descriptionAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <textarea
                        name="descriptionAr"
                        defaultValue={editingWhyWorkWithUsItem?.descriptionAr || ''}
                        rows="4"
                        placeholder="e.g., نؤمن بروح الفريق، وندعم الإبداع..."
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.careers.orderLabel')}</label>
                      <input
                        type="number"
                        name="order"
                        defaultValue={editingWhyWorkWithUsItem?.order || pageSettings?.whyWorkWithUsItems?.length || 0}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowWhyWorkWithUsForm(false);
                        setEditingWhyWorkWithUsItem(null);
                      }}
                      className="px-6 py-3 border border-[var(--color-admin-border)] rounded-xl font-semibold text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)] transition-all"
                    >
                      {t('pages.careers.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg"
                    >
                      {editingWhyWorkWithUsItem ? t('pages.careers.updateItem') : t('pages.careers.createItem')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Why Work With Us Items List */}
            <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
              <div className="p-6 border-b border-[var(--color-admin-border)]">
                <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.careers.whyWorkWithUs')} ({pageSettings?.whyWorkWithUsItems?.length || 0})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--color-admin-muted)]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.orderLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.titleEnLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.titleArLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.descriptionEnLabel')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.descriptionArLabel')}</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-admin-border)]">
                    {pageSettings?.whyWorkWithUsItems?.map(item => (
                      <tr key={item.id} className="hover:bg-[var(--color-admin-muted)] transition-colors">
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{item.order}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{item.titleEn}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{item.titleAr}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)] max-w-xs truncate">{item.descriptionEn}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)] max-w-xs truncate">{item.descriptionAr}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingWhyWorkWithUsItem(item);
                                setShowWhyWorkWithUsForm(true);
                              }}
                              className="px-4 py-2 bg-[var(--color-admin-primary)] text-white rounded-lg hover:bg-[var(--color-admin-primary-dark)] transition-all text-sm"
                            >
                              {t('pages.careers.edit')}
                            </button>
                            <button
                              onClick={() => handleDeleteWhyWorkWithUsItem(item.id)}
                              className="px-4 py-2 bg-[var(--color-admin-danger)] text-white rounded-lg hover:bg-red-700 transition-all text-sm"
                            >
                              {t('pages.careers.delete')}
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

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)]">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.careers.jobApplications')} ({jobApplications.length})</h2>
            </div>
            {applicationsLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-admin-primary)] mx-auto mb-4"></div>
                <p className="text-[var(--color-admin-text-muted)]">{t('pages.careers.loadingApplications')}</p>
              </div>
            ) : jobApplications.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-[var(--color-admin-text-muted)]">{t('pages.careers.noApplicationsFound')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--color-admin-muted)]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.date')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.name')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.email')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.phone')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.jobPosition')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.careers.message')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-admin-border)]">
                    {jobApplications.map(application => (
                      <tr key={application.id} className="hover:bg-[var(--color-admin-muted)] transition-colors">
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{new Date(application.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)] font-medium">{application.name}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">
                          <a href={`mailto:${application.email}`} className="text-[var(--color-admin-primary)] hover:underline">
                            {application.email}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">
                          <a href={`tel:${application.phone}`} className="text-[var(--color-admin-primary)] hover:underline">
                            {application.phone}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{application.jobListing ? application.jobListing.titleEn : t('pages.careers.na')}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-admin-text)] max-w-xs">
                          <div className="truncate" title={application.message}>
                            {application.message}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CareersPageManager;
