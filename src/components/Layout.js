import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  SunIcon,
  MoonIcon,
  LanguageIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline';

function Layout({ children, darkMode, toggleDarkMode }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

  const navigation = [
    { name: t('home'), href: '/', icon: HomeIcon },
    { name: t('clients'), href: '/clients', icon: UserGroupIcon },
    { name: t('orders'), href: '/orders', icon: ClipboardDocumentListIcon },
    { name: t('products'), href: '/products', icon: ShoppingBagIcon },
   // { name: t('suppliers'), href: '/suppliers', icon: UserIcon },
    { name: t('doctors'), href: '/doctors', icon: BuildingOffice2Icon },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="relative z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          <div className="fixed inset-0 z-40 flex">
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-gray-800 pt-5 pb-4">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              <div className="flex-shrink-0 px-4 flex items-center">
                <img
                  className="h-8 w-auto"
                  src={`${process.env.PUBLIC_URL}/logo.png`}
                  alt="Optical Store"
                />
              </div>
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`${
                          isActive
                            ? `${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-gray-900`
                            : `${darkMode ? 'text-gray-300' : 'text-gray-600'} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} hover:text-gray-900`
                        } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon
                          className={`${
                            isActive ? 'text-gray-500' : `${darkMode ? 'text-gray-400' : 'text-gray-400'} group-hover:text-gray-500`
                          } mr-4 flex-shrink-0 h-6 w-6`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    } hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} hover:text-gray-900 group flex w-full items-center px-2 py-2 text-base font-medium rounded-md`}
                  >
                    <ArrowRightOnRectangleIcon
                      className={`${
                        darkMode ? 'text-gray-400' : 'text-gray-400'
                      } group-hover:text-gray-500 mr-4 flex-shrink-0 h-6 w-6`}
                      aria-hidden="true"
                    />
                    {t('logout')}
                  </button>
                </nav>
              </div>
              <div className="flex-shrink-0 px-4 py-4 space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                >
                  {darkMode ? (
                    <SunIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <MoonIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
                <button
                  onClick={toggleLanguage}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                >
                  <LanguageIcon className="h-5 w-5" aria-hidden="true" />
                  <span className="ml-2">{i18n.language.toUpperCase()}</span>
                </button>
              </div>
            </div>
            <div className="w-14 flex-shrink-0" />
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white dark:bg-gray-800">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <img
                className="h-8 w-auto"
                src={`${process.env.PUBLIC_URL}/logo.png`}
                alt="Optical Store"
              />
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? `${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-gray-900`
                        : `${darkMode ? 'text-gray-300' : 'text-gray-600'} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} hover:text-gray-900`
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        isActive ? 'text-gray-500' : `${darkMode ? 'text-gray-400' : 'text-gray-400'} group-hover:text-gray-500`
                      } mr-3 flex-shrink-0 h-6 w-6`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className={`${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                } hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} hover:text-gray-900 group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <ArrowRightOnRectangleIcon
                  className={`${
                    darkMode ? 'text-gray-400' : 'text-gray-400'
                  } group-hover:text-gray-500 mr-3 flex-shrink-0 h-6 w-6`}
                  aria-hidden="true"
                />
                {t('logout')}
              </button>
            </nav>
          </div>
          <div className="flex flex-shrink-0 p-4 space-x-4">
            <button
              onClick={toggleDarkMode}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <MoonIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
            >
              <LanguageIcon className="h-5 w-5" aria-hidden="true" />
              <span className="ml-2">{i18n.language.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 pl-1 pt-1 sm:pl-3 sm:pt-3 lg:hidden">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-gray-400 dark:hover:text-gray-50"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Main content area */}
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
