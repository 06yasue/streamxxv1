import { supabase } from '../../lib/supabaseClient';
import { notFound } from 'next/navigation';
import styles from './video.module.css';
import ClientInteractionHandler from './ClientInteractionHandler';

export async function generateMetadata({ params }) {
  const { videoId } = params;

  const [vRes, sRes] = await Promise.all([
    supabase
      .from('videos')
      .select('*')
      .eq('video_id', videoId)
      .single(),

    supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single()
  ]);

  const video = vRes.data;
  const settings = sRes.data;

  // ======================
  // FALLBACK JIKA VIDEO TIDAK ADA
  // ======================

  if (!video) {
    return {
      title: 'Video Tidak Ditemukan',
      description: 'Video tidak tersedia',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // ======================
  // DEFAULT DATA
  // ======================

  const siteName =
    settings?.site_name || 'WebVideoKu';

  let baseUrl =
    'https://streamxxv1.vercel.app';

  if (settings?.base_url) {
    baseUrl = settings.base_url.startsWith('http')
      ? settings.base_url
      : `https://${settings.base_url}`;
  }

  // Pastikan thumbnail aman
  const thumbnail =
    video.thumbnail_url ||
    settings?.og_image_url ||
    settings?.site_logo_url ||
    'https://via.placeholder.com/1200x630.png';

  // Description SEO yang lebih kuat
  const description =
    video.description ||
    `Tonton video ${video.title} secara gratis dan kualitas terbaik hanya di ${siteName}. Streaming cepat tanpa ribet.`;

  const canonicalUrl =
    `${baseUrl}/${videoId}`;

  // ======================
  // SEO METADATA VIDEO PAGE
  // ======================

  return {
    title: video.title,

    description,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    openGraph: {
      title: video.title,
      description,
      url: canonicalUrl,
      siteName,
      locale: 'id_ID',
      type: 'video.other',

      images: [
        {
          url: thumbnail,
          width: 1280,
          height: 720,
          alt: video.title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: video.title,
      description,
      images: [thumbnail],
    },

    other: {
      'video:duration': video.duration || '',
      'video:release_date': video.created_at || '',
    },
  };
}

export default async function VideoPlayerPage({ params }) {
  const { videoId } = params;

  const [vRes, sRes] = await Promise.all([
    supabase
      .from('videos')
      .select('*')
      .eq('video_id', videoId)
      .single(),

    supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single()
  ]);

  const video = vRes.data;
  const settings = sRes.data;

  if (!video) return notFound();

  return (
    <div className={styles.videoPageBody}>

      {/* HEADER */}
      <div className={styles.headerFlat}>
        {settings?.site_logo_url ? (
          <img
            src={settings.site_logo_url}
            alt={settings?.site_name}
            className={styles.logoImageContainer}
          />
        ) : (
          <div className={styles.fallbackSiteText}>
            {settings?.site_name || 'WebVideoKu'}
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className={styles.mainLayoutContainer}>

        {/* ADS TOP */}
        <div className={styles.adsFloatingWrapper}>
          <div
            className="ads-mobile-only"
            dangerouslySetInnerHTML={{
              __html: settings?.ads_mobile
            }}
          />

          <div
            className="ads-desktop-only"
            dangerouslySetInnerHTML={{
              __html: settings?.ads_desktop
            }}
          />
        </div>

        {/* PLAYER */}
        <div className={styles.playerAreaWrapper}>
          <ClientInteractionHandler
            video={video}
            settings={settings}
          />

          <div className={styles.playerAspectRatioBox}>
            {video.source_type === 'upload' ? (
              <video
                controls
                src={video.video_url}
                poster={video.thumbnail_url}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
                controlsList="nodownload"
              />
            ) : (
              <iframe
                src={video.video_url}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allowFullScreen
              />
            )}
          </div>
        </div>

        {/* INFO */}
        <div className={styles.infoSection}>
          <div className={styles.titleLineEllipsis}>
            {video.title}
          </div>

          <div className={styles.metaLineData}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span
                className="material-icons notranslate"
                style={{ fontSize: '16px' }}
              >
                visibility
              </span>

              {video.hit_count} views
            </span>

            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span
                className="material-icons notranslate"
                style={{ fontSize: '16px' }}
              >
                event
              </span>

              {new Date(video.created_at).toLocaleDateString('id-ID')}
            </span>
          </div>

          {/* DOWNLOAD */}
          {video.source_type === 'upload' && (
            <a
              href={`/download/${video.video_id}`}
              className={styles.downloadBtnFlatDesign}
            >
              <span className="material-icons notranslate">
                download
              </span>

              DOWNLOAD VIDEO
            </a>
          )}

          {/* ADS BODY */}
          <div className={styles.nativeAdsBelowDetails}>
            <div
              dangerouslySetInnerHTML={{
                __html: settings?.ads_body
              }}
            />
          </div>

          {/* ADS FOOTER */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '20px',
              paddingBottom: '40px',
            }}
            dangerouslySetInnerHTML={{
              __html: settings?.ads_footer
            }}
          />
        </div>

      </div>
    </div>
  );
}
