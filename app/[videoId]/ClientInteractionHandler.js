"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ClientInteractionHandler({ video, settings }) {
  const [hasClickedOffer, setHasClickedOffer] = useState(false);

  useEffect(() => {
    if (!video?.video_id) return;

    // 1. CEK MEMORI BROWSER (Solusi Anti-Looping FB Browser)
    // Kalau browser inget user udah klik offer di video ini, langsung hilangkan overlay
    const isOfferClicked = sessionStorage.getItem(`offer_clicked_${video.video_id}`);
    if (isOfferClicked) {
      setHasClickedOffer(true);
    }

    // 2. UPDATE VIEW COUNT (Dengan Anti-Spam)
    // Biar view nggak nambah terus pas user ngeklik tombol "Back" di FB
    const isViewed = sessionStorage.getItem(`viewed_${video.video_id}`);
    if (!isViewed) {
       supabase.from('videos').update({ hit_count: video.hit_count + 1 }).eq('video_id', video.video_id).then(() => {
           sessionStorage.setItem(`viewed_${video.video_id}`, 'true');
       });
    }

    // 3. CEGAH KLIK KANAN (Anti-Maling Video)
    const handleContextMenu = (e) => {
        const playerArea = document.querySelector(`[class*="playerAreaWrapper"]`);
        if (playerArea && playerArea.contains(e.target) && video.source_type === 'upload') {
            e.preventDefault();
        }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [video]);

  // Fungsi buka link offer
  const handlePlayerOverlayClick = () => {
    if (!hasClickedOffer && settings?.offer_link) {
      
      // KUNCI UTAMA: Simpan catatan ke browser FB SEBELUM halamannya pindah!
      sessionStorage.setItem(`offer_clicked_${video.video_id}`, 'true');
      setHasClickedOffer(true); // Overlay langsung hilang
      
      // Eksekusi buka iklan
      window.open(settings.offer_link, '_blank');
    }
  };

  // Overlay transparan jebakan Iklan
  return (
    <>
        {!hasClickedOffer && (
            <div 
                onClick={handlePlayerOverlayClick}
                style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    zIndex: 10, cursor: 'pointer', background: 'rgba(0,0,0,0)'
                }}
            />
        )}
    </>
  );
}
