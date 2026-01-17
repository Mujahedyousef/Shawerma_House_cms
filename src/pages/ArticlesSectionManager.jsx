import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  getSectionSettings,
  updateSectionSettings,
} from '../api/article';
import { showSuccess, showError, showConfirm } from '../utils/i18nHelpers';

const ArticlesSectionManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [articles, setArticles] = useState([]);
  const [sectionSettings, setSectionSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('articles'); // 'articles', 'settings'
  const [editingArticle, setEditingArticle] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [articlesData, settingsData] = await Promise.all([
        getAllArticles(),
        getSectionSettings(),
      ]);
      setArticles(articlesData.data || []);
      setSectionSettings(settingsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      showError('failedToLoad', t('pages.articles.articles'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get('image');
    
    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      date: formData.get('date'),
      link: formData.get('link') || null,
      order: parseInt(formData.get('order')) || 0,
      isActive: formData.get('isActive') === 'on',
      image: file instanceof File && file.size > 0 ? file : null,
    };

    try {
      await createArticle(data);
      showSuccess('created', t('pages.articles.article'));
      fetchData();
      setShowForm(false);
      e.target.reset();
    } catch (error) {
      console.error('Error creating article:', error);
      showError('failedToCreate', t('pages.articles.article'));
    }
  };

  const handleUpdateArticle = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get('image');
    
    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      date: formData.get('date'),
      link: formData.get('link') || null,
      order: parseInt(formData.get('order')) || 0,
      isActive: formData.get('isActive') === 'on',
    };

    if (file instanceof File && file.size > 0) {
      data.image = file;
    }

    try {
      await updateArticle(editingArticle.id, data);
      showSuccess('updated', t('pages.articles.article'));
      fetchData();
      setEditingArticle(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating article:', error);
      showError('failedToUpdate', t('pages.articles.article'));
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteArticle(id);
      showSuccess('deleted', t('pages.articles.article'));
      fetchData();
    } catch (error) {
      console.error('Error deleting article:', error);
      showError('failedToDelete', t('pages.articles.article'));
    }
  };

  const handleUpdateSettings = async (e) => {
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
      showSuccess('updated', t('pages.articles.articles'));
      fetchData();
    } catch (error) {
      console.error('Error updating settings:', error);
      showError('failedToUpdate', t('pages.articles.articles'));
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:5000${imageUrl}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
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
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-admin-text)] mb-2">{t('pages.articles.articles')}</h1>
          <p className="text-[var(--color-admin-text-muted)]">{t('pages.articles.description')}</p>
        </div>

        {/* Tabs */}
        <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] p-1.5 mb-6 inline-flex gap-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'articles'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.articles.articles')} <span className={isRTL ? 'mr-1' : 'ml-1'} style={{ opacity: 0.8 }}>({articles.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'settings'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.articles.pageSettings')}
          </button>
        </div>

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <>
            {/* Add Article Button */}
            {!showForm && !editingArticle && (
              <div className="mb-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  + {t('pages.articles.addArticle')}
                </button>
              </div>
            )}

            {/* Create/Edit Form */}
            {(showForm || editingArticle) && (
              <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden mb-6">
                <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
                  <h2 className="text-xl font-bold text-[var(--color-admin-text)]">
                    {editingArticle ? t('pages.articles.editArticle') : t('pages.articles.addArticle')}
                  </h2>
                </div>
                <form onSubmit={editingArticle ? handleUpdateArticle : handleCreateArticle} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('form.titleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="titleEn"
                        defaultValue={editingArticle?.titleEn || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                        placeholder="e.g., The best types of building materials..."
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
                        defaultValue={editingArticle?.titleAr || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                        placeholder="مثال: أفضل أنواع مواد البناء..."
                        dir="rtl"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.articles.date')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        defaultValue={editingArticle ? formatDate(editingArticle.date) : formatDate(new Date())}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('form.order')} <span className="text-[var(--color-admin-text-muted)] font-normal">({t('pages.categories.displayOrder')})</span>
                      </label>
                      <input
                        type="number"
                        name="order"
                        defaultValue={editingArticle?.order || articles.length}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.articles.link')} <span className="text-[var(--color-admin-text-muted)] font-normal">({t('common.optional')})</span>
                    </label>
                    <input
                      type="text"
                      name="link"
                      defaultValue={editingArticle?.link || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                      placeholder="#article or /article or https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('common.image')} {!editingArticle && <span className="text-[var(--color-admin-danger)]">*</span>}
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)] hover:file:bg-[var(--color-admin-primary)]/20"
                      required={!editingArticle}
                    />
                    {editingArticle?.imageUrl && (
                      <div className="mt-4">
                        <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">{t('pages.solutions.currentImage')}</p>
                        <img
                          src={getImageUrl(editingArticle.imageUrl)}
                          alt={editingArticle.titleEn}
                          className="w-64 h-40 object-cover rounded-lg border border-[var(--color-admin-border)]"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      name="isActive"
                      id="isActive"
                      defaultChecked={editingArticle?.isActive !== false}
                      className="w-5 h-5 rounded border-[var(--color-admin-border)] text-[var(--color-admin-primary)] focus:ring-[var(--color-admin-primary)]"
                    />
                    <label htmlFor="isActive" className="text-sm font-semibold text-[var(--color-admin-text)]">
                      {t('pages.categories.activeVisible')}
                    </label>
                  </div>

                  <div className="pt-4 border-t border-[var(--color-admin-border)] flex gap-4">
                    <button
                      type="submit"
                      className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      {editingArticle ? t('pages.articles.updateArticle') : t('pages.articles.createArticle')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingArticle(null);
                      }}
                      className="bg-[var(--color-admin-muted)] text-[var(--color-admin-text)] px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-border)] transition-all"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Articles List */}
            <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
              <div className="p-6 border-b border-[var(--color-admin-border)]">
                <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.articles.articles')}</h2>
              </div>
              <div className="p-6">
                {articles.length === 0 ? (
                  <div className="text-center py-16 bg-[var(--color-admin-muted)] rounded-xl border-2 border-dashed border-[var(--color-admin-border)]">
                    <svg className="mx-auto h-16 w-16 text-[var(--color-admin-text-light)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-4 text-sm font-medium text-[var(--color-admin-text)]">{t('pages.articles.noArticlesYet')}</p>
                    <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">{t('pages.articles.getStarted')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                      <div
                        key={article.id}
                        className="group border border-[var(--color-admin-border)] rounded-xl overflow-hidden hover:shadow-xl transition-all bg-[var(--color-admin-surface)]"
                      >
                        <div className="relative">
                          <span className={`absolute top-3 right-3 text-white text-xs px-3 py-1.5 rounded-full font-semibold z-10 ${
                            article.isActive ? 'bg-[var(--color-admin-success)]' : 'bg-[var(--color-admin-text-muted)]'
                          }`}>
                            {article.isActive ? t('common.active') : t('common.inactive')}
                          </span>
                          <span className="absolute top-3 left-3 bg-[var(--color-admin-primary)] text-white text-xs px-3 py-1.5 rounded-full font-semibold z-10">
                            #{article.order}
                          </span>
                          <img
                            src={getImageUrl(article.imageUrl)}
                            alt={article.titleEn}
                            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-[var(--color-admin-text)] mb-1">
                            {article.titleEn}
                          </h3>
                          <p className="text-sm text-[var(--color-admin-text-muted)] mb-2" dir="rtl">
                            {article.titleAr}
                          </p>
                          <div className="text-sm text-[var(--color-admin-text-muted)] mb-4">
                            {t('pages.articles.date')}: <span className="font-semibold text-[var(--color-admin-text)]">{formatDate(article.date)}</span>
                          </div>
                          {article.link && (
                            <div className="text-xs text-[var(--color-admin-text-muted)] mb-4">
                              {t('pages.articles.link')}: <span className="font-semibold text-[var(--color-admin-text)] break-all">{article.link}</span>
                            </div>
                          )}
                          <div className="flex gap-2 pt-4 border-t border-[var(--color-admin-border)]">
                            <button
                              onClick={() => {
                                setEditingArticle(article);
                                setShowForm(true);
                              }}
                              className="flex-1 bg-[var(--color-admin-primary-light)] text-[var(--color-admin-primary)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-primary)]/20 transition-all"
                            >
                              {t('common.edit')}
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(article.id)}
                              className="flex-1 bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-danger)]/20 transition-all"
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

        {/* Settings Tab */}
        {activeTab === 'settings' && sectionSettings && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.articles.pageSettings')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.categories.updateSectionTitle')}</p>
            </div>
            <form onSubmit={handleUpdateSettings} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.sectionTitleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="sectionTitleEn"
                    defaultValue={sectionSettings.sectionTitleEn}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
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
                    defaultValue={sectionSettings.sectionTitleAr}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
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
                    defaultValue={sectionSettings.sectionSubtitleEn || ''}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.sectionSubtitleAr')}
                  </label>
                  <input
                    type="text"
                    name="sectionSubtitleAr"
                    defaultValue={sectionSettings.sectionSubtitleAr || ''}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
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
      </div>
    </div>
  );
};

export default ArticlesSectionManager;
