import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default async function Home() {
  const { data: settings } = await supabase.from('settings').select('site_name').eq('id', 1).single();
  const siteName = settings?.site_name || 'WebVideoKu';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#0a0a0a', padding: '20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <span className="material-icons notranslate" style={{ fontSize: '80px', color: '#e50914', marginBottom: '15px' }}>movie_filter</span>
        <h1 style={{ fontWeight: 'bold', color: '#fff', margin: '0 0 15px 0', fontSize: '42px' }}>{siteName}</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px' }}>
          <Link href="/list"><button className="btn btn-danger btn-lg">Dashboard</button></Link>
          <Link href="/upload"><button className="btn btn-default btn-lg">Upload Video</button></Link>
        </div>
      </div>
    </div>
  );
}
