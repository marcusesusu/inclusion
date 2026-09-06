import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

const siteConfig = {
  name: 'inclusion.id',
  url: 'https://inclusion.id', // Replace with your production domain
  ogImage: 'https://inclusion.id/og-image.png',
  description:
    'Secure, instant digital identity verification platform. Fast KYC compliance, automated NIN, BVN, driver license, and passport verification.',
};

// Comprehensive SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'inclusion.id :: Secure Identity Verification & KYC Platform',
    template: '%s | inclusion.id',
  },
  description: siteConfig.description,
  keywords: [
    'Identity Verification',
    'KYC Compliance',
    'BVN Verification',
    'NIN Verification',
    'Digital ID Verification',
    'Passport Lookup',
    'Driver License Verification',
    'AML Compliance',
    'Fraud Prevention',
  ],
  authors: [{ name: 'inclusion.id Team' }],
  creator: 'inclusion.id',
  publisher: 'inclusion.id',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: 'inclusion.id :: Instant Digital Identity Verification',
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'inclusion.id - Identity Verification System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'inclusion.id :: Instant Digital Identity Verification',
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@inclusion_id', // Replace with your actual handle
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Structured Data for Organization and Software Application
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'inclusion.id',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: siteConfig.description,
    url: siteConfig.url,
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-dvh w-full overflow-x-hidden font-sans antialiased">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
