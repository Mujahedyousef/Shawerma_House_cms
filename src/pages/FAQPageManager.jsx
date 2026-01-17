import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Minus, Edit, Trash2 } from 'lucide-react';
import {
  getFAQPageSettings,
  updateFAQPageSettings,
  getAllFAQItems,
  createFAQItem,
  updateFAQItem,
  deleteFAQItem,
} from '../api/faqPage';
import { showSuccess, showError, showConfirm, t } from '../utils/i18nHelpers';

const FAQPageManager = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [settings, setSettings] = useState(null);
  const [faqItems, setFaqItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('settings'); // 'settings', 'items'
  const [editingItem, setEditingItem] = useState(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [expandedItems, setExpandedItems] = useState(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsData, itemsData] = await Promise.all([
        getFAQPageSettings(),
        getAllFAQItems(),
      ]);
      setSettings(settingsData.data);
      setFaqItems(itemsData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showError('failedToLoad', t('sidebar.faqPage'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      titleEn: formData.get('titleEn'),
      titleAr: formData.get('titleAr'),
      descriptionEn: formData.get('descriptionEn'),
      descriptionAr: formData.get('descriptionAr'),
    };

    try {
      await updateFAQPageSettings(data);
      showSuccess('updated', t('sidebar.faqPage'));
      fetchData();
    } catch (error) {
      console.error('Error updating settings:', error);
      showError('failedToUpdate', t('sidebar.faqPage'));
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      questionEn: formData.get('questionEn'),
      questionAr: formData.get('questionAr'),
      answerEn: formData.get('answerEn'),
      answerAr: formData.get('answerAr'),
      order: parseInt(formData.get('order')) || faqItems.length,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      await createFAQItem(data);
      showSuccess('created', t('pages.faq.item'));
      fetchData();
      setShowItemForm(false);
      e.target.reset();
    } catch (error) {
      console.error('Error creating FAQ item:', error);
      showError('failedToCreate', t('pages.faq.item'));
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      questionEn: formData.get('questionEn'),
      questionAr: formData.get('questionAr'),
      answerEn: formData.get('answerEn'),
      answerAr: formData.get('answerAr'),
      order: parseInt(formData.get('order')) || 0,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      await updateFAQItem(editingItem.id, data);
      showSuccess('updated', t('pages.faq.item'));
      fetchData();
      setEditingItem(null);
      setShowItemForm(false);
    } catch (error) {
      console.error('Error updating FAQ item:', error);
      showError('failedToUpdate', t('pages.faq.item'));
    }
  };

  const handleDeleteItem = async (id) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteFAQItem(id);
      showSuccess('deleted', t('pages.faq.item'));
      fetchData();
    } catch (error) {
      console.error('Error deleting FAQ item:', error);
      showError('failedToDelete', t('pages.faq.item'));
    }
  };

  const toggleItem = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
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

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-admin-bg)]" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <p className="text-[var(--color-admin-text-muted)]">{t('messages.error.failedToLoad')} {t('sidebar.faqPage')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-admin-bg)] p-4 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-admin-text)] mb-2">{t('sidebar.faqPage')}</h1>
          <p className="text-[var(--color-admin-text-muted)]">{t('pages.faq.description')}</p>
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
            {t('pages.faq.pageSettings')}
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'items'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.faq.items')} <span className="ml-1 opacity-80">({faqItems.length})</span>
          </button>
        </div>

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.faq.pageSettings')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.faq.updateSettings')}</p>
            </div>
            <form onSubmit={handleUpdateSettings} className="p-6 space-y-6">
              {/* Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.titleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="titleEn"
                    defaultValue={settings.titleEn}
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
                    defaultValue={settings.titleAr}
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
                    defaultValue={settings.descriptionEn}
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
                    defaultValue={settings.descriptionAr}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-28 resize-none text-right"
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

        {/* FAQ Items Tab */}
        {activeTab === 'items' && (
          <>
            {/* Add FAQ Item Button */}
            {!showItemForm && !editingItem && (
              <div className="mb-6">
                <button
                  onClick={() => setShowItemForm(true)}
                  className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  + {t('pages.faq.addItem')}
                </button>
              </div>
            )}

            {/* Create/Edit Form */}
            {(showItemForm || editingItem) && (
              <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden mb-6">
                <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
                  <h2 className="text-xl font-bold text-[var(--color-admin-text)]">
                    {editingItem ? t('pages.faq.editItem') : t('pages.faq.addItem')}
                  </h2>
                </div>
                <form onSubmit={editingItem ? handleUpdateItem : handleCreateItem} className="p-6 space-y-6">
                  {/* Question */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.faq.question')} ({t('common.english')}) <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="questionEn"
                        defaultValue={editingItem?.questionEn || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        placeholder="e.g., Are all products displayed on the website?"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.faq.question')} ({t('common.arabic')}) <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="questionAr"
                        defaultValue={editingItem?.questionAr || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                        placeholder="مثال: هل جميع المنتجات معروضة على الموقع؟"
                        dir="rtl"
                        required
                      />
                    </div>
                  </div>

                  {/* Answer */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.faq.answer')} ({t('common.english')}) <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <textarea
                        name="answerEn"
                        defaultValue={editingItem?.answerEn || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-32 resize-none"
                        placeholder="Enter the answer..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.faq.answer')} ({t('common.arabic')}) <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <textarea
                        name="answerAr"
                        defaultValue={editingItem?.answerAr || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-32 resize-none text-right"
                        placeholder="أدخل الإجابة..."
                        dir="rtl"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('form.order')}
                      </label>
                      <input
                        type="number"
                        name="order"
                        defaultValue={editingItem?.order || faqItems.length}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        min="0"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        name="isActive"
                        id="isActive"
                        defaultChecked={editingItem?.isActive !== false}
                        className="w-5 h-5 rounded border-[var(--color-admin-border)] text-[var(--color-admin-primary)] focus:ring-[var(--color-admin-primary)]"
                      />
                      <label htmlFor="isActive" className="text-sm font-semibold text-[var(--color-admin-text)]">
                        {t('common.active')} ({t('pages.faq.visibleOnFrontend')})
                      </label>
                    </div>
                  </div>

                  <div className={`pt-4 border-t border-[var(--color-admin-border)] flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <button
                      type="submit"
                      className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      {editingItem ? t('pages.faq.updateItem') : t('pages.faq.createItem')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowItemForm(false);
                        setEditingItem(null);
                      }}
                      className="bg-[var(--color-admin-muted)] text-[var(--color-admin-text)] px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-border)] transition-all"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* FAQ Items List */}
            <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
              <div className="p-6 border-b border-[var(--color-admin-border)]">
                <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.faq.items')}</h2>
              </div>
              <div className="p-6">
                {faqItems.length === 0 ? (
                  <div className="text-center py-16 bg-[var(--color-admin-muted)] rounded-xl border-2 border-dashed border-[var(--color-admin-border)]">
                    <p className="text-sm font-medium text-[var(--color-admin-text)]">{t('pages.faq.noItemsYet')}</p>
                    <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">{t('pages.faq.getStarted')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {faqItems.map((item) => {
                      const isExpanded = expandedItems.has(item.id);
                      return (
                        <div
                          key={item.id}
                          className="border border-[var(--color-admin-border)] rounded-xl overflow-hidden bg-[var(--color-admin-surface)] hover:shadow-md transition-all"
                        >
                          {/* Question Header */}
                          <button
                            onClick={() => toggleItem(item.id)}
                            className="w-full flex items-center gap-4 p-4 text-left hover:bg-[var(--color-admin-muted)] transition-colors"
                          >
                            {/* Icon */}
                            <div className="shrink-0 w-8 h-8 rounded-full bg-[var(--color-admin-primary)] flex items-center justify-center text-white">
                              {isExpanded ? (
                                <Minus size={16} />
                              ) : (
                                <Plus size={16} />
                              )}
                            </div>
                            
                            {/* Question Number and Text */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-[var(--color-admin-text-muted)]">
                                  {String(item.order + 1).padStart(2, '0')}
                                </span>
                                <div className="flex-1">
                                  <p className="font-semibold text-[var(--color-admin-text)]">{item.questionEn}</p>
                                  <p className="text-sm text-[var(--color-admin-text-muted)] mt-1" dir="rtl">{item.questionAr}</p>
                                </div>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div className="shrink-0 flex items-center gap-2">
                              <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                                item.isActive ? 'bg-[var(--color-admin-success)] text-white' : 'bg-[var(--color-admin-text-muted)] text-white'
                              }`}>
                                {item.isActive ? t('common.active') : t('common.inactive')}
                              </span>
                            </div>
                          </button>

                          {/* Answer Content */}
                          {isExpanded && (
                            <div className="px-4 pb-4 pt-2 border-t border-[var(--color-admin-border)]">
                              <div className="pl-12 space-y-3">
                                <div>
                                  <p className="text-sm font-semibold text-[var(--color-admin-text-muted)] mb-1">{t('pages.faq.answer')} ({t('common.english')}):</p>
                                  <p className="text-[var(--color-admin-text)]">{item.answerEn}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-[var(--color-admin-text-muted)] mb-1">{t('pages.faq.answer')} ({t('common.arabic')}):</p>
                                  <p className="text-[var(--color-admin-text)]" dir="rtl">{item.answerAr}</p>
                                </div>
                                
                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                  <button
                                    onClick={() => {
                                      setEditingItem(item);
                                      setShowItemForm(true);
                                      setExpandedItems(new Set());
                                    }}
                                    className="bg-[var(--color-admin-primary-light)] text-[var(--color-admin-primary)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-primary)]/20 transition-all flex items-center gap-2"
                                  >
                                    <Edit size={16} />
                                    {t('common.edit')}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-danger)]/20 transition-all flex items-center gap-2"
                                  >
                                    <Trash2 size={16} />
                                    {t('common.delete')}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
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

export default FAQPageManager;
