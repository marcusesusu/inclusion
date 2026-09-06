'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={12}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--background, #0f172a)',
          color: 'var(--foreground, #f8fafc)',
          border: '1px solid var(--border, #1e293b)',
          borderRadius: '0.75rem',
          padding: '12px 16px',
          fontSize: '0.875rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        success: {
          iconTheme: {
            primary: 'var(--primary, #10b981)',
            secondary: 'var(--background, #0f172a)',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--secondary, #ef4444)',
            secondary: 'var(--background, #0f172a)',
          },
        },
      }}
    />
  );
}
