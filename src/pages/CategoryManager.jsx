import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesSectionSettings,
  updateCategoriesSectionSettings,
} from '../api/category';
import { showSuccess, showError, showConfirm, t } from '../utils/i18nHelpers';

const CategoryManager = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [categories, setCategories] = useState([]);
  const [sectionSettings, setSectionSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('categories'); // 'categories', 'general'
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesResponse, settingsResponse] = await Promise.all([getAllCategories(), getCategoriesSectionSettings()]);
      setCategories(categoriesResponse.data || []);
      setSectionSettings(settingsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      showError('failedToLoad', t('sidebar.categories'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      sectionTitleEn: formData.get('sectionTitleEn'),
      sectionTitleAr: formData.get('sectionTitleAr'),
      sectionSubtitleEn: formData.get('sectionSubtitleEn') || null,
      sectionSubtitleAr: formData.get('sectionSubtitleAr') || null,
    };

    try {
      await updateCategoriesSectionSettings(data);
      showSuccess('updated', t('sidebar.categories'));
      fetchData();
    } catch (error) {
      console.error('Error updating section settings:', error);
      showError('failedToUpdate', t('sidebar.categories'));
    }
  };

  const handleCreateCategory = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get('image');

    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      productCount: parseInt(formData.get('productCount')) || 0,
      gridClasses: formData.get('gridClasses'),
      order: parseInt(formData.get('order')) || 0,
      isActive: formData.get('isActive') === 'on',
      image: file instanceof File && file.size > 0 ? file : null,
    };

    try {
      await createCategory(data);
      showSuccess('created', t('sidebar.categories'));
      fetchData();
      setShowForm(false);
      e.target.reset();
    } catch (error) {
      console.error('Error creating category:', error);
      showError('failedToCreate', t('sidebar.categories'));
    }
  };

  const handleUpdateCategory = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get('image');

    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      productCount: parseInt(formData.get('productCount')) || 0,
      gridClasses: formData.get('gridClasses'),
      order: parseInt(formData.get('order')) || 0,
      isActive: formData.get('isActive') === 'on',
    };

    if (file instanceof File && file.size > 0) {
      data.image = file;
    }

    try {
      await updateCategory(editingCategory.id, data);
      showSuccess('updated', t('sidebar.categories'));
      fetchData();
      setEditingCategory(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating category:', error);
      showError('failedToUpdate', t('sidebar.categories'));
    }
  };

  const handleDeleteCategory = async id => {
    if (!showConfirm('delete')) return;

    try {
      await deleteCategory(id);
      showSuccess('deleted', t('sidebar.categories'));
      fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
      showError('failedToDelete', t('sidebar.categories'));
    }
  };

  const getImageUrl = imageUrl => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:5000${imageUrl}`;
  };

  // Common grid classes options
  const gridClassesOptions = [
    { value: 'col-span-2 row-span-2', label: 'Large (2x2)' },
    { value: 'col-span-2 col-start-3 row-start-1', label: 'Wide Top (2x1)' },
    { value: 'col-span-2 row-span-2 col-start-3 row-start-2', label: 'Large Right (2x2)' },
    { value: 'row-span-2 col-start-1 row-start-3', label: 'Tall Left (1x2)' },
    { value: 'col-span-3 col-start-2 row-start-4', label: 'Wide Bottom (3x1)' },
    { value: 'col-start-2 row-start-3', label: 'Small (1x1)' },
  ];

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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-admin-text)] mb-2">{t('sidebar.categories')}</h1>
              <p className="text-[var(--color-admin-text-muted)]">{t('pages.categories.description')}</p>
            </div>
            {activeTab === 'categories' && (
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setShowForm(true);
                }}
                className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                + {t('common.add')} {t('sidebar.categories')}
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className={`flex gap-2 border-b border-[var(--color-admin-border)] `}>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'categories'
                  ? 'text-[var(--color-admin-primary)] border-b-2 border-[var(--color-admin-primary)]'
                  : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)]'
              }`}
            >
              {t('sidebar.categories')}
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'general'
                  ? 'text-[var(--color-admin-primary)] border-b-2 border-[var(--color-admin-primary)]'
                  : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)]'
              }`}
            >
              {t('pages.categories.generalInfo')}
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent flex items-center justify-between">
                <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{editingCategory ? t('pages.categories.editCategory') : t('pages.categories.createNewCategory')}</h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingCategory(null);
                  }}
                  className="text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] transition-colors"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('form.titleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                    </label>
                    <input
                      type="text"
                      name="titleEn"
                      defaultValue={editingCategory?.titleEn || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                      placeholder="e.g., Personal Protective Equipment"
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
                      defaultValue={editingCategory?.titleAr || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                      placeholder="مثال: معدات الحماية الشخصية"
                      dir="rtl"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.categories.productCount')} <span className="text-[var(--color-admin-danger)]">*</span>
                    </label>
                    <input
                      type="number"
                      name="productCount"
                      defaultValue={editingCategory?.productCount || 0}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.categories.order')} <span className="text-[var(--color-admin-text-muted)] font-normal">{t('pages.categories.displayOrder')}</span>
                    </label>
                    <input
                      type="number"
                      name="order"
                      defaultValue={editingCategory?.order || 0}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.categories.gridClasses')} <span className="text-[var(--color-admin-danger)]">*</span>
                    <span className="text-[var(--color-admin-text-muted)] font-normal ml-2">{t('pages.categories.layoutPosition')}</span>
                  </label>
                  <select
                    name="gridClasses"
                    defaultValue={editingCategory?.gridClasses || ''}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    required
                  >
                    <option value="">{t('pages.categories.selectGridLayout')}</option>
                    {gridClassesOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-[var(--color-admin-text-muted)] mt-2">{t('pages.categories.chooseGridAppearance')}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('common.image')} {!editingCategory && <span className="text-[var(--color-admin-danger)]">*</span>}
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)] hover:file:bg-[var(--color-admin-primary)]/20"
                    required={!editingCategory}
                  />
                  {editingCategory?.imageUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">{t('pages.categories.currentImage')}</p>
                      <img
                        src={getImageUrl(editingCategory.imageUrl)}
                        alt={editingCategory.titleEn}
                        className="w-32 h-32 object-cover rounded-lg border border-[var(--color-admin-border)]"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    defaultChecked={editingCategory?.isActive !== false}
                    className="w-5 h-5 rounded border-[var(--color-admin-border)] text-[var(--color-admin-primary)] focus:ring-[var(--color-admin-primary)]"
                  />
                  <label htmlFor="isActive" className="text-sm font-semibold text-[var(--color-admin-text)]">
                    {t('pages.categories.activeVisible')}
                  </label>
                </div>

                <div className={`pt-4 border-t border-[var(--color-admin-border)] flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    type="submit"
                    className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    {editingCategory ? t('pages.categories.updateCategory') : t('pages.categories.createCategory')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingCategory(null);
                    }}
                    className="bg-[var(--color-admin-muted)] text-[var(--color-admin-text)] px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-border)] transition-all"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* General Info Tab */}
        {activeTab === 'general' && sectionSettings && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.categories.generalInformation')}</h2>
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
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('form.sectionSubtitleEn')}</label>
                  <input
                    type="text"
                    name="sectionSubtitleEn"
                    defaultValue={sectionSettings.sectionSubtitleEn || ''}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('form.sectionSubtitleAr')}</label>
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

        {/* Categories List */}
        {activeTab === 'categories' && categories.length === 0 ? (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-[var(--color-admin-text-light)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-bold text-[var(--color-admin-text)] mb-2">{t('pages.categories.noCategoriesYet')}</h3>
            <p className="text-[var(--color-admin-text-muted)] mb-6">{t('pages.categories.getStarted')}</p>
            <button
              onClick={() => {
                setEditingCategory(null);
                setShowForm(true);
              }}
              className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg"
            >
              + {t('pages.categories.createFirstCategory')}
            </button>
          </div>
        ) : (
          activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => (
                <div
                  key={category.id}
                  className="group border border-[var(--color-admin-border)] rounded-xl overflow-hidden hover:shadow-xl transition-all bg-[var(--color-admin-surface)]"
                >
                  <div className="relative">
                    <span
                      className={`absolute top-3 right-3 text-white text-xs px-3 py-1.5 rounded-full font-semibold z-10 ${
                        category.isActive ? 'bg-[var(--color-admin-success)]' : 'bg-[var(--color-admin-text-muted)]'
                      }`}
                    >
                      {category.isActive ? t('common.active') : t('common.inactive')}
                    </span>
                    <span className="absolute top-3 left-3 bg-[var(--color-admin-primary)] text-white text-xs px-3 py-1.5 rounded-full font-semibold z-10">
                      #{category.order}
                    </span>
                    <img
                      src={getImageUrl(category.imageUrl)}
                      alt={category.titleEn}
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-[var(--color-admin-text)] mb-1">{category.titleEn}</h3>
                    <p className="text-sm text-[var(--color-admin-text-muted)] mb-2" dir="rtl">
                      {category.titleAr}
                    </p>
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-[var(--color-admin-text-muted)]">
                        {t('pages.categories.products')}: <span className="font-semibold text-[var(--color-admin-text)]">{category.productCount}</span>
                      </span>
                      <span className="text-xs text-[var(--color-admin-text-light)] bg-[var(--color-admin-muted)] px-2 py-1 rounded">
                        {category.gridClasses}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-[var(--color-admin-border)]">
                      <button
                        onClick={() => {
                          setEditingCategory(category);
                          setShowForm(true);
                        }}
                        className="flex-1 bg-[var(--color-admin-primary-light)] text-[var(--color-admin-primary)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-primary)]/20 transition-all"
                      >
                        {t('common.edit')}
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="flex-1 bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-danger)]/20 transition-all"
                      >
                        {t('common.delete')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
