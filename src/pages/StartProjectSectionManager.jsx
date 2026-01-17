import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getActiveStartProjectSection,
  createStartProjectSection,
  updateStartProjectSection,
} from '../api/startProjectSection';
import { showSuccess, showError, t } from '../utils/i18nHelpers';

const StartProjectSectionManager = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [startProjectSection, setStartProjectSection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStartProjectSection();
  }, []);

  const fetchStartProjectSection = async () => {
    try {
      setLoading(true);
      const response = await getActiveStartProjectSection();
      setStartProjectSection(response.data);
    } catch (error) {
      console.error('Error fetching start project section:', error);
      // If no section exists, that's okay - we'll show create form
      setStartProjectSection(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get('backgroundImage');
    
    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      descriptionEn: formData.get('descriptionEn'),
      descriptionAr: formData.get('descriptionAr'),
      button1TextEn: formData.get('button1TextEn'),
      button1TextAr: formData.get('button1TextAr'),
      button1Link: formData.get('button1Link') || '',
      button2TextEn: formData.get('button2TextEn'),
      button2TextAr: formData.get('button2TextAr'),
      button2Link: formData.get('button2Link') || '',
      isActive: formData.get('isActive') === 'on',
      backgroundImage: file instanceof File && file.size > 0 ? file : null,
      backgroundImageUrl: formData.get('backgroundImageUrl') || '',
    };

    try {
      if (startProjectSection) {
        await updateStartProjectSection(startProjectSection.id, data);
        showSuccess('updated', t('sidebar.startProject'));
      } else {
        await createStartProjectSection(data);
        showSuccess('created', t('sidebar.startProject'));
      }
      fetchStartProjectSection();
    } catch (error) {
      console.error('Error saving start project section:', error);
      showError('failedToSave', t('sidebar.startProject'));
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-admin-text)] mb-2">{t('sidebar.startProject')}</h1>
          <p className="text-[var(--color-admin-text-muted)]">{t('pages.startProject.description')}</p>
        </div>

        {/* Form */}
        <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
          <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
            <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.startProject.sectionContent')}</h2>
            <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.startProject.updateContent')}</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                  {t('form.titleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                </label>
                <input
                  type="text"
                  name="titleEn"
                  defaultValue={startProjectSection?.titleEn || 'Start your project with us'}
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                  placeholder="Start your project with us"
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
                  defaultValue={startProjectSection?.titleAr || 'ابدأ مشروعك معنا'}
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                  placeholder="ابدأ مشروعك معنا"
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
                  defaultValue={startProjectSection?.descriptionEn || 'From building materials to heavy equipment — our team is ready to equip your project completely and at the best prices.'}
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-28 resize-none placeholder-[var(--color-admin-text-light)]"
                  placeholder={t('pages.startProject.enterEnglishDescription')}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                  {t('form.descriptionAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                </label>
                <textarea
                  name="descriptionAr"
                  defaultValue={startProjectSection?.descriptionAr || 'من مواد البناء إلى المعدات الثقيلة — فريقنا جاهز لتجهيز مشروعك بالكامل وبأفضل الأسعار.'}
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-28 resize-none text-right placeholder-[var(--color-admin-text-light)]"
                  placeholder={t('pages.startProject.enterArabicDescription')}
                  dir="rtl"
                  required
                />
              </div>
            </div>

            {/* Background Image */}
            <div>
              <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                {t('pages.startProject.backgroundImage')} {!startProjectSection && <span className="text-[var(--color-admin-danger)]">*</span>}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="file"
                    name="backgroundImage"
                    accept="image/*"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)] hover:file:bg-[var(--color-admin-primary)]/20"
                    required={!startProjectSection}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="backgroundImageUrl"
                    defaultValue={startProjectSection?.backgroundImageUrl || ''}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                    placeholder={t('pages.startProject.backgroundImageUrl')}
                  />
                  <p className="text-xs text-[var(--color-admin-text-muted)] mt-2">
                    {t('pages.startProject.backgroundImageHelp')}
                  </p>
                </div>
              </div>
              {startProjectSection?.backgroundImageUrl && (
                <div className="mt-4">
                  <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">{t('pages.startProject.currentImage')}</p>
                  <img
                    src={getImageUrl(startProjectSection.backgroundImageUrl)}
                    alt="Background"
                    className="w-full max-w-2xl h-64 object-cover rounded-lg border border-[var(--color-admin-border)]"
                  />
                </div>
              )}
            </div>

            {/* Button 1 (Talk to Expert) */}
            <div className="border-t border-[var(--color-admin-border)] pt-6">
              <h3 className="text-lg font-semibold text-[var(--color-admin-text)] mb-4">{t('pages.startProject.button1')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.buttonTextEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="button1TextEn"
                    defaultValue={startProjectSection?.button1TextEn || 'Talk to an expert'}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                    placeholder="Talk to an expert"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.buttonTextAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="button1TextAr"
                    defaultValue={startProjectSection?.button1TextAr || 'تحدث مع خبير'}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    placeholder="تحدث مع خبير"
                    dir="rtl"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.startProject.buttonLink')} <span className="text-[var(--color-admin-text-muted)] font-normal">({t('common.optional')})</span>
                  </label>
                  <input
                    type="text"
                    name="button1Link"
                    defaultValue={startProjectSection?.button1Link || ''}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                    placeholder="#contact or /contact"
                  />
                </div>
              </div>
            </div>

            {/* Button 2 (Start Order) */}
            <div className="border-t border-[var(--color-admin-border)] pt-6">
              <h3 className="text-lg font-semibold text-[var(--color-admin-text)] mb-4">{t('pages.startProject.button2')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.buttonTextEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="button2TextEn"
                    defaultValue={startProjectSection?.button2TextEn || 'Start your order now'}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                    placeholder="Start your order now"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.buttonTextAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="button2TextAr"
                    defaultValue={startProjectSection?.button2TextAr || 'ابدأ طلبك الآن'}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right placeholder-[var(--color-admin-text-light)]"
                    placeholder="ابدأ طلبك الآن"
                    dir="rtl"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.startProject.buttonLink')} <span className="text-[var(--color-admin-text-muted)] font-normal">({t('common.optional')})</span>
                  </label>
                  <input
                    type="text"
                    name="button2Link"
                    defaultValue={startProjectSection?.button2Link || ''}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all placeholder-[var(--color-admin-text-light)]"
                    placeholder="#order or /order"
                  />
                </div>
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-admin-border)]">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                defaultChecked={startProjectSection?.isActive !== false}
                className="w-5 h-5 rounded border-[var(--color-admin-border)] text-[var(--color-admin-primary)] focus:ring-[var(--color-admin-primary)]"
              />
              <label htmlFor="isActive" className="text-sm font-semibold text-[var(--color-admin-text)]">
                {t('common.active')} ({t('common.visibleOnWebsite')})
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-[var(--color-admin-border)]">
              <button
                type="submit"
                className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {startProjectSection ? t('common.update') + ' ' + t('pages.startProject.sectionContent') : t('common.create') + ' ' + t('pages.startProject.sectionContent')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StartProjectSectionManager;
