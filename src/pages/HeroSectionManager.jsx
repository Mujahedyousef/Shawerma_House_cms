import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getActiveHeroSection,
  createHeroSection,
  updateHeroSection,
  uploadHeroMedia,
  deleteHeroMedia,
  addHeroStat,
  updateHeroStat,
  deleteHeroStat,
} from '../api/heroSection';
import { showSuccess, showError, showConfirm } from '../utils/i18nHelpers';

const HeroSectionManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [heroSection, setHeroSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'media', 'stats'
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingStat, setEditingStat] = useState(null);

  useEffect(() => {
    fetchHeroSection();
  }, []);

  const fetchHeroSection = async () => {
    try {
      setLoading(true);
      const response = await getActiveHeroSection();
      setHeroSection(response.data);
    } catch (error) {
      console.error('Error fetching hero section:', error);
      showError('failedToLoad', t('pages.heroSection.title'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHeroSection = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      descriptionEn: formData.get('descriptionEn'),
      descriptionAr: formData.get('descriptionAr'),
      buttonTextEn: formData.get('buttonTextEn'),
      buttonTextAr: formData.get('buttonTextAr'),
      buttonLink: formData.get('buttonLink') || null,
      autoPlayInterval: parseInt(formData.get('autoPlayInterval')) || 5000,
      isActive: true,
    };

    try {
      await createHeroSection(data);
      showSuccess('created', t('pages.heroSection.title'));
      setShowCreateForm(false);
      fetchHeroSection();
    } catch (error) {
      console.error('Error creating hero section:', error);
      showError('failedToCreate', t('pages.heroSection.title'));
    }
  };

  const handleUpdateGeneral = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      descriptionEn: formData.get('descriptionEn'),
      descriptionAr: formData.get('descriptionAr'),
      buttonTextEn: formData.get('buttonTextEn'),
      buttonTextAr: formData.get('buttonTextAr'),
      buttonLink: formData.get('buttonLink'),
      autoPlayInterval: parseInt(formData.get('autoPlayInterval')) || 5000,
    };

    try {
      await updateHeroSection(heroSection.id, data);
      showSuccess('updated', t('pages.heroSection.title'));
      fetchHeroSection();
    } catch (error) {
      console.error('Error updating hero section:', error);
      showError('failedToUpdate', t('pages.heroSection.title'));
    }
  };

  const handleMediaUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get('file');
    const type = formData.get('type');
    const order = parseInt(formData.get('order')) || 0;

    if (!file) {
      showError('pleaseSelectFile', t('form.pleaseSelectFile'));
      return;
    }

    try {
      await uploadHeroMedia(heroSection.id, file, type, order);
      showSuccess('uploaded', t('common.image'));
      fetchHeroSection();
      e.target.reset();
    } catch (error) {
      console.error('Error uploading media:', error);
      showError('failedToUpload');
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteHeroMedia(mediaId);
      showSuccess('deleted', t('common.image'));
      fetchHeroSection();
    } catch (error) {
      console.error('Error deleting media:', error);
      showError('failedToDelete');
    }
  };

  const handleAddStat = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      numberEn: formData.get('numberEn'),
      numberAr: formData.get('numberAr'),
      labelEn: formData.get('labelEn'),
      labelAr: formData.get('labelAr'),
      descriptionEn: formData.get('descriptionEn'),
      descriptionAr: formData.get('descriptionAr'),
      link: formData.get('link') || null,
      buttonTextEn: formData.get('buttonTextEn') || null,
      buttonTextAr: formData.get('buttonTextAr') || null,
      order: parseInt(formData.get('order')) || 0,
    };

    try {
      await addHeroStat(heroSection.id, data);
      showSuccess('created', t('pages.heroSection.stats'));
      fetchHeroSection();
      e.target.reset();
    } catch (error) {
      console.error('Error adding stat:', error);
      showError('failedToCreate');
    }
  };

  const handleUpdateStat = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      numberEn: formData.get('numberEn'),
      numberAr: formData.get('numberAr'),
      labelEn: formData.get('labelEn'),
      labelAr: formData.get('labelAr'),
      descriptionEn: formData.get('descriptionEn'),
      descriptionAr: formData.get('descriptionAr'),
      link: formData.get('link') || null,
      buttonTextEn: formData.get('buttonTextEn') || null,
      buttonTextAr: formData.get('buttonTextAr') || null,
      order: parseInt(formData.get('order')) || 0,
    };

    try {
      await updateHeroStat(editingStat.id, data);
      showSuccess('updated', t('pages.heroSection.stats'));
      setEditingStat(null);
      fetchHeroSection();
    } catch (error) {
      console.error('Error updating stat:', error);
      showError('failedToUpdate');
    }
  };

  const handleDeleteStat = async (statId) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteHeroStat(statId);
      showSuccess('deleted', t('pages.heroSection.stats'));
      fetchHeroSection();
    } catch (error) {
      console.error('Error deleting stat:', error);
      showError('failedToDelete');
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

  if (!heroSection && !showCreateForm) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-admin-bg)]" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center bg-[var(--color-admin-surface)] rounded-xl shadow-xl p-8 max-w-md border border-[var(--color-admin-border)]">
          <svg className="mx-auto h-16 w-16 text-[var(--color-admin-text-light)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-[var(--color-admin-text)] mb-2">{t('pages.heroSection.noHeroSection')}</h3>
          <p className="text-[var(--color-admin-text-muted)] mb-6">{t('pages.heroSection.noHeroSectionDesc')}</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            + {t('pages.heroSection.createHero')}
          </button>
        </div>
      </div>
    );
  }

  if (!heroSection && showCreateForm) {
    return (
      <div className="min-h-screen bg-[var(--color-admin-bg)] p-4 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-admin-text)] mb-2">{t('pages.heroSection.createHero')}</h1>
            <p className="text-[var(--color-admin-text-muted)]">{t('pages.heroSection.createHeroDesc')}</p>
          </div>

          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.heroSection.generalInfo')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.heroSection.generalInfoDesc')}</p>
            </div>
            <form onSubmit={handleCreateHeroSection} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.titleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="titleEn"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                    placeholder={t('pages.heroSection.enterEnglishTitle')}
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
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    placeholder={t('pages.heroSection.enterArabicTitle')}
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
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-28 resize-none placeholder-[var(--color-admin-text-light)]"
                    placeholder={t('pages.heroSection.enterEnglishDescription')}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.descriptionAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <textarea
                    name="descriptionAr"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-28 resize-none text-right placeholder-[var(--color-admin-text-light)]"
                    placeholder={t('pages.heroSection.enterArabicDescription')}
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.buttonTextEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="buttonTextEn"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                    placeholder={t('pages.heroSection.buttonTextPlaceholder')}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.buttonTextAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="buttonTextAr"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    placeholder={t('pages.heroSection.buttonTextPlaceholderAr')}
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                  {t('pages.heroSection.buttonLinkOptional')} <span className="text-[var(--color-admin-text-muted)] font-normal">({t('common.optional')})</span>
                </label>
                <input
                  type="text"
                  name="buttonLink"
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                  placeholder={t('pages.heroSection.buttonLinkPlaceholder')}
                />
                <p className="text-xs text-[var(--color-admin-text-muted)] mt-2">{t('pages.heroSection.buttonLinkHelp')}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                  {t('pages.heroSection.autoPlayInterval')} <span className="text-[var(--color-admin-text-muted)] font-normal">({t('pages.heroSection.autoPlayIntervalDesc')})</span>
                </label>
                <input
                  type="number"
                  name="autoPlayInterval"
                  defaultValue={5000}
                  min="1000"
                  max="30000"
                  step="500"
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                />
                <p className="text-xs text-[var(--color-admin-text-muted)] mt-2">
                  {t('pages.heroSection.autoPlayIntervalHelp')}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--color-admin-border)] flex gap-4">
                <button
                  type="submit"
                  className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {t('pages.heroSection.createHero')}
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-admin-text)] mb-2">{t('pages.heroSection.title')}</h1>
          <p className="text-[var(--color-admin-text-muted)]">{t('pages.heroSection.description')}</p>
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
            {t('pages.heroSection.general')}
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'media'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.heroSection.media')} <span className="ml-1 opacity-80">({heroSection.mediaItems?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'stats'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.heroSection.stats')} <span className="ml-1 opacity-80">({heroSection.stats?.length || 0})</span>
          </button>
        </div>

        {/* General Info Tab */}
        {activeTab === 'general' && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.heroSection.generalInfo')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.heroSection.generalInfoDesc')}</p>
            </div>
            <form onSubmit={handleUpdateGeneral} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.titleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="titleEn"
                    defaultValue={heroSection.titleEn}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                    placeholder={t('pages.heroSection.enterEnglishTitle')}
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
                    defaultValue={heroSection.titleAr}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    placeholder={t('pages.heroSection.enterArabicTitle')}
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
                    defaultValue={heroSection.descriptionEn}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-28 resize-none placeholder-[var(--color-admin-text-light)]"
                    placeholder={t('pages.heroSection.enterEnglishDescription')}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.descriptionAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <textarea
                    name="descriptionAr"
                    defaultValue={heroSection.descriptionAr}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-28 resize-none text-right placeholder-[var(--color-admin-text-light)]"
                    placeholder={t('pages.heroSection.enterArabicDescription')}
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.buttonTextEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="buttonTextEn"
                    defaultValue={heroSection.buttonTextEn}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                    placeholder={t('pages.heroSection.buttonTextPlaceholder')}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.buttonTextAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="buttonTextAr"
                    defaultValue={heroSection.buttonTextAr}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    placeholder={t('pages.heroSection.buttonTextPlaceholderAr')}
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                  {t('pages.heroSection.buttonLinkOptional')} <span className="text-[var(--color-admin-text-muted)] font-normal">({t('common.optional')})</span>
                </label>
                <input
                  type="text"
                  name="buttonLink"
                  defaultValue={heroSection.buttonLink || ''}
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                  placeholder={t('pages.heroSection.buttonLinkPlaceholder')}
                />
                <p className="text-xs text-[var(--color-admin-text-muted)] mt-2">{t('pages.heroSection.buttonLinkHelp')}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                  {t('pages.heroSection.autoPlayInterval')} <span className="text-[var(--color-admin-text-muted)] font-normal">({t('pages.heroSection.autoPlayIntervalDesc')})</span>
                </label>
                <input
                  type="number"
                  name="autoPlayInterval"
                  defaultValue={heroSection.autoPlayInterval || 5000}
                  min="1000"
                  max="30000"
                  step="500"
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                />
                <p className="text-xs text-[var(--color-admin-text-muted)] mt-2">
                  {t('pages.heroSection.autoPlayIntervalHelp')}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--color-admin-border)]">
                <button
                  type="submit"
                  className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {t('pages.heroSection.saveChanges')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-info)]/10 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.heroSection.mediaManagement')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.heroSection.mediaManagementDesc')}</p>
            </div>
            
            {/* Upload Form */}
            <form onSubmit={handleMediaUpload} className="m-6 p-6 bg-gradient-to-br from-[var(--color-admin-info)]/10 to-[var(--color-admin-primary-light)] rounded-xl border-2 border-dashed border-[var(--color-admin-primary)]/30">
              <h3 className="text-lg font-semibold text-[var(--color-admin-text)] mb-4">{t('pages.heroSection.uploadNewMedia')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    File <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="file"
                    name="file"
                    accept="image/*,video/*"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)] hover:file:bg-[var(--color-admin-primary)]/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    Type <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <select name="type" className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all" required>
                    <option value="video">Video</option>
                    <option value="image">Image</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">Order</label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={heroSection.mediaItems?.length || 0}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    min="0"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 bg-gradient-to-r from-[var(--color-admin-success)] to-[var(--color-admin-accent)] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all shadow-md transform hover:-translate-y-0.5"
              >
                Upload Media
              </button>
            </form>

            {/* Media List */}
            <div className="p-6">
              {heroSection.mediaItems?.length === 0 ? (
                <div className="text-center py-16 bg-[var(--color-admin-muted)] rounded-xl border-2 border-dashed border-[var(--color-admin-border)]">
                  <svg className="mx-auto h-16 w-16 text-[var(--color-admin-text-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-4 text-sm font-medium text-[var(--color-admin-text)]">{t('pages.heroSection.noMediaUploadedYet')}</p>
                  <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">{t('pages.heroSection.uploadFirstMedia')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {heroSection.mediaItems?.map((media) => (
                    <div key={media.id} className="group border border-[var(--color-admin-border)] rounded-xl overflow-hidden hover:shadow-xl transition-all bg-[var(--color-admin-surface)]">
                      <div className="relative">
                        <span className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-semibold z-10 uppercase">
                          {media.type}
                        </span>
                        <span className="absolute top-3 left-3 bg-[var(--color-admin-primary)] text-white text-xs px-3 py-1.5 rounded-full font-semibold z-10">
                          #{media.order}
                        </span>
                        {media.type === 'video' ? (
                          <video
                            src={`http://localhost:5000${media.url}`}
                            className="w-full h-52 object-cover"
                            controls
                          />
                        ) : (
                          <img
                            src={`http://localhost:5000${media.url}`}
                            alt="Hero media"
                            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <button
                          onClick={() => handleDeleteMedia(media.id)}
                          className="w-full bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)] px-4 py-2.5 rounded-lg font-semibold hover:bg-[var(--color-admin-danger)]/20 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-purple)]/10 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.heroSection.statisticsManagement')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.heroSection.statisticsManagementDesc')}</p>
            </div>
            
            {/* Add Stat Form */}
            <form onSubmit={handleAddStat} className="m-6 p-6 bg-gradient-to-br from-[var(--color-admin-purple)]/10 to-[var(--color-admin-primary-light)] rounded-xl border-2 border-dashed border-[var(--color-admin-purple)]/30">
              <h3 className="text-lg font-semibold text-[var(--color-admin-text)] mb-4">{t('pages.heroSection.addNewStatistic')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.heroSection.numberEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="numberEn"
                    placeholder={t('pages.heroSection.statNumberPlaceholderEn')}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-purple)] focus:border-[var(--color-admin-purple)] transition-all placeholder-[var(--color-admin-text-light)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.heroSection.numberAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="numberAr"
                    placeholder={t('pages.heroSection.statNumberPlaceholderAr')}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-purple)] focus:border-[var(--color-admin-purple)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    dir="rtl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.heroSection.labelEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="labelEn"
                    placeholder={t('pages.heroSection.statLabelPlaceholderEn')}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-purple)] focus:border-[var(--color-admin-purple)] transition-all placeholder-[var(--color-admin-text-light)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.heroSection.labelAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="labelAr"
                    placeholder={t('pages.heroSection.statLabelPlaceholderAr')}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-purple)] focus:border-[var(--color-admin-purple)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    dir="rtl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.heroSection.statDescriptionEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="descriptionEn"
                    placeholder={t('pages.heroSection.statDescriptionPlaceholderEn')}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-purple)] focus:border-[var(--color-admin-purple)] transition-all placeholder-[var(--color-admin-text-light)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.heroSection.statDescriptionAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="descriptionAr"
                    placeholder={t('pages.heroSection.statDescriptionPlaceholderAr')}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-purple)] focus:border-[var(--color-admin-purple)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    dir="rtl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.heroSection.statLink')} <span className="text-[var(--color-admin-text-muted)] font-normal">({t('common.optional')})</span>
                  </label>
                  <input
                    type="text"
                    name="link"
                    placeholder={t('pages.heroSection.statLinkPlaceholder')}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-purple)] focus:border-[var(--color-admin-purple)] transition-all placeholder-[var(--color-admin-text-light)]"
                  />
                  <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">{t('pages.heroSection.statLinkHelp')}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.heroSection.statButtonTextEn')} <span className="text-[var(--color-admin-text-muted)] font-normal">({t('common.optional')})</span>
                  </label>
                  <input
                    type="text"
                    name="buttonTextEn"
                    placeholder={t('pages.heroSection.statButtonTextPlaceholderEn')}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-purple)] focus:border-[var(--color-admin-purple)] transition-all placeholder-[var(--color-admin-text-light)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.heroSection.statButtonTextAr')} <span className="text-[var(--color-admin-text-muted)] font-normal">({t('common.optional')})</span>
                  </label>
                  <input
                    type="text"
                    name="buttonTextAr"
                    placeholder={t('pages.heroSection.statButtonTextPlaceholderAr')}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-purple)] focus:border-[var(--color-admin-purple)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.heroSection.statOrder')}</label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={heroSection.stats?.length || 0}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-purple)] focus:border-[var(--color-admin-purple)] transition-all"
                    min="0"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 bg-gradient-to-r from-[var(--color-admin-purple)] to-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all shadow-md transform hover:-translate-y-0.5"
              >
                {t('pages.heroSection.addStat')}
              </button>
            </form>

            {/* Stats List */}
            <div className="p-6">
              {heroSection.stats?.length === 0 ? (
                <div className="text-center py-16 bg-[var(--color-admin-muted)] rounded-xl border-2 border-dashed border-[var(--color-admin-border)]">
                  <svg className="mx-auto h-16 w-16 text-[var(--color-admin-text-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="mt-4 text-sm font-medium text-[var(--color-admin-text)]">{t('pages.heroSection.noStatisticsYet')}</p>
                  <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">{t('pages.heroSection.addFirstStatistic')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {heroSection.stats?.map((stat, index) => (
                    <div key={stat.id} className="group border border-[var(--color-admin-border)] rounded-xl p-6 bg-gradient-to-br from-[var(--color-admin-surface)] to-[var(--color-admin-muted)] hover:shadow-xl transition-all">
                      {editingStat?.id === stat.id ? (
                        // Edit Form
                        <form onSubmit={handleUpdateStat} className="space-y-4">
                          <div className="flex items-start justify-between mb-4">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--color-admin-primary)]/10 text-[var(--color-admin-primary)]">
                              {t('pages.heroSection.statOrder')}: {stat.order}
                            </span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingStat(null)}
                                className="text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] text-sm font-semibold hover:bg-[var(--color-admin-muted)] px-3 py-1.5 rounded-lg transition-colors"
                              >
                                {t('common.cancel')}
                              </button>
                              <button
                                type="submit"
                                className="bg-[var(--color-admin-primary)] text-white text-sm font-semibold hover:bg-[var(--color-admin-primary-dark)] px-3 py-1.5 rounded-lg transition-colors"
                              >
                                {t('common.save')}
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-[var(--color-admin-text)] mb-1">
                                {t('pages.heroSection.numberEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                              </label>
                              <input
                                type="text"
                                name="numberEn"
                                defaultValue={stat.numberEn}
                                className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-sm"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[var(--color-admin-text)] mb-1">
                                {t('pages.heroSection.numberAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                              </label>
                              <input
                                type="text"
                                name="numberAr"
                                defaultValue={stat.numberAr}
                                className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-sm text-right"
                                dir="rtl"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[var(--color-admin-text)] mb-1">
                                {t('pages.heroSection.labelEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                              </label>
                              <input
                                type="text"
                                name="labelEn"
                                defaultValue={stat.labelEn}
                                className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-sm"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[var(--color-admin-text)] mb-1">
                                {t('pages.heroSection.labelAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                              </label>
                              <input
                                type="text"
                                name="labelAr"
                                defaultValue={stat.labelAr}
                                className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-sm text-right"
                                dir="rtl"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[var(--color-admin-text)] mb-1">
                                {t('pages.heroSection.statDescriptionEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                              </label>
                              <input
                                type="text"
                                name="descriptionEn"
                                defaultValue={stat.descriptionEn}
                                className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-sm"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[var(--color-admin-text)] mb-1">
                                {t('pages.heroSection.statDescriptionAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                              </label>
                              <input
                                type="text"
                                name="descriptionAr"
                                defaultValue={stat.descriptionAr}
                                className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-sm text-right"
                                dir="rtl"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[var(--color-admin-text)] mb-1">
                                {t('pages.heroSection.statLink')} <span className="text-[var(--color-admin-text-muted)] font-normal">({t('common.optional')})</span>
                              </label>
                              <input
                                type="text"
                                name="link"
                                defaultValue={stat.link || ''}
                                placeholder={t('pages.heroSection.statLinkPlaceholder')}
                                className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[var(--color-admin-text)] mb-1">
                                {t('pages.heroSection.statButtonTextEn')} <span className="text-[var(--color-admin-text-muted)] font-normal">({t('common.optional')})</span>
                              </label>
                              <input
                                type="text"
                                name="buttonTextEn"
                                defaultValue={stat.buttonTextEn || ''}
                                placeholder={t('pages.heroSection.statButtonTextPlaceholderEn')}
                                className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[var(--color-admin-text)] mb-1">
                                {t('pages.heroSection.statButtonTextAr')} <span className="text-[var(--color-admin-text-muted)] font-normal">({t('common.optional')})</span>
                              </label>
                              <input
                                type="text"
                                name="buttonTextAr"
                                defaultValue={stat.buttonTextAr || ''}
                                placeholder={t('pages.heroSection.statButtonTextPlaceholderAr')}
                                className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-sm text-right"
                                dir="rtl"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[var(--color-admin-text)] mb-1">{t('pages.heroSection.statOrder')}</label>
                              <input
                                type="number"
                                name="order"
                                defaultValue={stat.order}
                                className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-sm"
                                min="0"
                              />
                            </div>
                          </div>
                        </form>
                      ) : (
                        // Display View
                        <>
                          <div className="flex items-start justify-between mb-4">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--color-admin-primary)]/10 text-[var(--color-admin-primary)]">
                              {t('pages.heroSection.statOrder')}: {stat.order}
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingStat(stat)}
                                className="text-[var(--color-admin-primary)] hover:text-[var(--color-admin-primary-dark)] text-sm font-semibold hover:bg-[var(--color-admin-primary)]/10 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteStat(stat.id)}
                                className="text-[var(--color-admin-danger)] hover:text-[var(--color-admin-danger)] text-sm font-semibold hover:bg-[var(--color-admin-danger)]/10 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-[var(--color-admin-text-muted)] mb-1 uppercase tracking-wider">Number (EN)</p>
                                <p className="font-bold text-xl text-[var(--color-admin-text)]">{stat.numberEn}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-[var(--color-admin-text-muted)] mb-1 uppercase tracking-wider">Number (AR)</p>
                                <p className="font-bold text-xl text-[var(--color-admin-text)]" dir="rtl">{stat.numberAr}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-[var(--color-admin-text-muted)] mb-1 uppercase tracking-wider">Label (EN)</p>
                                <p className="text-sm font-semibold text-[var(--color-admin-text)]">{stat.labelEn}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-[var(--color-admin-text-muted)] mb-1 uppercase tracking-wider">Label (AR)</p>
                                <p className="text-sm font-semibold text-[var(--color-admin-text)]" dir="rtl">{stat.labelAr}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--color-admin-border)]">
                              <div>
                                <p className="text-xs text-[var(--color-admin-text-muted)] mb-1 uppercase tracking-wider">Description (EN)</p>
                                <p className="text-sm text-[var(--color-admin-text)]">{stat.descriptionEn}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-[var(--color-admin-text-muted)] mb-1 uppercase tracking-wider">Description (AR)</p>
                                <p className="text-sm text-[var(--color-admin-text)]" dir="rtl">{stat.descriptionAr}</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
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

export default HeroSectionManager;

