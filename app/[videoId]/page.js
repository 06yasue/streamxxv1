import { supabase } from '../../lib/supabaseClient';
import { notFound } from 'next/navigation';
import styles from './video.module.css';
import ClientInteractionHandler from './ClientInteractionHandler'; 
import DownloadAdsHandler from './DownloadAdsHandler';
import Script from 'next/script'; // TAMBAHAN WAJIB BUAT SCRIPT MONETAG

export default async function VideoPlayerPage({ params }) {
  const { videoId } = await params;
  const [vRes, sRes] = await Promise.all([
    supabase.from('videos').select('*').eq('video_id', videoId).single(),
    supabase.from('settings').select('*').eq('id', 1).single()
  ]);

  const video = vRes.data;
  const settings = sRes.data;
  
  if (!video) return notFound();

  // MESIN PENGEKSTRAK SCRIPT: Buat ngakalin React biar script Monetag tetep jalan
  const extractScriptSrc = (htmlString) => {
    if (!htmlString) return null;
    const match = htmlString.match(/src="([^"]+)"/);
    return match ? match[1] : null;
  };

  const globalScriptSrc = extractScriptSrc(settings?.script_head_global);
  const videoHeadScriptSrc = extractScriptSrc(settings?.ads_head_video);

  return (
    <>
      {/* EKSEKUSI SCRIPT MONETAG SECARA AMAN */}
      {globalScriptSrc && <Script src={globalScriptSrc} strategy="afterInteractive" />}
      {videoHeadScriptSrc && <Script src={videoHeadScriptSrc} strategy="afterInteractive" />}

      {/* Iklan Atas (Mobile & Desktop Floating) */}
      <div className={styles.adsFloatingWrapper}>
        <div className="ads-mobile-only" dangerouslySetInnerHTML={{ __html: settings?.ads_mobile }} />
        <div className="ads-desktop-only" dangerouslySetInnerHTML={{ __html: settings?.ads_desktop }} />
      </div>

      {/* INI DIA SLOT YANG HILANG: ADS HEAD VIDEO (ATAS PLAYER) */}
      {/* Kalau isinya banner HTML biasa (bukan script), bakal muncul di sini */}
      <div 
        style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '15px' }} 
        dangerouslySetInnerHTML={{ __html: settings?.ads_head_video }} 
      />

      {/* Area Video */}
      <div className={styles.playerAreaWrapper}>
        <ClientInteractionHandler video={video} settings={settings} />
        <div className={styles.playerAspectRatioBox}>
          {video.source_type === 'upload' ? (
            <video controls src={video.video_url} poster={video.thumbnail_url} style={{ width: '100%', height: '100%' }} controlsList="nodownload" />
          ) : (
            <iframe src={video.video_url} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen />
          )}
        </div>
      </div>

      {/* Info & Detail Bawah */}
      <div className={styles.infoSection}>
        <div className={styles.titleLineEllipsis}>{video.title}</div>
        <div className={styles.metaLineData}>
          <span><span className="material-icons" style={{fontSize:'16px'}}>visibility</span> {video.hit_count} views</span>
          <span><span className="material-icons" style={{fontSize:'16px'}}>event</span> {new Date(video.created_at).toLocaleDateString('id-ID')}</span>
        </div>

        {/* TOMBOL DOWNLOAD (Udah pakai slot Link Offer) */}
        <DownloadAdsHandler 
          videoId={video.video_id} 
          sourceType={video.source_type} 
          className={styles.downloadBtnFlatDesign} 
        />

        <div className={styles.nativeAdsBelowDetails} dangerouslySetInnerHTML={{ __html: settings?.ads_body }} />
        <div style={{ textAlign: 'center', marginTop: '30px' }} dangerouslySetInnerHTML={{ __html: settings?.ads_footer }} />
      </div>
    </>
  );
}
