"use client";
import { useState, useEffect } from 'react';

export default function DownloadTimerClient({ video, settings }) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [isReady, setIsReady] = useState(false);

  // LOGIKA TIMER 10 DETIK
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setIsReady(true);
    }
  }, [timeLeft]);

  // LOGIKA POPUNDER + DOWNLOAD
  const handleFinalDownload = (e) => {
    e.preventDefault();

    // 1. POPUNDER: Buka link Offer CPA di Tab Baru
    if (settings?.offer_link) {
      window.open(settings.offer_link, '_blank');
    }

    // 2. DOWNLOAD AKTUAL: Alihkan tab saat ini ke link file MP4
    window.location.href = video.video_url;
  };

  return (
    <div style={{ background: '#121212', minHeight: '100vh', padding: '40px 15px', fontFamily: '"Jost", sans-serif', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* HEADER LOGO */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
         {settings?.site_logo_url ? (
            <img src={settings.site_logo_url} alt="Logo" style={{ maxHeight: '40px' }} />
         ) : (
            <div style={{ color: '#e50914', fontSize: '24px', fontWeight: 'bold' }}>{settings?.site_name}</div>
         )}
      </div>

      <div style={{ width: '100%', maxWidth: '600px', background: '#1a1a1a', border: '1px solid #333', padding: '30px', borderRadius: '4px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' }}>Generating Download Link...</h1>
        
        {/* IKLAN ATAS (Desktop & Mobile) */}
        <div style={{ marginBottom: '20px' }}>
          <div className="ads-mobile-only" dangerouslySetInnerHTML={{ __html: settings?.ads_mobile }} />
          <div className="ads-desktop-only" dangerouslySetInnerHTML={{ __html: settings?.ads_desktop }} />
        </div>

        {/* THUMBNAIL VIDEO */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', border: '1px solid #444', marginBottom: '20px', borderRadius: '4px' }}>
          <img 
            src={video.thumbnail_url} 
            alt={video.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} 
          />
          <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', textAlign: 'left', background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '4px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{video.title}</div>
          </div>
        </div>

        {/* AREA TIMER & TOMBOL */}
        <div style={{ padding: '20px', background: '#0a0a0a', border: '1px solid #222', borderRadius: '4px' }}>
          {!isReady ? (
            <div>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#e50914', marginBottom: '10px' }}>
                {timeLeft}
              </div>
              <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Please wait while we prepare your file...</p>
            </div>
          ) : (
            <button 
              onClick={handleFinalDownload}
              style={{ width: '100%', background: '#1db954', color: '#fff', border: 'none', padding: '16px', fontSize: '18px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(29, 185, 84, 0.4)', transition: '0.3s' }}
            >
              <span className="material-icons" style={{ marginRight: '8px' }}>file_download</span> 
              DOWNLOAD READY
            </button>
          )}
        </div>

        {/* IKLAN BAWAH */}
        <div style={{ marginTop: '30px' }} dangerouslySetInnerHTML={{ __html: settings?.ads_body }} />
        <div style={{ marginTop: '15px' }} dangerouslySetInnerHTML={{ __html: settings?.ads_footer }} />

      </div>
    </div>
  );
}
