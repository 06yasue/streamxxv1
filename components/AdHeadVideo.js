"use client";
import { useEffect, useRef } from 'react';

export default function AdHeadVideo() {
  const adContainerRef = useRef(null);

  useEffect(() => {
    // Biar scriptnya nggak di-load dobel pas user bolak-balik halaman
    if (adContainerRef.current && adContainerRef.current.children.length === 0) {
      
      // --- SCRIPT 1 (tag.min.js | Zone: 234041) ---
      const script1 = document.createElement('script');
      script1.src = "https://quge5.com/88/tag.min.js";
      script1.dataset.zone = "234041";
      script1.async = true;
      script1.setAttribute('data-cfasync', 'false');
      adContainerRef.current.appendChild(script1);

      // --- SCRIPT 2 (vignette.min.js | Zone: 9450768) ---
      // Kode ribet Monetag kita ubah jadi susunan rapi
      const script2 = document.createElement('script');
      script2.dataset.zone = "9450768";
      script2.src = "https://n6wxm.com/vignette.min.js";
      adContainerRef.current.appendChild(script2);

      // --- SCRIPT 3 (tag.min.js | Zone: 9333277) ---
      const script3 = document.createElement('script');
      script3.dataset.zone = "9333277";
      script3.src = "https://al5sm.com/tag.min.js";
      adContainerRef.current.appendChild(script3);
    }
  }, []);

  return (
    <div style={{ width: '100%', textAlign: 'center', marginBottom: '15px' }}>
      {/* Tiga script Monetag lu bakal disuntik dengan aman ke dalam div ini */}
      <div ref={adContainerRef}></div>
    </div>
  );
}
