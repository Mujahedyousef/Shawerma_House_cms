import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getActiveDownloadAppSection,
  createDownloadAppSection,
  updateDownloadAppSection,
  uploadDownloadAppImage,
  deleteDownloadAppImage,
} from '../api/downloadAppSection';
import { showSuccess, showError } from '../utils/i18nHelpers';

const DownloadAppSectionManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(null);

  useEffect(() => {
    fetchSection();
  }, []);

  const fetchSection = async () => {
    try {
      setLoading(true);
      const response = await getActiveDownloadAppSection();
      setSection(response.data);
    } catch (error) {
      console.error('Error fetching download app section:', error);
      // If no section exists, that's okay - we'll show create form
      setSection(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      descriptionEn: formData.get('descriptionEn'),
      descriptionAr: formData.get('descriptionAr'),
      backgroundColorLight: formData.get('backgroundColorLight'),
      titleColorLight: formData.get('titleColorLight'),
      descriptionColorLight: formData.get('descriptionColorLight'),
      backgroundColorDark: formData.get('backgroundColorDark'),
      titleColorDark: formData.get('titleColorDark'),
      descriptionColorDark: formData.get('descriptionColorDark'),
      appStoreLink: formData.get('appStoreLink') || null,
      googlePlayLink: formData.get('googlePlayLink') || null,
      enableInitialAnimation: formData.get('enableInitialAnimation') === 'on',
      enableScrollAnimation: formData.get('enableScrollAnimation') === 'on',
    };

    try {
      await createDownloadAppSection(data);
      showSuccess('created', t('pages.downloadApp.title'));
      setShowCreateForm(false);
      fetchSection();
    } catch (error) {
      console.error('Error creating download app section:', error);
      showError('failedToCreate', t('pages.downloadApp.title'));
    }
  };

  const handleUpdateSection = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      descriptionEn: formData.get('descriptionEn'),
      descriptionAr: formData.get('descriptionAr'),
      backgroundColorLight: formData.get('backgroundColorLight'),
      titleColorLight: formData.get('titleColorLight'),
      descriptionColorLight: formData.get('descriptionColorLight'),
      backgroundColorDark: formData.get('backgroundColorDark'),
      titleColorDark: formData.get('titleColorDark'),
      descriptionColorDark: formData.get('descriptionColorDark'),
      appStoreLink: formData.get('appStoreLink') || null,
      googlePlayLink: formData.get('googlePlayLink') || null,
      enableInitialAnimation: formData.get('enableInitialAnimation') === 'on',
      enableScrollAnimation: formData.get('enableScrollAnimation') === 'on',
    };

    try {
      await updateDownloadAppSection(section.id, data);
      showSuccess('updated', t('pages.downloadApp.title'));
      fetchSection();
    } catch (error) {
      console.error('Error updating download app section:', error);
      showError('failedToUpdate', t('pages.downloadApp.title'));
    }
  };

  const handleImageUpload = async (imageType, file) => {
    if (!file) return;

    try {
      setUploadingImage(imageType);
      await uploadDownloadAppImage(section.id, imageType, file);
      showSuccess('uploaded', t('common.image'));
      fetchSection();
    } catch (error) {
      console.error('Error uploading image:', error);
      showError('failedToUpload', t('common.image'));
    } finally {
      setUploadingImage(null);
    }
  };

  const handleImageDelete = async (imageType) => {
    if (!confirm(t('common.confirmDelete'))) return;

    try {
      await deleteDownloadAppImage(section.id, imageType);
      showSuccess('deleted', t('common.image'));
      fetchSection();
    } catch (error) {
      console.error('Error deleting image:', error);
      showError('failedToDelete', t('common.image'));
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
          <p className="text-[var(--color-admin-text-muted)] font-medium">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!section && !showCreateForm) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-admin-bg)]" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center bg-[var(--color-admin-surface)] rounded-xl shadow-xl p-8 max-w-md border border-[var(--color-admin-border)]">
          <svg className="mx-auto h-16 w-16 text-[var(--color-admin-text-light)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-bold text-[var(--color-admin-text)] mb-2">{t('pages.downloadApp.noSection')}</h3>
          <p className="text-[var(--color-admin-text-muted)] mb-6">{t('pages.downloadApp.noSectionDesc')}</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            + {t('pages.downloadApp.createSection')}
          </button>
        </div>
      </div>
    );
  }

  if (!section && showCreateForm) {
    return (
      <div className="min-h-screen bg-[var(--color-admin-bg)] p-4 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-admin-text)] mb-2">{t('pages.downloadApp.createSection')}</h1>
            <p className="text-[var(--color-admin-text-muted)]">{t('pages.downloadApp.createSectionDesc')}</p>
          </div>

          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <form onSubmit={handleCreateSection} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.titleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="titleEn"
                    defaultValue="Download Shawarma House App Now!"
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
                    defaultValue="حمّل تطبيق بيت الشاورما الآن!"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.descriptionEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <textarea
                    name="descriptionEn"
                    defaultValue="Try your favorite food easier with Shawarma House app! Order, track, and enjoy exclusive offers from the nearest branch, all in simple steps from your phone."
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-32 resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.descriptionAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <textarea
                    name="descriptionAr"
                    defaultValue="جرّب طعامك المفضل بطريقة أسهل مع تطبيق بيت الشاورما! اطلب، تابع، واستمتع بعروض حصرية من أقرب فرع لك، وكل هذا بخطوات بسيطة من جوالك."
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-32 resize-none text-right"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              {/* Styling & Theme Colors Section */}
              <div className="border-t border-[var(--color-admin-border)] pt-6">
                <h3 className="text-lg font-bold text-[var(--color-admin-text)] mb-4">
                  {t('pages.downloadApp.stylingSettings')}
                </h3>
                
                {/* Light Mode Colors */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-[var(--color-admin-text)] mb-3">
                    ☀️ {t('pages.downloadApp.lightModeColors')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-2">
                        {t('pages.downloadApp.backgroundColorLight')}
                      </label>
                      <input
                        type="color"
                        name="backgroundColorLight"
                        defaultValue="#ffffff"
                        className="w-full h-12 px-2 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-2">
                        {t('pages.downloadApp.titleColorLight')}
                      </label>
                      <input
                        type="color"
                        name="titleColorLight"
                        defaultValue="#1a1a1a"
                        className="w-full h-12 px-2 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-2">
                        {t('pages.downloadApp.descriptionColorLight')}
                      </label>
                      <input
                        type="color"
                        name="descriptionColorLight"
                        defaultValue="#666666"
                        className="w-full h-12 px-2 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Dark Mode Colors */}
                <div>
                  <h4 className="text-md font-semibold text-[var(--color-admin-text)] mb-3">
                    🌙 {t('pages.downloadApp.darkModeColors')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-2">
                        {t('pages.downloadApp.backgroundColorDark')}
                      </label>
                      <input
                        type="color"
                        name="backgroundColorDark"
                        defaultValue="#1a1a1a"
                        className="w-full h-12 px-2 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-2">
                        {t('pages.downloadApp.titleColorDark')}
                      </label>
                      <input
                        type="color"
                        name="titleColorDark"
                        defaultValue="#ffffff"
                        className="w-full h-12 px-2 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-2">
                        {t('pages.downloadApp.descriptionColorDark')}
                      </label>
                      <input
                        type="color"
                        name="descriptionColorDark"
                        defaultValue="#cccccc"
                        className="w-full h-12 px-2 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.downloadApp.appStoreLink')}
                  </label>
                  <input
                    type="url"
                    name="appStoreLink"
                    placeholder="https://apps.apple.com/..."
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                  />
                  <p className="text-xs text-[var(--color-admin-text-muted)] mt-2">
                    {t('pages.downloadApp.appButtonNote')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.downloadApp.googlePlayLink')}
                  </label>
                  <input
                    type="url"
                    name="googlePlayLink"
                    placeholder="https://play.google.com/..."
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                  />
                  <p className="text-xs text-[var(--color-admin-text-muted)] mt-2">
                    {t('pages.downloadApp.appButtonNote')}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="enableInitialAnimation"
                    id="enableInitialAnimation"
                    defaultChecked
                    className="w-5 h-5 rounded border-[var(--color-admin-border)] text-[var(--color-admin-primary)] focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                  <label htmlFor="enableInitialAnimation" className="text-sm font-medium text-[var(--color-admin-text)] cursor-pointer">
                    {t('pages.downloadApp.enableInitialAnimation')}
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="enableScrollAnimation"
                    id="enableScrollAnimation"
                    defaultChecked
                    className="w-5 h-5 rounded border-[var(--color-admin-border)] text-[var(--color-admin-primary)] focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                  />
                  <label htmlFor="enableScrollAnimation" className="text-sm font-medium text-[var(--color-admin-text)] cursor-pointer">
                    {t('pages.downloadApp.enableScrollAnimation')}
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-admin-border)] flex gap-4">
                <button
                  type="submit"
                  className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {t('pages.downloadApp.createSection')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-[var(--color-admin-muted)] text-[var(--color-admin-text)] px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-border)] transition-all"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-admin-bg)] p-4 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-admin-text)] mb-2">{t('pages.downloadApp.title')}</h1>
          <p className="text-[var(--color-admin-text-muted)]">{t('pages.downloadApp.description')}</p>
        </div>

        {/* General Settings */}
        <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden mb-6">
          <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
            <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.downloadApp.generalSettings')}</h2>
          </div>
          <form onSubmit={handleUpdateSection} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                  {t('form.titleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                </label>
                <input
                  type="text"
                  name="titleEn"
                  defaultValue={section.titleEn}
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
                  defaultValue={section.titleAr}
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                  dir="rtl"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                  {t('form.descriptionEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                </label>
                <textarea
                  name="descriptionEn"
                  defaultValue={section.descriptionEn}
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-32 resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                  {t('form.descriptionAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                </label>
                <textarea
                  name="descriptionAr"
                  defaultValue={section.descriptionAr}
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-32 resize-none text-right"
                  dir="rtl"
                  required
                />
              </div>
            </div>

            {/* Styling & Theme Colors Section */}
            <div className="border-t border-[var(--color-admin-border)] pt-6">
              <h3 className="text-lg font-bold text-[var(--color-admin-text)] mb-4">
                {t('pages.downloadApp.stylingSettings')}
              </h3>
              
              {/* Light Mode Colors */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-[var(--color-admin-text)] mb-3">
                  ☀️ {t('pages.downloadApp.lightModeColors')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-2">
                      {t('pages.downloadApp.backgroundColorLight')}
                    </label>
                    <input
                      type="color"
                      name="backgroundColorLight"
                      defaultValue={section.backgroundColorLight || '#ffffff'}
                      className="w-full h-12 px-2 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-2">
                      {t('pages.downloadApp.titleColorLight')}
                    </label>
                    <input
                      type="color"
                      name="titleColorLight"
                      defaultValue={section.titleColorLight || '#1a1a1a'}
                      className="w-full h-12 px-2 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-2">
                      {t('pages.downloadApp.descriptionColorLight')}
                    </label>
                    <input
                      type="color"
                      name="descriptionColorLight"
                      defaultValue={section.descriptionColorLight || '#666666'}
                      className="w-full h-12 px-2 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Dark Mode Colors */}
              <div>
                <h4 className="text-md font-semibold text-[var(--color-admin-text)] mb-3">
                  🌙 {t('pages.downloadApp.darkModeColors')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-2">
                      {t('pages.downloadApp.backgroundColorDark')}
                    </label>
                    <input
                      type="color"
                      name="backgroundColorDark"
                      defaultValue={section.backgroundColorDark || '#1a1a1a'}
                      className="w-full h-12 px-2 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-2">
                      {t('pages.downloadApp.titleColorDark')}
                    </label>
                    <input
                      type="color"
                      name="titleColorDark"
                      defaultValue={section.titleColorDark || '#ffffff'}
                      className="w-full h-12 px-2 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-admin-text)] mb-2">
                      {t('pages.downloadApp.descriptionColorDark')}
                    </label>
                    <input
                      type="color"
                      name="descriptionColorDark"
                      defaultValue={section.descriptionColorDark || '#cccccc'}
                      className="w-full h-12 px-2 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                  {t('pages.downloadApp.appStoreLink')}
                </label>
                <input
                  type="url"
                  name="appStoreLink"
                  defaultValue={section.appStoreLink || ''}
                  placeholder="https://apps.apple.com/..."
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                />
                <p className="text-xs text-[var(--color-admin-text-muted)] mt-2">
                  ⚠️ Note: Button will only appear if BOTH link AND image are uploaded
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                  {t('pages.downloadApp.googlePlayLink')}
                </label>
                <input
                  type="url"
                  name="googlePlayLink"
                  defaultValue={section.googlePlayLink || ''}
                  placeholder="https://play.google.com/..."
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                />
                <p className="text-xs text-[var(--color-admin-text-muted)] mt-2">
                  ⚠️ Note: Button will only appear if BOTH link AND image are uploaded
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="enableInitialAnimation"
                  id="enableInitialAnimation"
                  defaultChecked={section.enableInitialAnimation}
                  className="w-5 h-5 rounded border-[var(--color-admin-border)] text-[var(--color-admin-primary)] focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                />
                <label htmlFor="enableInitialAnimation" className="text-sm font-medium text-[var(--color-admin-text)] cursor-pointer">
                  {t('pages.downloadApp.enableInitialAnimation')}
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="enableScrollAnimation"
                  id="enableScrollAnimation"
                  defaultChecked={section.enableScrollAnimation}
                  className="w-5 h-5 rounded border-[var(--color-admin-border)] text-[var(--color-admin-primary)] focus:ring-2 focus:ring-[var(--color-admin-primary)]"
                />
                <label htmlFor="enableScrollAnimation" className="text-sm font-medium text-[var(--color-admin-text)] cursor-pointer">
                  {t('pages.downloadApp.enableScrollAnimation')}
                </label>
              </div>
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

        {/* Images Management */}
        <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
          <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-info)]/10 to-transparent">
            <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.downloadApp.imagesManagement')}</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Background Image */}
            <div className="border border-[var(--color-admin-border)] rounded-xl p-4">
              <h3 className="text-lg font-semibold text-[var(--color-admin-text)] mb-3">{t('pages.downloadApp.backgroundImage')}</h3>
              {section.backgroundImageUrl && (
                <div className="relative mb-3">
                  <img
                    src={getImageUrl(section.backgroundImageUrl)}
                    alt="Background"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageDelete('backgroundImageUrl')}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all"
                    title={t('common.delete')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('backgroundImageUrl', e.target.files[0])}
                disabled={uploadingImage === 'backgroundImageUrl'}
                className="w-full text-sm text-[var(--color-admin-text)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary)] file:text-white hover:file:bg-[var(--color-admin-primary-dark)]"
              />
              {uploadingImage === 'backgroundImageUrl' && (
                <p className="text-sm text-[var(--color-admin-primary)] mt-2">{t('common.uploading')}</p>
              )}
            </div>

            {/* Mobile App Image */}
            <div className="border border-[var(--color-admin-border)] rounded-xl p-4">
              <h3 className="text-lg font-semibold text-[var(--color-admin-text)] mb-3">{t('pages.downloadApp.mobileAppImage')}</h3>
              {section.mobileAppImageUrl && (
                <div className="relative mb-3">
                  <img
                    src={getImageUrl(section.mobileAppImageUrl)}
                    alt="Mobile App"
                    className="w-full h-40 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageDelete('mobileAppImageUrl')}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all"
                    title={t('common.delete')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('mobileAppImageUrl', e.target.files[0])}
                disabled={uploadingImage === 'mobileAppImageUrl'}
                className="w-full text-sm text-[var(--color-admin-text)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary)] file:text-white hover:file:bg-[var(--color-admin-primary-dark)]"
              />
              {uploadingImage === 'mobileAppImageUrl' && (
                <p className="text-sm text-[var(--color-admin-primary)] mt-2">{t('common.uploading')}</p>
              )}
            </div>

            {/* App Store Image */}
            <div className="border border-[var(--color-admin-border)] rounded-xl p-4">
              <h3 className="text-lg font-semibold text-[var(--color-admin-text)] mb-3">{t('pages.downloadApp.appStoreImage')}</h3>
              {section.appStoreImageUrl && (
                <div className="relative mb-3">
                  <img
                    src={getImageUrl(section.appStoreImageUrl)}
                    alt="App Store"
                    className="w-full h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageDelete('appStoreImageUrl')}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all"
                    title={t('common.delete')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('appStoreImageUrl', e.target.files[0])}
                disabled={uploadingImage === 'appStoreImageUrl'}
                className="w-full text-sm text-[var(--color-admin-text)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary)] file:text-white hover:file:bg-[var(--color-admin-primary-dark)]"
              />
              {uploadingImage === 'appStoreImageUrl' && (
                <p className="text-sm text-[var(--color-admin-primary)] mt-2">{t('common.uploading')}</p>
              )}
            </div>

            {/* Google Play Image */}
            <div className="border border-[var(--color-admin-border)] rounded-xl p-4">
              <h3 className="text-lg font-semibold text-[var(--color-admin-text)] mb-3">{t('pages.downloadApp.googlePlayImage')}</h3>
              {section.googlePlayImageUrl && (
                <div className="relative mb-3">
                  <img
                    src={getImageUrl(section.googlePlayImageUrl)}
                    alt="Google Play"
                    className="w-full h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageDelete('googlePlayImageUrl')}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all"
                    title={t('common.delete')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('googlePlayImageUrl', e.target.files[0])}
                disabled={uploadingImage === 'googlePlayImageUrl'}
                className="w-full text-sm text-[var(--color-admin-text)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary)] file:text-white hover:file:bg-[var(--color-admin-primary-dark)]"
              />
              {uploadingImage === 'googlePlayImageUrl' && (
                <p className="text-sm text-[var(--color-admin-primary)] mt-2">{t('common.uploading')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadAppSectionManager;

