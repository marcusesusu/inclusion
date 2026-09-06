'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center gap-2 border border-border p-1 rounded-full bg-muted">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-full transition-colors ${
          theme === 'light' ? 'bg-background text-primary' : 'text-muted-foreground'
        }`}
        aria-label="Activate Light Mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-full transition-colors ${
          theme === 'system' ? 'bg-background text-primary' : 'text-muted-foreground'
        }`}
        aria-label="Follow System Theme"
      >
        <Monitor className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-full transition-colors ${
          theme === 'dark' ? 'bg-background text-primary' : 'text-muted-foreground'
        }`}
        aria-label="Activate Dark Mode"
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  );
}
