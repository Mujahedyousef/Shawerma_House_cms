import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogsPageSettings,
  updateBlogsPageSettings,
} from '../api/blog';
import { getAllBlogCategories, createBlogCategory, updateBlogCategory, deleteBlogCategory } from '../api/blogCategory';
import RichTextEditor from '../components/RichTextEditor';
import { showSuccess, showError, showConfirm } from '../utils/i18nHelpers';

const BlogsPageManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [blogs, setBlogs] = useState([]);
  const [pageSettings, setPageSettings] = useState(null);
  const [blogCategories, setBlogCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('blogs'); // 'blogs', 'settings', 'categories'
  const [editingBlog, setEditingBlog] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [blogContentEn, setBlogContentEn] = useState('');
  const [blogContentAr, setBlogContentAr] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [blogsData, settingsData, categoriesData] = await Promise.all([
        getAllBlogs(),
        getBlogsPageSettings(),
        getAllBlogCategories(),
      ]);
      setBlogs(blogsData.data || []);
      setPageSettings(settingsData.data);
      setBlogCategories(categoriesData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showError('failedToLoad', t('sidebar.blogs'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get('image');
    
    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      descriptionEn: formData.get('descriptionEn') || null,
      descriptionAr: formData.get('descriptionAr') || null,
      contentEn: blogContentEn || null,
      contentAr: blogContentAr || null,
      conclusionEn: formData.get('conclusionEn') || null,
      conclusionAr: formData.get('conclusionAr') || null,
      authorEn: formData.get('authorEn') || null,
      authorAr: formData.get('authorAr') || null,
      date: formData.get('date'),
      link: formData.get('link') || null,
      categoryId: formData.get('categoryId') || null,
      showInHero: formData.get('showInHero') === 'on',
      order: parseInt(formData.get('order')) || 0,
      isActive: formData.get('isActive') === 'on',
      image: file instanceof File && file.size > 0 ? file : null,
    };

    try {
      await createBlog(data);
      showSuccess('created', t('sidebar.blogs'));
      fetchData();
      setShowForm(false);
      setEditingBlog(null);
      setBlogContentEn('');
      setBlogContentAr('');
      e.target.reset();
    } catch (error) {
      console.error('Error creating blog:', error);
      showError('failedToCreate', t('sidebar.blogs'));
    }
  };

  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get('image');
    
    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      descriptionEn: formData.get('descriptionEn') || null,
      descriptionAr: formData.get('descriptionAr') || null,
      contentEn: editingBlog?.contentEn || blogContentEn || null,
      contentAr: editingBlog?.contentAr || blogContentAr || null,
      conclusionEn: formData.get('conclusionEn') || null,
      conclusionAr: formData.get('conclusionAr') || null,
      authorEn: formData.get('authorEn') || null,
      authorAr: formData.get('authorAr') || null,
      date: formData.get('date'),
      link: formData.get('link') || null,
      categoryId: formData.get('categoryId') || null,
      showInHero: formData.get('showInHero') === 'on',
      order: parseInt(formData.get('order')) || 0,
      isActive: formData.get('isActive') === 'on',
    };

    if (file instanceof File && file.size > 0) {
      data.image = file;
    }

    try {
      await updateBlog(editingBlog.id, data);
      showSuccess('updated', t('sidebar.blogs'));
      fetchData();
      setEditingBlog(null);
      setShowForm(false);
      setBlogContentEn('');
      setBlogContentAr('');
    } catch (error) {
      console.error('Error updating blog:', error);
      showError('failedToUpdate', t('sidebar.blogs'));
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteBlog(id);
      showSuccess('deleted', t('sidebar.blogs'));
      fetchData();
    } catch (error) {
      console.error('Error deleting blog:', error);
      showError('failedToDelete', t('sidebar.blogs'));
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      nameEn: formData.get('nameEn'),
      nameAr: formData.get('nameAr'),
      order: parseInt(formData.get('order')) || blogCategories.length,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      await createBlogCategory(data);
      showSuccess('created', t('pages.blogs.category'));
      fetchData();
      setShowCategoryForm(false);
      e.target.reset();
    } catch (error) {
      console.error('Error creating blog category:', error);
      showError('failedToCreate', t('pages.blogs.category'));
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      nameEn: formData.get('nameEn'),
      nameAr: formData.get('nameAr'),
      order: parseInt(formData.get('order')) || 0,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      await updateBlogCategory(editingCategory.id, data);
      showSuccess('updated', t('pages.blogs.category'));
      fetchData();
      setEditingCategory(null);
      setShowCategoryForm(false);
    } catch (error) {
      console.error('Error updating blog category:', error);
      showError('failedToUpdate', t('pages.blogs.category'));
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteBlogCategory(id);
      showSuccess('deleted', t('pages.blogs.category'));
      fetchData();
    } catch (error) {
      console.error('Error deleting blog category:', error);
      showError('failedToDelete', t('pages.blogs.category'));
    }
  };

  const handleCreateStatus = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      nameEn: formData.get('nameEn'),
      nameAr: formData.get('nameAr'),
      order: parseInt(formData.get('order')) || blogStatuses.length,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      await createBlogStatus(data);
      alert('Blog status created successfully!');
      fetchData();
      setShowStatusForm(false);
      e.target.reset();
    } catch (error) {
      console.error('Error creating blog status:', error);
      alert('Failed to create blog status');
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      nameEn: formData.get('nameEn'),
      nameAr: formData.get('nameAr'),
      order: parseInt(formData.get('order')) || 0,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      await updateBlogStatus(editingStatus.id, data);
      alert('Blog status updated successfully!');
      fetchData();
      setEditingStatus(null);
      setShowStatusForm(false);
    } catch (error) {
      console.error('Error updating blog status:', error);
      alert('Failed to update blog status');
    }
  };

  const handleDeleteStatus = async (id) => {
    if (!confirm('Are you sure you want to delete this blog status?')) return;

    try {
      await deleteBlogStatus(id);
      alert('Blog status deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting blog status:', error);
      alert('Failed to delete blog status');
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const heroImageFile = formData.get('heroImage');
    
    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      descriptionEn: formData.get('descriptionEn'),
      descriptionAr: formData.get('descriptionAr'),
      heroSectionDescriptionEn: formData.get('heroSectionDescriptionEn') || null,
      heroSectionDescriptionAr: formData.get('heroSectionDescriptionAr') || null,
      gridSectionTitleEn: formData.get('gridSectionTitleEn') || null,
      gridSectionTitleAr: formData.get('gridSectionTitleAr') || null,
      heroImage: heroImageFile instanceof File && heroImageFile.size > 0 ? heroImageFile : null,
    };

    try {
      await updateBlogsPageSettings(data);
      showSuccess('updated', t('sidebar.blogs'));
      fetchData();
    } catch (error) {
      console.error('Error updating settings:', error);
      showError('failedToUpdate', t('sidebar.blogs'));
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
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-admin-bg)]">
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
          <h1 className="text-3xl font-bold text-[var(--color-admin-text)] mb-2">{t('pages.blogs.title')}</h1>
          <p className="text-[var(--color-admin-text-muted)]">{t('pages.blogs.description')}</p>
        </div>

        {/* Tabs */}
        <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] p-1.5 mb-6 inline-flex gap-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'blogs'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.blogs.blogs')} <span className="ml-1 opacity-80">({blogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'categories'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.blogs.categories')} <span className="ml-1 opacity-80">({blogCategories.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'settings'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.blogs.settings')}
          </button>
        </div>

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <>
            {/* Add Blog Button */}
            {!showForm && !editingBlog && (
              <div className="mb-6">
                <button
                  onClick={() => {
                    setShowForm(true);
                    setBlogContentEn('');
                    setBlogContentAr('');
                  }}
                  className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  + {t('pages.blogs.addBlog')}
                </button>
              </div>
            )}

            {/* Create/Edit Form */}
            {(showForm || editingBlog) && (
              <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden mb-6">
                <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
                  <h2 className="text-xl font-bold text-[var(--color-admin-text)]">
                    {editingBlog ? t('pages.blogs.editBlog') : t('pages.blogs.addBlog')}
                  </h2>
                </div>
                <form onSubmit={editingBlog ? handleUpdateBlog : handleCreateBlog} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('form.titleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="titleEn"
                        defaultValue={editingBlog?.titleEn || ''}
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
                        defaultValue={editingBlog?.titleAr || ''}
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
                        defaultValue={editingBlog?.descriptionEn || ''}
                        rows="4"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all resize-y"
                        placeholder="Enter blog description in English..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('form.descriptionAr')}
                      </label>
                      <textarea
                        name="descriptionAr"
                        defaultValue={editingBlog?.descriptionAr || ''}
                        rows="4"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all resize-y text-right"
                        dir="rtl"
                        placeholder="أدخل وصف المدونة بالعربية..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('form.contentEn')}
                      </label>
                      <RichTextEditor
                        value={editingBlog ? editingBlog.contentEn || '' : blogContentEn}
                        onChange={(content) => {
                          if (editingBlog) {
                            setEditingBlog({ ...editingBlog, contentEn: content });
                          } else {
                            setBlogContentEn(content);
                          }
                        }}
                        placeholder="Write your blog content in English..."
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('form.contentAr')}
                      </label>
                      <RichTextEditor
                        value={editingBlog ? editingBlog.contentAr || '' : blogContentAr}
                        onChange={(content) => {
                          if (editingBlog) {
                            setEditingBlog({ ...editingBlog, contentAr: content });
                          } else {
                            setBlogContentAr(content);
                          }
                        }}
                        placeholder="اكتب محتوى المدونة بالعربية..."
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.blogs.conclusionEn')}
                      </label>
                      <textarea
                        name="conclusionEn"
                        defaultValue={editingBlog?.conclusionEn || ''}
                        rows="4"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all resize-y"
                        placeholder="Enter conclusion in English..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.blogs.conclusionAr')}
                      </label>
                      <textarea
                        name="conclusionAr"
                        defaultValue={editingBlog?.conclusionAr || ''}
                        rows="4"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all resize-y text-right"
                        dir="rtl"
                        placeholder="أدخل الخلاصة بالعربية..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.blogs.authorEn')}
                      </label>
                      <input
                        type="text"
                        name="authorEn"
                        defaultValue={editingBlog?.authorEn || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        placeholder="e.g., John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.blogs.authorAr')}
                      </label>
                      <input
                        type="text"
                        name="authorAr"
                        defaultValue={editingBlog?.authorAr || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                        dir="rtl"
                        placeholder="مثال: أحمد محمد"
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
                        defaultValue={editingBlog ? formatDate(editingBlog.date) : formatDate(new Date())}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.blogs.category')} ({t('common.optional')})
                      </label>
                      <select
                        name="categoryId"
                        defaultValue={editingBlog?.categoryId || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      >
                        <option value="">{t('pages.blogs.noCategory')}</option>
                        {blogCategories
                          .filter(cat => cat.isActive)
                          .map(category => (
                            <option key={category.id} value={category.id}>
                              {category.nameEn} / {category.nameAr}
                            </option>
                          ))}
                      </select>
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
                        defaultValue={editingBlog?.link || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('form.order')}
                      </label>
                      <input
                        type="number"
                        name="order"
                        defaultValue={editingBlog?.order || blogs.length}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('common.image')} {!editingBlog && <span className="text-[var(--color-admin-danger)]">*</span>}
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)]"
                      required={!editingBlog}
                    />
                    {editingBlog?.imageUrl && (
                      <div className="mt-4">
                        <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">{t('pages.servicesPage.currentImage')}</p>
                        <img
                          src={getImageUrl(editingBlog.imageUrl)}
                          alt={editingBlog.titleEn}
                          className="w-64 h-40 object-cover rounded-lg border border-[var(--color-admin-border)]"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        name="showInHero"
                        id="showInHero"
                        defaultChecked={editingBlog?.showInHero === true}
                        className="w-5 h-5 rounded border-[var(--color-admin-border)] text-[var(--color-admin-primary)] focus:ring-[var(--color-admin-primary)]"
                      />
                      <label htmlFor="showInHero" className="text-sm font-semibold text-[var(--color-admin-text)]">
                        {t('pages.blogs.showInHero')}
                      </label>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        name="isActive"
                        id="isActive"
                        defaultChecked={editingBlog?.isActive !== false}
                        className="w-5 h-5 rounded border-[var(--color-admin-border)] text-[var(--color-admin-primary)] focus:ring-[var(--color-admin-primary)]"
                      />
                      <label htmlFor="isActive" className="text-sm font-semibold text-[var(--color-admin-text)]">
                        {t('common.active')} ({t('pages.blogs.visibleOnWebsite')})
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--color-admin-border)] flex gap-4">
                    <button
                      type="submit"
                      className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      {editingBlog ? t('pages.blogs.updateBlog') : t('pages.blogs.createBlog')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingBlog(null);
                        setBlogContentEn('');
                        setBlogContentAr('');
                      }}
                      className="bg-[var(--color-admin-muted)] text-[var(--color-admin-text)] px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-border)] transition-all"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Blogs List */}
            <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
              <div className="p-6 border-b border-[var(--color-admin-border)]">
                <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.blogs.allBlogs')}</h2>
              </div>
              <div className="p-6">
                {blogs.length === 0 ? (
                  <div className="text-center py-16 bg-[var(--color-admin-muted)] rounded-xl border-2 border-dashed border-[var(--color-admin-border)]">
                    <p className="text-sm font-medium text-[var(--color-admin-text)]">{t('pages.blogs.noBlogsYet')}</p>
                    <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">{t('pages.blogs.getStarted')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                      <div
                        key={blog.id}
                        className="group border border-[var(--color-admin-border)] rounded-xl overflow-hidden hover:shadow-xl transition-all bg-[var(--color-admin-surface)]"
                      >
                        <div className="relative">
                          <span className={`absolute top-3 right-3 text-white text-xs px-3 py-1.5 rounded-full font-semibold z-10 ${
                            blog.isActive ? 'bg-[var(--color-admin-success)]' : 'bg-[var(--color-admin-text-muted)]'
                          }`}>
                            {blog.isActive ? t('common.active') : t('common.inactive')}
                          </span>
                          <span className="absolute top-3 left-3 bg-[var(--color-admin-primary)] text-white text-xs px-3 py-1.5 rounded-full font-semibold z-10">
                            #{blog.order}
                          </span>
                          <img
                            src={getImageUrl(blog.imageUrl)}
                            alt={blog.titleEn}
                            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-[var(--color-admin-text)] mb-1">
                            {blog.titleEn}
                          </h3>
                          <p className="text-sm text-[var(--color-admin-text-muted)] mb-2" dir="rtl">
                            {blog.titleAr}
                          </p>
                          {blog.authorEn && (
                            <div className="text-sm text-[var(--color-admin-text-muted)] mb-2">
                              {t('pages.blogs.author')}: <span className="font-semibold text-[var(--color-admin-text)]">{blog.authorEn}</span>
                              {blog.authorAr && (
                                <span className="mx-2">/</span>
                              )}
                              {blog.authorAr && (
                                <span className="font-semibold text-[var(--color-admin-text)]" dir="rtl">{blog.authorAr}</span>
                              )}
                            </div>
                          )}
                          <div className="text-sm text-[var(--color-admin-text-muted)] mb-4">
                            {t('pages.articles.date')}: <span className="font-semibold text-[var(--color-admin-text)]">{formatDate(blog.date)}</span>
                          </div>
                          {blog.link && (
                            <div className="text-xs text-[var(--color-admin-text-muted)] mb-4">
                              {t('form.link')}: <span className="font-semibold text-[var(--color-admin-text)] break-all">{blog.link}</span>
                            </div>
                          )}
                          <div className="flex gap-2 pt-4 border-t border-[var(--color-admin-border)]">
                            <button
                              onClick={() => {
                                setEditingBlog(blog);
                                setBlogContentEn(blog.contentEn || '');
                                setBlogContentAr(blog.contentAr || '');
                                setShowForm(true);
                              }}
                              className="flex-1 bg-[var(--color-admin-primary-light)] text-[var(--color-admin-primary)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-primary)]/20 transition-all"
                            >
                              {t('common.edit')}
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(blog.id)}
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

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <>
            {/* Add Category Button */}
            {!showCategoryForm && !editingCategory && (
              <div className="mb-6">
                <button
                  onClick={() => setShowCategoryForm(true)}
                  className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  + {t('pages.blogs.addCategory')}
                </button>
              </div>
            )}

            {/* Create/Edit Category Form */}
            {(showCategoryForm || editingCategory) && (
              <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden mb-6">
                <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
                  <h2 className="text-xl font-bold text-[var(--color-admin-text)]">
                    {editingCategory ? t('pages.blogs.editCategory') : t('pages.blogs.addCategory')}
                  </h2>
                </div>
                <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('form.nameEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="nameEn"
                        defaultValue={editingCategory?.nameEn || ''}
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
                        defaultValue={editingCategory?.nameAr || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                        dir="rtl"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('form.order')}
                    </label>
                    <input
                      type="number"
                      name="order"
                      defaultValue={editingCategory?.order || blogCategories.length}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      min="0"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      name="isActive"
                      id="categoryIsActive"
                      defaultChecked={editingCategory?.isActive !== false}
                      className="w-5 h-5 rounded border-[var(--color-admin-border)] text-[var(--color-admin-primary)] focus:ring-[var(--color-admin-primary)]"
                    />
                    <label htmlFor="categoryIsActive" className="text-sm font-semibold text-[var(--color-admin-text)]">
                      {t('common.active')} ({t('pages.blogs.visibleOnWebsite')})
                    </label>
                  </div>

                  <div className="pt-4 border-t border-[var(--color-admin-border)] flex gap-4">
                    <button
                      type="submit"
                      className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      {editingCategory ? t('pages.blogs.updateCategory') : t('pages.blogs.createCategory')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCategoryForm(false);
                        setEditingCategory(null);
                      }}
                      className="bg-[var(--color-admin-muted)] text-[var(--color-admin-text)] px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-border)] transition-all"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Categories List */}
            <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
              <div className="p-6 border-b border-[var(--color-admin-border)]">
                <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.blogs.allCategories')}</h2>
              </div>
              <div className="p-6">
                {blogCategories.length === 0 ? (
                  <div className="text-center py-16 bg-[var(--color-admin-muted)] rounded-xl border-2 border-dashed border-[var(--color-admin-border)]">
                    <p className="text-sm font-medium text-[var(--color-admin-text)]">{t('pages.blogs.noCategoriesYet')}</p>
                    <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">{t('pages.blogs.getStartedCategory')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blogCategories.map(category => (
                      <div
                        key={category.id}
                        className="border border-[var(--color-admin-border)] rounded-xl p-4 bg-[var(--color-admin-surface)] hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4">
                              <span className="bg-[var(--color-admin-primary)] text-white text-xs px-3 py-1.5 rounded-full font-semibold">#{category.order}</span>
                              <span
                                className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                                  category.isActive ? 'bg-[var(--color-admin-success)] text-white' : 'bg-[var(--color-admin-text-muted)] text-white'
                                }`}
                              >
                                {category.isActive ? t('common.active') : t('common.inactive')}
                              </span>
                              <div>
                                <p className="font-semibold text-[var(--color-admin-text)]">{category.nameEn}</p>
                                <p className="text-sm text-[var(--color-admin-text-muted)]" dir="rtl">
                                  {category.nameAr}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingCategory(category);
                                setShowCategoryForm(true);
                              }}
                              className="bg-[var(--color-admin-primary-light)] text-[var(--color-admin-primary)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-primary)]/20 transition-all"
                            >
                              {t('common.edit')}
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-danger)]/20 transition-all"
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

        {/* Statuses Tab */}
        {activeTab === 'statuses' && (
          <>
            {/* Add Status Button */}
            {!showStatusForm && !editingStatus && (
              <div className="mb-6">
                <button
                  onClick={() => setShowStatusForm(true)}
                  className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  + Add New Status
                </button>
              </div>
            )}

            {/* Create/Edit Status Form */}
            {(showStatusForm || editingStatus) && (
              <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden mb-6">
                <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
                  <h2 className="text-xl font-bold text-[var(--color-admin-text)]">
                    {editingStatus ? 'Edit Status' : 'Add New Status'}
                  </h2>
                </div>
                <form onSubmit={editingStatus ? handleUpdateStatus : handleCreateStatus} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        Name (English) <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="nameEn"
                        defaultValue={editingStatus?.nameEn || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        Name (Arabic) <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="nameAr"
                        defaultValue={editingStatus?.nameAr || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                        dir="rtl"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      Order
                    </label>
                    <input
                      type="number"
                      name="order"
                      defaultValue={editingStatus?.order || blogStatuses.length}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      min="0"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      name="isActive"
                      id="statusIsActive"
                      defaultChecked={editingStatus?.isActive !== false}
                      className="w-5 h-5 rounded border-[var(--color-admin-border)] text-[var(--color-admin-primary)] focus:ring-[var(--color-admin-primary)]"
                    />
                    <label htmlFor="statusIsActive" className="text-sm font-semibold text-[var(--color-admin-text)]">
                      Active (visible on website)
                    </label>
                  </div>

                  <div className="pt-4 border-t border-[var(--color-admin-border)] flex gap-4">
                    <button
                      type="submit"
                      className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      {editingStatus ? 'Update Status' : 'Create Status'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowStatusForm(false);
                        setEditingStatus(null);
                      }}
                      className="bg-[var(--color-admin-muted)] text-[var(--color-admin-text)] px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-border)] transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Statuses List */}
            <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
              <div className="p-6 border-b border-[var(--color-admin-border)]">
                <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.blogs.allStatuses')}</h2>
              </div>
              <div className="p-6">
                {blogStatuses.length === 0 ? (
                  <div className="text-center py-16 bg-[var(--color-admin-muted)] rounded-xl border-2 border-dashed border-[var(--color-admin-border)]">
                    <p className="text-sm font-medium text-[var(--color-admin-text)]">{t('pages.blogs.noStatusesAddedYet')}</p>
                    <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">{t('pages.blogs.addFirstStatusAbove')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blogStatuses.map(status => (
                      <div
                        key={status.id}
                        className="border border-[var(--color-admin-border)] rounded-xl p-4 bg-[var(--color-admin-surface)] hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4">
                              <span className="bg-[var(--color-admin-primary)] text-white text-xs px-3 py-1.5 rounded-full font-semibold">#{status.order}</span>
                              <span
                                className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                                  status.isActive ? 'bg-[var(--color-admin-success)] text-white' : 'bg-[var(--color-admin-text-muted)] text-white'
                                }`}
                              >
                                {status.isActive ? 'Active' : 'Inactive'}
                              </span>
                              <div>
                                <p className="font-semibold text-[var(--color-admin-text)]">{status.nameEn}</p>
                                <p className="text-sm text-[var(--color-admin-text-muted)]" dir="rtl">
                                  {status.nameAr}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingStatus(status);
                                setShowStatusForm(true);
                              }}
                              className="bg-[var(--color-admin-primary-light)] text-[var(--color-admin-primary)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-primary)]/20 transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteStatus(status.id)}
                              className="bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-danger)]/20 transition-all"
                            >
                              Delete
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
        {activeTab === 'settings' && pageSettings && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.blogs.settings')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.blogs.updateHeroSection')}</p>
            </div>
            <form onSubmit={handleUpdateSettings} className="p-6 space-y-6">
              {/* Hero Image */}
              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                  {t('pages.blogs.heroImage')}
                </label>
                <input
                  type="file"
                  name="heroImage"
                  accept="image/*"
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)]"
                />
                {pageSettings.heroImageUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">{t('pages.blogs.currentHeroImage')}</p>
                    <img
                      src={getImageUrl(pageSettings.heroImageUrl)}
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
                    defaultValue={pageSettings.titleEn}
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
                    defaultValue={pageSettings.titleAr}
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
                    defaultValue={pageSettings.descriptionEn}
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
                    defaultValue={pageSettings.descriptionAr}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-28 resize-none text-right"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              {/* Hero Section Description (for landing page) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.blogs.heroSectionDescriptionEn')}
                  </label>
                  <textarea
                    name="heroSectionDescriptionEn"
                    defaultValue={pageSettings.heroSectionDescriptionEn || ''}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-24 resize-none"
                    placeholder={t('pages.blogs.heroSectionDescriptionEnPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.blogs.heroSectionDescriptionAr')}
                  </label>
                  <textarea
                    name="heroSectionDescriptionAr"
                    defaultValue={pageSettings.heroSectionDescriptionAr || ''}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-24 resize-none text-right"
                    dir="rtl"
                    placeholder={t('pages.blogs.heroSectionDescriptionArPlaceholder')}
                  />
                </div>
              </div>

              {/* Grid Section Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.blogs.gridSectionTitleEn')}
                  </label>
                  <input
                    type="text"
                    name="gridSectionTitleEn"
                    defaultValue={pageSettings.gridSectionTitleEn || ''}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    placeholder={t('pages.blogs.blogs')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.blogs.gridSectionTitleAr')}
                  </label>
                  <input
                    type="text"
                    name="gridSectionTitleAr"
                    defaultValue={pageSettings.gridSectionTitleAr || ''}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                    dir="rtl"
                    placeholder={t('pages.blogs.blogs')}
                  />
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
        )}
      </div>
    </div>
  );
};

export default BlogsPageManager;
