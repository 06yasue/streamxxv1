import { supabase } from '../lib/supabaseClient';
import './globals.css';

export async function generateMetadata() {
  const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).single();
  const siteName = settings?.site_name || 'WebVideoKu';
  const siteTitle = settings?.site_title || 'Platform Video';
  
  return {
    title: {
      default: siteTitle,
      template: `%s | ${siteName}`,
    },
    description: settings?.site_description || 'Website video hosting',
    icons: {
      icon: settings?.site_logo_url || '/favicon.ico',
    },
    openGraph: {
      title: siteTitle,
      description: settings?.site_description,
      siteName: siteName,
      images: [{ url: settings?.og_image_url || settings?.site_logo_url, width: 1200, height: 630 }],
      type: 'website',
    },
  };
}

export default function RootLayout({ children }) {
  // Script Head dihapus total dari sini sesuai permintaan lo
  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </head>
      <body>
        {children}
        <div id="notification-bar" className="custom-notification"></div>
      </body>
    </html>
  );
}
