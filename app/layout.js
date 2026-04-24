import { supabase } from '../lib/supabaseClient';

export default async function RootLayout({ children }) {
  // Ambil data script head dari database secara langsung di server
  const { data: settings } = await supabase.from('settings').select('head_script').eq('id', 1).single();

  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        
        {/* INJEKSI SCRIPT HEAD OTOMATIS */}
        {settings?.head_script && (
          <div dangerouslySetInnerHTML={{ __html: settings.head_script }} />
        )}

        <style dangerouslySetInnerHTML={{__html: `
          body { background-color: #121212; color: #ffffff; margin: 0; padding: 0; font-family: Arial, sans-serif; }
          .container-custom { width: 100%; padding: 0 10px; }
          @media (min-width: 768px) { .container-custom { max-width: 750px; margin: 0 auto; padding: 15px; } }
          @media (min-width: 992px) { .container-custom { max-width: 970px; } }
          @media (min-width: 1200px) { .container-custom { max-width: 1170px; } }
          
          /* Utility Kelas Iklan */
          .ads-desktop-only { display: none; }
          @media (min-width: 992px) { .ads-desktop-only { display: block; } .ads-mobile-only { display: none; } }
          @media (max-width: 991px) { .ads-mobile-only { display: block; } }

          .custom-notification {
            position: fixed; bottom: 20px; right: 20px; background: #2b2b2b; color: #fff;
            padding: 15px 25px; border-left: 4px solid #e50914; border-radius: 4px;
            z-index: 9999; display: none; box-shadow: 0 4px 6px rgba(0,0,0,0.5);
          }
          .custom-notification.show { display: block; }
        `}} />
      </head>
      <body>
        {children}
        <div id="notification-bar" className="custom-notification"></div>
      </body>
    </html>
  );
}
