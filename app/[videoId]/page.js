import { supabase } from '../../lib/supabaseClient';
import { notFound } from 'next/navigation';
import styles from './video.module.css';
import ClientInteractionHandler from './ClientInteractionHandler'; 

// META TAG SUDAH DIHAPUS DARI SINI, PINDAH KE LAYOUT.JS

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
      {/* Iklan Atas */}
      <div className={styles.adsFloatingWrapper}>
        <div className="ads-mobile-only" dangerouslySetInnerHTML={{ __html: settings?.ads_mobile }} />
        <div className="ads-desktop-only" dangerouslySetInnerHTML={{ __html: settings?.ads_desktop }} />
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

        {video.source_type === 'upload' && (
          <a href={`/download/${video.video_id}`} className={styles.downloadBtnFlatDesign}>
            <span className="material-icons">download</span> DOWNLOAD VIDEO
          </a>
        )}

        <div className={styles.nativeAdsBelowDetails} dangerouslySetInnerHTML={{ __html: settings?.ads_body }} />
        <div style={{ textAlign: 'center', marginTop: '30px' }} dangerouslySetInnerHTML={{ __html: settings?.ads_footer }} />
      </div>
    </>
  );
}
