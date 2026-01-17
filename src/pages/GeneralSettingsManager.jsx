import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getGeneralSettings, updateGeneralSettings } from '../api/generalSettings';
import { showSuccess, showError, t } from '../utils/i18nHelpers';

const GeneralSettingsManager = () => {
  const { i18n } = useTranslation();
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
      const response = await getGeneralSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching general settings:', error);
      showError('failedToLoad', t('sidebar.generalSettings'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const data = {
      currencyCode: formData.get('currencyCode'),
      currencySymbol: formData.get('currencySymbol'),
      currencyNameEn: formData.get('currencyNameEn'),
      currencyNameAr: formData.get('currencyNameAr'),
    };

    try {
      setSaving(true);
      await updateGeneralSettings(data);
      showSuccess('updated', t('sidebar.generalSettings'));
      fetchSettings();
    } catch (error) {
      console.error('Error updating general settings:', error);
      showError('failedToUpdate', t('sidebar.generalSettings'));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
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
        <div className="text-center text-red-600">{t('messages.error.failedToLoad')} {t('sidebar.generalSettings')}</div>
      </div>
    );
  }

  // Common currencies for reference
  const commonCurrencies = [
    { code: 'AED', symbol: 'د.إ', nameEn: 'UAE Dirham', nameAr: 'درهم إماراتي' },
    { code: 'USD', symbol: '$', nameEn: 'US Dollar', nameAr: 'دولار أمريكي' },
    { code: 'EUR', symbol: '€', nameEn: 'Euro', nameAr: 'يورو' },
    { code: 'GBP', symbol: '£', nameEn: 'British Pound', nameAr: 'جنيه إسترليني' },
    { code: 'SAR', symbol: 'ر.س', nameEn: 'Saudi Riyal', nameAr: 'ريال سعودي' },
    { code: 'JOD', symbol: 'د.أ', nameEn: 'Jordanian Dinar', nameAr: 'دينار أردني' },
    { code: 'KWD', symbol: 'د.ك', nameEn: 'Kuwaiti Dinar', nameAr: 'دينار كويتي' },
    { code: 'BHD', symbol: '.د.ب', nameEn: 'Bahraini Dinar', nameAr: 'دينار بحريني' },
    { code: 'OMR', symbol: 'ر.ع.', nameEn: 'Omani Rial', nameAr: 'ريال عماني' },
    { code: 'QAR', symbol: 'ر.ق', nameEn: 'Qatari Riyal', nameAr: 'ريال قطري' },
  ];

  const handleCurrencySelect = (currency) => {
    setSettings({
      ...settings,
      currencyCode: currency.code,
      currencySymbol: currency.symbol,
      currencyNameEn: currency.nameEn,
      currencyNameAr: currency.nameAr,
    });
  };

  return (
    <div className="p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold mb-8">{t('sidebar.generalSettings')}</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleUpdateSettings} className="space-y-6">
          {/* Currency Settings */}
          <div>
            <h2 className="text-xl font-semibold mb-4">{t('pages.generalSettings.currencySettings')}</h2>
            
            {/* Quick Select Common Currencies */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('pages.generalSettings.quickSelectCurrencies')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {commonCurrencies.map((currency) => (
                  <button
                    key={currency.code}
                    type="button"
                    onClick={() => handleCurrencySelect(currency)}
                    className={`px-3 py-2 border rounded-md text-sm transition-colors ${
                      settings.currencyCode === currency.code
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {currency.code}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="currencyCode" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.generalSettings.currencyCode')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="currencyCode"
                  name="currencyCode"
                  value={settings.currencyCode || 'AED'}
                  onChange={(e) => handleChange('currencyCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="AED"
                  required
                  maxLength={3}
                />
                <p className="mt-1 text-xs text-gray-500">ISO 4217 currency code (e.g., AED, USD, EUR)</p>
              </div>

              <div>
                <label htmlFor="currencySymbol" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.generalSettings.currencySymbol')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="currencySymbol"
                  name="currencySymbol"
                  value={settings.currencySymbol || 'د.إ'}
                  onChange={(e) => handleChange('currencySymbol', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="د.إ"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Symbol displayed with prices (e.g., د.إ, $, €)</p>
              </div>

              <div>
                <label htmlFor="currencyNameEn" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.generalSettings.currencyNameEn')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="currencyNameEn"
                  name="currencyNameEn"
                  value={settings.currencyNameEn || 'UAE Dirham'}
                  onChange={(e) => handleChange('currencyNameEn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="UAE Dirham"
                  required
                />
              </div>

              <div>
                <label htmlFor="currencyNameAr" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('pages.generalSettings.currencyNameAr')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="currencyNameAr"
                  name="currencyNameAr"
                  value={settings.currencyNameAr || 'درهم إماراتي'}
                  onChange={(e) => handleChange('currencyNameAr', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="درهم إماراتي"
                  required
                  dir="rtl"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="text-sm font-medium text-gray-700 mb-2">{t('pages.generalSettings.preview')}:</p>
              <div className="flex gap-4">
                <div>
                  <p className="text-sm text-gray-600">{t('common.english')}:</p>
                  <p className="text-lg font-semibold">
                    1,000 {settings.currencySymbol} ({settings.currencyNameEn})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('common.arabic')}:</p>
                  <p className="text-lg font-semibold" dir="rtl">
                    {settings.currencySymbol} 1,000 ({settings.currencyNameAr})
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? t('common.saving') : t('pages.generalSettings.saveSettings')}
            </button>
            <button
              type="button"
              onClick={fetchSettings}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              {t('common.reset')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneralSettingsManager;
