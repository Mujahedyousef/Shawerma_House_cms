import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getActiveDownloadAppSection,
  createDownloadAppSection,
  updateDownloadAppSection,
  uploadDownloadAppImage,
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
      backgroundColor: formData.get('backgroundColor'),
      theme: formData.get('theme'),
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
      backgroundColor: formData.get('backgroundColor'),
      theme: formData.get('theme'),
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                  {t('pages.downloadApp.backgroundColor')}
                </label>
                <input
                  type="color"
                  name="backgroundColor"
                  defaultValue="#1a1a1a"
                  className="w-full h-12 px-2 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] cursor-pointer"
                />
                <p className="text-xs text-[var(--color-admin-text-muted)] mt-2">
                  ℹ️ Only used as fallback if no background image is uploaded
                </p>
              </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.downloadApp.theme')}
                  </label>
                  <select
                    name="theme"
                    defaultValue="dark"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                  >
                    <option value="dark">{t('pages.downloadApp.themeDark')}</option>
                    <option value="light">{t('pages.downloadApp.themeLight')}</option>
                  </select>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                  {t('pages.downloadApp.backgroundColor')}
                </label>
                <input
                  type="color"
                  name="backgroundColor"
                  defaultValue={section.backgroundColor}
                  className="w-full h-12 px-2 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] cursor-pointer"
                />
                <p className="text-xs text-[var(--color-admin-text-muted)] mt-2">
                  ℹ️ Only used as fallback if no background image is uploaded
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                  {t('pages.downloadApp.theme')}
                </label>
                <select
                  name="theme"
                  defaultValue={section.theme}
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                >
                  <option value="dark">{t('pages.downloadApp.themeDark')}</option>
                  <option value="light">{t('pages.downloadApp.themeLight')}</option>
                </select>
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
                <img
                  src={getImageUrl(section.backgroundImageUrl)}
                  alt="Background"
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
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
                <img
                  src={getImageUrl(section.mobileAppImageUrl)}
                  alt="Mobile App"
                  className="w-full h-40 object-contain rounded-lg mb-3"
                />
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
                <img
                  src={getImageUrl(section.appStoreImageUrl)}
                  alt="App Store"
                  className="w-full h-20 object-contain rounded-lg mb-3"
                />
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
                <img
                  src={getImageUrl(section.googlePlayImageUrl)}
                  alt="Google Play"
                  className="w-full h-20 object-contain rounded-lg mb-3"
                />
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

