import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getFooterSettings,
  updateFooterSettings,
  getAllFooterLinks,
  createFooterLink,
  updateFooterLink,
  deleteFooterLink,
  getAllSocialMedia,
  createSocialMedia,
  updateSocialMedia,
  deleteSocialMedia,
} from '../api/footer';
import { showSuccess, showError, showConfirm, t } from '../utils/i18nHelpers';

const FooterManager = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [settings, setSettings] = useState(null);
  const [links, setLinks] = useState([]);
  const [socialMedia, setSocialMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('settings'); // 'settings', 'links', 'social'
  const [editingLink, setEditingLink] = useState(null);
  const [editingSocial, setEditingSocial] = useState(null);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [showSocialForm, setShowSocialForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsData, linksData, socialData] = await Promise.all([
        getFooterSettings(),
        getAllFooterLinks(),
        getAllSocialMedia(),
      ]);
      setSettings(settingsData.data);
      setLinks(linksData.data || []);
      setSocialMedia(socialData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showError('failedToLoad', t('sidebar.footerSettings'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      column1TitleEn: formData.get('column1TitleEn'),
      column1TitleAr: formData.get('column1TitleAr'),
      column2TitleEn: formData.get('column2TitleEn'),
      column2TitleAr: formData.get('column2TitleAr'),
      column3TitleEn: formData.get('column3TitleEn'),
      column3TitleAr: formData.get('column3TitleAr'),
      column4TitleEn: formData.get('column4TitleEn'),
      column4TitleAr: formData.get('column4TitleAr'),
      followUsTitleEn: formData.get('followUsTitleEn'),
      followUsTitleAr: formData.get('followUsTitleAr'),
      newsletterTitleEn: formData.get('newsletterTitleEn'),
      newsletterTitleAr: formData.get('newsletterTitleAr'),
      newsletterEmailPlaceholderEn: formData.get('newsletterEmailPlaceholderEn'),
      newsletterEmailPlaceholderAr: formData.get('newsletterEmailPlaceholderAr'),
      newsletterButtonTextEn: formData.get('newsletterButtonTextEn'),
      newsletterButtonTextAr: formData.get('newsletterButtonTextAr'),
      copyrightTextEn: formData.get('copyrightTextEn'),
      copyrightTextAr: formData.get('copyrightTextAr'),
    };

    try {
      await updateFooterSettings(data);
      showSuccess('updated', t('sidebar.footerSettings'));
      fetchData();
    } catch (error) {
      console.error('Error updating settings:', error);
      showError('failedToUpdate', t('sidebar.footerSettings'));
    }
  };

  const handleCreateLink = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      column: parseInt(formData.get('column')),
      textEn: formData.get('textEn'),
      textAr: formData.get('textAr'),
      link: formData.get('link'),
      order: parseInt(formData.get('order')) || links.length,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      await createFooterLink(data);
      showSuccess('created', t('pages.footer.link'));
      fetchData();
      setShowLinkForm(false);
      e.target.reset();
    } catch (error) {
      console.error('Error creating link:', error);
      showError('failedToCreate', t('pages.footer.link'));
    }
  };

  const handleUpdateLink = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      column: parseInt(formData.get('column')),
      textEn: formData.get('textEn'),
      textAr: formData.get('textAr'),
      link: formData.get('link'),
      order: parseInt(formData.get('order')) || 0,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      await updateFooterLink(editingLink.id, data);
      showSuccess('updated', t('pages.footer.link'));
      fetchData();
      setEditingLink(null);
      setShowLinkForm(false);
    } catch (error) {
      console.error('Error updating link:', error);
      showError('failedToUpdate', t('pages.footer.link'));
    }
  };

  const handleDeleteLink = async (id) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteFooterLink(id);
      showSuccess('deleted', t('pages.footer.link'));
      fetchData();
    } catch (error) {
      console.error('Error deleting link:', error);
      showError('failedToDelete', t('pages.footer.link'));
    }
  };

  const handleCreateSocial = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      url: formData.get('url'),
      iconType: formData.get('iconType'),
      order: parseInt(formData.get('order')) || socialMedia.length,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      await createSocialMedia(data);
      showSuccess('created', t('pages.footer.socialMedia'));
      fetchData();
      setShowSocialForm(false);
      e.target.reset();
    } catch (error) {
      console.error('Error creating social media:', error);
      showError('failedToCreate', t('pages.footer.socialMedia'));
    }
  };

  const handleUpdateSocial = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      url: formData.get('url'),
      iconType: formData.get('iconType'),
      order: parseInt(formData.get('order')) || 0,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      await updateSocialMedia(editingSocial.id, data);
      showSuccess('updated', t('pages.footer.socialMedia'));
      fetchData();
      setEditingSocial(null);
      setShowSocialForm(false);
    } catch (error) {
      console.error('Error updating social media:', error);
      showError('failedToUpdate', t('pages.footer.socialMedia'));
    }
  };

  const handleDeleteSocial = async (id) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteSocialMedia(id);
      showSuccess('deleted', t('pages.footer.socialMedia'));
      fetchData();
    } catch (error) {
      console.error('Error deleting social media:', error);
      showError('failedToDelete', t('pages.footer.socialMedia'));
    }
  };

  const handleEditLink = (link) => {
    setEditingLink(link);
    setShowLinkForm(true);
  };

  const handleEditSocial = (social) => {
    setEditingSocial(social);
    setShowSocialForm(true);
  };

  const handleCancelEdit = () => {
    setEditingLink(null);
    setEditingSocial(null);
    setShowLinkForm(false);
    setShowSocialForm(false);
  };

  if (loading) {
    return (
      <div className="p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center">{t('common.loading')}</div>
      </div>
    );
  }

  // Group links by column for display
  const linksByColumn = {
    1: links.filter(l => l.column === 1),
    2: links.filter(l => l.column === 2),
    3: links.filter(l => l.column === 3),
    4: links.filter(l => l.column === 4),
  };

  return (
    <div className="p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold mb-8">{t('sidebar.footerSettings')}</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'settings'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('pages.footer.settings')}
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'links'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('pages.footer.footerLinks')} ({links.length})
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'social'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('pages.footer.socialMedia')} ({socialMedia.length})
          </button>
        </div>
      </div>

      {/* Settings Tab */}
      {activeTab === 'settings' && settings && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t('pages.footer.settings')}</h2>
          <form onSubmit={handleUpdateSettings} className="space-y-6">
            {/* Column Titles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('pages.footer.columnTitles')}</h3>
              
              {[1, 2, 3, 4].map(colNum => (
                <div key={colNum} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.footer.column')} {colNum} {t('form.titleEn')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name={`column${colNum}TitleEn`}
                      defaultValue={settings[`column${colNum}TitleEn`] || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.footer.column')} {colNum} {t('form.titleAr')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name={`column${colNum}TitleAr`}
                      defaultValue={settings[`column${colNum}TitleAr`] || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Follow Us Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('pages.footer.followUsSection')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('pages.footer.followUsTitle')} ({t('common.english')}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="followUsTitleEn"
                    defaultValue={settings.followUsTitleEn || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('pages.footer.followUsTitle')} ({t('common.arabic')}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="followUsTitleAr"
                    defaultValue={settings.followUsTitleAr || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('pages.footer.newsletterSection')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('pages.footer.newsletterTitle')} ({t('common.english')}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="newsletterTitleEn"
                    defaultValue={settings.newsletterTitleEn || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('pages.footer.newsletterTitle')} ({t('common.arabic')}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="newsletterTitleAr"
                    defaultValue={settings.newsletterTitleAr || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('pages.footer.newsletterEmailPlaceholder')} ({t('common.english')}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="newsletterEmailPlaceholderEn"
                    defaultValue={settings.newsletterEmailPlaceholderEn || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('pages.footer.newsletterEmailPlaceholder')} ({t('common.arabic')}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="newsletterEmailPlaceholderAr"
                    defaultValue={settings.newsletterEmailPlaceholderAr || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('pages.footer.newsletterButtonText')} ({t('common.english')}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="newsletterButtonTextEn"
                    defaultValue={settings.newsletterButtonTextEn || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('pages.footer.newsletterButtonText')} ({t('common.arabic')}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="newsletterButtonTextAr"
                    defaultValue={settings.newsletterButtonTextAr || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Copyright Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('pages.footer.copyrightSection')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('pages.footer.copyrightText')} ({t('common.english')}) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="copyrightTextEn"
                    defaultValue={settings.copyrightTextEn || ''}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('pages.footer.copyrightText')} ({t('common.arabic')}) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="copyrightTextAr"
                    defaultValue={settings.copyrightTextAr || ''}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('common.save')}
            </button>
          </form>
        </div>
      )}

      {/* Links Tab */}
      {activeTab === 'links' && (
        <div className="space-y-6">
          {/* Links List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">{t('pages.footer.footerLinks')}</h2>
              <button
                onClick={() => {
                  setEditingLink(null);
                  setShowLinkForm(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {t('pages.footer.addLink')}
              </button>
            </div>

            {links.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {t('pages.footer.noLinksYet')}. {t('pages.footer.getStarted')}.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages.footer.column')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('form.order')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('form.titleEn')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('form.titleAr')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages.footer.link')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('common.status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {links.map((link) => (
                      <tr key={link.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {t('pages.footer.column')} {link.column}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {link.order}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {link.textEn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {link.textAr}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {link.link}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              link.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {link.isActive ? t('common.active') : t('common.inactive')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditLink(link)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            {t('common.edit')}
                          </button>
                          <button
                            onClick={() => handleDeleteLink(link.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            {t('common.delete')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Link Form */}
          {showLinkForm && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingLink ? t('pages.footer.editLink') : t('pages.footer.addLink')}
              </h2>
              <form onSubmit={editingLink ? handleUpdateLink : handleCreateLink} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="column" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.footer.column')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="column"
                      name="column"
                      defaultValue={editingLink?.column || 1}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value={1}>{t('pages.footer.column')} 1</option>
                      <option value={2}>{t('pages.footer.column')} 2</option>
                      <option value={3}>{t('pages.footer.column')} 3</option>
                      <option value={4}>{t('pages.footer.column')} 4</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('form.order')}
                    </label>
                    <input
                      type="number"
                      id="order"
                      name="order"
                      defaultValue={editingLink?.order || links.length}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="textEn" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.footer.text')} ({t('common.english')}) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="textEn"
                      name="textEn"
                      defaultValue={editingLink?.textEn || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="textAr" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.footer.text')} ({t('common.arabic')}) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="textAr"
                      name="textAr"
                      defaultValue={editingLink?.textAr || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('pages.footer.linkUrl')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="link"
                    name="link"
                    defaultValue={editingLink?.link || ''}
                    placeholder="e.g., /products, /services, #about"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t('pages.navbar.linkUrlHint')}
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    defaultChecked={editingLink ? editingLink.isActive : true}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    {t('common.active')}
                  </label>
                </div>

                <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingLink ? t('pages.footer.updateLink') : t('pages.footer.createLink')}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Social Media Tab */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          {/* Social Media List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">{t('pages.footer.socialMedia')}</h2>
              <button
                onClick={() => {
                  setEditingSocial(null);
                  setShowSocialForm(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {t('pages.footer.addSocial')}
              </button>
            </div>

            {socialMedia.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {t('pages.footer.noSocialMediaYet')}. {t('pages.footer.getStartedSocial')}.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('form.order')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages.footer.name')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages.footer.iconType')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages.footer.url')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('common.status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {socialMedia.map((social) => (
                      <tr key={social.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {social.order}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {social.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {social.iconType}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {social.url}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              social.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {social.isActive ? t('common.active') : t('common.inactive')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditSocial(social)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            {t('common.edit')}
                          </button>
                          <button
                            onClick={() => handleDeleteSocial(social.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            {t('common.delete')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Social Media Form */}
          {showSocialForm && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingSocial ? t('pages.footer.editSocial') : t('pages.footer.addSocial')}
              </h2>
              <form onSubmit={editingSocial ? handleUpdateSocial : handleCreateSocial} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.footer.name')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      defaultValue={editingSocial?.name || ''}
                      placeholder="e.g., LinkedIn, Facebook"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="iconType" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.footer.iconType')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="iconType"
                      name="iconType"
                      defaultValue={editingSocial?.iconType || 'Linkedin'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Linkedin">LinkedIn</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Youtube">YouTube</option>
                      <option value="Snapchat">Snapchat</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('pages.footer.url')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    defaultValue={editingSocial?.url || ''}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('form.order')}
                    </label>
                    <input
                      type="number"
                      id="order"
                      name="order"
                      defaultValue={editingSocial?.order || socialMedia.length}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      defaultChecked={editingSocial ? editingSocial.isActive : true}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      {t('common.active')}
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingSocial ? t('pages.footer.updateSocial') : t('pages.footer.createSocial')}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FooterManager;
