"use client";
import { useState, useEffect, memo } from 'react';

const AdsContainer = memo(({ htmlContent, className }) => {
  if (!htmlContent) return null;
  return <div className={className} dangerouslySetInnerHTML={{ __html: htmlContent }} />;
});
AdsContainer.displayName = 'AdsContainer';

export default function DownloadTimerClient({ video, settings }) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setIsReady(true);
    }
  }, [timeLeft]);

  const triggerDownload = () => {
    // 1. Jalankan Popunder Offer
    if (settings?.offer_link) {
      window.open(settings.offer_link, '_blank');
    }

    // 2. MESIN AUTO-DOWNLOAD (Force Download)
    // Kita buat elemen <a> dinamis dengan atribut download
    const link = document.createElement('a');
    link.href = video.video_url;
    link.setAttribute('download', `${video.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`);
    link.setAttribute('target', '_self'); // Biar gak buka tab baru buat videonya
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ background: 'linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%)', minHeight: '100vh', padding: '40px 15px', color: '#fff', textAlign: 'center' }}>
      
      <div style={{ maxWidth: '500px', margin: '0 auto', background: '#222', padding: '30px', borderRadius: '8px', border: '1px solid #333' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Your File is Ready</h2>
        
        {/* Iklan Native Banner */}
        <div style={{ margin: '20px 0' }}>
            <AdsContainer htmlContent={settings?.ads_mobile} className="ads-mobile-only" />
            <AdsContainer htmlContent={settings?.ads_desktop} className="ads-desktop-only" />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <img src={video.thumbnail_url} alt="thumb" style={{ width: '100%', borderRadius: '4px', border: '1px solid #444' }} />
          <p style={{ marginTop: '10px', color: '#aaa' }}>{video.title}</p>
        </div>

        {!isReady ? (
          <div style={{ padding: '20px', border: '2px dashed #444' }}>
            <p style={{ margin: 0, color: '#e50914', fontSize: '18px', fontWeight: 'bold' }}>Link generating in {timeLeft}...</p>
          </div>
        ) : (
          <button 
            onClick={triggerDownload}
            style={{ width: '100%', background: '#1db954', color: '#fff', padding: '15px', border: 'none', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 5px 15px rgba(29, 185, 84, 0.3)' }}
          >
            START DOWNLOAD NOW
          </button>
        )}

        <div style={{ marginTop: '20px' }}>
            <AdsContainer htmlContent={settings?.ads_body} />
        </div>
      </div>
    </div>
  );
}
