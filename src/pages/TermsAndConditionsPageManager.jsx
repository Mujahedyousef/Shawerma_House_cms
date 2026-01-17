import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
  getTermsAndConditionsPageSettings,
  updateTermsAndConditionsPageSettings,
} from '../api/termsAndConditionsPage';
import { showSuccess, showError } from '../utils/i18nHelpers';

const TermsAndConditionsPageManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentEn, setContentEn] = useState('');
  const [contentAr, setContentAr] = useState('');
  const quillEnRef = useRef(null);
  const quillArRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (settings) {
      const contentEnValue = settings.contentEn ?? '';
      const contentArValue = settings.contentAr ?? '';
      
      setContentEn(contentEnValue);
      setContentAr(contentArValue);
      
      // Manually set Quill content using refs after a brief delay to ensure Quill is mounted
      setTimeout(() => {
        if (quillEnRef.current) {
          try {
            const editor = quillEnRef.current.getEditor ? quillEnRef.current.getEditor() : null;
            if (editor && editor.root && contentEnValue) {
              editor.root.innerHTML = contentEnValue;
            }
          } catch (e) {
            console.log('Could not set Quill content via ref:', e);
          }
        }
        if (quillArRef.current) {
          try {
            const editor = quillArRef.current.getEditor ? quillArRef.current.getEditor() : null;
            if (editor && editor.root && contentArValue) {
              editor.root.innerHTML = contentArValue;
            }
          } catch (e) {
            console.log('Could not set Quill content via ref:', e);
          }
        }
      }, 200);
    }
  }, [settings]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const settingsData = await getTermsAndConditionsPageSettings();
      setSettings(settingsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      showError('failedToLoad', t('sidebar.termsAndConditions'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get('heroImage');
    
    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      descriptionEn: formData.get('descriptionEn'),
      descriptionAr: formData.get('descriptionAr'),
      contentEn: contentEn,
      contentAr: contentAr,
      heroImage: file instanceof File && file.size > 0 ? file : null,
      heroImageUrl: settings?.heroImageUrl || null,
    };

    try {
      await updateTermsAndConditionsPageSettings(data);
      showSuccess('updated', t('sidebar.termsAndConditions'));
      fetchData();
    } catch (error) {
      console.error('Error updating settings:', error);
      showError('failedToUpdate', t('sidebar.termsAndConditions'));
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

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-admin-bg)]" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <p className="text-[var(--color-admin-text-muted)]">{t('messages.error.failedToLoad')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-admin-bg)] p-4 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-admin-text)] mb-2">{t('sidebar.termsAndConditions')}</h1>
          <p className="text-[var(--color-admin-text-muted)]">{t('pages.termsAndConditions.description')}</p>
        </div>

        {/* Settings Form */}
        <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
          <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
            <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.termsAndConditions.pageSettings')}</h2>
            <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.termsAndConditions.updateSettings')}</p>
          </div>
          <form onSubmit={handleUpdateSettings} className="p-6 space-y-6">
            {/* Hero Image */}
            <div>
              <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                {t('pages.termsAndConditions.heroImage')}
              </label>
              <input
                type="file"
                name="heroImage"
                accept="image/*"
                className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)] hover:file:bg-[var(--color-admin-primary)]/20"
              />
              {settings.heroImageUrl && (
                <div className="mt-4">
                  <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">{t('pages.termsAndConditions.currentHeroImage')}</p>
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

            {/* Rich Text Content */}
            <div>
              <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                {t('form.contentEn')}
              </label>
              <ReactQuill
                ref={quillEnRef}
                key={`content-en-${settings.id}`}
                theme="snow"
                value={contentEn}
                onChange={setContentEn}
                className="bg-[var(--color-admin-surface)] rounded-xl"
                style={{ minHeight: '300px' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                {t('form.contentAr')}
              </label>
              <ReactQuill
                ref={quillArRef}
                key={`content-ar-${settings.id}`}
                theme="snow"
                value={contentAr}
                onChange={setContentAr}
                className="bg-[var(--color-admin-surface)] rounded-xl"
                style={{ minHeight: '300px' }}
              />
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
      </div>
    </div>
  );
};

export default TermsAndConditionsPageManager;
