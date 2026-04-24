import { supabase } from '../../lib/supabaseClient';
import { notFound } from 'next/navigation';
import styles from './video.module.css';
import ClientInteractionHandler from './ClientInteractionHandler'; 

// GANTI FUNGSI INI DI app/[videoId]/page.js
export async function generateMetadata({ params }) {
  const { videoId } = await params;
  
  const [vRes, sRes] = await Promise.all([
    supabase.from('videos').select('*').eq('video_id', videoId).single(),
    supabase.from('settings').select('*').eq('id', 1).single()
  ]);

  const video = vRes.data;
  const settings = sRes.data;

  if (!video) return { title: 'Video Tidak Ditemukan' };

  const siteName = settings?.site_name || 'WebVideoKu';
  const description = `Tonton video ${video.title} secara gratis di ${siteName}.`;

  return {
    title: video.title, // Cukup judul videonya aja, gak bakal double lagi!
    description: description,
    
    // Paksa URL merujuk ke halaman video ini secara spesifik
    alternates: {
      canonical: `/${videoId}`, 
    },
    
    openGraph: {
      title: video.title, // Judul bersih untuk sosmed
      description: description,
      url: `/${videoId}`, // Bot sosmed bakal fokus ke link ini
      siteName: siteName,
      images: [
        {
          url: video.thumbnail_url,
          width: 1280,
          height: 720,
          alt: video.title,
        }
      ],
      type: 'video.other',
    },
    twitter: {
      card: 'summary_large_image',
      title: video.title,
      description: description,
      images: [video.thumbnail_url],
    },
  };
}


export default async function VideoPlayerPage({ params }) {
  const { videoId } = await params;
  
  const [vRes, sRes] = await Promise.all([
    supabase.from('videos').select('*').eq('video_id', videoId).single(),
    supabase.from('settings').select('*').eq('id', 1).single()
  ]);

  const video = vRes.data;
  const settings = sRes.data;
  
  if (!video) return notFound();

  return (
    <div className={styles.videoPageBody}>
      
      {/* 1. HEADER STICKY (Otomatis ikut saat di-scroll) */}
      <div className={styles.headerFlat}>
          {settings?.site_logo_url ? (
              <img src={settings.site_logo_url} alt={settings?.site_name} className={styles.logoImageContainer} />
          ) : (
              <div className={styles.fallbackSiteText}>{settings?.site_name || 'WebVideoKu'}</div>
          )}
      </div>

      {/* 2. KONTEN UTAMA (Diatur oleh Media Queries: HP Full, Desktop Terpusat) */}
      <div className={styles.mainLayoutContainer}>

          {/* ADS TOP (FLOATING) */}
          <div className={styles.adsFloatingWrapper}>
            <div className="ads-mobile-only" dangerouslySetInnerHTML={{ __html: settings?.ads_mobile }} />
            <div className="ads-desktop-only" dangerouslySetInnerHTML={{ __html: settings?.ads_desktop }} />
          </div>

          {/* VIDEO PLAYER WRAPPER */}
          <div className={styles.playerAreaWrapper}>
            <ClientInteractionHandler video={video} settings={settings} />

            <div className={styles.playerAspectRatioBox}>
              {video.source_type === 'upload' ? (
                <video 
                  controls 
                  src={video.video_url} 
                  poster={video.thumbnail_url} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  controlsList="nodownload" 
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

          {/* DETAIL KONTEN */}
          <div className={styles.infoSection}>
            <div className={styles.titleLineEllipsis}>{video.title}</div>
            
            <div className={styles.metaLineData}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="material-icons notranslate" style={{ fontSize: '16px' }}>visibility</span> {video.hit_count} views
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="material-icons notranslate" style={{ fontSize: '16px' }}>event</span> {new Date(video.created_at).toLocaleDateString('id-ID')}
              </span>
            </div>

            {/* TOMBOL DOWNLOAD DENGAN EFEK GERAK & BORDER */}
            {video.source_type === 'upload' && (
              <a href={`/download/${video.video_id}`} className={styles.downloadBtnFlatDesign}>
                <span className="material-icons notranslate">download</span> DOWNLOAD VIDEO
              </a>
            )}

            {/* ADS BODY / NATIVE BANNER AREA */}
            <div className={styles.nativeAdsBelowDetails}>
               <div dangerouslySetInnerHTML={{ __html: settings?.ads_body }} />
            </div>

            {/* ADS FOOTER */}
            <div style={{ textAlign: 'center', marginTop: '20px', paddingBottom: '40px' }} dangerouslySetInnerHTML={{ __html: settings?.ads_footer }} />
          </div>

      </div>
    </div>
  );
}
