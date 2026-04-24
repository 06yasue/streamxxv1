import './globals.css';
import { supabase } from '../lib/supabaseClient';

export async function generateMetadata() {
  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();

  // ======================
  // FALLBACK DEFAULT DATA
  // ======================

  const siteName =
    settings?.site_name || 'WebVideoKu';

  const siteTitle =
    settings?.site_title || 'Platform Video Terbaik';

  const description =
    settings?.site_description ||
    'Website penyimpanan dan streaming video terbaik';

  const keywords =
    settings?.site_keywords ||
    'video streaming, hosting video, video online, streaming platform';

  // ======================
  // BASE URL
  // ======================

  let baseUrl = 'https://streamxxv1.vercel.app';

  if (settings?.base_url) {
    baseUrl = settings.base_url.startsWith('http')
      ? settings.base_url
      : `https://${settings.base_url}`;
  }

  // ======================
  // LOGO + OG IMAGE
  // ======================

  const logoUrl =
    settings?.site_logo_url ||
    'https://via.placeholder.com/512x512.png';

  const ogImage =
    settings?.og_image_url ||
    logoUrl;

  // ======================
  // SEO METADATA
  // ======================

  return {
    metadataBase: new URL(baseUrl),

    title: {
      default: siteTitle,
      template: `%s | ${siteName}`,
    },

    description,

    keywords,

    applicationName: siteName,

    authors: [
      {
        name: siteName,
      },
    ],

    creator: siteName,

    publisher: siteName,

    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    alternates: {
      canonical: '/',
    },

    icons: {
      icon: [
        {
          url: logoUrl,
          href: logoUrl,
        },
      ],
      apple: [
        {
          url: logoUrl,
          href: logoUrl,
        },
      ],
      shortcut: logoUrl,
    },

    openGraph: {
      title: siteTitle,
      description,
      url: baseUrl,
      siteName,
      locale: 'id_ID',
      type: 'website',

      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description,
      creator: '@website',
      images: [ogImage],
    },

    verification: {
      google: settings?.google_verification || '',
    },

    category: 'video streaming',
  };
}

export default async function RootLayout({ children }) {
  const { data: settings } = await supabase
    .from('settings')
    .select('head_script')
    .eq('id', 1)
    .single();

  return (
    <html lang="id">
      <head>
        {/* Bootstrap */}
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
        />

        {/* Google Fonts */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />

        {/* Material Icons */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />

        {/* Viewport */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        {/* Theme Color */}
        <meta
          name="theme-color"
          content="#ffffff"
        />
      </head>

      <body>
        {/* 
          Head script JANGAN dimasukkan ke <head>
          supaya crawler Facebook / WhatsApp
          tidak rusak saat membaca meta tag
        */}
        {settings?.head_script && (
          <div
            dangerouslySetInnerHTML={{
              __html: settings.head_script,
            }}
          />
        )}

        {children}

        <div
          id="notification-bar"
          className="custom-notification"
        ></div>
      </body>
    </html>
  );
}
