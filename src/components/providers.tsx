'use client';

import * as React from 'react';
import { ThemeProvider } from 'next-themes';
import { AppProvider } from '@/contexts/app-context';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AppProvider>
        {children}
      </AppProvider>
      <Toaster />
      <ProgressBar
        height="4px"
        color="#3b82f6"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </ThemeProvider>
  );
}
