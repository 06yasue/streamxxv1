"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient'; // Wajib import supabase buat ngambil link offer

export default function DownloadAdsHandler({ videoId, sourceType, className }) {
  const [offerLink, setOfferLink] = useState('');

  // Ambil link offer dari database settings secara diam-diam saat tombol dimuat
  useEffect(() => {
    async function getSettings() {
      const { data } = await supabase.from('settings').select('offer_link').eq('id', 1).single();
      if (data?.offer_link) setOfferLink(data.offer_link);
    }
    getSettings();
  }, []);

  const handleDownloadClick = (e) => {
    e.preventDefault();
    
    // 1. FINGERPRINT: Ambil identitas browser (User Agent) buat Token Keamanan
    const userAgent = navigator.userAgent;
    const timestamp = Date.now();
    
    // Gabungkan VideoID + Timestamp + UserAgent untuk keamanan ganda
    const rawToken = `${videoId}|${timestamp}|${userAgent}`;
    const secureToken = btoa(unescape(encodeURIComponent(rawToken))); // Encode aman
    const downloadUrl = `/download/${videoId}?token=${secureToken}`;

    // 2. BUKA LINK OFFER (Di Tab Baru)
    if (offerLink && offerLink !== '#') {
      window.open(offerLink, '_blank');
    }

    // 3. ARAHKAN KE HALAMAN DOWNLOAD (Di Tab Saat Ini)
    window.location.href = downloadUrl;
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
        padding: '16px 20px', 
        fontSize: '16px', 
        fontWeight: '800', 
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
