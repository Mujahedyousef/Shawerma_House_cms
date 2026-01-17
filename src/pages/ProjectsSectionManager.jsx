import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getActiveProjectsSection,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectLogo,
  deleteProjectLogo,
  uploadProjectGalleryImages,
  deleteProjectGalleryImage,
  createSectionSettings,
  updateSectionSettings,
} from '../api/projectsSection';
import RichTextEditor from '../components/RichTextEditor';
import { showSuccess, showError, showConfirm } from '../utils/i18nHelpers';

const ProjectsSectionManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [projectsSection, setProjectsSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'projects'
  const [editingProject, setEditingProject] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [selectedProjectForLogos, setSelectedProjectForLogos] = useState(null);
  const [projectContentEn, setProjectContentEn] = useState('');
  const [projectContentAr, setProjectContentAr] = useState('');
  const [projectSpecifications, setProjectSpecifications] = useState([]);
  const [galleryImagesFiles, setGalleryImagesFiles] = useState([]);

  useEffect(() => {
    fetchProjectsSection();
  }, []);

  const fetchProjectsSection = async () => {
    try {
      setLoading(true);
      const response = await getActiveProjectsSection();
      setProjectsSection(response.data);
    } catch (error) {
      console.error('Error fetching projects section:', error);
      // If no section exists, that's okay - we'll show create form
      setProjectsSection(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSectionSettings = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      sectionTitleEn: formData.get('sectionTitleEn'),
      sectionTitleAr: formData.get('sectionTitleAr'),
      sectionSubtitleEn: formData.get('sectionSubtitleEn') || null,
      sectionSubtitleAr: formData.get('sectionSubtitleAr') || null,
      buttonTextEn: formData.get('buttonTextEn'),
      buttonTextAr: formData.get('buttonTextAr'),
      ctaButtonTextEn: formData.get('ctaButtonTextEn'),
      ctaButtonTextAr: formData.get('ctaButtonTextAr'),
      ctaButtonLink: formData.get('ctaButtonLink') || null,
      galleryTitleEn: formData.get('galleryTitleEn'),
      galleryTitleAr: formData.get('galleryTitleAr'),
    };

    try {
      await updateSectionSettings(projectsSection.id, data);
      showSuccess('updated', t('sidebar.projects'));
      fetchProjectsSection();
    } catch (error) {
      console.error('Error updating section settings:', error);
      showError('failedToUpdate', t('sidebar.projects'));
    }
  };

  const handleCreateProject = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get('image');
    const heroFile = formData.get('heroImage');

    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      descriptionEn: formData.get('descriptionEn') || null,
      descriptionAr: formData.get('descriptionAr') || null,
      contentEn: projectContentEn || null,
      contentAr: projectContentAr || null,
      specifications: projectSpecifications.length > 0 ? JSON.stringify(projectSpecifications) : null,
      productsCount: parseInt(formData.get('productsCount')) || 0,
      order: parseInt(formData.get('order')) || 0,
      isActive: formData.get('isActive') === 'on',
      buttonTextEn: formData.get('buttonTextEn') || '',
      buttonTextAr: formData.get('buttonTextAr') || '',
      image: file instanceof File && file.size > 0 ? file : null,
      heroImage: heroFile instanceof File && heroFile.size > 0 ? heroFile : null,
      projectsSectionId: projectsSection?.id,
    };

    try {
      const response = await createProject(data);
      const projectId = response?.data?.id;

      // Upload gallery images if any
      if (galleryImagesFiles.length > 0 && projectId) {
        try {
          await uploadProjectGalleryImages(projectId, galleryImagesFiles);
        } catch (galleryError) {
          console.error('Error uploading gallery images:', galleryError);
          showError('failedToUpload', t('pages.projects.galleryImages'));
        }
      }

      showSuccess('created', t('pages.projects.project'));
      fetchProjectsSection();
      setShowProjectForm(false);
      setEditingProject(null);
      setProjectContentEn('');
      setProjectContentAr('');
      setProjectSpecifications([]);
      setGalleryImagesFiles([]);
      e.target.reset();
    } catch (error) {
      console.error('Error creating project:', error);
      showError('failedToCreate', t('pages.projects.project'));
    }
  };

  const handleUpdateProject = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get('image');
    const heroFile = formData.get('heroImage');

    // Get specifications from editingProject if available, otherwise from projectSpecifications
    const specsToUse = editingProject?.specifications && Array.isArray(editingProject.specifications) ? editingProject.specifications : projectSpecifications;

    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      descriptionEn: formData.get('descriptionEn') || null,
      descriptionAr: formData.get('descriptionAr') || null,
      contentEn: editingProject?.contentEn || projectContentEn || null,
      contentAr: editingProject?.contentAr || projectContentAr || null,
      specifications: specsToUse.length > 0 ? JSON.stringify(specsToUse) : null,
      productsCount: parseInt(formData.get('productsCount')) || 0,
      order: parseInt(formData.get('order')) || 0,
      isActive: formData.get('isActive') === 'on',
      buttonTextEn: formData.get('buttonTextEn') || '',
      buttonTextAr: formData.get('buttonTextAr') || '',
    };

    if (file instanceof File && file.size > 0) {
      data.image = file;
    }

    if (heroFile instanceof File && heroFile.size > 0) {
      data.heroImage = heroFile;
    }

    try {
      await updateProject(editingProject.id, data);

      // Upload gallery images if any
      if (galleryImagesFiles.length > 0) {
        try {
          await uploadProjectGalleryImages(editingProject.id, galleryImagesFiles);
        } catch (galleryError) {
          console.error('Error uploading gallery images:', galleryError);
          showError('failedToUpload', t('pages.projects.galleryImages'));
        }
      }

      showSuccess('updated', t('pages.projects.project'));
      fetchProjectsSection();
      setShowProjectForm(false);
      setEditingProject(null);
      setProjectContentEn('');
      setProjectContentAr('');
      setProjectSpecifications([]);
      setGalleryImagesFiles([]);
    } catch (error) {
      console.error('Error updating project:', error);
      showError('failedToUpdate', t('pages.projects.project'));
    }
  };

  const handleDeleteProject = async id => {
    if (!showConfirm('delete')) return;

    try {
      await deleteProject(id);
      showSuccess('deleted', t('pages.projects.project'));
      fetchProjectsSection();
    } catch (error) {
      console.error('Error deleting project:', error);
      showError('failedToDelete', t('pages.projects.project'));
    }
  };

  const handleLogoUpload = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get('file');
    const order = parseInt(formData.get('order')) || 0;

    if (!file) {
      showError('pleaseSelectFile', t('form.pleaseSelectFile'));
      return;
    }

    try {
      await uploadProjectLogo(selectedProjectForLogos.id, file, order);
      showSuccess('uploaded', t('pages.projects.logo'));
      fetchProjectsSection();
      e.target.reset();
    } catch (error) {
      console.error('Error uploading logo:', error);
      showError('failedToUpload', t('pages.projects.logo'));
    }
  };

  const handleDeleteLogo = async logoId => {
    if (!showConfirm('delete')) return;

    try {
      await deleteProjectLogo(logoId);
      showSuccess('deleted', t('pages.projects.logo'));
      fetchProjectsSection();
    } catch (error) {
      console.error('Error deleting logo:', error);
      showError('failedToDelete', t('pages.projects.logo'));
    }
  };

  const handleCreateSection = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      sectionTitleEn: formData.get('sectionTitleEn') || 'Our proud projects',
      sectionTitleAr: formData.get('sectionTitleAr') || 'مشاريعنا الفخورة',
      buttonTextEn: formData.get('buttonTextEn') || 'View project details',
      buttonTextAr: formData.get('buttonTextAr') || 'عرض تفاصيل المشروع',
      ctaButtonTextEn: formData.get('ctaButtonTextEn') || 'View more projects',
      ctaButtonTextAr: formData.get('ctaButtonTextAr') || 'عرض المزيد من المشاريع',
      ctaButtonLink: formData.get('ctaButtonLink') || null,
      galleryTitleEn: formData.get('galleryTitleEn') || 'Project Photo Gallery',
      galleryTitleAr: formData.get('galleryTitleAr') || 'معرض صور المشروع',
      isActive: true,
    };

    try {
      await createSectionSettings(data);
      showSuccess('created', t('sidebar.projects'));
      fetchProjectsSection();
    } catch (error) {
      console.error('Error creating projects section:', error);
      showError('failedToCreate', t('sidebar.projects'));
    }
  };

  const getImageUrl = imageUrl => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:5000${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-admin-bg)]" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-admin-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--color-admin-text-muted)] font-medium">{t('pages.projects.loadingSection')}</p>
        </div>
      </div>
    );
  }

  if (!projectsSection) {
    return (
      <div className="min-h-screen bg-[var(--color-admin-bg)] p-4 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-[var(--color-admin-surface)] rounded-xl shadow-xl border border-[var(--color-admin-border)] overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.projects.createSection')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.projects.createSectionDesc')}</p>
            </div>
            <form onSubmit={handleCreateSection} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.sectionTitleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="sectionTitleEn"
                    defaultValue="Our proud projects"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                    placeholder="Our proud projects"
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
                    defaultValue="مشاريعنا الفخورة"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    placeholder="مشاريعنا الفخورة"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('form.buttonTextEn')}</label>
                  <input
                    type="text"
                    name="buttonTextEn"
                    defaultValue="View project details"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                    placeholder="View project details"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('form.buttonTextAr')}</label>
                  <input
                    type="text"
                    name="buttonTextAr"
                    defaultValue="عرض تفاصيل المشروع"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    placeholder="عرض تفاصيل المشروع"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.projects.ctaButtonText')} ({t('common.english')})</label>
                  <input
                    type="text"
                    name="ctaButtonTextEn"
                    defaultValue="View more projects"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                    placeholder="View more projects"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.projects.ctaButtonText')} ({t('common.arabic')})</label>
                  <input
                    type="text"
                    name="ctaButtonTextAr"
                    defaultValue="عرض المزيد من المشاريع"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    placeholder="عرض المزيد من المشاريع"
                    dir="rtl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                  {t('pages.projects.ctaButtonLink')} <span className="text-[var(--color-admin-text-muted)] font-normal">({t('common.optional')})</span>
                </label>
                <input
                  type="text"
                  name="ctaButtonLink"
                  defaultValue=""
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                  placeholder="#projects or /projects"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--color-admin-border)]">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.projects.galleryTitle')} ({t('common.english')}) <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="galleryTitleEn"
                    defaultValue="Project Photo Gallery"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                    placeholder="Project Photo Gallery"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.projects.galleryTitle')} ({t('common.arabic')}) <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="galleryTitleAr"
                    defaultValue="معرض صور المشروع"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    placeholder="معرض صور المشروع"
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
                  {t('pages.projects.createSection')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-admin-bg)] p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-admin-text)] mb-2">{t('pages.projects.title')}</h1>
          <p className="text-[var(--color-admin-text-muted)]">{t('pages.projects.description')}</p>
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
            {t('pages.projects.general')}
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'projects'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.projects.projects')} <span className="ml-1 opacity-80">({projectsSection.projects?.length || 0})</span>
          </button>
        </div>

        {/* General Info Tab */}
        {activeTab === 'general' && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.projects.sectionSettings')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.projects.sectionSettingsDesc')}</p>
            </div>
            <form onSubmit={handleUpdateSectionSettings} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.titleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="sectionTitleEn"
                    defaultValue={projectsSection.sectionTitleEn}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                    placeholder="Our proud projects"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.titleAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="sectionTitleAr"
                    defaultValue={projectsSection.sectionTitleAr}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    placeholder="مشاريعنا الفخورة"
                    dir="rtl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.projects.sectionSubtitle')} ({t('common.english')})</label>
                  <input
                    type="text"
                    name="sectionSubtitleEn"
                    defaultValue={projectsSection.sectionSubtitleEn || ''}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                    placeholder={t('pages.projects.sectionSubtitlePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.projects.sectionSubtitle')} ({t('common.arabic')})</label>
                  <input
                    type="text"
                    name="sectionSubtitleAr"
                    defaultValue={projectsSection.sectionSubtitleAr || ''}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    placeholder={t('pages.projects.sectionSubtitlePlaceholderAr')}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.projects.buttonText')} ({t('common.english')})</label>
                  <input
                    type="text"
                    name="buttonTextEn"
                    defaultValue={projectsSection.buttonTextEn}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                    placeholder="View project details"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.projects.buttonText')} ({t('common.arabic')})</label>
                  <input
                    type="text"
                    name="buttonTextAr"
                    defaultValue={projectsSection.buttonTextAr}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    placeholder="عرض تفاصيل المشروع"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.projects.ctaButtonText')} ({t('common.english')})</label>
                  <input
                    type="text"
                    name="ctaButtonTextEn"
                    defaultValue={projectsSection.ctaButtonTextEn}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                    placeholder="View more projects"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.projects.ctaButtonText')} ({t('common.arabic')})</label>
                  <input
                    type="text"
                    name="ctaButtonTextAr"
                    defaultValue={projectsSection.ctaButtonTextAr}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    placeholder="عرض المزيد من المشاريع"
                    dir="rtl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                  {t('pages.projects.ctaButtonLink')} <span className="text-[var(--color-admin-text-muted)] font-normal">({t('common.optional')})</span>
                </label>
                <input
                  type="text"
                  name="ctaButtonLink"
                  defaultValue={projectsSection.ctaButtonLink || ''}
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                  placeholder={t('pages.projects.ctaButtonLinkPlaceholder')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--color-admin-border)]">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.projects.galleryTitle')} ({t('common.english')}) <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="galleryTitleEn"
                    defaultValue={projectsSection.galleryTitleEn || 'Project Photo Gallery'}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                    placeholder="Project Photo Gallery"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.projects.galleryTitle')} ({t('common.arabic')}) <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="galleryTitleAr"
                    defaultValue={projectsSection.galleryTitleAr || 'معرض صور المشروع'}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    placeholder="معرض صور المشروع"
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
                  {t('common.save')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="">
            {/* Add Project Button */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setEditingProject(null);
                  setShowProjectForm(true);
                }}
                className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg"
              >
                + {t('pages.projects.addProject')}
              </button>
            </div>

            {/* Project Form Modal */}
            {showProjectForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{editingProject ? t('pages.projects.editProject') : t('pages.projects.createNewProject')}</h2>
                    <button
                      onClick={() => {
                        setShowProjectForm(false);
                        setEditingProject(null);
                      }}
                      className="text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <form onSubmit={editingProject ? handleUpdateProject : handleCreateProject} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                          {t('form.titleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                        </label>
                        <input
                          type="text"
                          name="titleEn"
                          defaultValue={editingProject?.titleEn || ''}
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
                          defaultValue={editingProject?.titleAr || ''}
                          className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                          dir="rtl"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                          {t('pages.projects.productsCount')} <span className="text-[var(--color-admin-danger)]">*</span>
                        </label>
                        <input
                          type="number"
                          name="productsCount"
                          defaultValue={editingProject?.productsCount || 0}
                          className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                          min="0"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('form.order')}</label>
                        <input
                          type="number"
                          name="order"
                          defaultValue={editingProject?.order || 0}
                          className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('form.buttonTextEn')}</label>
                        <input
                          type="text"
                          name="buttonTextEn"
                          defaultValue={editingProject?.buttonTextEn || ''}
                          className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                          placeholder={t('pages.projects.viewProjectDetails')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('form.buttonTextAr')}</label>
                        <input
                          type="text"
                          name="buttonTextAr"
                          defaultValue={editingProject?.buttonTextAr || ''}
                          className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                          placeholder="عرض تفاصيل المشروع"
                          dir="rtl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('form.descriptionEn')}</label>
                        <textarea
                          name="descriptionEn"
                          defaultValue={editingProject?.descriptionEn || ''}
                          rows="3"
                          className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                          placeholder={t('pages.projects.projectDescriptionEn')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('form.descriptionAr')}</label>
                        <textarea
                          name="descriptionAr"
                          defaultValue={editingProject?.descriptionAr || ''}
                          rows="3"
                          className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                          dir="rtl"
                          placeholder="وصف المشروع بالعربية"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.projects.projectImage')} {!editingProject && <span className="text-[var(--color-admin-danger)]">*</span>}
                      </label>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)] hover:file:bg-[var(--color-admin-primary)]/20"
                        required={!editingProject}
                      />
                      {editingProject?.imageUrl && (
                        <div className="mt-4">
                          <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">{t('pages.projects.currentImage')}</p>
                          <img
                            src={getImageUrl(editingProject.imageUrl)}
                            alt={editingProject.titleEn}
                            className="w-64 h-40 object-cover rounded-lg border border-[var(--color-admin-border)]"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.projects.heroImage')} <span className="text-[var(--color-admin-text-muted)] font-normal">({t('common.optional')})</span>
                      </label>
                      <input
                        type="file"
                        name="heroImage"
                        accept="image/*"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)] hover:file:bg-[var(--color-admin-primary)]/20"
                      />
                      {editingProject?.heroImageUrl && (
                        <div className="mt-4">
                          <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">{t('pages.projects.currentHeroImage')}</p>
                          <img
                            src={getImageUrl(editingProject.heroImageUrl)}
                            alt={editingProject.titleEn}
                            className="w-64 h-40 object-cover rounded-lg border border-[var(--color-admin-border)]"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.projects.contentEn')}</label>
                        <RichTextEditor
                          value={editingProject ? editingProject.contentEn || '' : projectContentEn}
                          onChange={content => {
                            if (editingProject) {
                              setEditingProject({ ...editingProject, contentEn: content });
                            } else {
                              setProjectContentEn(content);
                            }
                          }}
                          placeholder={t('pages.projects.writeProjectContentEn')}
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.projects.contentAr')}</label>
                        <RichTextEditor
                          value={editingProject ? editingProject.contentAr || '' : projectContentAr}
                          onChange={content => {
                            if (editingProject) {
                              setEditingProject({ ...editingProject, contentAr: content });
                            } else {
                              setProjectContentAr(content);
                            }
                          }}
                          placeholder={t('pages.projects.writeProjectContentAr')}
                          dir="rtl"
                        />
                      </div>
                    </div>

                    {/* Specifications Section */}
                    <div className="border-t border-[var(--color-admin-border)] pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.projects.specifications')}</label>
                        <button
                          type="button"
                          onClick={() => {
                            const newSpec = { keyEn: '', keyAr: '', valueEn: '', valueAr: '' };
                            if (editingProject) {
                              const currentSpecs =
                                editingProject.specifications && typeof editingProject.specifications === 'object'
                                  ? Array.isArray(editingProject.specifications)
                                    ? editingProject.specifications
                                    : []
                                  : [];
                              setEditingProject({ ...editingProject, specifications: [...currentSpecs, newSpec] });
                            } else {
                              setProjectSpecifications([...projectSpecifications, newSpec]);
                            }
                          }}
                          className="px-4 py-2 bg-[var(--color-admin-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all"
                        >
                          + {t('pages.projects.addSpecification')}
                        </button>
                      </div>
                      <div className="space-y-4">
                        {(editingProject && editingProject.specifications
                          ? Array.isArray(editingProject.specifications)
                            ? editingProject.specifications
                            : []
                          : projectSpecifications
                        ).map((spec, index) => (
                          <div key={index} className="p-4 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-muted)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <label className="block text-xs font-medium text-[var(--color-admin-text-muted)] mb-1">{t('pages.projects.keyEn')}</label>
                                <input
                                  type="text"
                                  value={spec.keyEn || ''}
                                  onChange={e => {
                                    const updatedSpecs = editingProject?.specifications
                                      ? [...(Array.isArray(editingProject.specifications) ? editingProject.specifications : [])]
                                      : [...projectSpecifications];
                                    updatedSpecs[index].keyEn = e.target.value;
                                    if (editingProject) {
                                      setEditingProject({ ...editingProject, specifications: updatedSpecs });
                                    } else {
                                      setProjectSpecifications(updatedSpecs);
                                    }
                                  }}
                                  className="w-full px-3 py-2 text-sm border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)]"
                                  placeholder={t('pages.projects.keyPlaceholderEn')}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-[var(--color-admin-text-muted)] mb-1">{t('pages.projects.keyAr')}</label>
                                <input
                                  type="text"
                                  value={spec.keyAr || ''}
                                  onChange={e => {
                                    const updatedSpecs = editingProject?.specifications
                                      ? [...(Array.isArray(editingProject.specifications) ? editingProject.specifications : [])]
                                      : [...projectSpecifications];
                                    updatedSpecs[index].keyAr = e.target.value;
                                    if (editingProject) {
                                      setEditingProject({ ...editingProject, specifications: updatedSpecs });
                                    } else {
                                      setProjectSpecifications(updatedSpecs);
                                    }
                                  }}
                                  className="w-full px-3 py-2 text-sm border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] text-right"
                                  dir="rtl"
                                  placeholder={t('pages.projects.keyPlaceholderAr')}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-[var(--color-admin-text-muted)] mb-1">{t('pages.projects.valueEn')}</label>
                                <input
                                  type="text"
                                  value={spec.valueEn || ''}
                                  onChange={e => {
                                    const updatedSpecs = editingProject?.specifications
                                      ? [...(Array.isArray(editingProject.specifications) ? editingProject.specifications : [])]
                                      : [...projectSpecifications];
                                    updatedSpecs[index].valueEn = e.target.value;
                                    if (editingProject) {
                                      setEditingProject({ ...editingProject, specifications: updatedSpecs });
                                    } else {
                                      setProjectSpecifications(updatedSpecs);
                                    }
                                  }}
                                  className="w-full px-3 py-2 text-sm border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)]"
                                  placeholder={t('pages.projects.valuePlaceholderEn')}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-[var(--color-admin-text-muted)] mb-1">{t('pages.projects.valueAr')}</label>
                                <input
                                  type="text"
                                  value={spec.valueAr || ''}
                                  onChange={e => {
                                    const updatedSpecs = editingProject?.specifications
                                      ? [...(Array.isArray(editingProject.specifications) ? editingProject.specifications : [])]
                                      : [...projectSpecifications];
                                    updatedSpecs[index].valueAr = e.target.value;
                                    if (editingProject) {
                                      setEditingProject({ ...editingProject, specifications: updatedSpecs });
                                    } else {
                                      setProjectSpecifications(updatedSpecs);
                                    }
                                  }}
                                  className="w-full px-3 py-2 text-sm border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] text-right"
                                  dir="rtl"
                                  placeholder={t('pages.projects.valuePlaceholderAr')}
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedSpecs = editingProject?.specifications
                                  ? [...(Array.isArray(editingProject.specifications) ? editingProject.specifications : [])]
                                  : [...projectSpecifications];
                                updatedSpecs.splice(index, 1);
                                if (editingProject) {
                                  setEditingProject({ ...editingProject, specifications: updatedSpecs });
                                } else {
                                  setProjectSpecifications(updatedSpecs);
                                }
                              }}
                              className="mt-3 px-3 py-1 bg-[var(--color-admin-danger)] text-white rounded text-xs font-semibold hover:bg-red-700 transition-all"
                            >
                              {t('common.remove')}
                            </button>
                          </div>
                        ))}
                        {(editingProject && editingProject.specifications
                          ? Array.isArray(editingProject.specifications)
                            ? editingProject.specifications
                            : []
                          : projectSpecifications
                        ).length === 0 && (
                          <p className="text-sm text-[var(--color-admin-text-muted)] text-center py-4">
                            {t('pages.projects.noSpecificationsYet')}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Gallery Images Section */}
                    <div className="border-t border-[var(--color-admin-border)] pt-6">
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-4">
                        {t('pages.projects.galleryImages')} <span className="text-[var(--color-admin-text-muted)] font-normal">({t('pages.projects.galleryImagesDesc')})</span>
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={e => {
                          const files = Array.from(e.target.files);
                          setGalleryImagesFiles(files);
                        }}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)] hover:file:bg-[var(--color-admin-primary)]/20"
                      />
                      {galleryImagesFiles.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">{galleryImagesFiles.length} {t('pages.projects.imagesSelected')}</p>
                          <div className="grid grid-cols-4 gap-2">
                            {galleryImagesFiles.map((file, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-20 object-cover rounded-lg border border-[var(--color-admin-border)]"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setGalleryImagesFiles(galleryImagesFiles.filter((_, i) => i !== index));
                                  }}
                                  className="absolute top-1 right-1 bg-[var(--color-admin-danger)] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {editingProject?.galleryImages && editingProject.galleryImages.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">{t('pages.projects.existingGalleryImages')}</p>
                          <div className="grid grid-cols-4 gap-2">
                            {editingProject.galleryImages.map(image => (
                              <div key={image.id} className="relative">
                                <img
                                  src={getImageUrl(image.imageUrl)}
                                  alt={`Gallery ${image.id}`}
                                  className="w-full h-20 object-cover rounded-lg border border-[var(--color-admin-border)]"
                                />
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (showConfirm('delete', t('messages.confirm.delete'))) {
                                      try {
                                        await deleteProjectGalleryImage(image.id);
                                        setEditingProject({
                                          ...editingProject,
                                          galleryImages: editingProject.galleryImages.filter(img => img.id !== image.id),
                                        });
                                        fetchProjectsSection();
                                      } catch (error) {
                                        console.error('Error deleting gallery image:', error);
                                        showError('failedToDelete', t('common.image'));
                                      }
                                    }
                                  }}
                                  className="absolute top-1 right-1 bg-[var(--color-admin-danger)] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        name="isActive"
                        id="isActive"
                        defaultChecked={editingProject?.isActive !== false}
                        className="w-5 h-5 rounded border-[var(--color-admin-border)] text-[var(--color-admin-primary)] focus:ring-[var(--color-admin-primary)]"
                      />
                      <label htmlFor="isActive" className="text-sm font-semibold text-[var(--color-admin-text)]">
                        {t('pages.projects.activeVisible')}
                      </label>
                    </div>

                    <div className="pt-4 border-t border-[var(--color-admin-border)] flex gap-4">
                      <button
                        type="submit"
                        className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg"
                      >
                        {editingProject ? t('pages.projects.updateProject') : t('pages.projects.createProject')}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProjectForm(false);
                          setEditingProject(null);
                          setProjectContentEn('');
                          setProjectContentAr('');
                          setProjectSpecifications([]);
                          setGalleryImagesFiles([]);
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

            {/* Projects List */}
            {projectsSection.projects?.length === 0 ? (
              <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md p-12 text-center">
                <p className="text-[var(--color-admin-text-muted)]">{t('pages.projects.noProjectsYet')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectsSection.projects?.map(project => (
                  <div
                    key={project.id}
                    className="group border border-[var(--color-admin-border)] rounded-xl overflow-hidden hover:shadow-xl transition-all bg-[var(--color-admin-surface)]"
                  >
                    <div className="relative">
                      <span
                        className={`absolute top-3 right-3 text-white text-xs px-3 py-1.5 rounded-full font-semibold z-10 ${
                          project.isActive ? 'bg-[var(--color-admin-success)]' : 'bg-[var(--color-admin-text-muted)]'
                        }`}
                      >
                        {project.isActive ? t('pages.projects.active') : t('pages.projects.inactive')}
                      </span>
                      <span className="absolute top-3 left-3 bg-[var(--color-admin-primary)] text-white text-xs px-3 py-1.5 rounded-full font-semibold z-10">
                        #{project.order}
                      </span>
                      <img
                        src={getImageUrl(project.imageUrl)}
                        alt={project.titleEn}
                        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-[var(--color-admin-text)] mb-1">{project.titleEn}</h3>
                      <p className="text-sm text-[var(--color-admin-text-muted)] mb-2" dir="rtl">
                        {project.titleAr}
                      </p>
                      <div className="text-sm text-[var(--color-admin-text-muted)] mb-4">
                        {t('pages.projects.productsCount')}: <span className="font-semibold text-[var(--color-admin-text)]">{project.productsCount}</span>
                      </div>
                      <div className="flex gap-2 pt-4 border-t border-[var(--color-admin-border)]">
                        <button
                          onClick={() => {
                            setEditingProject(project);
                            setProjectContentEn(project.contentEn || '');
                            setProjectContentAr(project.contentAr || '');
                            setProjectSpecifications(
                              project.specifications && typeof project.specifications === 'object'
                                ? Array.isArray(project.specifications)
                                  ? project.specifications
                                  : []
                                : []
                            );
                            setShowProjectForm(true);
                          }}
                          className="flex-1 bg-[var(--color-admin-primary-light)] text-[var(--color-admin-primary)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-primary)]/20 transition-all"
                        >
                          {t('pages.projects.edit')}
                        </button>
                        <button
                          onClick={() => setSelectedProjectForLogos(project)}
                          className="flex-1 bg-[var(--color-admin-info)]/10 text-[var(--color-admin-info)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-info)]/20 transition-all"
                        >
                          {t('pages.projects.logos')} ({project.logos?.length || 0})
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="flex-1 bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-danger)]/20 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Logo Management Modal */}
            {selectedProjectForLogos && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-info)]/10 to-transparent flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.projects.manageLogosFor')} {selectedProjectForLogos.titleEn}</h2>
                    <button
                      onClick={() => setSelectedProjectForLogos(null)}
                      className="text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-6">
                    <form
                      onSubmit={handleLogoUpload}
                      className="mb-6 p-4 bg-gradient-to-br from-[var(--color-admin-info)]/10 to-[var(--color-admin-primary-light)] rounded-xl border-2 border-dashed border-[var(--color-admin-primary)]/30"
                    >
                      <h3 className="text-lg font-semibold text-[var(--color-admin-text)] mb-4">{t('pages.projects.uploadNewLogo')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                            {t('pages.projects.logoImage')} <span className="text-[var(--color-admin-danger)]">*</span>
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
                          <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.projects.displayOrder')}</label>
                          <input
                            type="number"
                            name="order"
                            defaultValue={selectedProjectForLogos.logos?.length || 0}
                            className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                            min="0"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="mt-4 bg-gradient-to-r from-[var(--color-admin-success)] to-[var(--color-admin-accent)] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all shadow-md"
                      >
                        {t('pages.projects.uploadLogo')}
                      </button>
                    </form>

                    {selectedProjectForLogos.logos?.length === 0 ? (
                      <div className="text-center py-8 text-[var(--color-admin-text-muted)]">{t('pages.projects.noLogosUploadedYet')}</div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedProjectForLogos.logos?.map(logo => (
                          <div key={logo.id} className="border border-[var(--color-admin-border)] rounded-lg overflow-hidden bg-white p-4">
                            <img src={getImageUrl(logo.imageUrl)} alt="Logo" className="w-full h-24 object-contain mb-2" />
                            <button
                              onClick={() => handleDeleteLogo(logo.id)}
                              className="w-full bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-danger)]/20 transition-colors"
                            >
                              {t('pages.projects.delete')}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsSectionManager;
