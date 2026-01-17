import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Menu } from 'lucide-react';
import {
  getProjectsPageSettings,
  updateProjectsPageSettings,
  getAllHeroButtons,
  createHeroButton,
  updateHeroButton,
  deleteHeroButton,
} from '../api/projectsPage';
import { showSuccess, showError, showConfirm } from '../utils/i18nHelpers';

const ProjectsPageManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [pageSettings, setPageSettings] = useState(null);
  const [heroButtons, setHeroButtons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('settings'); // 'settings', 'buttons'
  const [editingButton, setEditingButton] = useState(null);
  const [showButtonForm, setShowButtonForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsData, buttonsData] = await Promise.all([
        getProjectsPageSettings(),
        getAllHeroButtons(),
      ]);
      setPageSettings(settingsData.data || settingsData);
      setHeroButtons(buttonsData.data || []);
    } catch (error) {
      console.error('Error fetching projects page data:', error);
      showError('failedToLoad', t('sidebar.projectsPage'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePageSettings = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const heroImageFile = formData.get('heroImage');
    
    const data = {
      heroTitleEn: formData.get('heroTitleEn'),
      heroTitleAr: formData.get('heroTitleAr'),
      heroDescriptionEn: formData.get('heroDescriptionEn') || '',
      heroDescriptionAr: formData.get('heroDescriptionAr') || '',
      heroImage: heroImageFile instanceof File && heroImageFile.size > 0 ? heroImageFile : null,
      heroImageUrl: pageSettings?.heroImageUrl || null,
    };

    try {
      await updateProjectsPageSettings(data);
      showSuccess('updated', t('sidebar.projectsPage'));
      fetchData();
    } catch (error) {
      console.error('Error updating page settings:', error);
      showError('failedToUpdate', t('sidebar.projectsPage'));
    }
  };

  const handleCreateButton = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      textEn: formData.get('textEn'),
      textAr: formData.get('textAr'),
      link: formData.get('link') || '',
      order: parseInt(formData.get('order')) || heroButtons.length,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      await createHeroButton(data);
      showSuccess('created', t('pages.projectsPage.heroButton'));
      fetchData();
      setShowButtonForm(false);
      e.target.reset();
    } catch (error) {
      console.error('Error creating hero button:', error);
      showError('failedToCreate', t('pages.projectsPage.heroButton'));
    }
  };

  const handleUpdateButton = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      textEn: formData.get('textEn'),
      textAr: formData.get('textAr'),
      link: formData.get('link') || '',
      order: parseInt(formData.get('order')) || 0,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      await updateHeroButton(editingButton.id, data);
      showSuccess('updated', t('pages.projectsPage.heroButton'));
      fetchData();
      setEditingButton(null);
      setShowButtonForm(false);
    } catch (error) {
      console.error('Error updating hero button:', error);
      showError('failedToUpdate', t('pages.projectsPage.heroButton'));
    }
  };

  const handleDeleteButton = async (id) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteHeroButton(id);
      showSuccess('deleted', t('pages.projectsPage.heroButton'));
      fetchData();
    } catch (error) {
      console.error('Error deleting hero button:', error);
      showError('failedToDelete', t('pages.projectsPage.heroButton'));
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

  return (
    <div className="min-h-screen bg-[var(--color-admin-bg)] p-4 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-admin-text)] mb-2">{t('sidebar.projectsPage')}</h1>
          <p className="text-[var(--color-admin-text-muted)]">{t('pages.projectsPage.description')}</p>
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
            {t('pages.projectsPage.heroSettings')}
          </button>
          <button
            onClick={() => setActiveTab('buttons')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'buttons'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.projectsPage.heroButtons')} <span className={isRTL ? 'mr-1' : 'ml-1'} style={{ opacity: 0.8 }}>({heroButtons.length})</span>
          </button>
        </div>

        {/* Settings Tab */}
        {activeTab === 'settings' && pageSettings && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.projectsPage.heroSectionSettings')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.projectsPage.description')}</p>
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
                      src={getImageUrl(pageSettings.heroImageUrl)}
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

        {/* Hero Buttons Tab */}
        {activeTab === 'buttons' && (
          <>
            {/* Add Button */}
            {!showButtonForm && !editingButton && (
              <div className="mb-6">
                <button
                  onClick={() => setShowButtonForm(true)}
                  className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  + {t('pages.projectsPage.addHeroButton')}
                </button>
              </div>
            )}

            {/* Create/Edit Form */}
            {(showButtonForm || editingButton) && (
              <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden mb-6">
                <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
                  <h2 className="text-xl font-bold text-[var(--color-admin-text)]">
                    {editingButton ? t('pages.projectsPage.editHeroButton') : t('pages.projectsPage.addHeroButton')}
                  </h2>
                </div>
                <form onSubmit={editingButton ? handleUpdateButton : handleCreateButton} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('form.buttonTextEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="textEn"
                        defaultValue={editingButton?.textEn || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        placeholder="e.g., Our Vision"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('form.buttonTextAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="textAr"
                        defaultValue={editingButton?.textAr || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                        placeholder="مثال: رؤيتنا"
                        dir="rtl"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('form.link')} ({t('common.optional')})
                      </label>
                      <input
                        type="text"
                        name="link"
                        defaultValue={editingButton?.link || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        placeholder="e.g., /about or https://example.com"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                          {t('form.order')}
                        </label>
                        <input
                          type="number"
                          name="order"
                          defaultValue={editingButton?.order || heroButtons.length}
                          className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                          min="0"
                        />
                      </div>
                      <div className="flex items-center gap-4 pt-6">
                        <input
                          type="checkbox"
                          name="isActive"
                          id="isActive"
                          defaultChecked={editingButton?.isActive !== false}
                          className="w-5 h-5 rounded border-[var(--color-admin-border)] text-[var(--color-admin-primary)] focus:ring-[var(--color-admin-primary)]"
                        />
                        <label htmlFor="isActive" className="text-sm font-semibold text-[var(--color-admin-text)]">
                          {t('common.active')}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--color-admin-border)] flex gap-4">
                    <button
                      type="submit"
                      className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      {editingButton ? t('pages.projectsPage.updateButton') : t('pages.projectsPage.createButton')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowButtonForm(false);
                        setEditingButton(null);
                      }}
                      className="bg-[var(--color-admin-muted)] text-[var(--color-admin-text)] px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-border)] transition-all"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Buttons List */}
            <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
              <div className="p-6 border-b border-[var(--color-admin-border)]">
                <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.projectsPage.heroButtons')}</h2>
              </div>
              <div className="p-6">
                {heroButtons.length === 0 ? (
                  <div className="text-center py-16 bg-[var(--color-admin-muted)] rounded-xl border-2 border-dashed border-[var(--color-admin-border)]">
                    <p className="text-sm font-medium text-[var(--color-admin-text)]">{t('pages.projectsPage.noHeroButtonsYet')}</p>
                    <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">{t('pages.projectsPage.getStarted')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {heroButtons.map((button) => (
                      <div
                        key={button.id}
                        className="border border-[var(--color-admin-border)] rounded-xl p-4 bg-[var(--color-admin-surface)] hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-[var(--color-admin-primary)]/10 flex items-center justify-center">
                              <Menu size={16} className="text-[var(--color-admin-primary)]" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="bg-[var(--color-admin-primary)] text-white text-xs px-3 py-1.5 rounded-full font-semibold">
                                  #{button.order}
                                </span>
                                <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                                  button.isActive ? 'bg-[var(--color-admin-success)] text-white' : 'bg-[var(--color-admin-text-muted)] text-white'
                                }`}>
                                  {button.isActive ? t('common.active') : t('common.inactive')}
                                </span>
                              </div>
                              <p className="font-semibold text-[var(--color-admin-text)]">{button.textEn}</p>
                              <p className="text-sm text-[var(--color-admin-text-muted)]" dir="rtl">{button.textAr}</p>
                              {button.link && (
                                <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">{t('form.link')}: {button.link}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingButton(button);
                                setShowButtonForm(true);
                              }}
                              className="bg-[var(--color-admin-primary-light)] text-[var(--color-admin-primary)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-primary)]/20 transition-all flex items-center gap-2"
                            >
                              <Edit size={16} />
                              {t('common.edit')}
                            </button>
                            <button
                              onClick={() => handleDeleteButton(button.id)}
                              className="bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-danger)]/20 transition-all flex items-center gap-2"
                            >
                              <Trash2 size={16} />
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
      </div>
    </div>
  );
};

export default ProjectsPageManager;










