import styles from './video.module.css';
import { supabase } from '../../lib/supabaseClient';

// 1. META TAG RESMI PINDAH KE LAYOUT SINI!
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

  return {
    title: video.title,
    description: `Tonton ${video.title} di ${siteName}`,
    openGraph: {
      title: video.title,
      description: `Tonton video ini di ${siteName}`,
      url: `/${videoId}`,
      siteName: siteName,
      images: [
        { 
          url: video.thumbnail_url, 
          width: 1280, 
          height: 720,
          alt: video.title
        }
      ],
      type: 'video.other',
    },
    twitter: {
      card: 'summary_large_image',
      title: video.title,
      images: [video.thumbnail_url],
    },
  };
}

// 2. TAMPILAN HEADER LAYOUT
export default async function VideoLayout({ children, params }) {
  const { data: settings } = await supabase.from('settings').select('site_name, site_logo_url').eq('id', 1).single();

  return (
    <div className={styles.videoPageBody}>
      {/* Header Flat Khusus Video */}
      <div className={styles.headerFlat}>
          {settings?.site_logo_url ? (
              <img src={settings.site_logo_url} alt="Logo" className={styles.logoImageContainer} />
          ) : (
              <div className={styles.fallbackSiteText}>{settings?.site_name}</div>
          )}
      </div>
      
      {/* Bungkus Konten Page */}
      <div className={styles.mainLayoutContainer}>
        {children}
      </div>
    </div>
  );
}
