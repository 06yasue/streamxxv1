"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [siteName, setSiteName] = useState('WebVideoKu');

  useEffect(() => {
    async function getSettings() {
      const { data } = await supabase.from('settings').select('site_name').eq('id', 1).single();
      if (data && data.site_name) setSiteName(data.site_name);
    }
    getSettings();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#0a0a0a', padding: '20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        
        {/* Ikon Besar Pengganti Logo */}
        <span className="material-icons notranslate" translate="no" style={{ fontSize: '80px', color: '#e50914', marginBottom: '15px' }}>
          movie_filter
        </span>
        
        {/* Judul Dinamis */}
        <h1 style={{ fontWeight: 'bold', color: '#fff', margin: '0 0 15px 0', fontSize: '42px', letterSpacing: '1px' }}>
          {siteName}
        </h1>
        
        {/* Deskripsi */}
        <p style={{ color: '#aaa', fontSize: '16px', lineHeight: '1.6', marginBottom: '40px' }}>
          Platform penyimpanan dan manajemen video pribadimu. Upload cepat, embed mudah, dan kelola semua koleksi dalam satu dashboard yang bersih.
        </p>
        
        {/* Tombol Navigasi Tengah */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <Link href="/list">
            <button className="btn btn-danger btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 30px', fontSize: '16px', borderRadius: '30px', boxShadow: '0 4px 15px rgba(229, 9, 20, 0.4)' }}>
              <span className="material-icons notranslate" translate="no" style={{ fontSize: '20px' }}>view_list</span> Buka Dashboard
            </button>
          </Link>
          <Link href="/upload">
            <button className="btn btn-default btn-lg" style={{ background: '#2b2b2b', color: '#fff', border: '1px solid #444', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 30px', fontSize: '16px', borderRadius: '30px', transition: '0.3s' }}>
              <span className="material-icons notranslate" translate="no" style={{ fontSize: '20px' }}>cloud_upload</span> Upload Baru
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
