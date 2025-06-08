'use client'
import "./globals.css";
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import Sidebar from '@/components/sidebar'
import SkipToMain from '@/components/skip-to-main'
import useIsCollapsed from '@/hooks/use-is-collapsed'

import { AuthProvider } from "@/context/MsalProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()
  return (
    <html lang="en">
      <body >
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
          <AuthProvider >
            <div className='relative h-full overflow-hidden bg-background'>
              <SkipToMain />
              <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
              <main
                id='content'
                className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
              >
                {children}
                <Toaster />
              </main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}