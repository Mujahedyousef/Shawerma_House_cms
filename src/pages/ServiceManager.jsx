import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
  getServiceById,
} from '../api/service';
import { showSuccess, showError, showConfirm } from '../utils/i18nHelpers';

const ServiceManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [tags, setTags] = useState([]);
  const [serviceType, setServiceType] = useState('card'); // 'image' or 'card'

  useEffect(() => {
    fetchData();
  }, []);

  // Initialize form data when editing service
  useEffect(() => {
    if (editingService) {
      setTags(editingService.tags || []);
      setServiceType(editingService.type || 'card');
    } else {
      setTags([]);
      setServiceType('card');
    }
  }, [editingService]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const servicesData = await getAllServices();
      setServices(servicesData.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      showError('failedToLoad', t('sidebar.servicesManagement'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const imageFile = formData.get('image');
    
    // Calculate count for card services (only count existing card services)
    const existingCardCount = services.filter(s => s.type === 'card').length;
    const cardCount = serviceType === 'card' ? (parseInt(formData.get('count')) || existingCardCount + 1) : 0;
    
    const requestFormData = new FormData();
    requestFormData.append('type', serviceType);
    requestFormData.append('count', cardCount);
    requestFormData.append('titleEn', formData.get('titleEn'));
    requestFormData.append('titleAr', formData.get('titleAr'));
    
    if (serviceType === 'card') {
      requestFormData.append('descriptionEn', formData.get('descriptionEn') || '');
      requestFormData.append('descriptionAr', formData.get('descriptionAr') || '');
      requestFormData.append('tags', JSON.stringify(tags));
    } else {
      requestFormData.append('descriptionEn', '');
      requestFormData.append('descriptionAr', '');
      requestFormData.append('tags', JSON.stringify([]));
    }
    
    requestFormData.append('order', formData.get('order') || services.length);
    requestFormData.append('isActive', formData.get('isActive') === 'on' ? 'true' : 'false');
    
    if (serviceType === 'image') {
      if (imageFile && imageFile.size > 0) {
        requestFormData.append('image', imageFile);
      } else if (formData.get('imageUrl')) {
        requestFormData.append('imageUrl', formData.get('imageUrl'));
      } else {
        showError('failedToUpload', t('pages.services.pleaseUploadImage'));
        return;
      }
    } else {
      // For cards, image is optional but can be provided
      if (imageFile && imageFile.size > 0) {
        requestFormData.append('image', imageFile);
      } else if (formData.get('imageUrl')) {
        requestFormData.append('imageUrl', formData.get('imageUrl'));
      }
    }

    try {
      await createService(requestFormData);
      showSuccess('created', t('sidebar.servicesManagement'));
      fetchData();
      e.target.reset();
      setShowForm(false);
      setTags([]);
      setServiceType('card');
    } catch (error) {
      console.error('Error creating service:', error);
      showError('failedToCreate', t('sidebar.servicesManagement'));
    }
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const requestFormData = new FormData();
    requestFormData.append('type', serviceType); // Preserve the type
    requestFormData.append('count', serviceType === 'card' ? formData.get('count') : 0);
    requestFormData.append('titleEn', formData.get('titleEn'));
    requestFormData.append('titleAr', formData.get('titleAr'));
    requestFormData.append('descriptionEn', formData.get('descriptionEn') || '');
    requestFormData.append('descriptionAr', formData.get('descriptionAr') || '');
    requestFormData.append('order', formData.get('order'));
    requestFormData.append('isActive', formData.get('isActive') === 'on' ? 'true' : 'false');
    requestFormData.append('tags', JSON.stringify(serviceType === 'card' ? tags : []));
    
    const imageFile = formData.get('image');
    if (serviceType === 'image') {
      if (imageFile && imageFile.size > 0) {
        requestFormData.append('image', imageFile);
      } else if (formData.get('imageUrl')) {
        requestFormData.append('imageUrl', formData.get('imageUrl'));
      }
    } else {
      // For cards, image is optional
      if (imageFile && imageFile.size > 0) {
        requestFormData.append('image', imageFile);
      } else if (formData.get('imageUrl')) {
        requestFormData.append('imageUrl', formData.get('imageUrl'));
      }
    }

    try {
      await updateService(editingService.id, requestFormData);
      showSuccess('updated', t('sidebar.servicesManagement'));
      fetchData();
      setEditingService(null);
      setShowForm(false);
      setTags([]);
    } catch (error) {
      console.error('Error updating service:', error);
      showError('failedToUpdate', t('sidebar.servicesManagement'));
    }
  };

  const handleDeleteService = async (id) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteService(id);
      showSuccess('deleted', t('sidebar.servicesManagement'));
      fetchData();
    } catch (error) {
      console.error('Error deleting service:', error);
      showError('failedToDelete', t('sidebar.servicesManagement'));
    }
  };

  const handleEditService = async (service) => {
    try {
      const fullService = await getServiceById(service.id);
      const serviceData = fullService.data || fullService;
      setEditingService(serviceData);
      setTags(serviceData.tags || []);
      setServiceType(serviceData.type || 'card');
      setShowForm(true);
    } catch (error) {
      console.error('Error fetching service:', error);
      showError('failedToLoad', t('sidebar.servicesManagement'));
    }
  };

  const addTag = () => {
    setTags([...tags, { textEn: '', textAr: '' }]);
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const updateTag = (index, field, value) => {
    const updated = [...tags];
    updated[index] = { ...updated[index], [field]: value };
    setTags(updated);
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-admin-text)] mb-2">
              {t('sidebar.servicesManagement')}
            </h1>
            <p className="text-[var(--color-admin-text-muted)]">
              {t('pages.services.description')}
            </p>
          </div>
          <button
            onClick={() => {
              setEditingService(null);
              setShowForm(true);
              setTags([]);
              setServiceType('card');
            }}
            className="px-6 py-3 bg-[var(--color-admin-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all"
          >
            {t('pages.services.addService')}
          </button>
        </div>

        {/* Pattern Preview */}
        {!showForm && services.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-[var(--color-admin-primary-light)]/20 to-[var(--color-admin-info)]/20 rounded-xl border border-[var(--color-admin-primary)]/30 p-6">
            <h3 className="text-lg font-bold text-[var(--color-admin-text)] mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('pages.services.displayPattern')}
            </h3>
            <p className="text-sm text-[var(--color-admin-text-muted)] mb-4">
              {t('pages.services.displayPatternDesc')}
            </p>
            <div className="flex flex-wrap gap-2">
              {services
                .sort((a, b) => a.order - b.order)
                .map((service, index) => {
                  const displayIndex = Math.floor(index / 2) + (index % 2 === 0 ? 0 : 1);
                  const isImagePosition = index % 2 === 0;
                  return (
                    <div
                      key={service.id}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        isImagePosition
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-purple-100 text-purple-800 border border-purple-300'
                      }`}
                    >
                      {isImagePosition ? (
                        <span>🖼️ Image {index + 1}</span>
                      ) : (
                        <span>📋 Service Card {String(service.count || Math.floor(index / 2) + 1).padStart(2, '0')}</span>
                      )}
                    </div>
                  );
                })}
            </div>
            <p className="text-xs text-[var(--color-admin-text-muted)] mt-3">
              💡 <strong>Note:</strong> Count numbers (01, 02, 03...) only appear on Service Cards, not on Images.
            </p>
          </div>
        )}

        {/* Services List */}
        {!showForm && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--color-admin-text)]">{t('pages.services.allServices')}</h3>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{t('pages.services.imageType')}</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">{t('pages.services.cardType')}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services
                  .sort((a, b) => a.order - b.order)
                  .map((service, index) => {
                    const displayPosition = index + 1;
                    const isImagePosition = displayPosition % 2 === 1; // Odd positions = Image, Even = Card
                    return (
                      <div
                        key={service.id}
                        className={`border-2 rounded-xl p-4 hover:shadow-lg transition-all ${
                          service.type === 'image' && isImagePosition
                            ? 'border-blue-300 bg-blue-50/30'
                            : service.type === 'card' && !isImagePosition
                            ? 'border-purple-300 bg-purple-50/30'
                            : 'border-yellow-300 bg-yellow-50/30'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              service.type === 'image' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {service.type === 'image' ? '🖼️ Image' : '📋 Card'}
                            </span>
                            {service.type === 'card' && (
                              <span className="text-2xl font-bold text-[var(--color-admin-text-muted)]">
                                {String(service.count || Math.floor(displayPosition / 2)).padStart(2, '0')}
                              </span>
                            )}
                            <span className="text-xs text-[var(--color-admin-text-muted)]">
                              Pos: {displayPosition}
                            </span>
                            {(service.type === 'image' && !isImagePosition) || (service.type === 'card' && isImagePosition) ? (
                              <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800 font-semibold">
                                ⚠️ Wrong Position
                              </span>
                            ) : null}
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {service.isActive ? t('common.active') : t('common.inactive')}
                          </span>
                        </div>
                        <h3 className="font-semibold text-[var(--color-admin-text)] mb-2">
                          {service.titleEn}
                        </h3>
                        {service.type === 'card' && (
                          <p className="text-sm text-[var(--color-admin-text-muted)] mb-3 line-clamp-2">
                            {service.descriptionEn || t('common.noDescription')}
                          </p>
                        )}
                        {service.tags && service.tags.length > 0 && (
                          <p className="text-xs text-[var(--color-admin-text-muted)] mb-3">
                            {service.tags.length} {t('pages.services.tag')}(s)
                          </p>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditService(service)}
                            className="flex-1 px-4 py-2 bg-[var(--color-admin-primary)] text-white rounded-lg hover:bg-[var(--color-admin-primary-dark)] transition-all text-sm"
                          >
                            {t('common.edit')}
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="px-4 py-2 bg-[var(--color-admin-danger)] text-white rounded-lg hover:bg-red-700 transition-all text-sm"
                          >
                            {t('common.delete')}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
              {services.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-[var(--color-admin-text-muted)]">{t('pages.services.noServicesFound')}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Service Form */}
        {showForm && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">
                {editingService ? t('pages.services.editService') : t('pages.services.addService')}
              </h2>
            </div>
            <form onSubmit={editingService ? handleUpdateService : handleCreateService} className="p-6 space-y-6">
              {/* Service Type Selector */}
              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-3">
                  {t('pages.services.serviceType')} <span className="text-[var(--color-admin-danger)]">*</span>
                </label>
                
                {/* Visual Pattern Guide */}
                <div className="mb-4 p-4 bg-gradient-to-r from-[var(--color-admin-primary-light)]/20 to-[var(--color-admin-info)]/20 rounded-xl border border-[var(--color-admin-primary)]/30">
                  <p className="text-sm font-semibold text-[var(--color-admin-text)] mb-2">📐 Display Pattern:</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium border border-blue-300">🖼️ Image</span>
                    <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium border border-purple-300">📋 Service Card 01</span>
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium border border-blue-300">🖼️ Image</span>
                    <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium border border-purple-300">📋 Service Card 02</span>
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium border border-blue-300">🖼️ Image</span>
                    <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium border border-purple-300">📋 Service Card 03</span>
                    <span className="text-sm text-[var(--color-admin-text-muted)]">...</span>
                  </div>
                  <p className="text-xs text-[var(--color-admin-text-muted)]">
                    💡 <strong>Important:</strong> Services alternate between Image and Service Card. Count numbers (01, 02, 03...) only appear on Service Cards.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setServiceType('image')}
                    className={`px-6 py-4 rounded-xl border-2 transition-all text-left ${
                      serviceType === 'image'
                        ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-md'
                        : 'border-[var(--color-admin-border)] bg-[var(--color-admin-surface)] text-[var(--color-admin-text-muted)] hover:border-blue-400'
                    }`}
                  >
                    <div className="font-semibold mb-1 flex items-center gap-2">
                      <span className="text-xl">🖼️</span>
                      {t('pages.services.imageOnly')}
                    </div>
                    <div className="text-xs">{t('pages.services.displayedAtPositions')}: 1, 3, 5, 7...</div>
                    <div className="text-xs mt-1 text-[var(--color-admin-text-muted)]">{t('pages.services.noCountNumber')}</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceType('card')}
                    className={`px-6 py-4 rounded-xl border-2 transition-all text-left ${
                      serviceType === 'card'
                        ? 'border-purple-500 bg-purple-50 text-purple-800 shadow-md'
                        : 'border-[var(--color-admin-border)] bg-[var(--color-admin-surface)] text-[var(--color-admin-text-muted)] hover:border-purple-400'
                    }`}
                  >
                    <div className="font-semibold mb-1 flex items-center gap-2">
                      <span className="text-xl">📋</span>
                      {t('pages.services.serviceCard')}
                    </div>
                    <div className="text-xs">{t('pages.services.displayedAtPositions')}: 2, 4, 6, 8...</div>
                    <div className="text-xs mt-1 font-semibold">{t('pages.services.showsCountNumber')}</div>
                  </button>
                </div>
                
                {/* Show expected position */}
                {services.length > 0 && (
                  <div className="mt-3 p-3 bg-[var(--color-admin-muted)] rounded-lg">
                    <p className="text-xs text-[var(--color-admin-text-muted)]">
                      📍 This service will be at position <strong>{services.length + 1}</strong> in the grid
                      {services.length % 2 === 0 ? (
                        <span className="text-blue-600 font-semibold"> (Image position)</span>
                      ) : (
                        <span className="text-purple-600 font-semibold"> (Service Card position)</span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {serviceType === 'card' && (
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('pages.services.countNumber')} <span className="text-[var(--color-admin-danger)]">*</span>
                    </label>
                    <input
                      type="number"
                      name="count"
                      defaultValue={editingService?.count || (services.filter(s => s.type === 'card').length + 1)}
                      min="1"
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      required={serviceType === 'card'}
                    />
                    <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">
                      Sequential number displayed on the card (01, 02, 03, etc.). This number only appears on Service Cards, not on Images.
                    </p>
                    <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-xs text-purple-800">
                        💡 This will display as: <strong>{String(editingService?.count || (services.filter(s => s.type === 'card').length + 1)).padStart(2, '0')}</strong>
                      </p>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.order')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={editingService?.order || services.length}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('form.titleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="titleEn"
                    defaultValue={editingService?.titleEn || ''}
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
                    defaultValue={editingService?.titleAr || ''}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              {serviceType === 'card' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('form.descriptionEn')}
                      </label>
                      <textarea
                        name="descriptionEn"
                        defaultValue={editingService?.descriptionEn || ''}
                        rows={4}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('form.descriptionAr')}
                      </label>
                      <textarea
                        name="descriptionAr"
                        defaultValue={editingService?.descriptionAr || ''}
                        rows={4}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all resize-none text-right"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  {/* Tags Section */}
                  <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)]">
                    {t('pages.solutions.tags')}
                  </label>
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-[var(--color-admin-primary-light)] text-[var(--color-admin-primary)] rounded-lg hover:bg-[var(--color-admin-primary)] hover:text-white transition-all text-sm font-semibold"
                  >
                    {t('pages.services.addTag')}
                  </button>
                </div>
                <div className="space-y-3">
                  {tags.length === 0 ? (
                    <p className="text-sm text-[var(--color-admin-text-muted)] text-center py-4">
                      {t('pages.services.noTagsAdded')}
                    </p>
                  ) : (
                    tags.map((tag, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-[var(--color-admin-border)] rounded-xl">
                        <div>
                          <label className="block text-xs text-[var(--color-admin-text-muted)] mb-1">
                            {t('pages.services.tagTextEn')}
                          </label>
                          <input
                            type="text"
                            value={tag.textEn || ''}
                            onChange={(e) => updateTag(index, 'textEn', e.target.value)}
                            className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-sm"
                            placeholder="e.g., Public Garden Design"
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className="block text-xs text-[var(--color-admin-text-muted)] mb-1">
                              {t('pages.services.tagTextAr')}
                            </label>
                            <input
                              type="text"
                              value={tag.textAr || ''}
                              onChange={(e) => updateTag(index, 'textAr', e.target.value)}
                              className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-sm text-right"
                              dir="rtl"
                              placeholder="مثال: تصميم حدائق عامة"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="px-3 py-2 bg-[var(--color-admin-danger)] text-white rounded-lg hover:bg-red-700 transition-all text-sm"
                          >
                            {t('pages.services.removeTag')}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
                </>
              )}

              {serviceType === 'image' && (
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.services.serviceImage')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)]"
                    required={serviceType === 'image'}
                  />
                  {editingService?.imageUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">{t('pages.services.currentImage')}</p>
                      <img
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${editingService.imageUrl}`}
                        alt="Service"
                        className="w-full max-w-md h-48 object-cover rounded-lg border border-[var(--color-admin-border)]"
                      />
                      <input
                        type="hidden"
                        name="imageUrl"
                        value={editingService.imageUrl}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={editingService?.isActive !== false}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-[var(--color-admin-text)]">{t('common.active')}</span>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[var(--color-admin-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all"
                >
                  {editingService ? t('pages.services.updateService') : t('pages.services.createService')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingService(null);
                    setTags([]);
                    setServiceType('card');
                  }}
                  className="px-8 py-3 bg-[var(--color-admin-muted)] text-[var(--color-admin-text)] rounded-xl font-semibold hover:bg-[var(--color-admin-border)] transition-all"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceManager;

