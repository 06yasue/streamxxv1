import { Metadata } from 'next'
import { supabase } from '../lib/supabaseClient';
import './globals.css';

export async function generateMetadata() {
  const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).single();

  const siteName = settings?.site_name || 'WebVideoKu';
  const siteTitle = settings?.site_title || 'Platform Video Terbaik';
  const description = settings?.site_description || 'Website penyimpanan dan streaming video';
  
  let baseUrl = 'https://streamxxv1.vercel.app';
  if (settings?.base_url) {
    baseUrl = settings.base_url.startsWith('http') ? settings.base_url : `https://${settings.base_url}`;
  }

  const logoUrl = settings?.site_logo_url || 'https://via.placeholder.com/150';
  const ogImage = settings?.og_image_url || logoUrl;

  return {
    title: {
      default: siteTitle, 
      template: `%s | ${siteName}`, 
    },
    description: description,
    metadataBase: new URL(baseUrl),
    icons: {
      icon: logoUrl,
      apple: logoUrl,
    },
    openGraph: {
      title: siteTitle,
      description: description,
      url: '/',
      siteName: siteName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }],
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

export default async function RootLayout({ children }) {
  const { data: settings } = await supabase.from('settings').select('head_script').eq('id', 1).single();

  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </head>
      <body>
        {/* Posisi script dipindah ke sini biar tidak merusak Meta Tag di Head */}
        {settings?.head_script && (
          <div dangerouslySetInnerHTML={{ __html: settings.head_script }} />
        )}
        
        {children}
        
        <div id="notification-bar" className="custom-notification"></div>
      </body>
    </html>
  );
}
