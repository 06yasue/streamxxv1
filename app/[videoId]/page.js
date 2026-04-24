import { supabase } from '../../lib/supabaseClient';
import { notFound } from 'next/navigation';
import styles from './video.module.css';

// Komponen Tersembunyi buat ngurus Interaksi (Click-Offer, View Count)
import ClientInteractionHandler from './ClientInteractionHandler'; 

export async function generateMetadata({ params }) {
  const { videoId } = await params;
  const { data: video } = await supabase.from('videos').select('*').eq('video_id', videoId).single();
  if (!video) return { title: 'Video Tidak Ditemukan' };
  return { title: video.title, openGraph: { title: video.title, images: [video.thumbnail_url] } };
}

export default async function VideoPlayerPage({ params }) {
  const { videoId } = await params;
  
  // Ambil data video dan settings sekaligus di Server (Biar Iklan JS jalan)
  const [vRes, sRes] = await Promise.all([
    supabase.from('videos').select('*').eq('video_id', videoId).single(),
    supabase.from('settings').select('*').eq('id', 1).single()
  ]);

  const video = vRes.data;
  const settings = sRes.data;
  
  if (!video) return notFound();

  return (
    <div className={styles.videoPageBody}>
      
      {/* 1. KONTEN UTAMA - contained kaku di desktop, full di HP */}
      <div className={styles.mainLayoutContainer}>
          
          {/* HEADER FLAT MINIMALIS (Ganti Navbar, Pake Image Logo) */}
          <div className={styles.headerFlat}>
              {settings?.site_logo_url ? (
                  <img src={settings.site_logo_url} alt={settings?.site_name} className={styles.logoImageContainer} />
              ) : (
                  <div className={styles.fallbackSiteText}>{settings?.site_name || 'WebVideoKu'}</div>
              )}
          </div>

          {/* 2. ADS TOP (FLOATING CENTER) - Langsung injeksi JS di Server */}
          <div className={styles.adsFloatingWrapper}>
            <div className="ads-mobile-only" dangerouslySetInnerHTML={{ __html: settings?.ads_mobile }} />
            <div className="ads-desktop-only" dangerouslySetInnerHTML={{ __html: settings?.ads_desktop }} />
          </div>

          {/* 3. VIDEO PLAYER WRAPPER */}
          <div className={styles.playerAreaWrapper}>
            
            {/* Panggil Handler Interaksi Client (Offer Redirect, Anti-Download Logic) */}
            <ClientInteractionHandler video={video} settings={settings} />

            <div className={styles.playerAspectRatioBox}>
              {video.source_type === 'upload' ? (
                <video 
                  controls 
                  src={video.video_url} 
                  poster={video.thumbnail_url} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  controlsList="nodownload" // CEGAH DOWNLOAD MODERN
                />
              ) : (
                <iframe 
                  src={video.video_url} 
                  style={{ width: '100%', height: '100%', border: 'none' }} 
                  allowFullScreen 
                />
              )}
            </div>
          </div>

          {/* 4. DETAIL KONTEN */}
          <div className={styles.infoSection}>
            {/* Judul Truncate Ellipsis */}
            <div className={styles.titleLineEllipsis}>{video.title}</div>
            
            <div className={styles.metaLineData}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="material-icons notranslate" style={{ fontSize: '16px' }}>visibility</span> {video.hit_count} views
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="material-icons notranslate" style={{ fontSize: '16px' }}>event</span> {new Date(video.created_at).toLocaleDateString('id-ID')}
              </span>
            </div>

            {/* 5. TOMBOL DOWNLOAD FLAT (Hanya untuk hasil upload) */}
            {video.source_type === 'upload' && (
              <a href={`/download/${video.video_id}`} className={styles.downloadBtnFlatDesign}>
                <span className="material-icons notranslate">download</span> DOWNLOAD VIDEO
              </a>
            )}

            {/* 6. ADS BODY / NATIVE BANNER AREA - Slot khusus Native */}
            <div className={styles.nativeAdsBelowDetails}>
               <div dangerouslySetInnerHTML={{ __html: settings?.ads_body }} />
            </div>

            {/* 7. ADS FOOTER */}
            <div style={{ textAlign: 'center', marginTop: '30px', paddingBottom: '40px' }} dangerouslySetInnerHTML={{ __html: settings?.ads_footer }} />
          </div>

      </div>

    </div>
  );
}
