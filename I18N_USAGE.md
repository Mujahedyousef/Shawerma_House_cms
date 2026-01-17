# دليل استخدام نظام الترجمة (i18n) في CMS

## نظرة عامة

تم إعداد نظام ترجمة كامل لجميع الصفحات والنماذج والرسائل في CMS. النظام يدعم العربية والإنجليزية مع دعم RTL/LTR تلقائي.

## البنية

```
src/i18n/
├── i18n.js          # إعداد الترجمة
├── ar/
│   └── common.json  # الترجمات العربية
└── en/
    └── common.json  # الترجمات الإنجليزية
```

## الاستخدام الأساسي

### 1. في المكونات (Components)

```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <h1>{t('common.title')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
};
```

### 2. استخدام المساعدات (Helpers)

```javascript
import { useTranslation } from 'react-i18next';
import { showSuccess, showError, showConfirm } from '../utils/i18nHelpers';

const MyComponent = () => {
  const { t } = useTranslation();
  
  // رسالة نجاح
  showSuccess('created', t('pages.heroSection.title'));
  // النتيجة: "Hero section created successfully!" أو "تم إنشاء قسم الرئيسي بنجاح!"

  // رسالة خطأ
  showError('failedToLoad', t('pages.heroSection.title'));

  // تأكيد
  if (showConfirm('delete')) {
    // تنفيذ الحذف
  }
};
```

## المفاتيح المتوفرة

### Common (نصوص مشتركة)
- `common.save` - حفظ
- `common.cancel` - إلغاء
- `common.delete` - حذف
- `common.edit` - تعديل
- `common.add` - إضافة
- `common.create` - إنشاء
- `common.update` - تحديث
- `common.loading` - جاري التحميل...
- `common.error` - خطأ
- `common.success` - نجح
- `common.required` - مطلوب
- `common.optional` - اختياري

### Form (نصوص النماذج)
- `form.titleEn` - العنوان (الإنجليزية)
- `form.titleAr` - العنوان (العربية)
- `form.descriptionEn` - الوصف (الإنجليزية)
- `form.descriptionAr` - الوصف (العربية)
- `form.buttonTextEn` - نص الزر (الإنجليزية)
- `form.buttonTextAr` - نص الزر (العربية)
- `form.messageTextEn` - نص الرسالة (الإنجليزية)
- `form.messageTextAr` - نص الرسالة (العربية)

### Messages (الرسائل)

#### Success Messages
- `messages.success.created` - تم الإنشاء بنجاح!
- `messages.success.updated` - تم التحديث بنجاح!
- `messages.success.deleted` - تم الحذف بنجاح!
- `messages.success.saved` - تم الحفظ بنجاح!
- `messages.success.uploaded` - تم الرفع بنجاح!

#### Error Messages
- `messages.error.failedToLoad` - فشل تحميل البيانات
- `messages.error.failedToCreate` - فشل الإنشاء
- `messages.error.failedToUpdate` - فشل التحديث
- `messages.error.failedToDelete` - فشل الحذف
- `messages.error.failedToSave` - فشل الحفظ
- `messages.error.failedToUpload` - فشل الرفع

#### Confirm Messages
- `messages.confirm.delete` - هل أنت متأكد من حذف هذا العنصر؟
- `messages.confirm.deleteMultiple` - هل أنت متأكد من حذف هذه العناصر؟

#### Info Messages
- `messages.info.noData` - لا توجد بيانات متاحة
- `messages.info.noItems` - لم يتم العثور على عناصر
- `messages.info.empty` - فارغ
- `messages.info.selectItem` - الرجاء اختيار عنصر

## أمثلة على التحديث

### قبل التحديث:
```javascript
alert('Hero section created successfully!');
alert('Failed to create hero section');
if (!confirm('Are you sure you want to delete this?')) return;
```

### بعد التحديث:
```javascript
import { useTranslation } from 'react-i18next';
import { showSuccess, showError, showConfirm } from '../utils/i18nHelpers';

const MyComponent = () => {
  const { t } = useTranslation();
  
  showSuccess('created', t('pages.heroSection.title'));
  showError('failedToCreate', t('pages.heroSection.title'));
  if (!showConfirm('delete')) return;
};
```

### في النماذج:
```javascript
// قبل
<label>Title (English) <span>*</span></label>

// بعد
<label>{t('form.titleEn')} <span className="text-[var(--color-admin-danger)]">*</span></label>
```

### في الأزرار:
```javascript
// قبل
<button>Save</button>
<button>Delete</button>

// بعد
<button>{t('common.save')}</button>
<button>{t('common.delete')}</button>
```

## إضافة ترجمات جديدة

1. افتح `src/i18n/en/common.json` و `src/i18n/ar/common.json`
2. أضف المفتاح الجديد في المكان المناسب
3. استخدم المفتاح في الكود: `t('your.key.path')`

مثال:
```json
// en/common.json
{
  "mySection": {
    "myKey": "My English Text"
  }
}

// ar/common.json
{
  "mySection": {
    "myKey": "نصي بالعربية"
  }
}
```

الاستخدام:
```javascript
{t('mySection.myKey')}
```

## نصائح مهمة

1. **استخدم المساعدات للرسائل**: استخدم `showSuccess`, `showError`, `showConfirm` بدلاً من `alert` و `confirm`
2. **دعم RTL**: أضف `dir={isRTL ? 'rtl' : 'ltr'}` للعناصر التي تحتاج دعم RTL
3. **استخدم t() للنصوص الثابتة**: جميع النصوص في الواجهة يجب أن تستخدم `t()`
4. **تجنب النصوص المثبتة**: لا تضع نصوص مباشرة في الكود، استخدم المفاتيح دائماً

## قائمة الملفات المطلوب تحديثها

- [x] Login.jsx
- [x] Navbar.jsx
- [x] Sidebar.jsx
- [x] CategoryManager.jsx
- [x] HeroSectionManager.jsx
- [x] ThemeManager.jsx
- [x] ProductManager.jsx
- [x] ProjectsSectionManager.jsx
- [x] TestimonialManager.jsx
- [x] ContactPageManager.jsx
- [x] FAQPageManager.jsx
- [x] FooterManager.jsx
- [x] NavbarManager.jsx
- [x] OrderManager.jsx
- [x] ProductTypeManager.jsx
- [x] ProjectsPageManager.jsx
- [x] ServiceManager.jsx
- [x] ServicesPageManager.jsx
- [x] SolutionManager.jsx
- [x] StartProjectSectionManager.jsx
- [x] TermsAndConditionsPageManager.jsx
- [x] TestimonialManager.jsx
- [x] AboutUsPageManager.jsx
- [x] ArticlesSectionManager.jsx
- [x] BlogsPageManager.jsx
- [x] BrandsSectionManager.jsx
- [x] CareersPageManager.jsx
- [x] GeneralSettingsManager.jsx

## خطوات التحديث لكل ملف

1. أضف الاستيراد:
```javascript
import { useTranslation } from 'react-i18next';
import { showSuccess, showError, showConfirm } from '../utils/i18nHelpers';
```

2. أضف في المكون:
```javascript
const { t, i18n } = useTranslation();
const isRTL = i18n.language === 'ar';
```

3. استبدل `alert()` بـ `showSuccess()` أو `showError()`
4. استبدل `confirm()` بـ `showConfirm()`
5. استبدل النصوص المثبتة بـ `t('key')`
6. أضف `dir={isRTL ? 'rtl' : 'ltr'}` للعناصر التي تحتاج دعم RTL

