import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getThemeSettings, updateThemeSettings } from '../api/theme';
import { showSuccess, showError } from '../utils/i18nHelpers';

const ThemeManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getThemeSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching theme settings:', error);
      showError('failedToLoad', t('pages.theme.title'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      // Brand colors
      colorBrand: formData.get('colorBrand'),
      colorBrandDark: formData.get('colorBrandDark'),
      colorAccent: formData.get('colorAccent'),
      colorDestructive: formData.get('colorDestructive'),
      colorWarning: formData.get('colorWarning'),
      colorInfo: formData.get('colorInfo'),
      colorRing: formData.get('colorRing'),

      // Light Mode Colors
      colorBg1: formData.get('colorBg1'),
      colorBg2: formData.get('colorBg2'),
      colorCard: formData.get('colorCard'),
      colorBorder: formData.get('colorBorder'),
      colorText: formData.get('colorText'),
      colorText2: formData.get('colorText2'),
      colorTextMuted: formData.get('colorTextMuted'),
      colorTextMuted2: formData.get('colorTextMuted2'),

      // Dark Mode Colors
      colorBg1Dark: formData.get('colorBg1Dark'),
      colorBg2Dark: formData.get('colorBg2Dark'),
      colorCardDark: formData.get('colorCardDark'),
      colorBorderDark: formData.get('colorBorderDark'),
      colorTextDark: formData.get('colorTextDark'),
      colorText2Dark: formData.get('colorText2Dark'),
      colorTextMutedDark: formData.get('colorTextMutedDark'),
      colorTextMuted2Dark: formData.get('colorTextMuted2Dark'),

      // Button Colors - Light Mode
      colorButtonPrimaryBg: formData.get('colorButtonPrimaryBg'),
      colorButtonPrimaryBgHover: formData.get('colorButtonPrimaryBgHover'),
      colorButtonPrimaryText: formData.get('colorButtonPrimaryText'),
      colorButtonPrimaryTextHover: formData.get('colorButtonPrimaryTextHover'),
      colorButtonSecondaryBg: formData.get('colorButtonSecondaryBg'),
      colorButtonSecondaryBgHover: formData.get('colorButtonSecondaryBgHover'),
      colorButtonSecondaryText: formData.get('colorButtonSecondaryText'),
      colorButtonSecondaryTextHover: formData.get('colorButtonSecondaryTextHover'),

      // Button Colors - Dark Mode
      colorButtonPrimaryBgDark: formData.get('colorButtonPrimaryBgDark'),
      colorButtonPrimaryBgHoverDark: formData.get('colorButtonPrimaryBgHoverDark'),
      colorButtonPrimaryTextDark: formData.get('colorButtonPrimaryTextDark'),
      colorButtonPrimaryTextHoverDark: formData.get('colorButtonPrimaryTextHoverDark'),
      colorButtonSecondaryBgDark: formData.get('colorButtonSecondaryBgDark'),
      colorButtonSecondaryBgHoverDark: formData.get('colorButtonSecondaryBgHoverDark'),
      colorButtonSecondaryTextDark: formData.get('colorButtonSecondaryTextDark'),
      colorButtonSecondaryTextHoverDark: formData.get('colorButtonSecondaryTextHoverDark'),

      // Fonts
      fontFamily: formData.get('fontFamily'),
      fontFamilyAr: formData.get('fontFamilyAr'),
    };

    try {
      setSaving(true);
      await updateThemeSettings(data);
      showSuccess('saved', t('pages.theme.title'));
      fetchSettings();
    } catch (error) {
      console.error('Error updating theme settings:', error);
      showError('failedToSave', t('pages.theme.title'));
    } finally {
      setSaving(false);
    }
  };

  const handleColorChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  if (loading) {
    return (
      <div className="p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center">{t('common.loading')}</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center text-red-600">{t('messages.error.failedToLoad')} {t('pages.theme.title')}</div>
      </div>
    );
  }

  return (
    <div className="p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold mb-8">{t('pages.theme.title')}</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleUpdateSettings} className="space-y-8">
          {/* Brand Colors */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-2xl font-semibold mb-4">{t('pages.theme.brandColors')}</h2>
            <p className="text-sm text-gray-600 mb-4">{t('pages.theme.brandColorsDesc')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="colorBrand" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.brandColor')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorBrand"
                    name="colorBrand"
                    value={settings.colorBrand || '#3daae1'}
                    onChange={e => handleColorChange('colorBrand', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                    required
                  />
                  <input
                    type="text"
                    value={settings.colorBrand || '#3daae1'}
                    onChange={e => handleColorChange('colorBrand', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#3daae1"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="colorBrandDark" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.brandDarkColor')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorBrandDark"
                    name="colorBrandDark"
                    value={settings.colorBrandDark || '#1c90ce'}
                    onChange={e => handleColorChange('colorBrandDark', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                    required
                  />
                  <input
                    type="text"
                    value={settings.colorBrandDark || '#1c90ce'}
                    onChange={e => handleColorChange('colorBrandDark', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#1c90ce"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Accent & Semantic Colors */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-2xl font-semibold mb-4">{t('pages.theme.accentColors')}</h2>
            <p className="text-sm text-gray-600 mb-4">{t('pages.theme.accentColorsDesc')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="colorAccent" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.accentColor')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorAccent"
                    name="colorAccent"
                    value={settings.colorAccent || '#22c55e'}
                    onChange={e => handleColorChange('colorAccent', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                    required
                  />
                  <input
                    type="text"
                    value={settings.colorAccent || '#22c55e'}
                    onChange={e => handleColorChange('colorAccent', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#22c55e"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="colorRing" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.ringFocusColor')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorRing"
                    name="colorRing"
                    value={settings.colorRing || settings.colorBrand || '#3daae1'}
                    onChange={e => handleColorChange('colorRing', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                    required
                  />
                  <input
                    type="text"
                    value={settings.colorRing || settings.colorBrand || '#3daae1'}
                    onChange={e => handleColorChange('colorRing', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#3daae1"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="colorDestructive" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.destructiveError')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorDestructive"
                    name="colorDestructive"
                    value={settings.colorDestructive || '#ef4444'}
                    onChange={e => handleColorChange('colorDestructive', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                    required
                  />
                  <input
                    type="text"
                    value={settings.colorDestructive || '#ef4444'}
                    onChange={e => handleColorChange('colorDestructive', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#ef4444"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="colorWarning" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.warning')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorWarning"
                    name="colorWarning"
                    value={settings.colorWarning || '#f59e0b'}
                    onChange={e => handleColorChange('colorWarning', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                    required
                  />
                  <input
                    type="text"
                    value={settings.colorWarning || '#f59e0b'}
                    onChange={e => handleColorChange('colorWarning', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#f59e0b"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="colorInfo" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.info')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorInfo"
                    name="colorInfo"
                    value={settings.colorInfo || '#3b82f6'}
                    onChange={e => handleColorChange('colorInfo', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                    required
                  />
                  <input
                    type="text"
                    value={settings.colorInfo || '#3b82f6'}
                    onChange={e => handleColorChange('colorInfo', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#3b82f6"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Light Mode Colors */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-2xl font-semibold mb-4">{t('pages.theme.lightMode')}</h2>
            <p className="text-sm text-gray-600 mb-4">{t('pages.theme.lightModeDesc')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="colorBg1" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.background1')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorBg1"
                    name="colorBg1"
                    value={settings.colorBg1 || '#f1f5f9'}
                    onChange={e => handleColorChange('colorBg1', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.colorBg1 || '#f1f5f9'}
                    onChange={e => handleColorChange('colorBg1', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#f1f5f9"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="colorBg2" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.background2')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorBg2"
                    name="colorBg2"
                    value={settings.colorBg2 || '#ffffff'}
                    onChange={e => handleColorChange('colorBg2', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.colorBg2 || '#ffffff'}
                    onChange={e => handleColorChange('colorBg2', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="colorCard" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.cardBackground')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorCard"
                    name="colorCard"
                    value={settings.colorCard || '#ffffff'}
                    onChange={e => handleColorChange('colorCard', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.colorCard || '#ffffff'}
                    onChange={e => handleColorChange('colorCard', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="colorBorder" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.borderColor')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorBorder"
                    name="colorBorder"
                    value={settings.colorBorder || '#e5e7eb'}
                    onChange={e => handleColorChange('colorBorder', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.colorBorder || '#e5e7eb'}
                    onChange={e => handleColorChange('colorBorder', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#e5e7eb"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="colorText" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.textColor')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorText"
                    name="colorText"
                    value={settings.colorText || '#020617'}
                    onChange={e => handleColorChange('colorText', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.colorText || '#020617'}
                    onChange={e => handleColorChange('colorText', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#020617"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="colorText2" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.textColor2')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorText2"
                    name="colorText2"
                    value={settings.colorText2 || '#64748b'}
                    onChange={e => handleColorChange('colorText2', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.colorText2 || '#64748b'}
                    onChange={e => handleColorChange('colorText2', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#64748b"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="colorTextMuted" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.textMuted')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorTextMuted"
                    name="colorTextMuted"
                    value={settings.colorTextMuted || '#64748b'}
                    onChange={e => handleColorChange('colorTextMuted', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.colorTextMuted || '#64748b'}
                    onChange={e => handleColorChange('colorTextMuted', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#64748b"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="colorTextMuted2" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.textMuted2')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorTextMuted2"
                    name="colorTextMuted2"
                    value={settings.colorTextMuted2 || '#94a3b8'}
                    onChange={e => handleColorChange('colorTextMuted2', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.colorTextMuted2 || '#94a3b8'}
                    onChange={e => handleColorChange('colorTextMuted2', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#94a3b8"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dark Mode Colors */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-2xl font-semibold mb-4">{t('pages.theme.darkMode')}</h2>
            <p className="text-sm text-gray-600 mb-4">{t('pages.theme.darkModeDesc')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="colorBg1Dark" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.background1Dark')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorBg1Dark"
                    name="colorBg1Dark"
                    value={settings.colorBg1Dark || '#020617'}
                    onChange={e => handleColorChange('colorBg1Dark', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.colorBg1Dark || '#020617'}
                    onChange={e => handleColorChange('colorBg1Dark', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#020617"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="colorBg2Dark" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.background2Dark')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorBg2Dark"
                    name="colorBg2Dark"
                    value={settings.colorBg2Dark || '#0f172a'}
                    onChange={e => handleColorChange('colorBg2Dark', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.colorBg2Dark || '#0f172a'}
                    onChange={e => handleColorChange('colorBg2Dark', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#0f172a"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="colorCardDark" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.cardBackgroundDark')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorCardDark"
                    name="colorCardDark"
                    value={settings.colorCardDark || '#1e293b'}
                    onChange={e => handleColorChange('colorCardDark', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.colorCardDark || '#1e293b'}
                    onChange={e => handleColorChange('colorCardDark', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#1e293b"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="colorBorderDark" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.borderColorDark')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorBorderDark"
                    name="colorBorderDark"
                    value={settings.colorBorderDark || '#334155'}
                    onChange={e => handleColorChange('colorBorderDark', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.colorBorderDark || '#334155'}
                    onChange={e => handleColorChange('colorBorderDark', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#334155"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="colorTextDark" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.textColorDark')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorTextDark"
                    name="colorTextDark"
                    value={settings.colorTextDark || '#ffffff'}
                    onChange={e => handleColorChange('colorTextDark', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.colorTextDark || '#ffffff'}
                    onChange={e => handleColorChange('colorTextDark', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="colorText2Dark" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.textColor2Dark')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorText2Dark"
                    name="colorText2Dark"
                    value={settings.colorText2Dark || '#cbd5e1'}
                    onChange={e => handleColorChange('colorText2Dark', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.colorText2Dark || '#cbd5e1'}
                    onChange={e => handleColorChange('colorText2Dark', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#cbd5e1"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="colorTextMutedDark" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.textMutedDark')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorTextMutedDark"
                    name="colorTextMutedDark"
                    value={settings.colorTextMutedDark || '#cbd5e1'}
                    onChange={e => handleColorChange('colorTextMutedDark', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.colorTextMutedDark || '#cbd5e1'}
                    onChange={e => handleColorChange('colorTextMutedDark', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#cbd5e1"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="colorTextMuted2Dark" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.textMuted2Dark')} <span className="text-red-500">*</span>
                </label>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="color"
                    id="colorTextMuted2Dark"
                    name="colorTextMuted2Dark"
                    value={settings.colorTextMuted2Dark || '#94a3b8'}
                    onChange={e => handleColorChange('colorTextMuted2Dark', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.colorTextMuted2Dark || '#94a3b8'}
                    onChange={e => handleColorChange('colorTextMuted2Dark', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#94a3b8"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Button Colors - Light Mode */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-2xl font-semibold mb-4">{t('pages.theme.buttonColorsLightMode')}</h2>
            <p className="text-sm text-gray-600 mb-4">{t('pages.theme.buttonColorsLightModeDesc')}</p>
            <div className="space-y-6">
              {/* Primary Button */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('pages.theme.primaryButton')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="colorButtonPrimaryBg" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.theme.buttonBackground')} <span className="text-red-500">*</span>
                    </label>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="color"
                        id="colorButtonPrimaryBg"
                        name="colorButtonPrimaryBg"
                        value={settings.colorButtonPrimaryBg || '#020617'}
                        onChange={e => handleColorChange('colorButtonPrimaryBg', e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.colorButtonPrimaryBg || '#020617'}
                        onChange={e => handleColorChange('colorButtonPrimaryBg', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#020617"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="colorButtonPrimaryBgHover" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.theme.hoverBackground')} <span className="text-red-500">*</span>
                    </label>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="color"
                        id="colorButtonPrimaryBgHover"
                        name="colorButtonPrimaryBgHover"
                        value={settings.colorButtonPrimaryBgHover || '#0f172a'}
                        onChange={e => handleColorChange('colorButtonPrimaryBgHover', e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.colorButtonPrimaryBgHover || '#0f172a'}
                        onChange={e => handleColorChange('colorButtonPrimaryBgHover', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#0f172a"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="colorButtonPrimaryText" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.theme.buttonText')} <span className="text-red-500">*</span>
                    </label>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="color"
                        id="colorButtonPrimaryText"
                        name="colorButtonPrimaryText"
                        value={settings.colorButtonPrimaryText || '#ffffff'}
                        onChange={e => handleColorChange('colorButtonPrimaryText', e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.colorButtonPrimaryText || '#ffffff'}
                        onChange={e => handleColorChange('colorButtonPrimaryText', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="colorButtonPrimaryTextHover" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.theme.hoverText')} <span className="text-red-500">*</span>
                    </label>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="color"
                        id="colorButtonPrimaryTextHover"
                        name="colorButtonPrimaryTextHover"
                        value={settings.colorButtonPrimaryTextHover || '#ffffff'}
                        onChange={e => handleColorChange('colorButtonPrimaryTextHover', e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.colorButtonPrimaryTextHover || '#ffffff'}
                        onChange={e => handleColorChange('colorButtonPrimaryTextHover', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Secondary Button */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('pages.theme.secondaryButton')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="colorButtonSecondaryBg" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.theme.buttonBackground')} <span className="text-red-500">*</span>
                    </label>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="color"
                        id="colorButtonSecondaryBg"
                        name="colorButtonSecondaryBg"
                        value={settings.colorButtonSecondaryBg || 'transparent'}
                        onChange={e => handleColorChange('colorButtonSecondaryBg', e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.colorButtonSecondaryBg || 'transparent'}
                        onChange={e => handleColorChange('colorButtonSecondaryBg', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="colorButtonSecondaryBgHover" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.theme.hoverBackground')} <span className="text-red-500">*</span>
                    </label>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="color"
                        id="colorButtonSecondaryBgHover"
                        name="colorButtonSecondaryBgHover"
                        value={settings.colorButtonSecondaryBgHover || '#f1f5f9'}
                        onChange={e => handleColorChange('colorButtonSecondaryBgHover', e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.colorButtonSecondaryBgHover || '#f1f5f9'}
                        onChange={e => handleColorChange('colorButtonSecondaryBgHover', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#f1f5f9"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="colorButtonSecondaryText" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.theme.buttonText')} <span className="text-red-500">*</span>
                    </label>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="color"
                        id="colorButtonSecondaryText"
                        name="colorButtonSecondaryText"
                        value={settings.colorButtonSecondaryText || '#020617'}
                        onChange={e => handleColorChange('colorButtonSecondaryText', e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.colorButtonSecondaryText || '#020617'}
                        onChange={e => handleColorChange('colorButtonSecondaryText', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#020617"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="colorButtonSecondaryTextHover" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.theme.hoverText')} <span className="text-red-500">*</span>
                    </label>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="color"
                        id="colorButtonSecondaryTextHover"
                        name="colorButtonSecondaryTextHover"
                        value={settings.colorButtonSecondaryTextHover || '#020617'}
                        onChange={e => handleColorChange('colorButtonSecondaryTextHover', e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.colorButtonSecondaryTextHover || '#020617'}
                        onChange={e => handleColorChange('colorButtonSecondaryTextHover', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#020617"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Button Colors - Dark Mode */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-2xl font-semibold mb-4">{t('pages.theme.buttonColorsDarkMode')}</h2>
            <p className="text-sm text-gray-600 mb-4">{t('pages.theme.buttonColorsDarkModeDesc')}</p>
            <div className="space-y-6">
              {/* Primary Button Dark */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('pages.theme.primaryButton')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="colorButtonPrimaryBgDark" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.theme.buttonBackground')} <span className="text-red-500">*</span>
                    </label>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="color"
                        id="colorButtonPrimaryBgDark"
                        name="colorButtonPrimaryBgDark"
                        value={settings.colorButtonPrimaryBgDark || '#ffffff'}
                        onChange={e => handleColorChange('colorButtonPrimaryBgDark', e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.colorButtonPrimaryBgDark || '#ffffff'}
                        onChange={e => handleColorChange('colorButtonPrimaryBgDark', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="colorButtonPrimaryBgHoverDark" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.theme.hoverBackground')} <span className="text-red-500">*</span>
                    </label>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="color"
                        id="colorButtonPrimaryBgHoverDark"
                        name="colorButtonPrimaryBgHoverDark"
                        value={settings.colorButtonPrimaryBgHoverDark || '#f1f5f9'}
                        onChange={e => handleColorChange('colorButtonPrimaryBgHoverDark', e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.colorButtonPrimaryBgHoverDark || '#f1f5f9'}
                        onChange={e => handleColorChange('colorButtonPrimaryBgHoverDark', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#f1f5f9"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="colorButtonPrimaryTextDark" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.theme.buttonText')} <span className="text-red-500">*</span>
                    </label>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="color"
                        id="colorButtonPrimaryTextDark"
                        name="colorButtonPrimaryTextDark"
                        value={settings.colorButtonPrimaryTextDark || '#020617'}
                        onChange={e => handleColorChange('colorButtonPrimaryTextDark', e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.colorButtonPrimaryTextDark || '#020617'}
                        onChange={e => handleColorChange('colorButtonPrimaryTextDark', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#020617"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="colorButtonPrimaryTextHoverDark" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.theme.hoverText')} <span className="text-red-500">*</span>
                    </label>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="color"
                        id="colorButtonPrimaryTextHoverDark"
                        name="colorButtonPrimaryTextHoverDark"
                        value={settings.colorButtonPrimaryTextHoverDark || '#020617'}
                        onChange={e => handleColorChange('colorButtonPrimaryTextHoverDark', e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.colorButtonPrimaryTextHoverDark || '#020617'}
                        onChange={e => handleColorChange('colorButtonPrimaryTextHoverDark', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#020617"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Secondary Button Dark */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('pages.theme.secondaryButton')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="colorButtonSecondaryBgDark" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.theme.buttonBackground')} <span className="text-red-500">*</span>
                    </label>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="color"
                        id="colorButtonSecondaryBgDark"
                        name="colorButtonSecondaryBgDark"
                        value={settings.colorButtonSecondaryBgDark || 'transparent'}
                        onChange={e => handleColorChange('colorButtonSecondaryBgDark', e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.colorButtonSecondaryBgDark || 'transparent'}
                        onChange={e => handleColorChange('colorButtonSecondaryBgDark', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="colorButtonSecondaryBgHoverDark" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.theme.hoverBackground')} <span className="text-red-500">*</span>
                    </label>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="color"
                        id="colorButtonSecondaryBgHoverDark"
                        name="colorButtonSecondaryBgHoverDark"
                        value={settings.colorButtonSecondaryBgHoverDark || '#1e293b'}
                        onChange={e => handleColorChange('colorButtonSecondaryBgHoverDark', e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.colorButtonSecondaryBgHoverDark || '#1e293b'}
                        onChange={e => handleColorChange('colorButtonSecondaryBgHoverDark', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#1e293b"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="colorButtonSecondaryTextDark" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.theme.buttonText')} <span className="text-red-500">*</span>
                    </label>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="color"
                        id="colorButtonSecondaryTextDark"
                        name="colorButtonSecondaryTextDark"
                        value={settings.colorButtonSecondaryTextDark || '#ffffff'}
                        onChange={e => handleColorChange('colorButtonSecondaryTextDark', e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.colorButtonSecondaryTextDark || '#ffffff'}
                        onChange={e => handleColorChange('colorButtonSecondaryTextDark', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="colorButtonSecondaryTextHoverDark" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.theme.hoverText')} <span className="text-red-500">*</span>
                    </label>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="color"
                        id="colorButtonSecondaryTextHoverDark"
                        name="colorButtonSecondaryTextHoverDark"
                        value={settings.colorButtonSecondaryTextHoverDark || '#ffffff'}
                        onChange={e => handleColorChange('colorButtonSecondaryTextHoverDark', e.target.value)}
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.colorButtonSecondaryTextHoverDark || '#ffffff'}
                        onChange={e => handleColorChange('colorButtonSecondaryTextHoverDark', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Font Settings */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-2xl font-semibold mb-4">{t('pages.theme.fonts')}</h2>
            <p className="text-sm text-gray-600 mb-4">{t('pages.theme.fontsDesc')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.englishFontFamily')} <span className="text-red-500">*</span>
                </label>
                <select
                  id="fontFamily"
                  name="fontFamily"
                  value={settings.fontFamily || 'Inter'}
                  onChange={e => handleColorChange('fontFamily', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Raleway">Raleway</option>
                  <option value="Nunito">Nunito</option>
                  <option value="Source Sans Pro">Source Sans Pro</option>
                  <option value="Ubuntu">Ubuntu</option>
                  <option value="Merriweather">Merriweather</option>
                  <option value="PT Sans">PT Sans</option>
                  <option value="Oswald">Oswald</option>
                  <option value="Lora">Lora</option>
                  <option value="Roboto Condensed">Roboto Condensed</option>
                  <option value="Dancing Script">Dancing Script</option>
                  <option value="Bebas Neue">Bebas Neue</option>
                  <option value="Fira Sans">Fira Sans</option>
                  <option value="Work Sans">Work Sans</option>
                  <option value="Quicksand">Quicksand</option>
                  <option value="Comfortaa">Comfortaa</option>
                  <option value="Rubik">Rubik</option>
                  <option value="Karla">Karla</option>
                  <option value="Crimson Text">Crimson Text</option>
                  <option value="Libre Baskerville">Libre Baskerville</option>
                  <option value="PT Serif">PT Serif</option>
                  <option value="Abril Fatface">Abril Fatface</option>
                  <option value="Pacifico">Pacifico</option>
                  <option value="Righteous">Righteous</option>
                  <option value="Bangers">Bangers</option>
                  <option value="Lobster">Lobster</option>
                  <option value="Satisfy">Satisfy</option>
                </select>
              </div>
              <div>
                <label htmlFor="fontFamilyAr" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.theme.arabicFontFamily')} <span className="text-red-500">*</span>
                </label>
                <select
                  id="fontFamilyAr"
                  name="fontFamilyAr"
                  value={settings.fontFamilyAr || 'Tajawal'}
                  onChange={e => handleColorChange('fontFamilyAr', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Tajawal">Tajawal</option>
                  <option value="Cairo">Cairo</option>
                  <option value="Almarai">Almarai</option>
                  <option value="Amiri">Amiri</option>
                  <option value="Noto Sans Arabic">Noto Sans Arabic</option>
                  <option value="IBM Plex Sans Arabic">IBM Plex Sans Arabic</option>
                  <option value="Changa">Changa</option>
                  <option value="El Messiri">El Messiri</option>
                  <option value="Reem Kufi">Reem Kufi</option>
                  <option value="Harmattan">Harmattan</option>
                  <option value="Markazi Text">Markazi Text</option>
                  <option value="Aladin">Aladin</option>
                  <option value="Aref Ruqaa">Aref Ruqaa</option>
                  <option value="Lalezar">Lalezar</option>
                  <option value="Mada">Mada</option>
                  <option value="Mirza">Mirza</option>
                  <option value="Rakkas">Rakkas</option>
                  <option value="Scheherazade New">Scheherazade New</option>
                  <option value="Vibes">Vibes</option>
                  <option value="Al Qalam Al Hindi">Al Qalam Al Hindi</option>
                  <option value="Almendra">Almendra</option>
                  <option value="Aref Ruqaa Ink">Aref Ruqaa Ink</option>
                  <option value="Baloo Bhaijaan 2">Baloo Bhaijaan 2</option>
                  <option value="Cairo Play">Cairo Play</option>
                  <option value="Noto Kufi Arabic">Noto Kufi Arabic</option>
                  <option value="Rubik">Rubik (Arabic support)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Color Preview */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-2xl font-semibold mb-4">{t('pages.theme.colorPreview')}</h2>
            <p className="text-sm text-gray-600 mb-4">{t('pages.theme.colorPreviewDesc')}</p>

            <div className="space-y-6">
              {/* Brand Colors Preview */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('pages.theme.brandColors')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg border border-gray-200">
                    <div className="w-full h-16 rounded mb-2" style={{ backgroundColor: settings.colorBrand || '#3daae1' }} />
                    <p className="text-xs text-gray-600">{t('pages.theme.brand')}</p>
                    <p className="text-xs text-gray-500">{settings.colorBrand || '#3daae1'}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200">
                    <div className="w-full h-16 rounded mb-2" style={{ backgroundColor: settings.colorAccent || '#22c55e' }} />
                    <p className="text-xs text-gray-600">{t('pages.theme.accent')}</p>
                    <p className="text-xs text-gray-500">{settings.colorAccent || '#22c55e'}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200">
                    <div className="w-full h-16 rounded mb-2" style={{ backgroundColor: settings.colorDestructive || '#ef4444' }} />
                    <p className="text-xs text-gray-600">{t('pages.theme.destructive')}</p>
                    <p className="text-xs text-gray-500">{settings.colorDestructive || '#ef4444'}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200">
                    <div className="w-full h-16 rounded mb-2" style={{ backgroundColor: settings.colorWarning || '#f59e0b' }} />
                    <p className="text-xs text-gray-600">{t('pages.theme.warning')}</p>
                    <p className="text-xs text-gray-500">{settings.colorWarning || '#f59e0b'}</p>
                  </div>
                </div>
              </div>

              {/* Light Mode Preview */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('pages.theme.lightMode')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="p-4 rounded-lg border border-gray-200">
                    <div className="w-full h-12 rounded mb-2" style={{ backgroundColor: settings.colorBg || '#f1f5f9' }} />
                    <p className="text-xs text-gray-600">{t('pages.theme.background')}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200">
                    <div className="w-full h-12 rounded mb-2" style={{ backgroundColor: settings.colorCard || '#ffffff' }} />
                    <p className="text-xs text-gray-600">{t('pages.theme.card')}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200">
                    <div className="w-full h-12 rounded mb-2" style={{ backgroundColor: settings.colorMuted || '#f8fafc' }} />
                    <p className="text-xs text-gray-600">{t('pages.theme.muted')}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200">
                    <div className="w-full h-12 rounded mb-2 border border-gray-300" style={{ backgroundColor: settings.colorText || '#020617' }} />
                    <p className="text-xs text-gray-600">{t('pages.theme.text')}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200">
                    <div className="w-full h-12 rounded mb-2" style={{ backgroundColor: settings.colorBorder || '#e5e7eb' }} />
                    <p className="text-xs text-gray-600">{t('pages.theme.border')}</p>
                  </div>
                </div>
              </div>

              {/* Dark Mode Preview */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('pages.theme.darkMode')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-gray-800 p-6 rounded-lg">
                  <div className="p-4 rounded-lg border border-gray-600">
                    <div className="w-full h-12 rounded mb-2" style={{ backgroundColor: settings.colorBgDark || '#020617' }} />
                    <p className="text-xs text-gray-300">{t('pages.theme.background')}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-600">
                    <div className="w-full h-12 rounded mb-2" style={{ backgroundColor: settings.colorCardDark || '#020617' }} />
                    <p className="text-xs text-gray-300">{t('pages.theme.card')}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-600">
                    <div className="w-full h-12 rounded mb-2" style={{ backgroundColor: settings.colorMutedDark || '#1e293b' }} />
                    <p className="text-xs text-gray-300">{t('pages.theme.muted')}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-600">
                    <div className="w-full h-12 rounded mb-2 border border-gray-600" style={{ backgroundColor: settings.colorTextDark || '#ffffff' }} />
                    <p className="text-xs text-gray-300">{t('pages.theme.text')}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-600">
                    <div className="w-full h-12 rounded mb-2" style={{ backgroundColor: settings.colorBorderDark || '#334155' }} />
                    <p className="text-xs text-gray-300">{t('pages.theme.border')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? t('pages.theme.saving') : t('pages.theme.saveThemeSettings')}
            </button>
            <button type="button" onClick={fetchSettings} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
              {t('pages.theme.reset')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThemeManager;
