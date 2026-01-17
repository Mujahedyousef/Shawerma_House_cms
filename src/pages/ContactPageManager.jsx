import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getContactPageSettings, updateContactPageSettings } from '../api/contactPage';
import { getAllRequestTypes, createRequestType, updateRequestType, deleteRequestType } from '../api/requestType';
import { getAllContactRequests, updateContactRequest, deleteContactRequest } from '../api/contactRequest';
import { showSuccess, showError, showConfirm, t } from '../utils/i18nHelpers';

const ContactPageManager = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [settings, setSettings] = useState(null);
  const [requestTypes, setRequestTypes] = useState([]);
  const [contactRequests, setContactRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('settings'); // 'settings', 'request-types', 'submissions'
  const [editingRequestType, setEditingRequestType] = useState(null);
  const [showRequestTypeForm, setShowRequestTypeForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsData, requestTypesData, requestsData] = await Promise.all([getContactPageSettings(), getAllRequestTypes(), getAllContactRequests()]);
      setSettings(settingsData.data);
      setRequestTypes(requestTypesData.data || []);
      setContactRequests(requestsData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showError('failedToLoad', t('sidebar.contactPage'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const heroImageFile = formData.get('heroImage');

    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      descriptionEn: formData.get('descriptionEn'),
      descriptionAr: formData.get('descriptionAr'),
      phoneNumber: formData.get('phoneNumber'),
      email: formData.get('email'),
      workingHoursEn: formData.get('workingHoursEn'),
      workingHoursAr: formData.get('workingHoursAr'),
      locationEn: formData.get('locationEn'),
      locationAr: formData.get('locationAr'),
      heroImage: heroImageFile instanceof File && heroImageFile.size > 0 ? heroImageFile : null,
      mapLatitude: formData.get('mapLatitude') || null,
      mapLongitude: formData.get('mapLongitude') || null,
    };

    try {
      await updateContactPageSettings(data);
      showSuccess('updated', t('sidebar.contactPage'));
      fetchData();
    } catch (error) {
      console.error('Error updating settings:', error);
      showError('failedToUpdate', t('sidebar.contactPage'));
    }
  };

  const handleCreateRequestType = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      nameEn: formData.get('nameEn'),
      nameAr: formData.get('nameAr'),
      order: parseInt(formData.get('order')) || requestTypes.length,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      await createRequestType(data);
      showSuccess('created', t('pages.contact.requestType'));
      fetchData();
      setShowRequestTypeForm(false);
      e.target.reset();
    } catch (error) {
      console.error('Error creating request type:', error);
      showError('failedToCreate', t('pages.contact.requestType'));
    }
  };

  const handleUpdateRequestType = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      nameEn: formData.get('nameEn'),
      nameAr: formData.get('nameAr'),
      order: parseInt(formData.get('order')) || 0,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      await updateRequestType(editingRequestType.id, data);
      showSuccess('updated', t('pages.contact.requestType'));
      fetchData();
      setEditingRequestType(null);
      setShowRequestTypeForm(false);
    } catch (error) {
      console.error('Error updating request type:', error);
      showError('failedToUpdate', t('pages.contact.requestType'));
    }
  };

  const handleDeleteRequestType = async id => {
    if (!showConfirm('delete')) return;

    try {
      await deleteRequestType(id);
      showSuccess('deleted', t('pages.contact.requestType'));
      fetchData();
    } catch (error) {
      console.error('Error deleting request type:', error);
      showError('failedToDelete', t('pages.contact.requestType'));
    }
  };

  const handleUpdateRequestStatus = async (id, status) => {
    try {
      await updateContactRequest(id, { status });
      showSuccess('updated', t('pages.contact.request'));
      fetchData();
    } catch (error) {
      console.error('Error updating request status:', error);
      showError('failedToUpdate', t('pages.contact.request'));
    }
  };

  const handleDeleteRequest = async id => {
    if (!showConfirm('delete')) return;

    try {
      await deleteContactRequest(id);
      showSuccess('deleted', t('pages.contact.request'));
      fetchData();
    } catch (error) {
      console.error('Error deleting contact request:', error);
      showError('failedToDelete', t('pages.contact.request'));
    }
  };

  const getImageUrl = imageUrl => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:5000${imageUrl}`;
  };

  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-admin-bg)]" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-admin-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--color-admin-text-muted)] font-medium">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-admin-bg)]" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <p className="text-[var(--color-admin-text-muted)]">{t('messages.error.failedToLoad')} {t('sidebar.contactPage')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-admin-bg)] p-4 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-admin-text)] mb-2">{t('sidebar.contactPage')}</h1>
          <p className="text-[var(--color-admin-text-muted)]">{t('pages.contact.description')}</p>
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
            {t('pages.contact.pageSettings')}
          </button>
          <button
            onClick={() => setActiveTab('request-types')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'request-types'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.contact.requestTypes')} <span className="ml-1 opacity-80">({requestTypes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'submissions'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.contact.submissions')} <span className="ml-1 opacity-80">({contactRequests.length})</span>
          </button>
        </div>

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.contact.pageSettings')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.contact.updateSettings')}</p>
            </div>
            <form onSubmit={handleUpdateSettings} className="p-6 space-y-6">
              {/* Hero Image */}
              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.contact.heroImage')}</label>
                <input
                  type="file"
                  name="heroImage"
                  accept="image/*"
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)] hover:file:bg-[var(--color-admin-primary)]/20"
                />
                {settings.heroImageUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">{t('pages.contact.currentImage')}</p>
                    <img
                      src={getImageUrl(settings.heroImageUrl)}
                      alt="Hero"
                      className="w-full max-w-md h-64 object-cover rounded-lg border border-[var(--color-admin-border)]"
                    />
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.titleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="titleEn"
                    defaultValue={settings.titleEn}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.titleAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="titleAr"
                    defaultValue={settings.titleAr}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.descriptionEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <textarea
                    name="descriptionEn"
                    defaultValue={settings.descriptionEn}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-28 resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.descriptionAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <textarea
                    name="descriptionAr"
                    defaultValue={settings.descriptionAr}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-28 resize-none text-right"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.contact.phoneNumber')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    defaultValue={settings.phoneNumber}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.contact.email')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={settings.email}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.contact.workingHours')} ({t('common.english')}) <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="workingHoursEn"
                    defaultValue={settings.workingHoursEn}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    placeholder="Sunday - Thursday: 8:00 AM - 5:00 PM"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.contact.workingHours')} ({t('common.arabic')}) <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="workingHoursAr"
                    defaultValue={settings.workingHoursAr}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                    placeholder="الأحد - الخميس: 8:00 صباحاً - 5:00 مساءً"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.contact.location')} ({t('common.english')}) <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="locationEn"
                    defaultValue={settings.locationEn}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.contact.location')} ({t('common.arabic')}) <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="locationAr"
                    defaultValue={settings.locationAr}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              {/* Map Coordinates */}
              <div className="border-t border-[var(--color-admin-border)] pt-6">
                <h3 className="text-lg font-bold text-[var(--color-admin-text)] mb-4">Map Location</h3>
                <p className="text-sm text-[var(--color-admin-text-muted)] mb-4">
                  Enter the latitude and longitude coordinates for the map location (appears below contact form)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.contact.mapLatitude')} <span className="text-[var(--color-admin-text-muted)] text-xs">(e.g., 31.9539)</span>
                    </label>
                    <input
                      type="number"
                      name="mapLatitude"
                      step="any"
                      defaultValue={settings.mapLatitude || ''}
                      placeholder="31.9539"
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    />
                    <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">Range: -90 to 90</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.contact.mapLongitude')} <span className="text-[var(--color-admin-text-muted)] text-xs">(e.g., 35.9106)</span>
                    </label>
                    <input
                      type="number"
                      name="mapLongitude"
                      step="any"
                      defaultValue={settings.mapLongitude || ''}
                      placeholder="35.9106"
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    />
                    <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">Range: -180 to 180</p>
                  </div>
                </div>
                {settings.mapLatitude && settings.mapLongitude && (
                  <div className="mt-4 p-4 bg-[var(--color-admin-muted)] rounded-lg border border-[var(--color-admin-border)]">
                    <p className="text-sm font-semibold text-[var(--color-admin-text)] mb-2">Current map coordinates:</p>
                    <p className="text-sm text-[var(--color-admin-text)]">
                      Latitude: <span className="font-mono">{settings.mapLatitude}</span>
                    </p>
                    <p className="text-sm text-[var(--color-admin-text)]">
                      Longitude: <span className="font-mono">{settings.mapLongitude}</span>
                    </p>
                    <p className="text-xs text-[var(--color-admin-text-muted)] mt-2">
                      The map will be displayed on the frontend contact page using these coordinates.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[var(--color-admin-border)]">
                <button
                  type="submit"
                  className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {t('common.save')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Request Types Tab */}
        {activeTab === 'request-types' && (
          <>
            {/* Add Request Type Button */}
            {!showRequestTypeForm && !editingRequestType && (
              <div className="mb-6">
                <button
                  onClick={() => setShowRequestTypeForm(true)}
                  className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  + {t('pages.contact.addRequestType')}
                </button>
              </div>
            )}

            {/* Create/Edit Form */}
            {(showRequestTypeForm || editingRequestType) && (
              <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden mb-6">
                <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
                  <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{editingRequestType ? t('pages.contact.editRequestType') : t('pages.contact.addRequestType')}</h2>
                </div>
                <form onSubmit={editingRequestType ? handleUpdateRequestType : handleCreateRequestType} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.contact.name')} ({t('common.english')}) <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="nameEn"
                        defaultValue={editingRequestType?.nameEn || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        placeholder="e.g., General Inquiry"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.contact.name')} ({t('common.arabic')}) <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="nameAr"
                        defaultValue={editingRequestType?.nameAr || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                        placeholder="مثال: استفسار عام"
                        dir="rtl"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('form.order')}</label>
                      <input
                        type="number"
                        name="order"
                        defaultValue={editingRequestType?.order || requestTypes.length}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        min="0"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        name="isActive"
                        id="isActive"
                        defaultChecked={editingRequestType?.isActive !== false}
                        className="w-5 h-5 rounded border-[var(--color-admin-border)] text-[var(--color-admin-primary)] focus:ring-[var(--color-admin-primary)]"
                      />
                      <label htmlFor="isActive" className="text-sm font-semibold text-[var(--color-admin-text)]">
                        {t('common.active')} ({t('pages.contact.visibleInDropdown')})
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--color-admin-border)] flex gap-4">
                    <button
                      type="submit"
                      className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      {editingRequestType ? t('pages.contact.updateRequestType') : t('pages.contact.createRequestType')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowRequestTypeForm(false);
                        setEditingRequestType(null);
                      }}
                      className="bg-[var(--color-admin-muted)] text-[var(--color-admin-text)] px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-border)] transition-all"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Request Types List */}
            <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
              <div className="p-6 border-b border-[var(--color-admin-border)]">
                <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.contact.requestTypes')}</h2>
              </div>
              <div className="p-6">
                {requestTypes.length === 0 ? (
                  <div className="text-center py-16 bg-[var(--color-admin-muted)] rounded-xl border-2 border-dashed border-[var(--color-admin-border)]">
                    <p className="text-sm font-medium text-[var(--color-admin-text)]">{t('pages.contact.noRequestTypesYet')}</p>
                    <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">{t('pages.contact.getStarted')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requestTypes.map(type => (
                      <div
                        key={type.id}
                        className="border border-[var(--color-admin-border)] rounded-xl p-4 bg-[var(--color-admin-surface)] hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4">
                              <span className="bg-[var(--color-admin-primary)] text-white text-xs px-3 py-1.5 rounded-full font-semibold">#{type.order}</span>
                              <span
                                className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                                  type.isActive ? 'bg-[var(--color-admin-success)] text-white' : 'bg-[var(--color-admin-text-muted)] text-white'
                                }`}
                              >
                                {type.isActive ? t('common.active') : t('common.inactive')}
                              </span>
                              <div>
                                <p className="font-semibold text-[var(--color-admin-text)]">{type.nameEn}</p>
                                <p className="text-sm text-[var(--color-admin-text-muted)]" dir="rtl">
                                  {type.nameAr}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingRequestType(type);
                                setShowRequestTypeForm(true);
                              }}
                              className="bg-[var(--color-admin-primary-light)] text-[var(--color-admin-primary)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-primary)]/20 transition-all"
                            >
                              {t('common.edit')}
                            </button>
                            <button
                              onClick={() => handleDeleteRequestType(type.id)}
                              className="bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-danger)]/20 transition-all"
                            >
                              {t('common.delete')}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)]">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.contact.submissions')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.contact.viewSubmissions')}</p>
            </div>
            <div className="p-6">
              {contactRequests.length === 0 ? (
                <div className="text-center py-16 bg-[var(--color-admin-muted)] rounded-xl border-2 border-dashed border-[var(--color-admin-border)]">
                  <p className="text-sm font-medium text-[var(--color-admin-text)]">{t('pages.contact.noSubmissionsYet')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contactRequests.map(request => (
                    <div
                      key={request.id}
                      className="border border-[var(--color-admin-border)] rounded-xl p-6 bg-[var(--color-admin-surface)] hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <span
                              className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                                request.status === 'pending'
                                  ? 'bg-[var(--color-admin-warning)] text-white'
                                  : request.status === 'read'
                                  ? 'bg-[var(--color-admin-info)] text-white'
                                  : request.status === 'replied'
                                  ? 'bg-[var(--color-admin-success)] text-white'
                                  : 'bg-[var(--color-admin-text-muted)] text-white'
                              }`}
                            >
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                            {request.requestType && (
                              <span className="text-xs px-3 py-1.5 rounded-full font-semibold bg-[var(--color-admin-primary)]/10 text-[var(--color-admin-primary)]">
                                {request.requestType.nameEn}
                              </span>
                            )}
                            <span className="text-xs text-[var(--color-admin-text-muted)]">{formatDate(request.createdAt)}</span>
                          </div>
                          <h3 className="text-lg font-bold text-[var(--color-admin-text)] mb-1">{request.name}</h3>
                          <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">{request.email}</p>
                          {request.phone && <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">Phone: {request.phone}</p>}
                          {request.company && <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">Company: {request.company}</p>}
                          <p className="text-sm text-[var(--color-admin-text)] mt-3">{request.message}</p>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <select
                            value={request.status}
                            onChange={e => handleUpdateRequestStatus(request.id, e.target.value)}
                            className="px-3 py-2 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] text-sm focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                          >
                            <option value="pending">{t('pages.contact.pending')}</option>
                            <option value="read">{t('pages.contact.read')}</option>
                            <option value="replied">{t('pages.contact.replied')}</option>
                            <option value="archived">{t('pages.contact.archived')}</option>
                          </select>
                          <button
                            onClick={() => handleDeleteRequest(request.id)}
                            className="bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-danger)]/20 transition-all"
                          >
                            {t('common.delete')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPageManager;
