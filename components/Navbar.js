"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Navbar() {
  const [siteName, setSiteName] = useState('WebVideoKu');
  const [isOpen, setIsOpen] = useState(false); // Untuk menu klik di HP

  useEffect(() => {
    async function getSettings() {
      const { data } = await supabase.from('settings').select('site_name').eq('id', 1).single();
      if (data && data.site_name) setSiteName(data.site_name);
    }
    getSettings();
  }, []);

  return (
    <nav className="navbar navbar-inverse" style={{ borderRadius: 0, marginBottom: '20px', border: 'none', background: '#1a1a1a' }}>
      <div className="container-custom">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle" onClick={() => setIsOpen(!isOpen)} style={{ border: 'none' }}>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <Link href="/" className="navbar-brand" style={{ color: '#e50914', fontWeight: 'bold', fontSize: '22px' }}>
            🎬 {siteName}
          </Link>
        </div>
        <div className={`collapse navbar-collapse ${isOpen ? 'in' : ''}`}>
          <ul className="nav navbar-nav navbar-right">
            <li><Link href="/" style={{ color: '#ccc' }}>Beranda</Link></li>
            <li><Link href="/list" style={{ color: '#ccc' }}>List Video</Link></li>
            <li><Link href="/upload" style={{ color: '#ccc' }}>Upload</Link></li>
            <li><Link href="/settings" style={{ color: '#ccc' }}>Setting</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
