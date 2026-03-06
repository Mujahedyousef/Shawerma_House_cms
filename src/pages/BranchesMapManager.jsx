import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Plus, 
  Save, 
  Edit2, 
  Trash2, 
  X,
  Phone,
  Mail,
  Clock,
  MapPinned
} from 'lucide-react';
import {
  getActiveMapSection,
  createMapSection,
  updateMapSection,
  createBranch,
  updateBranch,
  deleteBranch,
} from '../api/mapSection';
import { showSuccess, showError } from '../utils/i18nHelpers';

const BranchesMapManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [savingSection, setSavingSection] = useState(false);
  const [savingBranch, setSavingBranch] = useState(false);

  useEffect(() => {
    fetchSection();
  }, []);

  const fetchSection = async () => {
    try {
      setLoading(true);
      const response = await getActiveMapSection();
      setSection(response.data);
    } catch (error) {
      console.error('Error fetching map section:', error);
      setSection(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    setSavingSection(true);
    const formData = new FormData(e.target);
    const data = {
      sectionTitleEn: formData.get('sectionTitleEn'),
      sectionTitleAr: formData.get('sectionTitleAr'),
      sectionSubtitleEn: formData.get('sectionSubtitleEn') || null,
      sectionSubtitleAr: formData.get('sectionSubtitleAr') || null,
      mapCenterLat: parseFloat(formData.get('mapCenterLat')),
      mapCenterLng: parseFloat(formData.get('mapCenterLng')),
      defaultZoomLevel: parseInt(formData.get('defaultZoomLevel')),
      borderRadius: formData.get('borderRadius') ? parseInt(formData.get('borderRadius')) : 12,
      cardBackgroundLight: formData.get('cardBackgroundLight') || '#ffffff',
      cardTextLight: formData.get('cardTextLight') || '#1a1a1a',
      cardAccentLight: formData.get('cardAccentLight') || '#3daae1',
      pinColorLight: formData.get('pinColorLight') || '#3daae1',
      cardBackgroundDark: formData.get('cardBackgroundDark') || '#2a2a2a',
      cardTextDark: formData.get('cardTextDark') || '#ffffff',
      cardAccentDark: formData.get('cardAccentDark') || '#3daae1',
      pinColorDark: formData.get('pinColorDark') || '#3daae1',
      isActive: formData.get('isActive') === 'on',
    };

    try {
      await createMapSection(data);
      showSuccess('created', t('pages.mapSection.title'));
      setShowCreateForm(false);
      fetchSection();
    } catch (error) {
      console.error('Error creating map section:', error);
      showError('failedToCreate', t('pages.mapSection.title'));
    } finally {
      setSavingSection(false);
    }
  };

  const handleUpdateSection = async (e) => {
    e.preventDefault();
    setSavingSection(true);
    const formData = new FormData(e.target);
    const data = {
      sectionTitleEn: formData.get('sectionTitleEn'),
      sectionTitleAr: formData.get('sectionTitleAr'),
      sectionSubtitleEn: formData.get('sectionSubtitleEn') || null,
      sectionSubtitleAr: formData.get('sectionSubtitleAr') || null,
      mapCenterLat: parseFloat(formData.get('mapCenterLat')),
      mapCenterLng: parseFloat(formData.get('mapCenterLng')),
      defaultZoomLevel: parseInt(formData.get('defaultZoomLevel')),
      borderRadius: formData.get('borderRadius') ? parseInt(formData.get('borderRadius')) : 12,
      cardBackgroundLight: formData.get('cardBackgroundLight') || '#ffffff',
      cardTextLight: formData.get('cardTextLight') || '#1a1a1a',
      cardAccentLight: formData.get('cardAccentLight') || '#3daae1',
      pinColorLight: formData.get('pinColorLight') || '#3daae1',
      cardBackgroundDark: formData.get('cardBackgroundDark') || '#2a2a2a',
      cardTextDark: formData.get('cardTextDark') || '#ffffff',
      cardAccentDark: formData.get('cardAccentDark') || '#3daae1',
      pinColorDark: formData.get('pinColorDark') || '#3daae1',
      isActive: formData.get('isActive') === 'on',
    };

    try {
      await updateMapSection(section.id, data);
      showSuccess('updated', t('pages.mapSection.title'));
      fetchSection();
    } catch (error) {
      console.error('Error updating map section:', error);
      showError('failedToUpdate', t('pages.mapSection.title'));
    } finally {
      setSavingSection(false);
    }
  };

  const handleSaveBranch = async (e) => {
    e.preventDefault();
    setSavingBranch(true);
    const formData = new FormData(e.target);
    const data = {
      nameEn: formData.get('nameEn'),
      nameAr: formData.get('nameAr'),
      addressEn: formData.get('addressEn'),
      addressAr: formData.get('addressAr'),
      latitude: parseFloat(formData.get('latitude')),
      longitude: parseFloat(formData.get('longitude')),
      googleMapsLink: formData.get('googleMapsLink') || null,
      phoneNumber: formData.get('phoneNumber'),
      email: formData.get('email'),
      workingHoursEn: formData.get('workingHoursEn'),
      workingHoursAr: formData.get('workingHoursAr'),
      order: parseInt(formData.get('order')),
      isActive: formData.get('isActive') === 'on',
      mapSectionId: section.id,
    };

    try {
      if (editingBranch) {
        await updateBranch(editingBranch.id, data);
        showSuccess('updated', t('pages.mapSection.branch'));
      } else {
        await createBranch(data);
        showSuccess('created', t('pages.mapSection.branch'));
      }
      setShowBranchForm(false);
      setEditingBranch(null);
      fetchSection();
    } catch (error) {
      console.error('Error saving branch:', error);
      showError(
        editingBranch ? 'failedToUpdate' : 'failedToCreate',
        t('pages.mapSection.branch')
      );
    } finally {
      setSavingBranch(false);
    }
  };

  const handleDeleteBranch = async (branchId) => {
    if (!confirm(t('pages.mapSection.confirmDeleteBranch'))) {
      return;
    }

    try {
      await deleteBranch(branchId);
      showSuccess('deleted', t('pages.mapSection.branch'));
      fetchSection();
    } catch (error) {
      console.error('Error deleting branch:', error);
      showError('failedToDelete', t('pages.mapSection.branch'));
    }
  };

  const handleEditBranch = (branch) => {
    setEditingBranch(branch);
    setShowBranchForm(true);
  };

  const handleAddNewBranch = () => {
    setEditingBranch(null);
    setShowBranchForm(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!section && !showCreateForm) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {t('pages.mapSection.noSectionFound')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('pages.mapSection.noSectionDesc')}
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('pages.mapSection.createSection')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <MapPin className="w-8 h-8 mr-3" />
          {t('pages.mapSection.title')}
        </h1>
        <p className="text-gray-600">
          {t('pages.mapSection.description')}
        </p>
      </div>

      {/* Section Settings Form */}
      {(section || showCreateForm) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <MapPinned className="w-6 h-6 mr-2" />
            {t('pages.mapSection.sectionSettings')}
          </h2>
          <form onSubmit={section ? handleUpdateSection : handleCreateSection}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Title EN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('pages.mapSection.sectionTitleEn')} *
                </label>
                <input
                  type="text"
                  name="sectionTitleEn"
                  defaultValue={section?.sectionTitleEn}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Title AR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('pages.mapSection.sectionTitleAr')} *
                </label>
                <input
                  type="text"
                  name="sectionTitleAr"
                  defaultValue={section?.sectionTitleAr}
                  required
                  dir="rtl"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Subtitle EN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('pages.mapSection.sectionSubtitleEn')}
                </label>
                <input
                  type="text"
                  name="sectionSubtitleEn"
                  defaultValue={section?.sectionSubtitleEn || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Subtitle AR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('pages.mapSection.sectionSubtitleAr')}
                </label>
                <input
                  type="text"
                  name="sectionSubtitleAr"
                  defaultValue={section?.sectionSubtitleAr || ''}
                  dir="rtl"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Map Center Latitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('pages.mapSection.mapCenterLat')} *
                </label>
                <input
                  type="number"
                  step="any"
                  name="mapCenterLat"
                  defaultValue={section?.mapCenterLat || 25.2048}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Map Center Longitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('pages.mapSection.mapCenterLng')} *
                </label>
                <input
                  type="number"
                  step="any"
                  name="mapCenterLng"
                  defaultValue={section?.mapCenterLng || 55.2708}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Default Zoom Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('pages.mapSection.defaultZoomLevel')} *
                </label>
                <input
                  type="number"
                  name="defaultZoomLevel"
                  defaultValue={section?.defaultZoomLevel || 12}
                  min="1"
                  max="20"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Styling Settings */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t('pages.mapSection.stylingSettings')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Border Radius */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('pages.mapSection.borderRadius')}
                  </label>
                  <input
                    type="number"
                    name="borderRadius"
                    defaultValue={section?.borderRadius || 12}
                    min="0"
                    max="50"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Light Mode Colors */}
              <div className="mt-4">
                <h4 className="text-md font-medium text-gray-700 mb-3">
                  {t('pages.mapSection.lightModeColors')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {t('pages.mapSection.cardBackgroundLight')}
                    </label>
                    <input
                      type="color"
                      name="cardBackgroundLight"
                      defaultValue={section?.cardBackgroundLight || '#ffffff'}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {t('pages.mapSection.cardTextLight')}
                    </label>
                    <input
                      type="color"
                      name="cardTextLight"
                      defaultValue={section?.cardTextLight || '#1a1a1a'}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {t('pages.mapSection.cardAccentLight')}
                    </label>
                    <input
                      type="color"
                      name="cardAccentLight"
                      defaultValue={section?.cardAccentLight || '#3daae1'}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Dark Mode Colors */}
              <div className="mt-4">
                <h4 className="text-md font-medium text-gray-700 mb-3">
                  {t('pages.mapSection.darkModeColors')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {t('pages.mapSection.cardBackgroundDark')}
                    </label>
                    <input
                      type="color"
                      name="cardBackgroundDark"
                      defaultValue={section?.cardBackgroundDark || '#2a2a2a'}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {t('pages.mapSection.cardTextDark')}
                    </label>
                    <input
                      type="color"
                      name="cardTextDark"
                      defaultValue={section?.cardTextDark || '#ffffff'}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {t('pages.mapSection.cardAccentDark')}
                    </label>
                    <input
                      type="color"
                      name="cardAccentDark"
                      defaultValue={section?.cardAccentDark || '#3daae1'}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Pin Colors */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Pin Color (Light Mode)
                    </label>
                    <input
                      type="color"
                      name="pinColorLight"
                      defaultValue={section?.pinColorLight || '#3daae1'}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Pin Color (Dark Mode)
                    </label>
                    <input
                      type="color"
                      name="pinColorDark"
                      defaultValue={section?.pinColorDark || '#3daae1'}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Is Active */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  defaultChecked={section?.isActive ?? true}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                  {t('pages.mapSection.isActive')}
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              {showCreateForm && (
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 mr-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {t('common.cancel')}
                </button>
              )}
              <button
                type="submit"
                disabled={savingSection}
                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {savingSection ? t('common.saving') : t('common.save')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Branches Management */}
      {section && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <MapPin className="w-6 h-6 mr-2" />
              {t('pages.mapSection.branchesManagement')}
            </h2>
            <button
              onClick={handleAddNewBranch}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('pages.mapSection.addBranch')}
            </button>
          </div>

          {/* Branches List */}
          {section.branches && section.branches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.branches.map((branch) => (
                <div
                  key={branch.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-gray-800">
                      {isRTL ? branch.nameAr : branch.nameEn}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditBranch(branch)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title={t('common.edit')}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBranch(branch.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title={t('common.delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{isRTL ? branch.addressAr : branch.addressEn}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{branch.phoneNumber}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{branch.email}</span>
                    </div>
                    <div className="flex items-start">
                      <Clock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{isRTL ? branch.workingHoursAr : branch.workingHoursEn}</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <MapPinned className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span>
                        {branch.latitude.toFixed(4)}, {branch.longitude.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {t('pages.mapSection.order')}: {branch.order}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        branch.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {branch.isActive ? t('common.active') : t('common.inactive')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t('pages.mapSection.noBranches')}</p>
            </div>
          )}
        </div>
      )}

      {/* Branch Form Modal */}
      {showBranchForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {editingBranch
                  ? t('pages.mapSection.editBranch')
                  : t('pages.mapSection.addBranch')}
              </h3>
              <button
                onClick={() => {
                  setShowBranchForm(false);
                  setEditingBranch(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Name EN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('pages.mapSection.nameEn')} *
                  </label>
                  <input
                    type="text"
                    name="nameEn"
                    defaultValue={editingBranch?.nameEn}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Name AR */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('pages.mapSection.nameAr')} *
                  </label>
                  <input
                    type="text"
                    name="nameAr"
                    defaultValue={editingBranch?.nameAr}
                    required
                    dir="rtl"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Address EN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('pages.mapSection.addressEn')} *
                  </label>
                  <textarea
                    name="addressEn"
                    defaultValue={editingBranch?.addressEn}
                    required
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Address AR */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('pages.mapSection.addressAr')} *
                  </label>
                  <textarea
                    name="addressAr"
                    defaultValue={editingBranch?.addressAr}
                    required
                    rows="2"
                    dir="rtl"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Latitude */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('pages.mapSection.latitude')} *
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    defaultValue={editingBranch?.latitude}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Longitude */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('pages.mapSection.longitude')} *
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    defaultValue={editingBranch?.longitude}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Google Maps Link (Optional) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('pages.mapSection.googleMapsLink')}
                </label>
                <input
                  type="url"
                  name="googleMapsLink"
                  defaultValue={editingBranch?.googleMapsLink}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {t('pages.mapSection.googleMapsLinkHint')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('pages.mapSection.phoneNumber')} *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    defaultValue={editingBranch?.phoneNumber}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('pages.mapSection.email')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingBranch?.email}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Working Hours EN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('pages.mapSection.workingHoursEn')} *
                  </label>
                  <textarea
                    name="workingHoursEn"
                    defaultValue={editingBranch?.workingHoursEn}
                    required
                    rows="3"
                    placeholder="Saturday-Thursday: 10AM-11PM&#10;Friday: 1PM-8PM"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t('pages.mapSection.workingHoursHint')}
                  </p>
                </div>

                {/* Working Hours AR */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('pages.mapSection.workingHoursAr')} *
                  </label>
                  <textarea
                    name="workingHoursAr"
                    defaultValue={editingBranch?.workingHoursAr}
                    required
                    rows="3"
                    dir="rtl"
                    placeholder="السبت-الخميس: 10ص-11م&#10;الجمعة: 1م-8م"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500" dir="rtl">
                    {t('pages.mapSection.workingHoursHint')}
                  </p>
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('pages.mapSection.order')} *
                  </label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={editingBranch?.order || 0}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Is Active */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="branchIsActive"
                    defaultChecked={editingBranch?.isActive ?? true}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="branchIsActive" className="ml-2 text-sm font-medium text-gray-700">
                    {t('pages.mapSection.isActive')}
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowBranchForm(false);
                    setEditingBranch(null);
                  }}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={savingBranch}
                  className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {savingBranch ? t('common.saving') : t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchesMapManager;

