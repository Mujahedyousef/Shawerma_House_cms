import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getAllProductTypes,
  createProductType,
  updateProductType,
  deleteProductType,
} from '../api/productType';
import { showSuccess, showError, showConfirm } from '../utils/i18nHelpers';

const ProductTypeManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProductType, setEditingProductType] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllProductTypes();
      setProductTypes(response.data || []);
    } catch (error) {
      console.error('Error fetching product types:', error);
      showError('failedToLoad', t('sidebar.productTypes'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProductType = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      nameEn: formData.get('nameEn'),
      nameAr: formData.get('nameAr'),
      order: parseInt(formData.get('order')) || 0,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      await createProductType(data);
      showSuccess('created', t('sidebar.productTypes'));
      fetchData();
      e.target.reset();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating product type:', error);
      showError('failedToCreate', t('sidebar.productTypes'));
    }
  };

  const handleUpdateProductType = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      nameEn: formData.get('nameEn'),
      nameAr: formData.get('nameAr'),
      order: parseInt(formData.get('order')) || 0,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      await updateProductType(editingProductType.id, data);
      showSuccess('updated', t('sidebar.productTypes'));
      fetchData();
      setEditingProductType(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating product type:', error);
      showError('failedToUpdate', t('sidebar.productTypes'));
    }
  };

  const handleDeleteProductType = async (id) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteProductType(id);
      showSuccess('deleted', t('sidebar.productTypes'));
      fetchData();
    } catch (error) {
      console.error('Error deleting product type:', error);
      showError('failedToDelete', t('sidebar.productTypes'));
    }
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
          <h1 className="text-3xl font-bold text-[var(--color-admin-text)] mb-2">{t('sidebar.productTypes')}</h1>
          <p className="text-[var(--color-admin-text-muted)]">{t('pages.productTypes.description')}</p>
        </div>

        <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
          <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
            <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('sidebar.productTypes')}</h2>
            <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.productTypes.description')}</p>
          </div>
          
          {/* Add Product Type Button */}
          {!showForm && !editingProductType && (
            <div className="p-6">
              <button
                onClick={() => setShowForm(true)}
                className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg"
              >
                + {t('pages.productTypes.addProductType')}
              </button>
            </div>
          )}

          {/* Product Type Form */}
          {(showForm || editingProductType) && (
            <div className="p-6 border-b border-[var(--color-admin-border)]">
              <form onSubmit={editingProductType ? handleUpdateProductType : handleCreateProductType} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('form.nameEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                    </label>
                    <input
                      type="text"
                      name="nameEn"
                      defaultValue={editingProductType?.nameEn || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                      {t('form.nameAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                    </label>
                    <input
                      type="text"
                      name="nameAr"
                      defaultValue={editingProductType?.nameAr || ''}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
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
                      defaultValue={editingProductType?.order || 0}
                      className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        defaultChecked={editingProductType?.isActive !== false}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-[var(--color-admin-text)]">{t('common.active')}</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg"
                  >
                    {editingProductType ? t('pages.productTypes.updateProductType') : t('pages.productTypes.addProductType')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingProductType(null);
                    }}
                    className="bg-[var(--color-admin-muted)] text-[var(--color-admin-text)] px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-border)] transition-all"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Product Types List */}
          <div className="p-6">
            {productTypes.length === 0 ? (
              <div className="text-center py-16 bg-[var(--color-admin-muted)] rounded-xl border-2 border-dashed border-[var(--color-admin-border)]">
                <p className="text-sm font-medium text-[var(--color-admin-text)]">{t('pages.productTypes.noProductTypesYet')}</p>
                <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">{t('pages.productTypes.getStarted')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--color-admin-border)]">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-admin-text)]">{t('form.order')}</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-admin-text)]">{t('form.nameEn')}</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-[var(--color-admin-text)]">{t('form.nameAr')}</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-[var(--color-admin-text)]">{t('common.status')}</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-[var(--color-admin-text)]">{t('common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productTypes.map((productType) => (
                      <tr key={productType.id} className="border-b border-[var(--color-admin-border)] hover:bg-[var(--color-admin-muted)] transition-colors">
                        <td className="py-3 px-4 text-sm text-[var(--color-admin-text)]">{productType.order}</td>
                        <td className="py-3 px-4 text-sm text-[var(--color-admin-text)]">{productType.nameEn}</td>
                        <td className="py-3 px-4 text-sm text-[var(--color-admin-text)] text-right">{productType.nameAr}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            productType.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {productType.isActive ? t('common.active') : t('common.inactive')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => {
                                setEditingProductType(productType);
                                setShowForm(true);
                              }}
                              className="bg-[var(--color-admin-primary-light)] text-[var(--color-admin-primary)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-primary)]/20 transition-all"
                            >
                              {t('common.edit')}
                            </button>
                            <button
                              onClick={() => handleDeleteProductType(productType.id)}
                              className="bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-danger)]/20 transition-all"
                            >
                              {t('common.delete')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTypeManager;
