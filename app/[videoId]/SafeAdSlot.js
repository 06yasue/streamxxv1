"use client";
import { useEffect, useRef } from 'react';

export default function SafeAdSlot({ htmlContent, className }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!htmlContent || !containerRef.current) return;

    // 1. Masukkan raw HTML/JS ke dalam container
    containerRef.current.innerHTML = htmlContent;

    // 2. Ambil semua tag <script> yang biasanya dimatikan otomatis oleh React
    const scripts = containerRef.current.querySelectorAll('script');
    
    // 3. Hidupkan ulang scriptnya satu per satu agar browser mau mengeksekusinya
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      
      // Copy semua atribut (src, type, dll)
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      // Copy isi script (inline config JS)
      if (oldScript.innerHTML) {
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      }
      
      // Ganti script lama dengan script baru yang aktif
      if (oldScript.parentNode) {
        oldScript.parentNode.replaceChild(newScript, oldScript);
      }
    });
  }, [htmlContent]);

  if (!htmlContent) return null;

  return (
    <div 
      ref={containerRef} 
      className={className} 
      style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} 
    />
  );
}
