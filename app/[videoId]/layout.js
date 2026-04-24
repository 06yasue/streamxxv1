import styles from './video.module.css';
import { supabase } from '../../lib/supabaseClient';

// FUNGSI GENERATE METADATA DINAMIS (SEO KHUSUS VIDEO)
export async function generateMetadata({ params }) {
  const { videoId } = await params;
  
  const [vRes, sRes] = await Promise.all([
    supabase.from('videos').select('*').eq('video_id', videoId).single(),
    supabase.from('settings').select('*').eq('id', 1).single()
  ]);

  const video = vRes.data;
  const settings = sRes.data;
  
  if (!video) return { title: 'Video Not Found' };

  const siteName = settings?.site_name || 'WebVideo';
  
  // Deskripsi dalam Bahasa Inggris, kombinasi dengan site name, TANPA kata "video hosting"
  const description = `Watch ${video.title} on ${siteName}. Enjoy the best streaming experience with high-quality videos and latest viral content.`;

  return {
    title: video.title,
    description: description,
    openGraph: {
      title: `${video.title} - ${siteName}`,
      description: description,
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
      description: description,
      images: [video.thumbnail_url],
    },
  };
}

export default async function VideoLayout({ children }) {
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
      
      {/* Container Konten Video */}
      <div className={styles.mainLayoutContainer}>
        {children}
      </div>
    </div>
  );
}
