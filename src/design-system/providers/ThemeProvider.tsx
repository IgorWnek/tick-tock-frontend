import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ThemePreset = 'default' | 'high-contrast' | 'colorful';

type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  themePreset: ThemePreset;
  setTheme: (theme: Theme) => void;
  setThemePreset: (preset: ThemePreset) => void;
  resolvedTheme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultPreset?: ThemePreset;
}

export const ThemeProvider = ({ children, defaultTheme = 'system', defaultPreset = 'default' }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [themePreset, setThemePreset] = useState<ThemePreset>(defaultPreset);

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (typeof window === 'undefined') return 'light';
    if (theme === 'system') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  }, [theme]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // Theme classes
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);

    // Preset classes (used for future theming needs)
    root.classList.remove('default', 'high-contrast', 'colorful');
    root.classList.add(themePreset);
  }, [resolvedTheme, themePreset]);

  const value: ThemeContextValue = useMemo(
    () => ({
      theme,
      themePreset,
      setTheme,
      setThemePreset,
      resolvedTheme,
    }),
    [theme, themePreset, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
