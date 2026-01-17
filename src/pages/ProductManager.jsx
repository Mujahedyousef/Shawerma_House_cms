import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductFilterOptions,
  getProductsPageSettings,
  updateProductsPageSettings,
  getProductById,
} from '../api/product';
import { getActiveBrandsSection } from '../api/brandsSection';
import { getActiveProductTypes } from '../api/productType';
import { getAllCategories } from '../api/category';
import { createColor, getAllColors } from '../api/color';
import { showSuccess, showError, showConfirm } from '../utils/i18nHelpers';

const ProductManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [products, setProducts] = useState([]);
  const [filterOptions, setFilterOptions] = useState(null);
  const [pageSettings, setPageSettings] = useState(null);
  const [brands, setBrands] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'settings', 'filters'
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [technicalSpecs, setTechnicalSpecs] = useState([]);
  const [detailedDescriptionEn, setDetailedDescriptionEn] = useState('');
  const [detailedDescriptionAr, setDetailedDescriptionAr] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [originalImageIds, setOriginalImageIds] = useState([]); // Track original image IDs from DB
  const [selectedSimilarProducts, setSelectedSimilarProducts] = useState([]);
  const [selectedColorIds, setSelectedColorIds] = useState([]);
  const [showColorForm, setShowColorForm] = useState(false);
  const [newColor, setNewColor] = useState({ nameEn: '', nameAr: '', hexCode: '#000000' });
  const quillEnRef = useRef(null);
  const quillArRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Initialize form data when editing product
  useEffect(() => {
    if (editingProduct) {
      setTechnicalSpecs(editingProduct.technicalSpecs || []);
      // Ensure we handle null/undefined properly for rich text editors
      const descEn = editingProduct.detailedDescriptionEn ?? '';
      const descAr = editingProduct.detailedDescriptionAr ?? '';

      // Set state first
      setDetailedDescriptionEn(descEn);
      setDetailedDescriptionAr(descAr);

      // Manually set Quill content using refs after a brief delay to ensure Quill is mounted
      setTimeout(() => {
        if (quillEnRef.current) {
          try {
            // Try to access the editor instance
            const editor = quillEnRef.current.getEditor ? quillEnRef.current.getEditor() : null;
            if (editor && editor.root && descEn) {
              editor.root.innerHTML = descEn;
            }
          } catch (e) {
            console.log('Could not set Quill content via ref:', e);
          }
        }
        if (quillArRef.current) {
          try {
            const editor = quillArRef.current.getEditor ? quillArRef.current.getEditor() : null;
            if (editor && editor.root && descAr) {
              editor.root.innerHTML = descAr;
            }
          } catch (e) {
            console.log('Could not set Quill content via ref:', e);
          }
        }
      }, 200);

      // Use images relation if available, otherwise fallback to imageUrls or imageUrl
      if (editingProduct.images && editingProduct.images.length > 0) {
        setProductImages(editingProduct.images.map(img => img.imageUrl));
        setOriginalImageIds(editingProduct.images.map(img => img.id));
      } else if (editingProduct.imageUrls && editingProduct.imageUrls.length > 0) {
        setProductImages(editingProduct.imageUrls);
        setOriginalImageIds([]);
      } else {
        setProductImages(editingProduct.imageUrl ? [editingProduct.imageUrl] : []);
        setOriginalImageIds([]);
      }
      // Set similar products
      setSelectedSimilarProducts(editingProduct.similarProductIds || []);
      // Set selected colors from the colors array
      setSelectedColorIds(editingProduct.colors?.map(pc => pc.colorId) || editingProduct.colors?.map(c => c.id) || []);
    } else {
      setTechnicalSpecs([]);
      setDetailedDescriptionEn('');
      setDetailedDescriptionAr('');
      setProductImages([]);
      setOriginalImageIds([]);
      setSelectedSimilarProducts([]);
      setSelectedColorIds([]);
    }
  }, [editingProduct]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, filtersData, settingsData, brandsSectionData, productTypesData, categoriesData, colorsData] = await Promise.all([
        getAllProducts(),
        getProductFilterOptions(),
        getProductsPageSettings(),
        getActiveBrandsSection(),
        getActiveProductTypes(),
        getAllCategories(),
        getAllColors(),
      ]);
      setProducts(productsData.data || []);
      setFilterOptions(filtersData.data);
      setPageSettings(settingsData.data);
      // Extract logos from brands section as brands
      setBrands(brandsSectionData.data?.logos || []);
      // Update filterOptions with all colors (not just ones with product counts)
      if (colorsData?.data) {
        setFilterOptions(prev => ({
          ...prev,
          colors: colorsData.data,
        }));
      }
      setProductTypes(productTypesData.data || []);
      setCategories(categoriesData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showError('failedToLoad', t('sidebar.products'));
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = imageUrl => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:5000${imageUrl}`;
  };

  const handleCreateProduct = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const imageFiles = formData.getAll('images');

    const requestFormData = new FormData();
    requestFormData.append('titleEn', formData.get('titleEn'));
    requestFormData.append('titleAr', formData.get('titleAr'));
    requestFormData.append('descriptionEn', formData.get('descriptionEn') || '');
    requestFormData.append('descriptionAr', formData.get('descriptionAr') || '');
    requestFormData.append('price', formData.get('price'));
    requestFormData.append('oldPrice', formData.get('oldPrice') || '');
    requestFormData.append('availability', formData.get('availability') || '');
    requestFormData.append('warranty', formData.get('warranty') || '');
    requestFormData.append('detailedDescriptionEn', detailedDescriptionEn);
    requestFormData.append('detailedDescriptionAr', detailedDescriptionAr);
    requestFormData.append('mediaType', formData.get('mediaType') || '');
    requestFormData.append('mediaUrl', formData.get('mediaUrl') || '');
    requestFormData.append('similarProductIds', JSON.stringify(selectedSimilarProducts));
    const categoryId = formData.get('categoryId');
    if (categoryId) {
      requestFormData.append('categoryId', categoryId);
    }
    requestFormData.append('productTypeId', formData.get('productTypeId') || '');
    requestFormData.append('brandLogoId', formData.get('brandId') || '');
    // Send colorIds as JSON array
    requestFormData.append('colorIds', JSON.stringify(selectedColorIds));
    const countryId = formData.get('countryId');
    if (countryId) {
      requestFormData.append('countryId', countryId);
    }
    const yearId = formData.get('yearId');
    const year = formData.get('year');
    if (yearId) {
      requestFormData.append('yearId', yearId);
    }
    if (year && year.toString().trim() !== '' && !yearId) {
      requestFormData.append('year', year);
    }
    requestFormData.append('order', formData.get('order') || products.length);
    requestFormData.append('isActive', formData.get('isActive') === 'on' ? 'true' : 'false');
    requestFormData.append('technicalSpecs', JSON.stringify(technicalSpecs));

    // Append multiple image files
    imageFiles.forEach(file => {
      if (file && file.size > 0) {
        requestFormData.append('images', file);
      }
    });

    // Append media file if provided
    const mediaFile = formData.get('mediaFile');
    if (mediaFile && mediaFile.size > 0) {
      requestFormData.append('mediaFile', mediaFile);
    }

    try {
      await createProduct(requestFormData);
      showSuccess('created', t('sidebar.products'));
      fetchData();
      e.target.reset();
      setShowForm(false);
      setTechnicalSpecs([]);
      setDetailedDescriptionEn('');
      setDetailedDescriptionAr('');
      setProductImages([]);
      setOriginalImageIds([]);
      setSelectedSimilarProducts([]);
    } catch (error) {
      console.error('Error creating product:', error);
      showError('failedToCreate', t('sidebar.products'));
    }
  };

  const handleUpdateProduct = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const imageFiles = formData.getAll('images');

    const requestFormData = new FormData();
    requestFormData.append('titleEn', formData.get('titleEn'));
    requestFormData.append('titleAr', formData.get('titleAr'));
    requestFormData.append('descriptionEn', formData.get('descriptionEn') || '');
    requestFormData.append('descriptionAr', formData.get('descriptionAr') || '');
    requestFormData.append('price', formData.get('price'));
    requestFormData.append('oldPrice', formData.get('oldPrice') || '');
    requestFormData.append('availability', formData.get('availability') || '');
    requestFormData.append('warranty', formData.get('warranty') || '');
    requestFormData.append('detailedDescriptionEn', detailedDescriptionEn);
    requestFormData.append('detailedDescriptionAr', detailedDescriptionAr);
    requestFormData.append('mediaType', formData.get('mediaType') || '');
    requestFormData.append('mediaUrl', formData.get('mediaUrl') || '');
    requestFormData.append('similarProductIds', JSON.stringify(selectedSimilarProducts));
    const categoryId = formData.get('categoryId');
    if (categoryId) {
      requestFormData.append('categoryId', categoryId);
    }
    requestFormData.append('productTypeId', formData.get('productTypeId') || '');
    requestFormData.append('brandLogoId', formData.get('brandId') || '');
    // Send colorIds as JSON array
    requestFormData.append('colorIds', JSON.stringify(selectedColorIds));
    const countryId = formData.get('countryId');
    if (countryId) {
      requestFormData.append('countryId', countryId);
    }
    const yearId = formData.get('yearId');
    const year = formData.get('year');
    if (yearId) {
      requestFormData.append('yearId', yearId);
    }
    if (year && year.toString().trim() !== '' && !yearId) {
      requestFormData.append('year', year);
    }
    requestFormData.append('order', formData.get('order'));
    requestFormData.append('isActive', formData.get('isActive') === 'on' ? 'true' : 'false');
    requestFormData.append('technicalSpecs', JSON.stringify(technicalSpecs));

    // Handle images:
    // - Send new file uploads as files
    // - Send the final list of existing image URLs that should be kept (after deletions)
    // The backend will merge new file URLs with existing ones and delete removed ones
    if (imageFiles.length > 0 && imageFiles[0].size > 0) {
      // Upload new files
      imageFiles.forEach(file => {
        if (file && file.size > 0) {
          requestFormData.append('images', file);
        }
      });
    }
    // Send the final list of existing image URLs that should be kept
    // This tells the backend which existing images should remain (images not in this list will be deleted)
    // Note: productImages may contain both existing images (from DB) and placeholder URLs for new uploads
    // We filter to only include URLs that look like existing ones (start with /uploads/ or are full URLs)
    const existingImageUrls = productImages.filter(url => url && (url.startsWith('/uploads/') || url.startsWith('http')));
    requestFormData.append('imageUrls', JSON.stringify(existingImageUrls));

    // Append media file if provided
    const mediaFile = formData.get('mediaFile');
    if (mediaFile && mediaFile.size > 0) {
      requestFormData.append('mediaFile', mediaFile);
    }

    // Append technical data sheet file if provided
    const technicalDataSheetFile = formData.get('technicalDataSheet');
    if (technicalDataSheetFile && technicalDataSheetFile.size > 0) {
      requestFormData.append('technicalDataSheet', technicalDataSheetFile);
    } else if (editingProduct?.technicalDataSheetUrl) {
      // Keep existing file if no new file is uploaded
      requestFormData.append('technicalDataSheetUrl', editingProduct.technicalDataSheetUrl);
    }

    // Append catalog file if provided
    const catalogFile = formData.get('catalog');
    if (catalogFile && catalogFile.size > 0) {
      requestFormData.append('catalog', catalogFile);
    } else if (editingProduct?.catalogUrl) {
      // Keep existing file if no new file is uploaded
      requestFormData.append('catalogUrl', editingProduct.catalogUrl);
    }

    try {
      await updateProduct(editingProduct.id, requestFormData);
      showSuccess('updated', t('sidebar.products'));
      fetchData();
      setEditingProduct(null);
      setShowForm(false);
      setTechnicalSpecs([]);
      setDetailedDescriptionEn('');
      setDetailedDescriptionAr('');
      setProductImages([]);
      setOriginalImageIds([]);
      setSelectedSimilarProducts([]);
    } catch (error) {
      console.error('Error updating product:', error);
      showError('failedToUpdate', t('sidebar.products'));
    }
  };

  const addTechnicalSpec = () => {
    setTechnicalSpecs([...technicalSpecs, { titleEn: '', titleAr: '', valueEn: '', valueAr: '' }]);
  };

  const removeTechnicalSpec = index => {
    setTechnicalSpecs(technicalSpecs.filter((_, i) => i !== index));
  };

  const updateTechnicalSpec = (index, field, value) => {
    const updated = [...technicalSpecs];
    updated[index][field] = value;
    setTechnicalSpecs(updated);
  };

  const handleDeleteProduct = async id => {
    if (!showConfirm('delete')) return;

    try {
      await deleteProduct(id);
      showSuccess('deleted', t('sidebar.products'));
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      showError('failedToDelete', t('sidebar.products'));
    }
  };

  const handleUpdatePageSettings = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const heroImageFile = formData.get('heroImage');

    const requestFormData = new FormData();
    requestFormData.append('heroTitleEn', formData.get('heroTitleEn'));
    requestFormData.append('heroTitleAr', formData.get('heroTitleAr'));

    if (heroImageFile && heroImageFile.size > 0) {
      requestFormData.append('heroImage', heroImageFile);
    } else if (formData.get('heroImageUrl')) {
      requestFormData.append('heroImageUrl', formData.get('heroImageUrl'));
    }

    try {
      await updateProductsPageSettings(requestFormData);
      showSuccess('updated', t('sidebar.products'));
      fetchData();
    } catch (error) {
      console.error('Error updating page settings:', error);
      showError('failedToUpdate', t('sidebar.products'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-admin-bg)]" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-admin-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--color-admin-text-muted)] font-medium">{t('pages.products.loadingProducts')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-admin-bg)] p-4 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-admin-text)] mb-2">{t('pages.products.title')}</h1>
          <p className="text-[var(--color-admin-text-muted)]">{t('pages.products.description')}</p>
        </div>

        {/* Tabs */}
        <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] p-1.5 mb-6 inline-flex gap-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'products'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.products.products')} <span className="ml-1 opacity-80">({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'settings'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.products.settings')}
          </button>
          <button
            onClick={() => setActiveTab('filters')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'filters'
                ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30'
                : 'text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)]'
            }`}
          >
            {t('pages.products.filters')}
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.products.products')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.products.productsDesc')}</p>
            </div>

            {/* Add Product Button */}
            {!showForm && !editingProduct && (
              <div className="p-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-[var(--color-admin-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg"
                >
                  + {t('pages.products.addProduct')}
                </button>
              </div>
            )}

            {/* Product Form */}
            {(showForm || editingProduct) && (
              <div className="p-6 border-b border-[var(--color-admin-border)]">
                <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('form.titleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="text"
                        name="titleEn"
                        defaultValue={editingProduct?.titleEn || ''}
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
                        defaultValue={editingProduct?.titleAr || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                        dir="rtl"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('form.descriptionEn')}</label>
                      <textarea
                        name="descriptionEn"
                        defaultValue={editingProduct?.descriptionEn || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-24 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('form.descriptionAr')}</label>
                      <textarea
                        name="descriptionAr"
                        defaultValue={editingProduct?.descriptionAr || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all h-24 resize-none text-right"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.products.price')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="price"
                        defaultValue={editingProduct?.price || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.products.oldPrice')}</label>
                      <input
                        type="number"
                        step="0.01"
                        name="oldPrice"
                        defaultValue={editingProduct?.oldPrice || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.products.availability')}</label>
                      <input
                        type="number"
                        name="availability"
                        defaultValue={editingProduct?.availability || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        min="0"
                        placeholder={t('pages.products.availabilityPlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.products.warranty')}</label>
                      <input
                        type="text"
                        name="warranty"
                        defaultValue={editingProduct?.warranty || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        placeholder={t('pages.products.warrantyPlaceholder')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.products.productImages')} {!editingProduct && <span className="text-[var(--color-admin-danger)]">*</span>}
                        <span className="text-xs text-[var(--color-admin-text-muted)] ml-2">({t('pages.products.productImagesNote')})</span>
                      </label>
                      <input
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)]"
                        required={!editingProduct && productImages.length === 0}
                      />
                      {productImages.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">{t('pages.products.currentImages')}</p>
                          <div className="flex flex-wrap gap-2">
                            {productImages.map((imgUrl, idx) => (
                              <div key={idx} className="relative">
                                <img
                                  src={getImageUrl(imgUrl)}
                                  alt={`Product image ${idx + 1}`}
                                  className="w-24 h-24 object-cover rounded-lg border border-[var(--color-admin-border)]"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = productImages.filter((_, i) => i !== idx);
                                    setProductImages(updated);
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.products.displayOrder')}</label>
                      <input
                        type="number"
                        name="order"
                        defaultValue={editingProduct?.order || products.length}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Product Files */}
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.products.productFiles')}</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Technical Data Sheet */}
                      <div>
                        <label className="block text-xs text-[var(--color-admin-text-muted)] mb-2">{t('pages.products.technicalDataSheet')}</label>
                        <input
                          type="file"
                          name="technicalDataSheet"
                          accept=".pdf,application/pdf"
                          className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)]"
                        />
                        {editingProduct?.technicalDataSheetUrl && (
                          <div className="mt-2">
                            <a
                              href={getImageUrl(editingProduct.technicalDataSheetUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-[var(--color-admin-primary)] hover:underline"
                            >
                              {t('pages.products.viewCurrentFile')}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Catalog */}
                      <div>
                        <label className="block text-xs text-[var(--color-admin-text-muted)] mb-2">{t('pages.products.catalog')}</label>
                        <input
                          type="file"
                          name="catalog"
                          accept=".pdf,application/pdf"
                          className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)]"
                        />
                        {editingProduct?.catalogUrl && (
                          <div className="mt-2">
                            <a
                              href={getImageUrl(editingProduct.catalogUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-[var(--color-admin-primary)] hover:underline"
                            >
                              {t('pages.products.viewCurrentFile')}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Filter Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                        {t('pages.products.category')} <span className="text-[var(--color-admin-danger)]">*</span>
                      </label>
                      <select
                        name="categoryId"
                        defaultValue={editingProduct?.categoryId || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        required
                      >
                        <option value="">{t('pages.products.selectCategory')}</option>
                        {categories
                          .filter(cat => cat.isActive)
                          .map(category => (
                            <option key={category.id} value={category.id}>
                              {category.titleEn} / {category.titleAr}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Product Type */}
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.products.productType')}</label>
                      <select
                        name="productTypeId"
                        defaultValue={editingProduct?.productTypeId || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      >
                        <option value="">{t('pages.products.none')}</option>
                        {productTypes.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Brand */}
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.products.brand')}</label>
                      <select
                        name="brandId"
                        defaultValue={editingProduct?.brandLogoId || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      >
                        <option value="">{t('pages.products.none')}</option>
                        {brands.map(brand => (
                          <option key={brand.id} value={brand.id}>
                            {brand.nameEn}
                          </option>
                        ))}
                      </select>
                      {brands.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {brands.map(brand => (
                            <div
                              key={brand.id}
                              className={`p-2 border-2 rounded-lg cursor-pointer transition-all ${
                                editingProduct?.brandLogoId === brand.id
                                  ? 'border-[var(--color-admin-primary)] bg-[var(--color-admin-primary)]/10'
                                  : 'border-[var(--color-admin-border)] hover:border-[var(--color-admin-primary)]/50'
                              }`}
                              onClick={() => {
                                const select = document.querySelector('select[name="brandId"]');
                                if (select) {
                                  select.value = brand.id;
                                  // Trigger change event
                                  select.dispatchEvent(new Event('change', { bubbles: true }));
                                }
                              }}
                              title={brand.nameEn}
                            >
                              {brand.imageUrl ? (
                                <img src={getImageUrl(brand.imageUrl)} alt={brand.nameEn} className="w-12 h-12 object-contain" />
                              ) : (
                                <span className="text-xs block text-center">{brand.nameEn}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Colors */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.products.colors')}</label>
                        <button
                          type="button"
                          onClick={() => setShowColorForm(!showColorForm)}
                          className="text-xs px-3 py-1 bg-[var(--color-admin-primary)] text-white rounded-lg hover:bg-[var(--color-admin-primary-dark)] transition-colors"
                        >
                          {showColorForm ? t('common.cancel') : `+ ${t('pages.products.addColor')}`}
                        </button>
                      </div>

                      {/* Create New Color Form */}
                      {showColorForm && (
                        <div className="mb-4 p-4 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-muted)] space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-[var(--color-admin-text)] mb-1">{t('pages.products.nameEn')} <span className="text-[var(--color-admin-danger)]">*</span></label>
                              <input
                                type="text"
                                value={newColor.nameEn}
                                onChange={e => setNewColor({ ...newColor, nameEn: e.target.value })}
                                className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] text-sm"
                                placeholder="Red"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[var(--color-admin-text)] mb-1">{t('pages.products.nameAr')} <span className="text-[var(--color-admin-danger)]">*</span></label>
                              <input
                                type="text"
                                value={newColor.nameAr}
                                onChange={e => setNewColor({ ...newColor, nameAr: e.target.value })}
                                className="w-full px-3 py-2 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] text-sm text-right"
                                placeholder="أحمر"
                                dir="rtl"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="block text-xs font-semibold text-[var(--color-admin-text)]">{t('pages.products.hexCode')}:</label>
                            <input
                              type="color"
                              value={newColor.hexCode}
                              onChange={e => setNewColor({ ...newColor, hexCode: e.target.value })}
                              className="w-16 h-10 border border-[var(--color-admin-border)] rounded-lg cursor-pointer"
                            />
                            <input
                              type="text"
                              value={newColor.hexCode}
                              onChange={e => setNewColor({ ...newColor, hexCode: e.target.value })}
                              className="flex-1 px-3 py-2 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] text-sm"
                              placeholder="#FF0000"
                            />
                            <button
                              type="button"
                              onClick={async () => {
                                if (!newColor.nameEn || !newColor.nameAr) {
                                  showError('validation.required', t('form.colorNames'));
                                  return;
                                }
                                try {
                                  const response = await createColor(newColor);
                                  if (response?.data) {
                                    // Add the new color to the list and select it
                                    const newColorId = response.data.id;
                                    setFilterOptions(prev => ({
                                      ...prev,
                                      colors: [...(prev?.colors || []), response.data],
                                    }));
                                    setSelectedColorIds([...selectedColorIds, newColorId]);
                                    setNewColor({ nameEn: '', nameAr: '', hexCode: '#000000' });
                                    setShowColorForm(false);
                                    showSuccess('created', t('form.color'));
                                  }
                                } catch (error) {
                                  console.error('Error creating color:', error);
                                  showError('failedToCreate', t('form.color'));
                                }
                              }}
                              className="px-4 py-2 bg-[var(--color-admin-primary)] text-white rounded-lg hover:bg-[var(--color-admin-primary-dark)] transition-colors text-sm font-semibold"
                            >
                              {t('pages.products.create')}
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 max-h-48 overflow-y-auto border border-[var(--color-admin-border)] rounded-xl p-3 bg-[var(--color-admin-surface)]">
                        {filterOptions?.colors?.map(color => (
                          <label
                            key={color.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--color-admin-muted)] cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedColorIds.includes(color.id)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setSelectedColorIds([...selectedColorIds, color.id]);
                                } else {
                                  setSelectedColorIds(selectedColorIds.filter(id => id !== color.id));
                                }
                              }}
                              className="w-4 h-4 text-[var(--color-admin-primary)] border-[var(--color-admin-border)] rounded focus:ring-[var(--color-admin-primary)]"
                            />
                            <div className="flex items-center gap-2 flex-1">
                              {color.hexCode && (
                                <div className="w-6 h-6 rounded border border-[var(--color-admin-border)]" style={{ backgroundColor: color.hexCode }} />
                              )}
                              <span className="text-sm text-[var(--color-admin-text)]">
                                {color.nameEn} {color.nameAr && `(${color.nameAr})`}
                              </span>
                            </div>
                          </label>
                        ))}
                        {filterOptions?.colors?.length === 0 && (
                          <p className="text-sm text-[var(--color-admin-text-muted)] text-center py-2">{t('pages.products.noColorsAvailable')}</p>
                        )}
                      </div>
                        {selectedColorIds.length > 0 && (
                        <p className="text-xs text-[var(--color-admin-text-muted)] mt-2">
                          {selectedColorIds.length} {t('pages.products.colorsSelected')}
                        </p>
                      )}
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.products.country')}</label>
                      <select
                        name="countryId"
                        defaultValue={editingProduct?.countryId || ''}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      >
                        <option value="">{t('pages.products.selectCountry')}</option>
                        {filterOptions?.countries &&
                          filterOptions.countries.map(country => (
                            <option key={country.id} value={country.id}>
                              {country.nameEn}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Year */}
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.products.year')}</label>
                      <input
                        type="number"
                        name="year"
                        defaultValue={editingProduct?.year?.year || ''}
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        placeholder={t('pages.products.yearPlaceholder')}
                        className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                      />
                      {filterOptions?.years && filterOptions.years.length > 0 && (
                        <select
                          name="yearId"
                          defaultValue={editingProduct?.yearId || ''}
                          className="w-full mt-2 px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        >
                          <option value="">{t('pages.products.orSelectFromExistingYears')}</option>
                          {filterOptions.years.map(year => (
                            <option key={year.id} value={year.id}>
                              {year.year}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  {/* Technical Specifications */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.products.technicalSpecifications')}</label>
                      <button
                        type="button"
                        onClick={addTechnicalSpec}
                        className="text-sm bg-[var(--color-admin-primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-admin-primary-dark)] transition-all"
                      >
                        + {t('pages.products.addSpecification')}
                      </button>
                    </div>
                    <div className="space-y-3">
                      {technicalSpecs.map((spec, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-muted)]"
                        >
                          <input
                            type="text"
                            placeholder={t('form.titleEn')}
                            value={spec.titleEn || ''}
                            onChange={e => updateTechnicalSpec(index, 'titleEn', e.target.value)}
                            className="px-3 py-2 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] text-sm"
                          />
                          <input
                            type="text"
                            placeholder={t('form.titleAr')}
                            value={spec.titleAr || ''}
                            onChange={e => updateTechnicalSpec(index, 'titleAr', e.target.value)}
                            className="px-3 py-2 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] text-sm text-right"
                            dir="rtl"
                          />
                          <input
                            type="text"
                            placeholder={t('form.valueEn')}
                            value={spec.valueEn || ''}
                            onChange={e => updateTechnicalSpec(index, 'valueEn', e.target.value)}
                            className="px-3 py-2 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] text-sm"
                          />
                          <input
                            type="text"
                            placeholder={t('form.valueAr')}
                            value={spec.valueAr || ''}
                            onChange={e => updateTechnicalSpec(index, 'valueAr', e.target.value)}
                            className="px-3 py-2 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] text-sm text-right"
                            dir="rtl"
                          />
                          <button
                            type="button"
                            onClick={() => removeTechnicalSpec(index)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all text-sm"
                          >
                            {t('common.delete')}
                          </button>
                        </div>
                      ))}
                      {technicalSpecs.length === 0 && (
                        <p className="text-sm text-[var(--color-admin-text-muted)] text-center py-4">
                          {t('pages.products.noTechnicalSpecs')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Detailed Description */}
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.products.detailedDescriptionEn')}</label>
                    {editingProduct && (
                      <ReactQuill
                        ref={quillEnRef}
                        key={`desc-en-${editingProduct.id}`}
                        theme="snow"
                        value={detailedDescriptionEn}
                        onChange={setDetailedDescriptionEn}
                        className="bg-[var(--color-admin-surface)] rounded-xl"
                        style={{ minHeight: '200px' }}
                      />
                    )}
                    {!editingProduct && (
                      <ReactQuill
                        key="desc-en-new"
                        theme="snow"
                        value={detailedDescriptionEn}
                        onChange={setDetailedDescriptionEn}
                        className="bg-[var(--color-admin-surface)] rounded-xl"
                        style={{ minHeight: '200px' }}
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.products.detailedDescriptionAr')}</label>
                    {editingProduct && (
                      <ReactQuill
                        ref={quillArRef}
                        key={`desc-ar-${editingProduct.id}`}
                        theme="snow"
                        value={detailedDescriptionAr}
                        onChange={setDetailedDescriptionAr}
                        className="bg-[var(--color-admin-surface)] rounded-xl"
                        style={{ minHeight: '200px' }}
                      />
                    )}
                    {!editingProduct && (
                      <ReactQuill
                        key="desc-ar-new"
                        theme="snow"
                        value={detailedDescriptionAr}
                        onChange={setDetailedDescriptionAr}
                        className="bg-[var(--color-admin-surface)] rounded-xl"
                        style={{ minHeight: '200px' }}
                      />
                    )}
                  </div>

                  {/* Media Section (Video or Image) */}
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.products.media')}</label>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-[var(--color-admin-text-muted)] mb-2">{t('pages.products.mediaType')}</label>
                        <select
                          name="mediaType"
                          defaultValue={editingProduct?.mediaType || ''}
                          className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        >
                          <option value="">{t('pages.products.none')}</option>
                          <option value="video">{t('pages.products.video')}</option>
                          <option value="image">{t('pages.products.image')}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-[var(--color-admin-text-muted)] mb-2">{t('pages.products.uploadMediaFile')}</label>
                        <input
                          type="file"
                          name="mediaFile"
                          accept="video/*,image/*"
                          className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)]"
                        />
                        {editingProduct?.mediaUrl && (
                          <div className="mt-4">
                            <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">{t('pages.products.currentMedia')}</p>
                            {editingProduct.mediaType === 'video' ? (
                              <video
                                src={getImageUrl(editingProduct.mediaUrl)}
                                controls
                                className="w-full max-w-md h-48 object-cover rounded-lg border border-[var(--color-admin-border)]"
                              />
                            ) : (
                              <img
                                src={getImageUrl(editingProduct.mediaUrl)}
                                alt="Media"
                                className="w-full max-w-md h-48 object-cover rounded-lg border border-[var(--color-admin-border)]"
                              />
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs text-[var(--color-admin-text-muted)] mb-2">{t('pages.products.orEnterMediaUrl')}</label>
                        <input
                          type="text"
                          name="mediaUrl"
                          defaultValue={editingProduct?.mediaUrl || ''}
                          placeholder={t('pages.products.mediaUrlPlaceholder')}
                          className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Similar Products Section */}
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.products.similarProducts')}</label>
                    <p className="text-xs text-[var(--color-admin-text-muted)] mb-3">{t('pages.products.selectSimilarProducts')}</p>
                    <div className="border border-[var(--color-admin-border)] rounded-xl p-4 max-h-64 overflow-y-auto">
                      {products
                        .filter(p => !editingProduct || p.id !== editingProduct.id)
                        .map(product => (
                          <label key={product.id} className="flex items-center gap-2 p-2 hover:bg-[var(--color-admin-muted)] rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedSimilarProducts.includes(product.id)}
                              onChange={e => {
                                if (e.target.checked) {
                                  if (selectedSimilarProducts.length < 4) {
                                    setSelectedSimilarProducts([...selectedSimilarProducts, product.id]);
                                  } else {
                                    showError('maxSimilarProducts', t('pages.products.maxSimilarProducts'));
                                  }
                                } else {
                                  setSelectedSimilarProducts(selectedSimilarProducts.filter(id => id !== product.id));
                                }
                              }}
                              className="w-4 h-4"
                            />
                            <span className="text-sm text-[var(--color-admin-text)]">
                              {product.titleEn} / {product.titleAr}
                            </span>
                          </label>
                        ))}
                      {products.filter(p => !editingProduct || p.id !== editingProduct.id).length === 0 && (
                        <p className="text-sm text-[var(--color-admin-text-muted)]">{t('pages.products.noOtherProductsAvailable')}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="isActive" defaultChecked={editingProduct?.isActive !== false} className="w-4 h-4" />
                      <span className="text-sm text-[var(--color-admin-text)]">{t('pages.products.active')}</span>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg"
                    >
                      {editingProduct ? t('pages.products.updateProduct') : t('pages.products.addProduct')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingProduct(null);
                        setSelectedSimilarProducts([]);
                      }}
                      className="bg-[var(--color-admin-muted)] text-[var(--color-admin-text)] px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-border)] transition-all"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products List */}
            <div className="p-6">
              {products.length === 0 ? (
                <div className="text-center py-16 bg-[var(--color-admin-muted)] rounded-xl border-2 border-dashed border-[var(--color-admin-border)]">
                  <p className="text-sm font-medium text-[var(--color-admin-text)]">{t('pages.products.noProductsYet')}</p>
                  <p className="text-xs text-[var(--color-admin-text-muted)] mt-1">{t('pages.products.getStarted')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <div
                      key={product.id}
                      className="border border-[var(--color-admin-border)] rounded-xl p-6 bg-[var(--color-admin-surface)] hover:shadow-xl transition-all"
                    >
                      <img src={getImageUrl(product.imageUrl)} alt={product.titleEn} className="w-full h-48 object-cover rounded-lg mb-4" />
                      <h3 className="font-bold text-[var(--color-admin-text)] mb-2">{product.titleEn}</h3>
                      <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">
                        {t('pages.products.priceLabel')} {parseFloat(product.price).toFixed(2)} AED
                        {product.oldPrice && <span className="ml-2 line-through text-gray-400">{parseFloat(product.oldPrice).toFixed(2)} AED</span>}
                      </p>
                      <div className="flex gap-2 pt-4 border-t border-[var(--color-admin-border)]">
                        <button
                          onClick={async () => {
                            try {
                              // Fetch full product data including detailed descriptions
                              const productData = await getProductById(product.id);
                              const fullProduct = productData?.data || productData;

                              // Set detailed descriptions BEFORE setting editingProduct
                              // This ensures ReactQuill gets the value on initial render
                              setDetailedDescriptionEn(fullProduct.detailedDescriptionEn ?? '');
                              setDetailedDescriptionAr(fullProduct.detailedDescriptionAr ?? '');
                              setTechnicalSpecs(fullProduct.technicalSpecs || []);
                              if (fullProduct.images && fullProduct.images.length > 0) {
                                setProductImages(fullProduct.images.map(img => img.imageUrl));
                                setOriginalImageIds(fullProduct.images.map(img => img.id));
                              } else if (fullProduct.imageUrls && fullProduct.imageUrls.length > 0) {
                                setProductImages(fullProduct.imageUrls);
                                setOriginalImageIds([]);
                              } else {
                                setProductImages(fullProduct.imageUrl ? [fullProduct.imageUrl] : []);
                                setOriginalImageIds([]);
                              }

                              // Now set editingProduct which will trigger useEffect
                              setEditingProduct(fullProduct);
                              setShowForm(true);
                            } catch (error) {
                              console.error('Error fetching product details:', error);
                              // Fallback to using product from list
                              setDetailedDescriptionEn(product.detailedDescriptionEn ?? '');
                              setDetailedDescriptionAr(product.detailedDescriptionAr ?? '');
                              setTechnicalSpecs(product.technicalSpecs || []);
                              if (product.images && product.images.length > 0) {
                                setProductImages(product.images.map(img => img.imageUrl));
                                setOriginalImageIds(product.images.map(img => img.id));
                              } else if (product.imageUrls && product.imageUrls.length > 0) {
                                setProductImages(product.imageUrls);
                                setOriginalImageIds([]);
                              } else {
                                setProductImages(product.imageUrl ? [product.imageUrl] : []);
                                setOriginalImageIds([]);
                              }
                              setEditingProduct(product);
                              setShowForm(true);
                            }
                          }}
                          className="flex-1 bg-[var(--color-admin-primary-light)] text-[var(--color-admin-primary)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-primary)]/20 transition-all"
                        >
                          {t('pages.products.edit')}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 bg-[var(--color-admin-danger)]/10 text-[var(--color-admin-danger)] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--color-admin-danger)]/20 transition-all"
                        >
                          {t('pages.products.delete')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page Settings Tab */}
        {activeTab === 'settings' && pageSettings && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-primary-light)]/30 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.products.pageSettings')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">{t('pages.products.pageSettingsDesc')}</p>
            </div>
            <form onSubmit={handleUpdatePageSettings} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.products.heroTitleEn')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="heroTitleEn"
                    defaultValue={pageSettings.heroTitleEn}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">
                    {t('pages.products.heroTitleAr')} <span className="text-[var(--color-admin-danger)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="heroTitleAr"
                    defaultValue={pageSettings.heroTitleAr}
                    className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-right"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-admin-text)] mb-2">{t('pages.products.heroImage')}</label>
                <input
                  type="file"
                  name="heroImage"
                  accept="image/*"
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-xl bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-admin-primary-light)] file:text-[var(--color-admin-primary)]"
                />
                {pageSettings.heroImageUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-[var(--color-admin-text-muted)] mb-2">{t('pages.products.currentImage')}</p>
                    <img
                      src={getImageUrl(pageSettings.heroImageUrl)}
                      alt="Hero"
                      className="w-full max-w-md h-auto rounded-lg border border-[var(--color-admin-border)]"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[var(--color-admin-border)]">
                <button
                  type="submit"
                  className="bg-[var(--color-admin-primary)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--color-admin-primary-dark)] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {t('pages.products.saveSettings')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Options Tab */}
        {activeTab === 'filters' && (
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] shadow-md overflow-hidden">
            <div className="p-6 border-b border-[var(--color-admin-border)] bg-gradient-to-r from-[var(--color-admin-info)]/10 to-transparent">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.products.filterOptions')}</h2>
              <p className="text-sm text-[var(--color-admin-text-muted)] mt-1">
                {t('pages.products.filterOptionsDesc')}
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterOptions && (
                  <>
                    <div>
                      <h3 className="font-semibold text-[var(--color-admin-text)] mb-3">{t('pages.products.productTypes')} ({filterOptions.productTypes?.length || 0})</h3>
                      <div className="space-y-2">
                        {filterOptions.productTypes?.map(type => (
                          <div key={type.id} className="p-2 bg-[var(--color-admin-muted)] rounded">
                            <span className="text-sm">
                              {type.nameEn} / {type.nameAr}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--color-admin-text)] mb-3">{t('pages.products.brands')} ({filterOptions.brands?.length || 0})</h3>
                      <div className="space-y-2">
                        {filterOptions.brands?.map(brand => (
                          <div key={brand.id} className="p-2 bg-[var(--color-admin-muted)] rounded">
                            <span className="text-sm">
                              {brand.nameEn} / {brand.nameAr}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--color-admin-text)] mb-3">{t('pages.products.colors')} ({filterOptions.colors?.length || 0})</h3>
                      <div className="space-y-2">
                        {filterOptions.colors?.map(color => (
                          <div key={color.id} className="p-2 bg-[var(--color-admin-muted)] rounded">
                            <span className="text-sm">
                              {color.nameEn} / {color.nameAr}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--color-admin-text)] mb-3">{t('pages.products.countries')} ({filterOptions.countries?.length || 0})</h3>
                      <div className="space-y-2">
                        {filterOptions.countries?.map(country => (
                          <div key={country.id} className="p-2 bg-[var(--color-admin-muted)] rounded">
                            <span className="text-sm">
                              {country.nameEn} / {country.nameAr}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--color-admin-text)] mb-3">{t('pages.products.years')} ({filterOptions.years?.length || 0})</h3>
                      <div className="space-y-2">
                        {filterOptions.years?.map(year => (
                          <div key={year.id} className="p-2 bg-[var(--color-admin-muted)] rounded">
                            <span className="text-sm">{year.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--color-admin-text)] mb-3">{t('pages.products.priceRange')}</h3>
                      <div className="p-2 bg-[var(--color-admin-muted)] rounded">
                        <span className="text-sm">
                          {filterOptions.priceRange?.min || 0} - {filterOptions.priceRange?.max || 0} AED
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManager;
