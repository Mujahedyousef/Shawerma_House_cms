import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getActiveTestimonial,
  updateTestimonial,
  addTestimonialProfile,
  updateTestimonialProfile,
  deleteTestimonialProfile,
  createTestimonial,
} from '../api/testimonial';
import { showSuccess, showError, showConfirm } from '../utils/i18nHelpers';

const TestimonialManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [testimonial, setTestimonial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'profiles'
  const [editingProfile, setEditingProfile] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);

  useEffect(() => {
    fetchTestimonial();
  }, []);

  const fetchTestimonial = async () => {
    try {
      setLoading(true);
      const response = await getActiveTestimonial();
      setTestimonial(response.data);
    } catch (error) {
      console.error('Error fetching testimonial:', error);
      // If no testimonial exists, that's okay - we'll show create form
      setTestimonial(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGeneral = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const requestFormData = new FormData();
    requestFormData.append('sectionTitleEn', formData.get('sectionTitleEn'));
    requestFormData.append('sectionTitleAr', formData.get('sectionTitleAr'));
    requestFormData.append('sectionSubtitleEn', formData.get('sectionSubtitleEn') || '');
    requestFormData.append('sectionSubtitleAr', formData.get('sectionSubtitleAr') || '');

    try {
      await updateTestimonial(testimonial.id, requestFormData);
      showSuccess('updated', t('sidebar.testimonials'));
      fetchTestimonial();
    } catch (error) {
      console.error('Error updating testimonial:', error);
      showError('failedToUpdate', t('sidebar.testimonials'));
    }
  };

  const handleCreateTestimonial = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get('image');
    
    const requestFormData = new FormData();
    requestFormData.append('sectionTitleEn', formData.get('sectionTitleEn') || 'Customer trust comes first');
    requestFormData.append('sectionTitleAr', formData.get('sectionTitleAr') || 'ثقة العملاء أولاً');
    requestFormData.append('sectionSubtitleEn', formData.get('sectionSubtitleEn') || '');
    requestFormData.append('sectionSubtitleAr', formData.get('sectionSubtitleAr') || '');
    requestFormData.append('textEn', formData.get('textEn'));
    requestFormData.append('textAr', formData.get('textAr'));
    requestFormData.append('isActive', 'true');
    
    if (file && file.size > 0) {
      requestFormData.append('image', file);
    }

    try {
      await createTestimonial(requestFormData);
      showSuccess('created', t('sidebar.testimonials'));
      fetchTestimonial();
    } catch (error) {
      console.error('Error creating testimonial:', error);
      showError('failedToCreate', t('sidebar.testimonials'));
    }
  };

  const handleAddProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const profileImageFile = formData.get('profileImage');
    const testimonialImageFile = formData.get('testimonialImage');
    
    const requestFormData = new FormData();
    requestFormData.append('name', formData.get('name'));
    requestFormData.append('role', formData.get('role'));
    requestFormData.append('testimonialTextEn', formData.get('testimonialTextEn') || '');
    requestFormData.append('testimonialTextAr', formData.get('testimonialTextAr') || '');
    requestFormData.append('order', formData.get('order') || testimonial.profiles?.length || 0);
    
    if (profileImageFile && profileImageFile.size > 0) {
      requestFormData.append('profileImage', profileImageFile);
    }
    
    if (testimonialImageFile && testimonialImageFile.size > 0) {
      requestFormData.append('testimonialImage', testimonialImageFile);
    }

    try {
      await addTestimonialProfile(testimonial.id, requestFormData);
      showSuccess('created', t('pages.testimonials.profile'));
      fetchTestimonial();
      setShowProfileForm(false);
      e.target.reset();
    } catch (error) {
      console.error('Error adding profile:', error);
      showError('failedToCreate', t('pages.testimonials.profile'));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const profileImageFile = formData.get('profileImage');
    const testimonialImageFile = formData.get('testimonialImage');
    
    const requestFormData = new FormData();
    requestFormData.append('name', formData.get('name'));
    requestFormData.append('role', formData.get('role'));
    requestFormData.append('testimonialTextEn', formData.get('testimonialTextEn') || '');
    requestFormData.append('testimonialTextAr', formData.get('testimonialTextAr') || '');
    requestFormData.append('order', formData.get('order'));
    
    if (profileImageFile && profileImageFile.size > 0) {
      requestFormData.append('profileImage', profileImageFile);
    }
    
    if (testimonialImageFile && testimonialImageFile.size > 0) {
      requestFormData.append('testimonialImage', testimonialImageFile);
    }

    try {
      await updateTestimonialProfile(editingProfile.id, requestFormData);
      showSuccess('updated', t('pages.testimonials.profile'));
      fetchTestimonial();
      setEditingProfile(null);
      setShowProfileForm(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('failedToUpdate', t('pages.testimonials.profile'));
    }
  };

  const handleDeleteProfile = async (profileId) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteTestimonialProfile(profileId);
      showSuccess('deleted', t('pages.testimonials.profile'));
      fetchTestimonial();
    } catch (error) {
      console.error('Error deleting profile:', error);
      showError('failedToDelete', t('pages.testimonials.profile'));
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

  if (!testimonial) {
    return (
      <div className="min-h-screen bg-[var(--color-admin-bg)] p-4 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-[var(--color-admin-surface)] rounded-xl shadow-xl border border-[var(--color-admin-border)] overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.testimonials.createTestimonialSection')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.testimonials.setupSection')}</p>
            </div>
            <form onSubmit={handleCreateTestimonial} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.sectionTitleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="sectionTitleEn"
                    defaultValue="Customer trust comes first"
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
                    defaultValue="ثقة العملاء أولاً"
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
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    placeholder="Optional subtitle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.sectionSubtitleAr')}
                  </label>
                  <input
                    type="text"
                    name="sectionSubtitleAr"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                    placeholder="عنوان فرعي اختياري"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.testimonials.testimonialText')} ({t('common.english')}) <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <textarea
                    name="textEn"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-28 resize-none"
                    placeholder="Enter testimonial text in English"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.testimonials.testimonialText')} ({t('common.arabic')}) <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <textarea
                    name="textAr"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-28 resize-none text-right"
                    dir="rtl"
                    placeholder="أدخل نص الشهادة بالعربية"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                  {t('common.image')} <span className="text-[var(--color-admin-danger)]">*</span>
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)]"
                  required
                />
              </div>

              <div className="pt-4 border-t border-[var(--color-admin-border)]">
                <button
                  type="submit"
                  className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {t('common.create')} {t('sidebar.testimonials')}
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
          <h1 className="text-3xl font-bold text-[var(--color-admin-text)] mb-2">{t('sidebar.testimonials')}</h1>
          <p className="text-[var(--color-admin-text-muted)]">{t('pages.testimonials.description')}</p>
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
            {t('pages.testimonials.general')}
          </button>
          <button
            onClick={() => setActiveTab('profiles')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'profiles'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.testimonials.profiles')} <span className="ml-1 opacity-80">({testimonial.profiles?.length || 0})</span>
          </button>
        </div>

        {/* General Info Tab */}
        {activeTab === 'general' && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.testimonials.general')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.testimonials.updateSectionTitle')}</p>
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
                    defaultValue={testimonial.sectionTitleEn}
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
                    defaultValue={testimonial.sectionTitleAr}
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
                    defaultValue={testimonial.sectionSubtitleEn || ''}
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
                    defaultValue={testimonial.sectionSubtitleAr || ''}
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
                  {t('common.save')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Profiles Tab */}
        {activeTab === 'profiles' && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-info)]/10 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.testimonials.profiles')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.testimonials.manageProfiles')}</p>
            </div>
            
            {/* Add Profile Button */}
            {!showProfileForm && !editingProfile && (
              <div className="p-6">
                <button
                  onClick={() => setShowProfileForm(true)}
                  className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg"
                >
                  + {t('pages.testimonials.addProfile')}
                </button>
              </div>
            )}

            {/* Profile Form */}
            {(showProfileForm || editingProfile) && (
              <div className="p-6 border-b border-[var(--color-admin-border)]">
                <form onSubmit={editingProfile ? handleUpdateProfile : handleAddProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.testimonials.name')} ({t('common.english')}) <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={editingProfile?.name || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        placeholder="e.g., Mr. Samer Al-Ali"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.testimonials.role')} ({t('common.english')}) <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="role"
                        defaultValue={editingProfile?.role || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        placeholder="e.g., General Manager"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.testimonials.profileImage')} {!editingProfile && <span className="text-[var(--color-admin-danger)]">*</span>}
                      </label>
                      <input
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)]"
                        required={!editingProfile}
                      />
                      {editingProfile?.imageUrl && (
                        <div className="mt-4">
                          <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">{t('pages.testimonials.currentImage')}</p>
                          <img
                            src={getImageUrl(editingProfile.imageUrl)}
                            alt={editingProfile.name}
                            className="w-24 h-24 rounded-full object-cover border border-[var(--color-admin-border)]"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('form.order')}
                      </label>
                      <input
                        type="number"
                        name="order"
                        defaultValue={editingProfile?.order || testimonial.profiles?.length || 0}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.testimonials.testimonialText')} ({t('common.english')})
                      </label>
                      <textarea
                        name="testimonialTextEn"
                        defaultValue={editingProfile?.testimonialTextEn || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-32 resize-none"
                        placeholder="Enter what this customer said in English"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.testimonials.testimonialText')} ({t('common.arabic')})
                      </label>
                      <textarea
                        name="testimonialTextAr"
                        defaultValue={editingProfile?.testimonialTextAr || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-32 resize-none text-right"
                        dir="rtl"
                        placeholder="أدخل ما قاله هذا العميل بالعربية"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.testimonials.testimonialImage')}
                    </label>
                    <input
                      type="file"
                      name="testimonialImage"
                      accept="image/*"
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)]"
                    />
                    {editingProfile?.testimonialImageUrl && (
                      <div className="mt-4">
                        <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">{t('pages.testimonials.currentImage')}</p>
                        <img
                          src={getImageUrl(editingProfile.testimonialImageUrl)}
                          alt="Testimonial"
                          className="w-full max-w-md h-auto rounded-lg border border-[var(--color-admin-border)]"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg"
                    >
                      {editingProfile ? t('pages.testimonials.editProfile') : t('pages.testimonials.addProfile')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileForm(false);
                        setEditingProfile(null);
                      }}
                      className="bg-[var(--color-admin-muted)] text-[var(--color-admin-text)] px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-border)] transition-all"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Profiles List */}
            <div className="p-6">
              {testimonial.profiles?.length === 0 ? (
                <div className="text-center py-16 bg-[var(--color-admin-muted)] rounded-xl border-2 border-dashed border-[var(--color-admin-border)]">
                  <svg className="mx-auto h-16 w-16 text-[var(--color-admin-text-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="mt-4 text-sm font-medium text-[var(--color-admin-text)]">{t('pages.testimonials.noProfilesYet')}</p>
                  <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">{t('pages.testimonials.getStarted')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonial.profiles?.map((profile) => (
                    <div
                      key={profile.id}
                      className="border border-[var(--color-admin-border)] rounded-xl p-6 bg-[var(--color-admin-surface)] hover:shadow-xl transition-all"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={getImageUrl(profile.imageUrl)}
                          alt={profile.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-admin-border)]"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-[var(--color-admin-text)]">{profile.name}</h3>
                          <p className="text-sm text-[var(--color-admin-text-muted)]">{profile.role}</p>
                          <span className="text-xs text-[var(--color-admin-text-light)] bg-[var(--color-admin-muted)] px-2 py-1 rounded mt-1 inline-block">
                            {t('form.order')}: {profile.order}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4 border-t border-[var(--color-admin-border)]">
                        <button
                          onClick={() => {
                            setEditingProfile(profile);
                            setShowProfileForm(true);
                          }}
                          className="flex-1 bg-[var(--color-admin-primary-light)] text-[var(--color-admin-primary)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-primary)]/20 transition-all"
                        >
                          {t('common.edit')}
                        </button>
                        <button
                          onClick={() => handleDeleteProfile(profile.id)}
                          className="flex-1 bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-danger)]/20 transition-all"
                        >
                          {t('common.delete')}
                        </button>
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

export default TestimonialManager;
