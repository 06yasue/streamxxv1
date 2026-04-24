import { supabase } from '../lib/supabaseClient';
import './globals.css';

export const metadata = {
  title: 'WebVideoKu',
  description: 'Platform penyimpanan video pribadimu',
}

export default async function RootLayout({ children }) {
  // Ambil data script head dari database secara langsung di server
  const { data: settings } = await supabase.from('settings').select('head_script').eq('id', 1).single();

  return (
    <html lang="id">
      <head>
        {/* Bootstrap 3 & Material Icons */}
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        
        {/* Google Fonts: Jost (Sesuai kode dari lo) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        
        {/* INJEKSI SCRIPT HEAD (Google Analytics dll) */}
        {settings?.head_script && (
          <div dangerouslySetInnerHTML={{ __html: settings.head_script }} />
        )}
      </head>
      <body>
        {/* Bungkus ini biar halaman gak nempel ke pucuk layar */}
        <div className="main-wrapper">
          {children}
        </div>
        
        {/* Wadah notifikasi global */}
        <div id="notification-bar" className="custom-notification"></div>
      </body>
    </html>
  );
}
