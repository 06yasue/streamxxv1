"use client";
import { useEffect } from 'react';

export default function DownloadAdsHandler({ videoId, sourceType, className }) {
  
  useEffect(() => {
    const adTimer = setTimeout(() => {
      if (typeof window !== 'undefined' && typeof window.show_10921796 === 'function') {
        try {
          window.show_10921796({ type: 'inApp', inAppSettings: { frequency: 2, capping: 0.1, interval: 30, timeout: 5, everyPage: false } });
        } catch (error) {}
      }
    }, 1500);
    return () => clearTimeout(adTimer);
  }, []);

  const handleDownloadClick = (e) => {
    e.preventDefault();
    
    // FINGERPRINT: Ambil identitas browser (User Agent)
    const userAgent = navigator.userAgent;
    const timestamp = Date.now();
    
    // Gabungkan VideoID + Timestamp + UserAgent untuk keamanan ganda
    const rawToken = `${videoId}|${timestamp}|${userAgent}`;
    const secureToken = btoa(unescape(encodeURIComponent(rawToken))); // Encode aman
    
    const downloadUrl = `/download/${videoId}?token=${secureToken}`;

    if (typeof window !== 'undefined' && typeof window.show_10921796 === 'function') {
      window.show_10921796()
        .then(() => {
          window.location.href = downloadUrl; 
        })
        .catch(() => {
          window.location.href = downloadUrl;
        });
    } else {
      window.location.href = downloadUrl;
    }
  };

  if (sourceType !== 'upload') return null;

  return (
    <button 
      onClick={handleDownloadClick} 
      className={className}
      style={{ 
        width: '100%', 
        background: 'linear-gradient(135deg, #1db954 0%, #158a3e 100%)', // Gradasi hijau premium
        color: '#ffffff', 
        border: 'none', 
        padding: '16px 20px', // Dibikin lebih tebal biar enak di-tap
        fontSize: '16px', 
        fontWeight: '800', // Font ditebelin maksimal
        letterSpacing: '1px',
        borderRadius: '8px', 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginTop: '20px',
        boxShadow: '0 6px 20px rgba(29, 185, 84, 0.4)', // Bayangan hijau glowing
        transition: 'all 0.3s ease'
      }}
    >
      <span className="material-icons" style={{ marginRight: '10px', fontSize: '24px' }}>cloud_download</span> 
      DOWNLOAD FULL VIDEO
    </button>
  );
}

