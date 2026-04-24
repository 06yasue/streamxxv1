"use client";
import { useEffect } from 'react';

export default function DownloadAdsHandler({ videoId, sourceType, className }) {
  
  // 1. IKLAN IN-APP INTERSTITIAL (Otomatis Muncul Pas Buka Video)
  useEffect(() => {
    const adTimer = setTimeout(() => {
      if (typeof window !== 'undefined' && typeof window.show_10921796 === 'function') {
        try {
          window.show_10921796({ 
            type: 'inApp', 
            inAppSettings: { frequency: 2, capping: 0.1, interval: 30, timeout: 5, everyPage: false } 
          });
        } catch (error) {
          console.error("Gagal load In-App Interstitial:", error);
        }
      }
    }, 1500); // Kasih jeda 1.5 detik biar mulus

    return () => clearTimeout(adTimer);
  }, []);

  // 2. IKLAN REWARDED INTERSTITIAL (Pas Tombol Download Diklik)
  const handleDownloadClick = (e) => {
    e.preventDefault(); // Tahan dulu biar gak langsung pindah halaman
    const downloadUrl = `/download/${videoId}`;

    // Cek apakah script Monetag udah siap
    if (typeof window !== 'undefined' && typeof window.show_10921796 === 'function') {
      
      // Tembak Iklan Rewarded
      window.show_10921796().then(() => {
        // JIKA SUKSES NONTON IKLAN: Buka link download di Tab Baru
        window.open(downloadUrl, '_blank');
      }).catch((err) => {
        // JIKA IKLAN ERROR/GAGAL LOAD: Tetep kasih download biar user gak ngamuk
        window.open(downloadUrl, '_blank');
      });

    } else {
      // JIKA KENA ADBLOCKER: Langsung kasih download aja
      window.open(downloadUrl, '_blank');
    }
  };

  // Sembunyikan tombol kalau tipe video bukan "upload" (misal: embed YouTube/link luar)
  if (sourceType !== 'upload') return null;

  return (
    <button 
      onClick={handleDownloadClick} 
      className={className}
      style={{ 
        width: '100%', 
        border: 'none', 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginTop: '15px' // Biar jaraknya pas
      }}
    >
      <span className="material-icons" style={{ marginRight: '8px' }}>download</span> 
      DOWNLOAD VIDEO
    </button>
  );
}
