"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Navbar() {
  const [siteName, setSiteName] = useState('WebVideoKu');
  const [logoUrl, setLogoUrl] = useState(null); // Tambahan state buat nampung URL logo
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function getSettings() {
      // Panggil juga site_logo_url dari database
      const { data } = await supabase.from('settings').select('site_name, site_logo_url').eq('id', 1).single();
      if (data) {
        if (data.site_name) setSiteName(data.site_name);
        if (data.site_logo_url) setLogoUrl(data.site_logo_url);
      }
    }
    getSettings();
  }, []);

  // Tutup menu otomatis setelah di-klik (Biar mulus di HP)
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar navbar-inverse" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
      <div className="container-custom">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle" onClick={() => setIsOpen(!isOpen)} style={{ border: 'none' }}>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          
          <Link href="/" onClick={closeMenu} className="navbar-brand" style={{ color: '#e50914', fontWeight: '800', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px', padding: logoUrl ? '10px 15px' : '15px' }}>
            {/* LOGIKA LOGO: Jika ada gambar, tampilkan gambar. Jika tidak, tampilkan teks fallback. */}
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} style={{ maxHeight: '30px', width: 'auto', objectFit: 'contain' }} />
            ) : (
              <>
                <span className="material-icons notranslate" translate="no">movie</span> {siteName}
              </>
            )}
          </Link>
          
        </div>
        <div className={`collapse navbar-collapse ${isOpen ? 'in' : ''}`}>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <Link href="/" onClick={closeMenu} style={{ color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px' }}>home</span> Beranda
              </Link>
            </li>
            <li>
              <Link href="/list" onClick={closeMenu} style={{ color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px' }}>view_list</span> List Video
              </Link>
            </li>
            <li>
              <Link href="/upload" onClick={closeMenu} style={{ color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px' }}>cloud_upload</span> Upload
              </Link>
            </li>
            <li>
              <Link href="/settings" onClick={closeMenu} style={{ color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px' }}>settings</span> Setting
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
