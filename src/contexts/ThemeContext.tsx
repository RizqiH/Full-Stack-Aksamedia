'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
  mounted: boolean;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

const THEME_STORAGE_KEY = 'theme';
const VALID_THEMES: Theme[] = ['light', 'dark', 'system'];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ 
  children, 
  defaultTheme = 'system' 
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [mounted, setMounted] = useState(false);

  // Get system theme preference
  const getSystemTheme = useCallback((): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light';
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }, []);

  // Apply theme to DOM
  const applyThemeToDOM = useCallback((themeToApply: ResolvedTheme) => {
    if (typeof window === 'undefined' || !document?.documentElement) return;

    const root = document.documentElement;

    // Clean up existing theme classes
    root.classList.remove('light', 'dark');
    
    // Apply new theme
    if (themeToApply === 'dark') {
      root.classList.add('dark');
    }

    // Update data attribute for CSS queries
    root.setAttribute('data-theme', themeToApply);

    // Force repaint for immediate visual update
    void root.offsetHeight;
  }, []);

  // Update resolved theme and apply changes
  const updateResolvedTheme = useCallback((currentTheme: Theme) => {
    const newResolvedTheme: ResolvedTheme = 
      currentTheme === 'system' ? getSystemTheme() : currentTheme;
    
    setResolvedTheme(newResolvedTheme);
    applyThemeToDOM(newResolvedTheme);
  }, [getSystemTheme, applyThemeToDOM]);

  // Load theme from localStorage safely
  const loadStoredTheme = useCallback((): Theme => {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
      return storedTheme && VALID_THEMES.includes(storedTheme) 
        ? storedTheme 
        : defaultTheme;
    } catch (error) {
      // localStorage might be disabled or unavailable
      return defaultTheme;
    }
  }, [defaultTheme]);

  // Save theme to localStorage safely
  const saveThemeToStorage = useCallback((themeToSave: Theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeToSave);
    } catch (error) {
      // Fail silently if localStorage is unavailable
    }
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    const initialTheme = loadStoredTheme();
    setTheme(initialTheme);
    updateResolvedTheme(initialTheme);
    setMounted(true);
  }, [loadStoredTheme, updateResolvedTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = () => {
      setTheme(currentTheme => {
        if (currentTheme === 'system') {
          updateResolvedTheme('system');
        }
        return currentTheme;
      });
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [mounted, updateResolvedTheme]);

  // Handle theme changes
  useEffect(() => {
    if (!mounted) return;
    
    updateResolvedTheme(theme);
    saveThemeToStorage(theme);
  }, [theme, mounted, updateResolvedTheme, saveThemeToStorage]);

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme,
    mounted,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}