"use client";
import { useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ClientInteractionHandler({ video }) {

  useEffect(() => {
    if (!video?.video_id) return;

    // 1. UPDATE VIEW COUNT (Dengan Anti-Spam via SessionStorage)
    // Biar view nggak nambah terus pas user ngeklik tombol "Back" di FB
    const isViewed = sessionStorage.getItem(`viewed_${video.video_id}`);
    if (!isViewed) {
       supabase.from('videos').update({ hit_count: video.hit_count + 1 }).eq('video_id', video.video_id).then(() => {
           sessionStorage.setItem(`viewed_${video.video_id}`, 'true');
       });
    }

    // 2. CEGAH KLIK KANAN (Anti-Maling Video)
    const handleContextMenu = (e) => {
        const playerArea = document.querySelector(`[class*="playerAreaWrapper"]`);
        if (playerArea && playerArea.contains(e.target) && video.source_type === 'upload') {
            e.preventDefault();
        }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [video]);

  // Kita hapus overlay jebakannya. 
  // Sekarang kembalikan null agar video bisa langsung di-klik dan di-play!
  return null;
}
