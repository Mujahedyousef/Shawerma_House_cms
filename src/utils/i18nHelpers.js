import i18n from '../i18n/i18n';

/**
 * Helper function to show success messages
 */
export const showSuccess = (messageKey, itemName = '') => {
  const message = i18n.t(`messages.success.${messageKey}`);
  const fullMessage = itemName ? `${itemName} ${message}` : message;
  alert(fullMessage);
  return fullMessage;
};

/**
 * Helper function to show error messages
 */
export const showError = (messageKey, customMessage = '') => {
  const message = customMessage || i18n.t(`messages.error.${messageKey}`);
  alert(message);
  return message;
};

/**
 * Helper function to show confirmation dialogs
 */
export const showConfirm = (messageKey, customMessage = '') => {
  const message = customMessage || i18n.t(`messages.confirm.${messageKey}`);
  return window.confirm(message);
};

/**
 * Helper function to show info messages
 */
export const showInfo = (messageKey, customMessage = '') => {
  const message = customMessage || i18n.t(`messages.info.${messageKey}`);
  alert(message);
  return message;
};

/**
 * Get translated text with fallback
 */
export const t = (key, defaultValue = '') => {
  return i18n.t(key, defaultValue);
};

/**
 * Check if current language is RTL
 */
export const isRTL = () => {
  return i18n.language === 'ar';
};

/**
 * Get current language
 */
export const getCurrentLanguage = () => {
  return i18n.language;
};

/**
 * Change language
 */
export const changeLanguage = (lang) => {
  return i18n.changeLanguage(lang);
};

export default {
  showSuccess,
  showError,
  showConfirm,
  showInfo,
  t,
  isRTL,
  getCurrentLanguage,
  changeLanguage,
};

