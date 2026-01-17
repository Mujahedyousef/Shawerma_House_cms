import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getServicesPageSettings, updateServicesPageSettings } from '../api/servicesPage';
import { showSuccess, showError } from '../utils/i18nHelpers';

const ServicesPageManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [pageSettings, setPageSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const settingsData = await getServicesPageSettings();
      setPageSettings(settingsData.data || settingsData);
    } catch (error) {
      console.error('Error fetching services page settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePageSettings = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const heroImageFile = formData.get('heroImage');
    
    const requestFormData = new FormData();
    requestFormData.append('heroTitleEn', formData.get('heroTitleEn'));
    requestFormData.append('heroTitleAr', formData.get('heroTitleAr'));
    requestFormData.append('heroDescriptionEn', formData.get('heroDescriptionEn') || '');
    requestFormData.append('heroDescriptionAr', formData.get('heroDescriptionAr') || '');
    requestFormData.append('tickerTextEn', formData.get('tickerTextEn') || '');
    requestFormData.append('tickerTextAr', formData.get('tickerTextAr') || '');
    
    if (heroImageFile && heroImageFile.size > 0) {
      requestFormData.append('heroImage', heroImageFile);
    } else if (formData.get('heroImageUrl')) {
      requestFormData.append('heroImageUrl', formData.get('heroImageUrl'));
    }

    try {
      await updateServicesPageSettings(requestFormData);
      showSuccess('updated', t('sidebar.servicesPage'));
      fetchData();
    } catch (error) {
      console.error('Error updating page settings:', error);
      showError('failedToUpdate', t('sidebar.servicesPage'));
    }
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

  return (
    <div className="min-h-screen bg-[var(--color-admin-bg)] p-4 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-admin-text)] mb-2">
            {t('sidebar.servicesPage')}
          </h1>
          <p className="text-[var(--color-admin-text-muted)]">
            {t('pages.servicesPage.description')}
          </p>
        </div>

        {pageSettings && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.servicesPage.heroSectionSettings')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.servicesPage.description')}</p>
            </div>
            <form onSubmit={handleUpdatePageSettings} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.servicesPage.heroTitleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="heroTitleEn"
                    defaultValue={pageSettings.heroTitleEn}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.servicesPage.heroTitleAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="heroTitleAr"
                    defaultValue={pageSettings.heroTitleAr}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.servicesPage.heroDescriptionEn')}
                  </label>
                  <textarea
                    name="heroDescriptionEn"
                    defaultValue={pageSettings.heroDescriptionEn || ''}
                    rows={4}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.servicesPage.heroDescriptionAr')}
                  </label>
                  <textarea
                    name="heroDescriptionAr"
                    defaultValue={pageSettings.heroDescriptionAr || ''}
                    rows={4}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all resize-none text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.servicesPage.tickerTextEn')}
                  </label>
                  <input
                    type="text"
                    name="tickerTextEn"
                    defaultValue={pageSettings.tickerTextEn || ''}
                    placeholder="e.g., Our Complete Services Group"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                  />
                  <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">
                    {t('pages.servicesPage.tickerTextDesc')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.servicesPage.tickerTextAr')}
                  </label>
                  <input
                    type="text"
                    name="tickerTextAr"
                    defaultValue={pageSettings.tickerTextAr || ''}
                    placeholder="مثال: مجموعة خدماتنا الكاملة"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                    dir="rtl"
                  />
                  <p className="text-xs text-[var(--color-admin-text-muted)] mt-1 text-right">
                    {t('pages.servicesPage.tickerTextDesc')}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                  {t('pages.servicesPage.heroImage')}
                </label>
                <input
                  type="file"
                  name="heroImage"
                  accept="image/*"
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)]"
                />
                {pageSettings.heroImageUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">{t('pages.servicesPage.currentImage')}</p>
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${pageSettings.heroImageUrl}`}
                      alt="Hero"
                      className="w-full max-w-md h-48 object-cover rounded-lg border border-[var(--color-admin-border)]"
                    />
                    <input
                      type="hidden"
                      name="heroImageUrl"
                      value={pageSettings.heroImageUrl}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[var(--color-admin-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all"
                >
                  {t('pages.servicesPage.updateSettings')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPageManager;
