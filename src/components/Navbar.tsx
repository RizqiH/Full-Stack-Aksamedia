'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

type ThemeOption = 'light' | 'dark' | 'system';

interface ThemeConfig {
  icon: string;
  label: string;
}

const THEME_OPTIONS: Record<ThemeOption, ThemeConfig> = {
  light: { icon: '☀️', label: 'Light' },
  dark: { icon: '🌙', label: 'Dark' },
  system: { icon: '🖥️', label: 'System' },
} as const;

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme, mounted } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
      
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(target)) {
        setThemeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleThemeChange = (newTheme: ThemeOption) => {
    setTheme(newTheme);
    setThemeDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
    // Close theme dropdown if user dropdown is opening
    if (!dropdownOpen) {
      setThemeDropdownOpen(false);
    }
  };

  const toggleThemeDropdown = () => {
    setThemeDropdownOpen(prev => !prev);
    // Close user dropdown if theme dropdown is opening
    if (!themeDropdownOpen) {
      setDropdownOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
    // Close other dropdowns when mobile menu opens
    setDropdownOpen(false);
    setThemeDropdownOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Don't render navbar if user is not authenticated
  if (!user) return null;

  // Don't render until theme is mounted to prevent hydration issues
  if (!mounted) {
    return (
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              Aksamedia
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="glass bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/dashboard"
              className="text-xl font-bold text-indigo-600 dark:text-indigo-400 hover:scale-105 transition-transform duration-200"
              onClick={closeMobileMenu}
            >
              Aksamedia
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <Link
              href="/dashboard"
              className="group relative px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            >
              <span className="relative z-10">Dashboard</span>
              <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200"></div>
            </Link>
            <Link
              href="/data"
              className="group relative px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            >
              <span className="relative z-10">Data Karyawan</span>
              <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200"></div>
            </Link>
          </div>

          {/* Right Side - Theme Toggle and User Menu */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <div className="relative" ref={themeDropdownRef}>
              <button
                type="button"
                onClick={toggleThemeDropdown}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                aria-label="Toggle theme"
              >
                <span className="text-lg">
                  {THEME_OPTIONS[theme].icon}
                </span>
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  {Object.entries(THEME_OPTIONS).map(([themeKey, config]) => (
                    <button
                      key={themeKey}
                      onClick={() => handleThemeChange(themeKey as ThemeOption)}
                      className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-200 ${
                        theme === themeKey
                          ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>{config.icon}</span>
                      <span>{config.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={toggleDropdown}
                className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                aria-label="User menu"
              >
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-sm font-medium max-w-24 truncate">
                  {user.name}
                </div>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-200"
                  >
                    Profile
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className={`md:hidden p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                mobileMenuOpen
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-label="Toggle mobile menu"
            >
              <svg
                className={`w-6 h-6 transition-all duration-300 ${
                  mobileMenuOpen ? 'rotate-90 scale-110' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? 'max-h-96 opacity-100 visible'
            : 'max-h-0 opacity-0 invisible'
        } overflow-hidden bg-white dark:bg-gray-900 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700`}
      >
        <div className="px-4 py-3 space-y-2">
          <Link
            href="/dashboard"
            onClick={closeMobileMenu}
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
            </svg>
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            href="/data"
            onClick={closeMobileMenu}
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <span className="font-medium">Data Karyawan</span>
          </Link>

          <Link
            href="/data/create"
            onClick={closeMobileMenu}
            className="flex items-center space-x-3 px-4 py-3 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-semibold">Tambah Karyawan</span>
          </Link>

          {/* Mobile Profile Link */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/profile"
              onClick={closeMobileMenu}
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
