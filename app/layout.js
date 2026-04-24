import { supabase } from '../lib/supabaseClient';
import './globals.css';

export const metadata = {
  title: 'WebVideoKu',
  description: 'Platform penyimpanan video',
}

export default async function RootLayout({ children }) {
  const { data: settings } = await supabase.from('settings').select('head_script').eq('id', 1).single();

  return (
    <html lang="en">
      <head>
        {/* 1. CSS BOOTSTRAP */}
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
        
        {/* 2. GOOGLE FONTS (Jost) & MATERIAL ICONS (Wajib di sini biar gak keblokir) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        
        {settings?.head_script && (
          <div dangerouslySetInnerHTML={{ __html: settings.head_script }} />
        )}
      </head>
      <body>
        {children}
        <div id="notification-bar" className="custom-notification"></div>
      </body>
    </html>
  );
}
