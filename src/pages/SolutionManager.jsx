import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getAllSolutions,
  createSolution,
  updateSolution,
  deleteSolution,
  uploadSolutionImage,
  getSectionSettings,
  updateSectionSettings,
} from '../api/solution';
import { showSuccess, showError, showConfirm, t } from '../utils/i18nHelpers';

const SolutionManager = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [solutions, setSolutions] = useState([]);
  const [sectionSettings, setSectionSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('solutions'); // 'solutions', 'settings'
  const [editingSolution, setEditingSolution] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [solutionsData, settingsData] = await Promise.all([
        getAllSolutions(),
        getSectionSettings(),
      ]);
      setSolutions(solutionsData.data || []);
      setSectionSettings(settingsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      showError('failedToLoad', t('sidebar.solutions'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSolution = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const imageFile = formData.get('image');
    const imageUrl = formData.get('imageUrl') || '';
    
    // Validate that at least one image source is provided
    if (!imageUrl && (!imageFile || imageFile.size === 0)) {
      showError('failedToUpload', t('pages.solutions.provideImage'));
      return;
    }

    // Prepare FormData for the request (reuse the formData, just ensure correct field names)
    const requestFormData = new FormData();
    requestFormData.append('titleEn', formData.get('titleEn'));
    requestFormData.append('titleAr', formData.get('titleAr'));
    requestFormData.append('descriptionEn', formData.get('descriptionEn') || '');
    requestFormData.append('descriptionAr', formData.get('descriptionAr') || '');
    requestFormData.append('height', formData.get('height') || 'h-[632px]');
    
    const tagsValue = formData.get('tags');
    if (tagsValue) {
      requestFormData.append('tags', tagsValue);
    }
    
    const extraCountValue = formData.get('extraCount');
    if (extraCountValue) {
      requestFormData.append('extraCount', extraCountValue);
    }
    
    requestFormData.append('ctaButtonTextEn', formData.get('ctaButtonTextEn') || '');
    requestFormData.append('ctaButtonTextAr', formData.get('ctaButtonTextAr') || '');
    requestFormData.append('ctaButtonLink', formData.get('ctaButtonLink') || '');
    
    requestFormData.append('order', formData.get('order') || solutions.length);
    requestFormData.append('isActive', formData.get('isActive') === 'on' ? 'true' : 'false');
    
    // Add image - prefer file upload over URL
    if (imageFile && imageFile.size > 0) {
      requestFormData.append('image', imageFile);
    } else if (imageUrl) {
      requestFormData.append('imageUrl', imageUrl);
    }

    try {
      const response = await createSolution(requestFormData);
      showSuccess('created', t('sidebar.solutions'));
      fetchData();
      e.target.reset();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating solution:', error);
      showError('failedToCreate', t('sidebar.solutions'));
    }
  };

  const handleUpdateSolution = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Prepare FormData for the request
    const requestFormData = new FormData();
    requestFormData.append('titleEn', formData.get('titleEn'));
    requestFormData.append('titleAr', formData.get('titleAr'));
    requestFormData.append('descriptionEn', formData.get('descriptionEn') || '');
    requestFormData.append('descriptionAr', formData.get('descriptionAr') || '');
    requestFormData.append('height', formData.get('height'));
    
    const tagsValue = formData.get('tags');
    if (tagsValue) {
      requestFormData.append('tags', tagsValue);
    }
    
    const extraCountValue = formData.get('extraCount');
    if (extraCountValue) {
      requestFormData.append('extraCount', extraCountValue);
    }
    
    requestFormData.append('ctaButtonTextEn', formData.get('ctaButtonTextEn') || '');
    requestFormData.append('ctaButtonTextAr', formData.get('ctaButtonTextAr') || '');
    requestFormData.append('ctaButtonLink', formData.get('ctaButtonLink') || '');
    
    requestFormData.append('order', formData.get('order'));
    requestFormData.append('isActive', formData.get('isActive') === 'on' ? 'true' : 'false');
    
    // Add image if provided
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      requestFormData.append('image', imageFile);
    }

    try {
      await updateSolution(editingSolution.id, requestFormData);
      showSuccess('updated', t('sidebar.solutions'));
      fetchData();
      setEditingSolution(null);
    } catch (error) {
      console.error('Error updating solution:', error);
      showError('failedToUpdate', t('sidebar.solutions'));
    }
  };

  const handleDeleteSolution = async (id) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteSolution(id);
      showSuccess('deleted', t('sidebar.solutions'));
      fetchData();
    } catch (error) {
      console.error('Error deleting solution:', error);
      showError('failedToDelete', t('sidebar.solutions'));
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
      showSuccess('updated', t('sidebar.solutions'));
      fetchData();
    } catch (error) {
      console.error('Error updating settings:', error);
      showError('failedToUpdate', t('sidebar.solutions'));
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
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-admin-text)] mb-2">{t('sidebar.solutions')}</h1>
          <p className="text-[var(--color-admin-text-muted)]">{t('pages.solutions.description')}</p>
        </div>

        {/* Tabs */}
        <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] p-1.5 mb-6 inline-flex gap-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab('solutions')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'solutions'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.solutions.solutions')} <span className="ml-1 opacity-80">({solutions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'settings'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.solutions.settings')}
          </button>
        </div>

        {/* Solutions Tab */}
        {activeTab === 'solutions' && (
          <>
            {/* Add Solution Button */}
            {!showForm && !editingSolution && (
              <div className="mb-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  + {t('pages.solutions.addSolution')}
                </button>
              </div>
            )}

            {/* Create/Edit Form */}
            {(showForm || editingSolution) && (
              <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden mb-6">
                <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
                  <h2 className="text-xl font-bold text-[var(--color-admin-text)]">
                    {editingSolution ? t('pages.solutions.editSolution') : t('pages.solutions.addSolution')}
                  </h2>
                </div>
                <form onSubmit={editingSolution ? handleUpdateSolution : handleCreateSolution} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('form.titleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="titleEn"
                        defaultValue={editingSolution?.titleEn}
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
                        defaultValue={editingSolution?.titleAr}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                        dir="rtl"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('form.descriptionEn')}
                      </label>
                      <textarea
                        name="descriptionEn"
                        defaultValue={editingSolution?.descriptionEn || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-28 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('form.descriptionAr')}
                      </label>
                      <textarea
                        name="descriptionAr"
                        defaultValue={editingSolution?.descriptionAr || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-28 resize-none text-right"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.solutions.height')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <select
                        name="height"
                        defaultValue={editingSolution?.height || 'h-[632px]'}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      >
                        <option value="h-[532px]">Medium (532px)</option>
                        <option value="h-[632px]">Tall (632px)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('form.order')}
                      </label>
                      <input
                        type="number"
                        name="order"
                        defaultValue={editingSolution?.order || solutions.length}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.solutions.extraCount')}
                      </label>
                      <input
                        type="number"
                        name="extraCount"
                        defaultValue={editingSolution?.extraCount || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.solutions.tags')} <span className="text-[var(--color-admin-text-muted)] text-xs">e.g., [&#123;"textEn":"Tag1","textAr":"علامة1"&#125;]</span>
                    </label>
                    <textarea
                      name="tags"
                      defaultValue={editingSolution?.tags ? JSON.stringify(editingSolution.tags, null, 2) : ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-24 resize-none font-mono text-sm"
                      placeholder={JSON.stringify([{textEn:"Tag1",textAr:"علامة1"}])}
                    />
                  </div>

                  {/* CTA Button Fields */}
                  <div className="border-t border-[var(--color-admin-border)] pt-6">
                    <h3 className="text-lg font-bold text-[var(--color-admin-text)] mb-4">{t('pages.solutions.ctaButtonSettings')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                          CTA Button Text (English)
                        </label>
                        <input
                          type="text"
                          name="ctaButtonTextEn"
                          defaultValue={editingSolution?.ctaButtonTextEn || ''}
                          className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                          placeholder="EXPLORE SOLUTION"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                          CTA Button Text (Arabic)
                        </label>
                        <input
                          type="text"
                          name="ctaButtonTextAr"
                          defaultValue={editingSolution?.ctaButtonTextAr || ''}
                          className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                          dir="rtl"
                          placeholder="استكشف الحل"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                          CTA Button Link (URL)
                        </label>
                        <input
                          type="text"
                          name="ctaButtonLink"
                          defaultValue={editingSolution?.ctaButtonLink || ''}
                          className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                          placeholder="/products or https://example.com"
                        />
                        <p className="text-xs text-[var(--color-admin-text-muted)] mt-2">
                          Enter a relative path (e.g., /products) or full URL. Leave empty to hide the button.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.solutions.imageUrl')} <span className="text-[var(--color-admin-text-muted)] text-xs">(Optional if uploading file)</span>
                      </label>
                      <input
                        type="text"
                        name="imageUrl"
                        defaultValue={editingSolution?.imageUrl || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        placeholder="http://localhost:5000/uploads/image.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.solutions.or')} {t('pages.solutions.uploadImage')} <span className="text-[var(--color-admin-text-muted)] text-xs">(Optional if providing URL)</span>
                      </label>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)]"
                      />
                      <p className="text-xs text-[var(--color-admin-text-muted)] mt-2">
                        {t('pages.solutions.provideImage')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isActive"
                        defaultChecked={editingSolution?.isActive !== false}
                        className="w-4 h-4 rounded border-[var(--color-admin-border)] text-[var(--color-admin-primary)] focus:ring-[var(--color-admin-primary)]"
                      />
                      <span className="text-sm font-semibold text-[var(--color-admin-text)]">{t('common.active')}</span>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-[var(--color-admin-border)] flex gap-4">
                    <button
                      type="submit"
                      className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      {editingSolution ? t('pages.solutions.updateSolution') : t('pages.solutions.createSolution')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingSolution(null);
                      }}
                      className="bg-[var(--color-admin-muted)] text-[var(--color-admin-text)] px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-border)] transition-all"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Solutions List */}
            <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
              <div className="p-6 border-b border-[var(--color-admin-border)]">
                <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.solutions.solutions')}</h2>
              </div>
              <div className="p-6">
                {solutions.length === 0 ? (
                  <div className="text-center py-16 bg-[var(--color-admin-muted)] rounded-xl border-2 border-dashed border-[var(--color-admin-border)]">
                    <p className="text-sm font-medium text-[var(--color-admin-text)]">{t('pages.solutions.noSolutionsYet')}</p>
                    <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">{t('pages.solutions.getStarted')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {solutions.map((solution) => (
                      <div key={solution.id} className="border border-[var(--color-admin-border)] rounded-xl overflow-hidden hover:shadow-xl transition-all bg-[var(--color-admin-surface)]">
                        <div className="relative">
                          <span className={`absolute top-3 right-3 text-white text-xs px-3 py-1.5 rounded-full font-semibold z-10 ${solution.isActive ? 'bg-[var(--color-admin-success)]' : 'bg-[var(--color-admin-text-muted)]'}`}>
                            {solution.isActive ? t('common.active') : t('common.inactive')}
                          </span>
                          <span className="absolute top-3 left-3 bg-[var(--color-admin-primary)] text-white text-xs px-3 py-1.5 rounded-full font-semibold z-10">
                            #{solution.order}
                          </span>
                          <img
                            src={solution.imageUrl.startsWith('http') ? solution.imageUrl : `http://localhost:5000${solution.imageUrl}`}
                            alt={solution.titleEn}
                            className="w-full h-52 object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-[var(--color-admin-text)] mb-1">{solution.titleEn}</h3>
                          <p className="text-sm text-[var(--color-admin-text-muted)] mb-4" dir="rtl">{solution.titleAr}</p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setEditingSolution(solution);
                                setShowForm(false);
                              }}
                              className="flex-1 bg-[var(--color-admin-primary)]/10 text-[var(--color-admin-primary)] px-4 py-2 rounded-lg font-semibold hover:bg-[var(--color-admin-primary)]/20 transition-colors cursor-pointer"
                            >
                              {t('common.edit')}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteSolution(solution.id);
                              }}
                              className="flex-1 bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)] px-4 py-2 rounded-lg font-semibold hover:bg-[var(--color-admin-danger)]/20 transition-colors cursor-pointer"
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
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.solutions.settings')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.solutions.updateSectionTitle')}</p>
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
                  {t('pages.solutions.saveSettings')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolutionManager;


