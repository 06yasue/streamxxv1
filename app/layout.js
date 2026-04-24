import { supabase } from '../lib/supabaseClient';
import './globals.css'; // Manggil file CSS yang baru kita buat

export const metadata = {
  title: 'WebVideoKu',
  description: 'Platform penyimpanan video pribadimu',
}

export default async function RootLayout({ children }) {
  // Ambil data script head dari database secara langsung di server
  const { data: settings } = await supabase.from('settings').select('head_script').eq('id', 1).single();

  return (
    <html lang="en">
      <head>
        {/* Bootstrap 3 & Material Icons */}
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        
        {/* Google Fonts: Jost */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* INJEKSI SCRIPT HEAD (Google Analytics dll) */}
        {settings?.head_script && (
          <div dangerouslySetInnerHTML={{ __html: settings.head_script }} />
        )}
      </head>
      <body>
        {children}
        {/* Wadah notifikasi global */}
        <div id="notification-bar" className="custom-notification"></div>
      </body>
    </html>
  );
}
