import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Bell, Search, ExternalLink, LogOut, User, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const isRTL = i18n.language === 'ar';

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className={`h-16 bg-[var(--color-navbar-bg)] border-b border-[var(--color-navbar-border)] fixed top-0 left-0 right-0 z-30 shadow-sm ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="h-full px-4 lg:px-8 flex items-center justify-between ">
        {/* Start Section */}
        <div className="flex items-center gap-4 ">
          <button
            onClick={onMenuClick}
            className={`lg:hidden text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] p-2 ${isRTL ? '-mr-2' : '-ml-2'} rounded-xl hover:bg-[var(--color-admin-muted)] transition-colors`}
          >
            <Menu size={24} />
          </button>

          {/* Search */}
          {/* <div className={`hidden md:flex items-center gap-3 bg-[var(--color-admin-muted)] rounded-xl px-4 py-2.5 w-96 border border-[var(--color-admin-border-light)] focus-within:border-[var(--color-admin-primary)] focus-within:ring-2 focus-within:ring-[var(--color-admin-primary)]/20 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Search size={18} className={`text-[var(--color-admin-text-muted)] ${isRTL ? 'order-2' : ''}`} />
            <input
              type="text"
              placeholder={t('navbar.searchPlaceholder')}
              className={`bg-transparent border-none outline-none text-sm text-[var(--color-admin-text)] placeholder-[var(--color-admin-text-light)] w-full ${isRTL ? 'text-right' : 'text-left'}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div> */}
        </div>

        {/* End Section */}
        <div className={`flex items-center gap-3 `}>
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--color-admin-text)] hover:text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-primary-light)] rounded-xl transition-all border border-[var(--color-admin-border)] hover:border-[var(--color-admin-primary)]"
            title={isRTL ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            <Globe size={18} />
            <span className="hidden sm:inline">{isRTL ? 'EN' : 'AR'}</span>
          </button>

          {/* View Website */}
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[var(--color-admin-text)] hover:text-[var(--color-admin-primary)] hover:bg-[var(--color-admin-primary-light)] rounded-xl transition-all border border-[var(--color-admin-border)] hover:border-[var(--color-admin-primary)]"
          >
            <ExternalLink size={18} />
            <span>{t('navbar.viewWebsite')}</span>
          </a>

          {/* User Info */}
          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-admin-text-muted)]">
              <User size={16} />
              <span className="text-[var(--color-admin-text)]">{user.name || user.email}</span>
            </div>
          )}

          {/* Notifications */}
          <button className="relative p-2.5 text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] hover:bg-[var(--color-admin-muted)] rounded-xl transition-all">
            <Bell size={20} />
            <span className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} w-2 h-2 bg-[var(--color-admin-danger)] rounded-full ring-2 ring-white`}></span>
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--color-admin-text)] hover:text-[var(--color-admin-danger)] hover:bg-[var(--color-admin-muted)] rounded-xl transition-all border border-[var(--color-admin-border)] hover:border-[var(--color-admin-danger)]"
            title={t('navbar.logout')}
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">{t('navbar.logout')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

