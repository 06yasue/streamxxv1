"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ClientInteractionHandler({ video, settings }) {
  const [hasClickedOffer, setHasClickedOffer] = useState(false);

  useEffect(() => {
    // 1. Update view count saat halaman dimuat
    if (video?.video_id) {
       supabase.from('videos').update({ hit_count: video.hit_count + 1 }).eq('video_id', video.video_id).then(() => {});
    }

    // 2. Cegah klik kanan global di area video
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
      window.open(settings.offer_link, '_blank');
      setHasClickedOffer(true); // Overlay hilang setelah klik pertama
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
