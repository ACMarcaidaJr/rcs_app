'use client'
import "./globals.css";
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "@/context/AuthProvider";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body >
        {/* storageKey=vite-ui-theme */}
        <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
          <SessionProvider >
            {children}
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}