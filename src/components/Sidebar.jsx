import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Image, Grid3x3, Briefcase, Newspaper, MessageSquare, Palette, X, Tag, FileText, HelpCircle, Navigation, DollarSign, ShoppingCart, Globe } from 'lucide-react';
import Logo from '../assets/Logo.svg';

const Sidebar = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRTL = i18n.language === 'ar';

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  // Landing Page Sections
  const landingPageItems = [
    { icon: Image, label: t('sidebar.heroSection'), href: '/', active: location.pathname === '/' },
    { icon: Grid3x3, label: t('sidebar.categories'), href: '/categories', active: location.pathname === '/categories' },
    { icon: Briefcase, label: t('sidebar.solutions'), href: '/solutions', active: location.pathname === '/solutions' },
    { icon: Tag, label: t('sidebar.brands'), href: '/brands', active: location.pathname === '/brands' },
    { icon: Newspaper, label: t('sidebar.projects'), href: '/projects', active: location.pathname === '/projects' },
    { icon: Briefcase, label: t('sidebar.startProject'), href: '/start-project', active: location.pathname === '/start-project' },
    { icon: MessageSquare, label: t('sidebar.testimonials'), href: '/testimonials', active: location.pathname === '/testimonials' },
  ];

  // Products & E-commerce
  const productsItems = [
    { icon: Tag, label: t('sidebar.products'), href: '/products', active: location.pathname === '/products' },
    { icon: Tag, label: t('sidebar.productTypes'), href: '/product-types', active: location.pathname === '/product-types' },
    { icon: ShoppingCart, label: t('sidebar.orders'), href: '/orders', active: location.pathname === '/orders' },
  ];

  // Pages
  const pagesItems = [
    { icon: Newspaper, label: t('sidebar.projectsPage'), href: '/projects-page', active: location.pathname === '/projects-page' },
    { icon: Briefcase, label: t('sidebar.servicesPage'), href: '/services', active: location.pathname === '/services' },
    { icon: Briefcase, label: t('sidebar.servicesManagement'), href: '/services-management', active: location.pathname === '/services-management' },
    { icon: Newspaper, label: t('sidebar.blogsPage'), href: '/blogs-page', active: location.pathname === '/blogs-page' },
    { icon: FileText, label: t('sidebar.aboutUsPage'), href: '/about-us-page', active: location.pathname === '/about-us-page' },
    { icon: Briefcase, label: t('sidebar.careersPage'), href: '/careers-page', active: location.pathname === '/careers-page' },
    { icon: MessageSquare, label: t('sidebar.contactPage'), href: '/contact', active: location.pathname === '/contact' },
    { icon: FileText, label: t('sidebar.termsAndConditions'), href: '/terms-and-conditions', active: location.pathname === '/terms-and-conditions' },
    { icon: HelpCircle, label: t('sidebar.faqPage'), href: '/faq', active: location.pathname === '/faq' },
  ];

  // UI Settings
  const uiSettingsItems = [
    { icon: Navigation, label: t('sidebar.navbarSettings'), href: '/navbar', active: location.pathname === '/navbar' },
    { icon: Navigation, label: t('sidebar.footerSettings'), href: '/footer', active: location.pathname === '/footer' },
  ];

  const settingsItems = [
    { icon: Palette, label: t('sidebar.themeSettings'), href: '/theme', active: location.pathname === '/theme' },
    { icon: DollarSign, label: t('sidebar.generalSettings'), href: '/general-settings', active: location.pathname === '/general-settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 ${isRTL ? 'right-0 border-l' : 'left-0 border-r'} h-full bg-[var(--color-sidebar-bg)] border-[var(--color-sidebar-border)] z-50 transition-transform duration-300 lg:translate-x-0 shadow-lg ${
          isOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'
        } w-72 ${isRTL ? 'rtl' : 'ltr'}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className={`h-20 flex items-center justify-between px-6 border-b border-[var(--color-sidebar-border)] ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[var(--color-admin-primary-light)] to-white`}>
            <div className="flex items-center gap-3">
              <img src={Logo} alt="Central Jordan Logo" className="h-10 w-auto" />
              <div>
                <h2 className="font-bold text-[var(--color-admin-text)] text-sm">{t('sidebar.cmsPortal')}</h2>
                <p className="text-xs text-[var(--color-admin-text-muted)]">{t('sidebar.contentManagement')}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] p-1 rounded-lg hover:bg-[var(--color-sidebar-hover)] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4">
            {/* Landing Page Sections */}
            <div className="mb-8">
              <h3 className="px-3 mb-3 text-xs font-semibold text-[var(--color-admin-text-light)] uppercase tracking-wider">{t('sidebar.landingPage')}</h3>
              <ul className="space-y-1">
                {landingPageItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href || '#'}
                      onClick={() => onClose()}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        item.active
                          ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/20 font-medium'
                          : 'text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-admin-text)]'
                      }`}
                    >
                      <item.icon size={20} className={item.active ? 'text-white' : ''} />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products & E-commerce */}
            <div className="mb-8">
              <h3 className="px-3 mb-3 text-xs font-semibold text-[var(--color-admin-text-light)] uppercase tracking-wider">{t('sidebar.products')}</h3>
              <ul className="space-y-1">
                {productsItems?.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href || '#'}
                      onClick={() => onClose()}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        item.active
                          ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/20 font-medium'
                          : 'text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-admin-text)]'
                      }`}
                    >
                      <item.icon size={20} className={item.active ? 'text-white' : ''} />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pages */}
            <div className="mb-8">
              <h3 className="px-3 mb-3 text-xs font-semibold text-[var(--color-admin-text-light)] uppercase tracking-wider">{t('sidebar.pages')}</h3>
              <ul className="space-y-1">
                {pagesItems?.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href || '#'}
                      onClick={() => onClose()}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        item.active
                          ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/20 font-medium'
                          : 'text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-admin-text)]'
                      }`}
                    >
                      <item.icon size={20} className={item.active ? 'text-white' : ''} />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* UI Settings */}
            <div className="mb-8">
              <h3 className="px-3 mb-3 text-xs font-semibold text-[var(--color-admin-text-light)] uppercase tracking-wider">{t('sidebar.uiSettings')}</h3>
              <ul className="space-y-1">
                {uiSettingsItems?.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href || '#'}
                      onClick={() => onClose()}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        item.active
                          ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/20 font-medium'
                          : 'text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-admin-text)]'
                      }`}
                    >
                      <item.icon size={20} className={item.active ? 'text-white' : ''} />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Settings */}
            <div>
              <h3 className="px-3 mb-3 text-xs font-semibold text-[var(--color-admin-text-light)] uppercase tracking-wider">{t('sidebar.settings')}</h3>
              <ul className="space-y-1">
                {settingsItems?.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href || '#'}
                      onClick={() => onClose()}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        item.active
                          ? 'bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/20 font-medium'
                          : 'text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-admin-text)]'
                      }`}
                    >
                      <item.icon size={20} className={item.active ? 'text-white' : ''} />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
