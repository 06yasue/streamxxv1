import { supabase } from '../../lib/supabaseClient';
import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default async function VideoPlayerPage({ params }) {
  const { videoId } = await params;
  
  // Ambil data video dan settings sekaligus
  const [videoRes, settingsRes] = await Promise.all([
    supabase.from('videos').select('*').eq('video_id', videoId).single(),
    supabase.from('settings').select('*').eq('id', 1).single()
  ]);

  const video = videoRes.data;
  const settings = settingsRes.data;
  
  if (!video) return notFound();
  await supabase.from('videos').update({ hit_count: video.hit_count + 1 }).eq('video_id', videoId);

  return (
    <>
      {/* Sesuai permintaan lo: di halaman video tetap ada navbar tapi rapi */}
      <Navbar />

      <div className="container-custom" style={{ maxWidth: '900px' }}>
        
        {/* 1. ADS VIDEO HEAD (Atas Video) */}
        {settings?.ads_video_head && (
          <div style={{ textAlign: 'center', marginBottom: '15px' }} dangerouslySetInnerHTML={{ __html: settings.ads_video_head }} />
        )}

        {/* 2. VIDEO PLAYER */}
        <div style={{ background: '#000', width: '100%', aspectRatio: '16/9', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', overflow: 'hidden' }}>
          {video.source_type === 'upload' ? (
            <video controls src={video.video_url} poster={video.thumbnail_url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <iframe src={video.video_url} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen />
          )}
        </div>

        {/* 3. DETAIL & ADS MOBILE/DESKTOP */}
        <div style={{ padding: '20px 0' }}>
          <h2 style={{ marginTop: 0, fontWeight: 'bold' }}>{video.title}</h2>
          
          {/* Iklan Mobile Khusus */}
          <div className="ads-mobile-only" style={{ margin: '15px 0' }} dangerouslySetInnerHTML={{ __html: settings?.ads_mobile }} />
          {/* Iklan Desktop Khusus */}
          <div className="ads-desktop-only" style={{ margin: '15px 0' }} dangerouslySetInnerHTML={{ __html: settings?.ads_desktop }} />

          <hr style={{ borderColor: '#333' }} />

          {/* 4. ADS BODY */}
          {settings?.ads_body && (
            <div style={{ margin: '20px 0' }} dangerouslySetInnerHTML={{ __html: settings.ads_body }} />
          )}

          {/* Link Offer */}
          {settings?.offer_link && (
            <a href={settings.offer_link} target="_blank" className="btn btn-danger btn-block" style={{ padding: '15px', fontWeight: 'bold' }}>
              KLIK DI SINI UNTUK PENAWARAN KHUSUS!
            </a>
          )}
        </div>

        {/* 5. ADS FOOTER */}
        {settings?.ads_footer && (
          <div style={{ textAlign: 'center', marginTop: '30px', paddingBottom: '50px' }} dangerouslySetInnerHTML={{ __html: settings.ads_footer }} />
        )}

      </div>
    </>
  );
}
