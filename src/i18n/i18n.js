import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Common translations
import commonEn from './en/common.json';
import commonAr from './ar/common.json';

// Component translations
import loginEn from './en/login.json';
import loginAr from './ar/login.json';
import navbarEn from './en/navbar.json';
import navbarAr from './ar/navbar.json';
import sidebarEn from './en/sidebar.json';
import sidebarAr from './ar/sidebar.json';

// Page translations
import heroSectionEn from './en/pages/heroSection.json';
import heroSectionAr from './ar/pages/heroSection.json';
import themeEn from './en/pages/theme.json';
import themeAr from './ar/pages/theme.json';
import productsEn from './en/pages/products.json';
import productsAr from './ar/pages/products.json';
import productTypesEn from './en/pages/productTypes.json';
import productTypesAr from './ar/pages/productTypes.json';
import startProjectEn from './en/pages/startProject.json';
import startProjectAr from './ar/pages/startProject.json';
import brandsEn from './en/pages/brands.json';
import brandsAr from './ar/pages/brands.json';
import footerEn from './en/pages/footer.json';
import footerAr from './ar/pages/footer.json';
import navbarPageEn from './en/pages/navbar.json';
import navbarPageAr from './ar/pages/navbar.json';
import generalSettingsEn from './en/pages/generalSettings.json';
import generalSettingsAr from './ar/pages/generalSettings.json';
import articlesEn from './en/pages/articles.json';
import articlesAr from './ar/pages/articles.json';
import servicesEn from './en/pages/services.json';
import servicesAr from './ar/pages/services.json';
import faqEn from './en/pages/faq.json';
import faqAr from './ar/pages/faq.json';
import contactEn from './en/pages/contact.json';
import contactAr from './ar/pages/contact.json';
import testimonialsEn from './en/pages/testimonials.json';
import testimonialsAr from './ar/pages/testimonials.json';
import solutionsEn from './en/pages/solutions.json';
import solutionsAr from './ar/pages/solutions.json';
import categoriesEn from './en/pages/categories.json';
import categoriesAr from './ar/pages/categories.json';
import servicesPageEn from './en/pages/servicesPage.json';
import servicesPageAr from './ar/pages/servicesPage.json';
import termsAndConditionsEn from './en/pages/termsAndConditions.json';
import termsAndConditionsAr from './ar/pages/termsAndConditions.json';
import ordersEn from './en/pages/orders.json';
import ordersAr from './ar/pages/orders.json';
import projectsEn from './en/pages/projects.json';
import projectsAr from './ar/pages/projects.json';
import projectsPageEn from './en/pages/projectsPage.json';
import projectsPageAr from './ar/pages/projectsPage.json';
import blogsEn from './en/pages/blogs.json';
import blogsAr from './ar/pages/blogs.json';
import careersEn from './en/pages/careers.json';
import careersAr from './ar/pages/careers.json';
import aboutUsEn from './en/pages/aboutUs.json';
import aboutUsAr from './ar/pages/aboutUs.json';
import downloadAppEn from './en/pages/downloadApp.json';
import downloadAppAr from './ar/pages/downloadApp.json';
import mapSectionEn from './en/pages/mapSection.json';
import mapSectionAr from './ar/pages/mapSection.json';

// Merge all translations
const mergeTranslations = (...translations) => {
  return translations.reduce((acc, translation) => {
    return { ...acc, ...translation };
  }, {});
};

const enTranslations = mergeTranslations(
  commonEn,
  loginEn,
  navbarEn,
  sidebarEn,
  {
    pages: {
      heroSection: heroSectionEn.heroSection,
      theme: themeEn.theme,
      products: productsEn.products,
      productTypes: productTypesEn.productTypes,
      startProject: startProjectEn.startProject,
      brands: brandsEn.brands,
      footer: footerEn.footer,
      navbar: navbarPageEn.navbar,
      generalSettings: generalSettingsEn.generalSettings,
      articles: articlesEn.articles,
      services: servicesEn.services,
      faq: faqEn.faq,
      contact: contactEn.contact,
      testimonials: testimonialsEn.testimonials,
      solutions: solutionsEn.solutions,
      categories: categoriesEn.categories,
      servicesPage: servicesPageEn.servicesPage,
      termsAndConditions: termsAndConditionsEn.termsAndConditions,
      orders: ordersEn.orders,
      projects: projectsEn.projects,
      projectsPage: projectsPageEn.projectsPage,
      blogs: blogsEn.blogs,
      careers: careersEn.careers,
      aboutUs: aboutUsEn.aboutUs,
      downloadApp: downloadAppEn.downloadApp,
      mapSection: mapSectionEn.mapSection,
    },
  }
);

const arTranslations = mergeTranslations(
  commonAr,
  loginAr,
  navbarAr,
  sidebarAr,
  {
    pages: {
      heroSection: heroSectionAr.heroSection,
      theme: themeAr.theme,
      products: productsAr.products,
      productTypes: productTypesAr.productTypes,
      startProject: startProjectAr.startProject,
      brands: brandsAr.brands,
      footer: footerAr.footer,
      navbar: navbarPageAr.navbar,
      generalSettings: generalSettingsAr.generalSettings,
      articles: articlesAr.articles,
      services: servicesAr.services,
      faq: faqAr.faq,
      contact: contactAr.contact,
      testimonials: testimonialsAr.testimonials,
      solutions: solutionsAr.solutions,
      categories: categoriesAr.categories,
      servicesPage: servicesPageAr.servicesPage,
      termsAndConditions: termsAndConditionsAr.termsAndConditions,
      orders: ordersAr.orders,
      projects: projectsAr.projects,
      projectsPage: projectsPageAr.projectsPage,
      blogs: blogsAr.blogs,
      careers: careersAr.careers,
      aboutUs: aboutUsAr.aboutUs,
      downloadApp: downloadAppAr.downloadApp,
      mapSection: mapSectionAr.mapSection,
    },
  }
);

// Get saved language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        translation: arTranslations,
      },
      en: {
        translation: enTranslations,
      },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Save language preference when it changes
i18n.on('languageChanged', lng => {
  localStorage.setItem('language', lng);
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
});

// Set initial language
document.documentElement.lang = savedLanguage;
document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';

export default i18n;
