import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getNavbarSettings,
  updateNavbarSettings,
  getAllNavbarLinks,
  createNavbarLink,
  updateNavbarLink,
  deleteNavbarLink,
} from '../api/navbar';
import { showSuccess, showError, showConfirm } from '../utils/i18nHelpers';

const NavbarManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [settings, setSettings] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('logo'); // 'logo', 'links'
  const [editingLink, setEditingLink] = useState(null);
  const [showLinkForm, setShowLinkForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsData, linksData] = await Promise.all([
        getNavbarSettings(),
        getAllNavbarLinks(),
      ]);
      setSettings(settingsData.data);
      setLinks(linksData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showError('failedToLoad', t('sidebar.navbar'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLogo = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const logoFile = formData.get('logo');

    if (!logoFile || !(logoFile instanceof File) || logoFile.size === 0) {
      showError('failedToUpload', t('pages.navbar.selectLogoFile'));
      return;
    }

    try {
      await updateNavbarSettings(logoFile);
      showSuccess('updated', t('pages.navbar.logo'));
      fetchData();
      e.target.reset();
    } catch (error) {
      console.error('Error updating logo:', error);
      showError('failedToUpdate', t('pages.navbar.logo'));
    }
  };

  const handleCreateLink = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      textEn: formData.get('textEn'),
      textAr: formData.get('textAr'),
      link: formData.get('link'),
      order: parseInt(formData.get('order')) || links.length,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      await createNavbarLink(data);
      showSuccess('created', t('pages.navbar.link'));
      fetchData();
      setShowLinkForm(false);
      e.target.reset();
    } catch (error) {
      console.error('Error creating link:', error);
      showError('failedToCreate', t('pages.navbar.link'));
    }
  };

  const handleUpdateLink = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      textEn: formData.get('textEn'),
      textAr: formData.get('textAr'),
      link: formData.get('link'),
      order: parseInt(formData.get('order')) || 0,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      await updateNavbarLink(editingLink.id, data);
      showSuccess('updated', t('pages.navbar.link'));
      fetchData();
      setEditingLink(null);
      setShowLinkForm(false);
    } catch (error) {
      console.error('Error updating link:', error);
      showError('failedToUpdate', t('pages.navbar.link'));
    }
  };

  const handleDeleteLink = async (id) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteNavbarLink(id);
      showSuccess('deleted', t('pages.navbar.link'));
      fetchData();
    } catch (error) {
      console.error('Error deleting link:', error);
      showError('failedToDelete', t('pages.navbar.link'));
    }
  };

  const handleEditLink = (link) => {
    setEditingLink(link);
    setShowLinkForm(true);
  };

  const handleCancelEdit = () => {
    setEditingLink(null);
    setShowLinkForm(false);
  };

  if (loading) {
    return (
      <div className="p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold mb-8">{t('sidebar.navbarSettings')}</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('logo')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'logo'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('pages.navbar.logo')}
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'links'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('pages.navbar.navigationLinks')} ({links.length})
          </button>
        </div>
      </div>

      {/* Logo Tab */}
      {activeTab === 'logo' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t('pages.navbar.logoSettings')}</h2>
          
          {settings && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">{t('pages.navbar.currentLogo')}:</p>
              <img
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${settings.logoUrl}`}
                alt="Current logo"
                className="h-16 w-auto border border-gray-200 rounded p-2 bg-white"
              />
            </div>
          )}

          <form onSubmit={handleUpdateLogo} className="space-y-4">
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                {t('pages.navbar.uploadNewLogo')}
              </label>
              <input
                type="file"
                id="logo"
                name="logo"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {t('pages.navbar.logoRecommendations')}
              </p>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('pages.navbar.updateLogo')}
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
              <h2 className="text-xl font-semibold">{t('pages.navbar.navigationLinks')}</h2>
              <button
                onClick={() => {
                  setEditingLink(null);
                  setShowLinkForm(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {t('pages.navbar.addLink')}
              </button>
            </div>

            {links.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {t('pages.navbar.noLinksYet')}. {t('pages.navbar.getStarted')}.
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
                        {t('form.titleEn')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('form.titleAr')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('pages.navbar.link')}
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
                {editingLink ? t('pages.navbar.editLink') : t('pages.navbar.addLink')}
              </h2>
              <form onSubmit={editingLink ? handleUpdateLink : handleCreateLink} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="textEn" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('pages.navbar.text')} ({t('common.english')}) <span className="text-red-500">*</span>
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
                      {t('pages.navbar.text')} ({t('common.arabic')}) <span className="text-red-500">*</span>
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
                    {t('pages.navbar.linkUrl')} <span className="text-red-500">*</span>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingLink ? t('pages.navbar.updateLink') : t('pages.navbar.createLink')}
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

export default NavbarManager;

