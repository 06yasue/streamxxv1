import { supabase } from '../../lib/supabaseClient';
import { notFound } from 'next/navigation';
import styles from './video.module.css';
import ClientInteractionHandler from './ClientInteractionHandler'; 
import DownloadAdsHandler from './DownloadAdsHandler';
import SafeAdSlot from './SafeAdSlot'; // MANGGIL MESIN PENJINAK IKLAN

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
    <>
      {/* EKSEKUSI SCRIPT GLOBAL DENGAN AMAN */}
      <SafeAdSlot htmlContent={settings?.script_head_global} />

      {/* Iklan Atas (Mobile & Desktop Floating) */}
      <div className={styles.adsFloatingWrapper}>
        <SafeAdSlot htmlContent={settings?.ads_mobile} className="ads-mobile-only" />
        <SafeAdSlot htmlContent={settings?.ads_desktop} className="ads-desktop-only" />
      </div>

      {/* SLOT ADS HEAD VIDEO (Atas Player) - Bebas pasang JS apa aja! */}
      <div style={{ marginBottom: '15px' }}>
        <SafeAdSlot htmlContent={settings?.ads_head_video} />
      </div>

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

        <DownloadAdsHandler 
          videoId={video.video_id} 
          sourceType={video.source_type} 
          className={styles.downloadBtnFlatDesign} 
        />

        {/* Iklan Bawah */}
        <SafeAdSlot htmlContent={settings?.ads_body} className={styles.nativeAdsBelowDetails} />
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <SafeAdSlot htmlContent={settings?.ads_footer} />
        </div>
      </div>
    </>
  );
}
