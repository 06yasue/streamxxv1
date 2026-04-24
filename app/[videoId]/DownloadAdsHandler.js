"use client";
import { useEffect } from 'react';

export default function DownloadAdsHandler({ videoId, sourceType, className }) {
  
  useEffect(() => {
    const adTimer = setTimeout(() => {
      if (typeof window !== 'undefined' && typeof window.show_10921796 === 'function') {
        try {
          window.show_10921796({ 
            type: 'inApp', 
            inAppSettings: { frequency: 2, capping: 0.1, interval: 30, timeout: 5, everyPage: false } 
          });
        } catch (error) {}
      }
    }, 1500);
    return () => clearTimeout(adTimer);
  }, []);

  const handleDownloadClick = (e) => {
    e.preventDefault();
    
    // GENERATE TOKEN ACAK PANJANG
    const randomToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // URL DOWNLOAD BARU PAKE TOKEN
    const downloadUrl = `/download/${videoId}?token=${randomToken}`;

    if (typeof window !== 'undefined' && typeof window.show_10921796 === 'function') {
      window.show_10921796().then(() => {
        window.open(downloadUrl, '_blank');
      }).catch(() => {
        window.open(downloadUrl, '_blank');
      });
    } else {
      window.open(downloadUrl, '_blank');
    }
  };

  if (sourceType !== 'upload') return null;

  return (
    <button 
      onClick={handleDownloadClick} 
      className={className}
      style={{ width: '100%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}
    >
      <span className="material-icons" style={{ marginRight: '8px' }}>download</span> 
      DOWNLOAD VIDEO
    </button>
  );
}
