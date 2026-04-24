import { supabase } from '../lib/supabaseClient';
import './globals.css';

export const metadata = {
  title: 'WebVideoKu',
  description: 'Platform penyimpanan video',
}

export default async function RootLayout({ children }) {
  const { data: settings } = await supabase.from('settings').select('head_script').eq('id', 1).single();

  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
        {settings?.head_script && (
          <div dangerouslySetInnerHTML={{ __html: settings.head_script }} />
        )}
      </head>
      <body>
        <div className="main-wrapper">
          {children}
        </div>
        <div id="notification-bar" className="custom-notification"></div>
      </body>
    </html>
  );
}
