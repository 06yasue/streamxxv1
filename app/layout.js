import { supabase } from '../lib/supabaseClient';
import './globals.css';

// 1. PENGATURAN VIEWPORT & TAMPILAN BROWSER HP
export const viewport = {
  themeColor: '#121212', 
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// 2. MESIN METADATA GLOBAL (SUPER LENGKAP & SEO)
export async function generateMetadata() {
  const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).single();
  
  const siteName = settings?.site_name || 'WebVideoKu';
  const siteTitle = settings?.site_title || 'Platform Video Terbaik';
  const description = settings?.site_description || 'Situs penyimpanan dan streaming video terbaik.';
  
  // Amankan Base URL wajib https://
  let baseUrl = 'https://streamxxv1.vercel.app';
  if (settings?.base_url) {
    baseUrl = settings.base_url.startsWith('http') ? settings.base_url : `https://${settings.base_url}`;
  }

  const logoUrl = settings?.site_logo_url || '/favicon.ico';
  const ogImage = settings?.og_image_url || logoUrl;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: siteTitle,
      template: `%s | ${siteName}`,
    },
    description: description,
    
    // TAMBAHAN SEO: Keywords & Author
    keywords: ['video', 'streaming', 'upload video', 'viral', siteName],
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    
    // TAMBAHAN SEO: Paksa Googlebot buat index & tampilin gambar ukuran besar
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
    
    icons: {
      icon: logoUrl,
      apple: logoUrl, 
    },
    
    openGraph: {
      title: siteTitle,
      description: description,
      url: baseUrl,
      siteName: siteName,
      locale: 'id_ID', 
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteName,
        }
      ],
      type: 'website',
    },
    
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: description,
      images: [ogImage],
    },
  };
}

// 3. RENDER HALAMAN HTML
export default async function RootLayout({ children }) {
  const { data } = await supabase.from('settings').select('head_script').eq('id', 1).single();

  return (
    <html lang="id">
      <head>
        {/* Resource Global CSS & Material Icons */}
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

        {/* INI DIA GOOGLE FONT JOST KESAYANGAN LO */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        
        {/* SCRIPT GOOGLE ANALYTICS / ADS GLOBAL */}
        {data?.head_script && (
          <div dangerouslySetInnerHTML={{ __html: data.head_script }} style={{ display: 'none' }} />
        )}

        {/* Konten Utama Halaman/Video */}
        {children}
        
        <div id="notification-bar" className="custom-notification"></div>
      </body>
    </html>
  );
}
