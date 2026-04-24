"use client";
import { useState, useEffect, memo } from 'react';

// BUNGKUSAN IKLAN RAPI: Biar iklan gak tumpang tindih
const AdsContainer = memo(({ htmlContent, className }) => {
  if (!htmlContent) return null;
  return (
    <div 
      className={className} 
      style={{ width: '100%', display: 'flex', justifyContent: 'center', overflow: 'hidden', margin: '15px 0' }} 
      dangerouslySetInnerHTML={{ __html: htmlContent }} 
    />
  );
});
AdsContainer.displayName = 'AdsContainer';

export default function DownloadTimerClient({ video, settings }) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [isReady, setIsReady] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // Status loading tombol

  // LOGIKA TIMER 10 DETIK
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setIsReady(true);
    }
  }, [timeLeft]);

  const triggerDownload = async (e) => {
    e.preventDefault();
    setIsDownloading(true);

    // 1. POPUNDER OFFER (Jalan di Background)
    if (settings?.offer_link) {
      window.open(settings.offer_link, '_blank');
    }

    // 2. MESIN FORCE DOWNLOAD (Maksa Browser Nyedot File)
    let finalUrl = video.video_url;

    // TRIK CLOUDINARY: Tambah parameter fl_attachment biar auto-download!
    if (finalUrl.includes('cloudinary.com') && finalUrl.includes('/upload/')) {
      finalUrl = finalUrl.replace('/upload/', '/upload/fl_attachment/');
    }

    // Eksekusi Download
    const link = document.createElement('a');
    link.href = finalUrl;
    // Set atribut download sebagai cadangan
    link.setAttribute('download', `${video.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Balikin status tombol setelah 2 detik
    setTimeout(() => setIsDownloading(false), 2000);
  };

  // MATEMATIKA UNTUK ANIMASI LINGKARAN TIMER
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 10) * circumference;

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '30px 15px', color: '#fff', fontFamily: '"Jost", sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* HEADER LOGO (Tanpa Box) */}
      <div style={{ marginBottom: '25px', textAlign: 'center' }}>
         {settings?.site_logo_url ? (
            <img src={settings.site_logo_url} alt="Logo" style={{ maxHeight: '40px' }} />
         ) : (
            <div style={{ color: '#e50914', fontSize: '26px', fontWeight: '900' }}>{settings?.site_name}</div>
         )}
      </div>

      {/* KONTEN UTAMA POLOS BEBAS BORDER */}
      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '5px' }}>File is Ready!</h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>Your secure link has been generated</p>

        {/* IKLAN ATAS */}
        <AdsContainer htmlContent={settings?.ads_mobile} className="ads-mobile-only" />
        <AdsContainer htmlContent={settings?.ads_desktop} className="ads-desktop-only" />

        {/* THUMBNAIL VIDEO (16:9 Proporsional & Elegan) */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '16px', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <img 
            src={video.thumbnail_url} 
            alt="thumb" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          {/* Gradasi gelap di bawah gambar biar teks judul kebaca */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', padding: '20px', textAlign: 'left' }}>
             <div style={{ fontSize: '16px', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,1)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
               {video.title}
             </div>
          </div>
        </div>

        {/* AREA TIMER LINGKARAN & TOMBOL */}
        {!isReady ? (
          <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <svg width="120" height="120" style={{ transform: 'rotate(-90deg)', position: 'absolute', top: 0, left: 0 }}>
              {/* Cincin Background */}
              <circle cx="60" cy="60" r={radius} stroke="#222" strokeWidth="8" fill="transparent" />
              {/* Cincin Progress (Warna Merah) */}
              <circle 
                cx="60" 
                cy="60" 
                r={radius} 
                stroke="#e50914" 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset} 
                style={{ transition: 'stroke-dashoffset 1s linear', strokeLinecap: 'round' }}
              />
            </svg>
            <div style={{ fontSize: '40px', fontWeight: '900', color: '#fff', position: 'absolute' }}>
              {timeLeft}
            </div>
          </div>
        ) : (
          <button 
            onClick={triggerDownload}
            disabled={isDownloading}
            style={{ 
              width: '100%', maxWidth: '350px', 
              background: isDownloading ? '#444' : 'linear-gradient(135deg, #1db954 0%, #158a3e 100%)', 
              color: '#fff', padding: '16px 20px', border: 'none', borderRadius: '30px', 
              fontSize: '18px', fontWeight: 'bold', cursor: isDownloading ? 'not-allowed' : 'pointer', 
              boxShadow: '0 8px 25px rgba(29, 185, 84, 0.4)', transition: '0.3s', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' 
            }}
          >
            {isDownloading ? (
              <span className="material-icons" style={{ animation: 'spin 1s linear infinite' }}>autorenew</span>
            ) : (
              <>
                <span className="material-icons" style={{ marginRight: '8px' }}>download</span> 
                START DOWNLOAD NOW
              </>
            )}
          </button>
        )}

        {/* IKLAN BAWAH */}
        <AdsContainer htmlContent={settings?.ads_body} />
        <AdsContainer htmlContent={settings?.ads_footer} />

      </div>

      {/* CSS Animasi Loading Tombol */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
