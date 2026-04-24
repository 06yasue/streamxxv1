"use client";
import { useEffect } from 'react';

export default function DownloadAdsHandler({ videoId, sourceType, className }) {
  
  // In-App Interstitial Otomatis
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
    
    // GENERATE TOKEN SUPER AMAN (VideoID + Waktu Saat Ini di-enkripsi Base64)
    const timestamp = Date.now();
    const rawToken = `${videoId}_${timestamp}`;
    const secureToken = btoa(rawToken); // Enkripsi jadi huruf acak
    
    const downloadUrl = `/download/${videoId}?token=${secureToken}`;

    // TRIK ANTI POP-UP BLOCKER: Buka tab kosong duluan sebelum iklan jalan!
    const newTab = window.open('about:blank', '_blank');

    if (typeof window !== 'undefined' && typeof window.show_10921796 === 'function') {
      // Jalanin Iklan Rewarded Monetag
      window.show_10921796()
        .then(() => {
          newTab.location.href = downloadUrl; // Kalau beres nonton, arahin tab kosong tadi ke link download
        })
        .catch(() => {
          newTab.location.href = downloadUrl; // Kalau iklan error, tetep kasih jalan
        });
    } else {
      newTab.location.href = downloadUrl;
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
