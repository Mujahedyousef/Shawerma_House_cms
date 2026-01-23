import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import HeroSectionManager from './pages/HeroSectionManager';
import SolutionManager from './pages/SolutionManager';
import CategoryManager from './pages/CategoryManager';
import BrandsSectionManager from './pages/BrandsSectionManager';
import ProjectsSectionManager from './pages/ProjectsSectionManager';
import StartProjectSectionManager from './pages/StartProjectSectionManager';
import TestimonialManager from './pages/TestimonialManager';
import ArticlesSectionManager from './pages/ArticlesSectionManager';
import ContactPageManager from './pages/ContactPageManager';
import TermsAndConditionsPageManager from './pages/TermsAndConditionsPageManager';
import FAQPageManager from './pages/FAQPageManager';
import ProductManager from './pages/ProductManager';
import ProductTypeManager from './pages/ProductTypeManager';
import ServicesPageManager from './pages/ServicesPageManager';
import ServiceManager from './pages/ServiceManager';
import ProjectsPageManager from './pages/ProjectsPageManager';
import NavbarManager from './pages/NavbarManager';
import ThemeManager from './pages/ThemeManager';
import FooterManager from './pages/FooterManager';
import GeneralSettingsManager from './pages/GeneralSettingsManager';
import OrderManager from './pages/OrderManager';
import BlogsPageManager from './pages/BlogsPageManager';
import AboutUsPageManager from './pages/AboutUsPageManager';
import CareersPageManager from './pages/CareersPageManager';
import DownloadAppSectionManager from './pages/DownloadAppSectionManager';

function App() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className={`min-h-screen bg-[var(--color-admin-bg)] ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                  {/* Sidebar */}
                  <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                  {/* Main Content Area */}
                  <div className={isRTL ? 'lg:mr-72' : 'lg:ml-72'}>
                    {/* Navbar */}
                    <Navbar onMenuClick={() => setSidebarOpen(true)} />

                    {/* Page Content */}
                    <main className="pt-16 min-h-screen bg-[var(--color-admin-bg)]">
                      <Routes>
                        <Route path="/" element={<HeroSectionManager />} />
                        <Route path="/categories" element={<CategoryManager />} />
                        <Route path="/solutions" element={<SolutionManager />} />
                        <Route path="/brands" element={<BrandsSectionManager />} />
                        <Route path="/projects" element={<ProjectsSectionManager />} />
                        <Route path="/start-project" element={<StartProjectSectionManager />} />
                        <Route path="/testimonials" element={<TestimonialManager />} />
                        <Route path="/products" element={<ProductManager />} />
                        <Route path="/product-types" element={<ProductTypeManager />} />
                        <Route path="/articles" element={<ArticlesSectionManager />} />
                        <Route path="/contact" element={<ContactPageManager />} />
                        <Route path="/terms-and-conditions" element={<TermsAndConditionsPageManager />} />
                        <Route path="/faq" element={<FAQPageManager />} />
                        <Route path="/services" element={<ServicesPageManager />} />
                        <Route path="/services-management" element={<ServiceManager />} />
                        <Route path="/projects-page" element={<ProjectsPageManager />} />
                        <Route path="/navbar" element={<NavbarManager />} />
                        <Route path="/footer" element={<FooterManager />} />
                        <Route path="/theme" element={<ThemeManager />} />
                        <Route path="/general-settings" element={<GeneralSettingsManager />} />
                        <Route path="/orders" element={<OrderManager />} />
                        <Route path="/blogs-page" element={<BlogsPageManager />} />
                        <Route path="/about-us-page" element={<AboutUsPageManager />} />
                        <Route path="/careers-page" element={<CareersPageManager />} />
                        <Route path="/download-app" element={<DownloadAppSectionManager />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
