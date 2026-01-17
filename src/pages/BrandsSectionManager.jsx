import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getActiveBrandsSection,
  createBrandsSection,
  updateBrandsSection,
  uploadBrandLogo,
  updateBrandLogo,
  deleteBrandLogo,
  getSectionSettings,
  updateSectionSettings,
} from '../api/brandsSection';
import { showSuccess, showError, showConfirm } from '../utils/i18nHelpers';

const BrandsSectionManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [brandsSection, setBrandsSection] = useState(null);
  const [sectionSettings, setSectionSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'logos'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [brandsResponse, settingsResponse] = await Promise.all([
        getActiveBrandsSection(),
        getSectionSettings(),
      ]);
      setBrandsSection(brandsResponse.data);
      setSectionSettings(settingsResponse.data);
    } catch (error) {
      console.error('Error fetching brands section:', error);
      showError('failedToLoad', t('sidebar.brands'));
    } finally {
      setLoading(false);
    }
  };

  const fetchBrandsSection = async () => {
    try {
      const response = await getActiveBrandsSection();
      setBrandsSection(response.data);
    } catch (error) {
      console.error('Error fetching brands section:', error);
      showError('failedToLoad', t('sidebar.brands'));
    }
  };

  const handleUpdateGeneral = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      sectionTitleEn: formData.get('sectionTitleEn'),
      sectionTitleAr: formData.get('sectionTitleAr'),
      sectionSubtitleEn: formData.get('sectionSubtitleEn') || null,
      sectionSubtitleAr: formData.get('sectionSubtitleAr') || null,
    };

    try {
      await updateSectionSettings(data);
      showSuccess('updated', t('sidebar.brands'));
      fetchData();
    } catch (error) {
      console.error('Error updating section settings:', error);
      showError('failedToUpdate', t('sidebar.brands'));
    }
  };

  const handleLogoUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get('file');
    const order = parseInt(formData.get('order')) || 0;
    const nameEn = formData.get('nameEn') || 'Brand';
    const nameAr = formData.get('nameAr') || 'علامة تجارية';

    if (!file) {
      showError('failedToUpload', t('pages.brands.selectFile'));
      return;
    }

    try {
      await uploadBrandLogo(brandsSection.id, file, order, nameEn, nameAr);
      showSuccess('uploaded', t('pages.brands.logo'));
      fetchBrandsSection();
      e.target.reset();
    } catch (error) {
      console.error('Error uploading logo:', error);
      showError('failedToUpload', t('pages.brands.logo'));
    }
  };

  const handleDeleteLogo = async (logoId) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteBrandLogo(logoId);
      showSuccess('deleted', t('pages.brands.logo'));
      fetchBrandsSection();
    } catch (error) {
      console.error('Error deleting logo:', error);
      showError('failedToDelete', t('pages.brands.logo'));
    }
  };

  const handleCreateBrandsSection = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      sectionTitleEn: formData.get('sectionTitleEn') || 'The best global brands',
      sectionTitleAr: formData.get('sectionTitleAr') || 'أفضل العلامات التجارية العالمية',
      isActive: true,
    };

    try {
      await createBrandsSection(data);
      showSuccess('created', t('sidebar.brands'));
      fetchBrandsSection();
    } catch (error) {
      console.error('Error creating brands section:', error);
      showError('failedToCreate', t('sidebar.brands'));
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

  if (!brandsSection) {
    return (
      <div className="min-h-screen bg-[var(--color-admin-bg)] p-4 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-[var(--color-admin-surface)] rounded-xl shadow-xl border border-[var(--color-admin-border)] overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.brands.createFirstLogo')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.brands.description')}</p>
            </div>
            <form onSubmit={handleCreateBrandsSection} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.sectionTitleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="sectionTitleEn"
                    defaultValue="The best global brands"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                    placeholder="The best global brands"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.sectionTitleAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="sectionTitleAr"
                    defaultValue="أفضل العلامات التجارية العالمية"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    placeholder="أفضل العلامات التجارية العالمية"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-admin-border)]">
                <button
                  type="submit"
                  className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {t('pages.brands.createFirstLogo')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  return (
    <div className="min-h-screen bg-[var(--color-admin-bg)] p-4 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-admin-text)] mb-2">{t('sidebar.brands')}</h1>
          <p className="text-[var(--color-admin-text-muted)]">{t('pages.brands.description')}</p>
        </div>

        {/* Tabs */}
        <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] p-1.5 mb-6 inline-flex gap-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'general'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.brands.general')}
          </button>
          <button
            onClick={() => setActiveTab('logos')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'logos'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.brands.logos')} <span className={isRTL ? 'mr-1' : 'ml-1'} style={{ opacity: 0.8 }}>({brandsSection.logos?.length || 0})</span>
          </button>
        </div>

        {/* General Info Tab */}
        {activeTab === 'general' && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.categories.generalInformation')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.categories.updateSectionTitle')}</p>
            </div>
            <form onSubmit={handleUpdateGeneral} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.sectionTitleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="sectionTitleEn"
                    defaultValue={sectionSettings?.sectionTitleEn || ''}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                    placeholder="The best global brands"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.sectionTitleAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="sectionTitleAr"
                    defaultValue={sectionSettings?.sectionTitleAr || ''}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    placeholder="أفضل العلامات التجارية العالمية"
                    dir="rtl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.sectionSubtitleEn')}
                  </label>
                  <input
                    type="text"
                    name="sectionSubtitleEn"
                    defaultValue={sectionSettings?.sectionSubtitleEn || ''}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                    placeholder={t('common.optional')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.sectionSubtitleAr')}
                  </label>
                  <input
                    type="text"
                    name="sectionSubtitleAr"
                    defaultValue={sectionSettings?.sectionSubtitleAr || ''}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    placeholder={t('common.optional')}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-admin-border)]">
                <button
                  type="submit"
                  className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {t('pages.categories.saveSettings')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Logos Tab */}
        {activeTab === 'logos' && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-info)]/10 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.brands.logos')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.brands.description')}</p>
            </div>
            
            {/* Upload Form */}
            <form onSubmit={handleLogoUpload} className="m-6 p-6 bg-gradient-to-br from-[var(--color-admin-info)]/10 to-[var(--color-admin-primary-light)] rounded-xl border-2 border-dashed border-[var(--color-admin-primary)]/30">
              <h3 className="text-lg font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.brands.addLogo')}</h3>
              <p className="text-sm text-[var(--color-admin-text-muted)] mb-4">{t('pages.brands.description')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.nameEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="nameEn"
                    placeholder="e.g., Bosch, Amazon"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.nameAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="nameAr"
                    placeholder="e.g., بوش، أمازون"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                    dir="rtl"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.brands.logo')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="file"
                    name="file"
                    accept="image/*"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)] hover:file:bg-[var(--color-admin-primary)]/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('form.order')}</label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={brandsSection.logos?.length || 0}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    min="0"
                  />
                  <p className="text-xs text-[var(--color-admin-text-muted)] mt-2">{t('pages.categories.displayOrder')}</p>
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 bg-gradient-to-r from-[var(--color-admin-success)] to-[var(--color-admin-accent)] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all shadow-md transform hover:-translate-y-0.5"
              >
                {t('pages.brands.addLogo')}
              </button>
            </form>

            {/* Logos List */}
            <div className="p-6">
              {brandsSection.logos?.length === 0 ? (
                <div className="text-center py-16 bg-[var(--color-admin-muted)] rounded-xl border-2 border-dashed border-[var(--color-admin-border)]">
                  <svg className="mx-auto h-16 w-16 text-[var(--color-admin-text-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-4 text-sm font-medium text-[var(--color-admin-text)]">{t('pages.brands.noLogosYet')}</p>
                  <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">{t('pages.brands.getStarted')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {brandsSection.logos?.map((logo) => (
                    <div key={logo.id} className="group border border-[var(--color-admin-border)] rounded-xl overflow-hidden hover:shadow-xl transition-all bg-[var(--color-admin-surface)]">
                      <div className="relative bg-white p-6">
                        <span className="absolute top-3 left-3 bg-[var(--color-admin-primary)] text-white text-xs px-3 py-1.5 rounded-full font-semibold z-10">
                          #{logo.order}
                        </span>
                        <img
                          src={logo.imageUrl.startsWith('http') ? logo.imageUrl : `http://localhost:5000${logo.imageUrl}`}
                          alt="Brand logo"
                          className="w-full h-32 object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 border-t border-[var(--color-admin-border)]">
                        <p className="text-sm font-semibold text-[var(--color-admin-text)] mb-1">{logo.nameEn}</p>
                        <p className="text-xs text-[var(--color-admin-text-muted)] mb-3 text-right" dir="rtl">{logo.nameAr}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const nameEn = prompt(t('form.nameEn'), logo.nameEn);
                              const nameAr = prompt(t('form.nameAr'), logo.nameAr);
                              if (nameEn && nameAr) {
                                updateBrandLogo(logo.id, { nameEn, nameAr }).then(() => {
                                  fetchBrandsSection();
                                }).catch((error) => {
                                  console.error('Error updating logo:', error);
                                  showError('failedToUpdate', t('pages.brands.logo'));
                                });
                              }
                            }}
                            className="flex-1 bg-[var(--color-admin-primary-light)] text-[var(--color-admin-primary)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-primary)]/20 transition-colors"
                          >
                            {t('common.edit')}
                          </button>
                          <button
                            onClick={() => handleDeleteLogo(logo.id)}
                            className="flex-1 bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-danger)]/20 transition-colors"
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

export default BrandsSectionManager;
