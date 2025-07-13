'use client'
import "./globals.css";
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

import { AuthProvider } from "@/context/MsalProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body >
        <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
          <AuthProvider >
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}