'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      // Critically: 'class' matches our CSS selector .dark
      attribute="class"
      // Use 'system' as the initial default, which honors the system setting
      defaultTheme="system"
      // Enables automatic synchronization if the system theme changes
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
