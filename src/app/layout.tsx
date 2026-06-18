import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SessionProvider } from '@/hooks/useSession';
import faviconSvg from '@/assets/images/favicon.svg';

const siteName = 'Event & Ticketing System';
const siteDescription = 'An enterprise web application for hospitality and travel organizations to manage events, venues, tickets, and bookings with role-based access.';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4f46e5', // Primary indigo
};

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  icons: {
    icon: { url: faviconSvg.src, type: 'image/svg+xml' },
  },
  openGraph: {
    type: 'website',
    siteName,
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    card: 'summary',
    title: siteName,
    description: siteDescription,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
