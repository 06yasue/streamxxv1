"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { notFound, useParams } from 'next/navigation';
import styles from './video.module.css';

export default function VideoPlayerPage() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasClicked, setHasClicked] = useState(false); // Logika redirect offer

  useEffect(() => {
    async function loadData() {
      const [vRes, sRes] = await Promise.all([
        supabase.from('videos').select('*').eq('video_id', videoId).single(),
        supabase.from('settings').select('*').eq('id', 1).single()
      ]);

      if (vRes.data) {
        setVideo(vRes.data);
        setSettings(sRes.data);
        // Update view count
        await supabase.from('videos').update({ hit_count: vRes.data.hit_count + 1 }).eq('video_id', videoId);
      }
      setLoading(false);
    }
    loadData();
  }, [videoId]);

  if (loading) return null;
  if (!video) return notFound();

  // Fungsi buka link offer
  const handlePlayerClick = () => {
    if (!hasClicked && settings?.offer_link) {
      window.open(settings.offer_link, '_blank');
      setHasClicked(true); // Overlay hilang setelah klik pertama
    }
  };

  return (
    <div style={{ background: '#121212', minHeight: '100vh' }}>
      
      {/* 1. HEADER MINIMALIS (Ganti Navbar) */}
      <div className={styles.headerVideo}>
        <span className="material-icons notranslate" style={{ color: '#e50914' }}>movie</span>
        <span style={{ fontWeight: '800', fontSize: '18px', color: '#e50914' }}>
          {settings?.site_name || 'WebVideoKu'}
        </span>
      </div>

      {/* 2. ADS TOP (FLOATING CENTER) */}
      <div className={styles.floatingAds}>
        <div className="ads-mobile-only" dangerouslySetInnerHTML={{ __html: settings?.ads_mobile }} />
        <div className="ads-desktop-only" dangerouslySetInnerHTML={{ __html: settings?.ads_desktop }} />
      </div>

      {/* 3. VIDEO PLAYER FULL WIDTH */}
      <div className={styles.videoWrapper}>
        
        {/* Overlay Jebakan Iklan */}
        {!hasClicked && (
          <div className={styles.clickOverlay} onClick={handlePlayerClick}></div>
        )}

        <div className={styles.playerContainer}>
          {video.source_type === 'upload' ? (
            <video 
              controls 
              src={video.video_url} 
              poster={video.thumbnail_url} 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              controlsList="nodownload" // CEGAH DOWNLOAD DI BROWSER MODERN
              onContextMenu={(e) => e.preventDefault()} // CEGAH KLIK KANAN SIMPAN VIDEO
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
      <div className={styles.videoInfo}>
        <div className={styles.titleTruncate}>{video.title}</div>
        
        <div className={styles.metaData}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span className="material-icons notranslate" style={{ fontSize: '16px' }}>visibility</span> {video.hit_count} views
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span className="material-icons notranslate" style={{ fontSize: '16px' }}>event</span> {new Date(video.created_at).toLocaleDateString('id-ID')}
          </span>
        </div>

        {/* 5. TOMBOL DOWNLOAD (Hanya untuk hasil upload) */}
        {video.source_type === 'upload' && (
          <a href={`/download/${video.video_id}`} className={styles.btnDownload}>
            <span className="material-icons notranslate">download</span> DOWNLOAD VIDEO SEKARANG
          </a>
        )}

        {/* 6. ADS BODY / NATIVE BANNER AREA */}
        <div className={styles.nativeAdsArea}>
           <div dangerouslySetInnerHTML={{ __html: settings?.ads_body }} />
        </div>

        {/* 7. ADS FOOTER */}
        <div style={{ textAlign: 'center', marginTop: '30px', paddingBottom: '40px' }} dangerouslySetInnerHTML={{ __html: settings?.ads_footer }} />
      </div>

    </div>
  );
}
