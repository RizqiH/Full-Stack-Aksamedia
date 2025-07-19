import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './theme.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { EmployeeProvider } from '@/contexts/EmployeeContext';
import ErrorBoundary from '@/components/ErrorBoundary';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Aksamedia Test - Frontend Developer',
  description: 'Frontend Developer Internship Test Application',
  keywords: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Employee Management'],
  authors: [{ name: 'Aksamedia Development Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans`}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <ThemeProvider>
            <ErrorBoundary>
              <AuthProvider>
                <ErrorBoundary>
                  <EmployeeProvider>
                    {children}
                  </EmployeeProvider>
                </ErrorBoundary>
              </AuthProvider>
            </ErrorBoundary>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
