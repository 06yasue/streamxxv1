"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { showNotification } from '../../components/Notification';
import Link from 'next/link';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    site_name: '', base_url: '', cloudinary_name: '', cloudinary_key: '', cloudinary_secret: '',
    head_script: '', ads_video_head: '', ads_body: '', ads_footer: '', ads_native: '',
    ads_mobile: '', ads_desktop: '', offer_link: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (data) setFormData(data);
    }
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('settings').update(formData).eq('id', 1);
    setLoading(false);
    if (error) showNotification('Gagal menyimpan!');
    else showNotification('Pengaturan Berhasil Diperbarui!');
  };

  return (
    <div className="container-custom" style={{ marginTop: '20px', paddingBottom: '60px' }}>
      
      {/* Tombol Kembali (Ganti Navbar biar lebih fokus dan lega) */}
      <Link href="/list">
        <button className="btn btn-default" style={{ marginBottom: '20px', background: '#222', color: '#fff', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '8px 15px', borderRadius: '4px' }}>
          <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px' }}>arrow_back</span> Kembali
        </button>
      </Link>

      <form onSubmit={handleSave}>
        
        {/* Header Form */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
          <h3 style={{ margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-icons notranslate" translate="no" style={{ color: '#e50914' }}>admin_panel_settings</span> Pengaturan Web
          </h3>
          <button type="submit" className="btn btn-danger btn-lg" disabled={loading} style={{ padding: '10px 30px', fontWeight: 'bold' }}>
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>

        {/* Layout Baru Anti-Geser (Gak Pake .row Bootstrap) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
          
          {/* BAGIAN KIRI */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            {/* Box Identitas */}
            <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '6px', borderTop: '4px solid #e50914' }}>
              <h4 style={{ marginTop: 0, marginBottom: '20px', fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>Identitas & Cloudinary</h4>
              <div className="form-group">
                <label style={{ color: '#aaa' }}>Nama Situs</label>
                <input type="text" className="form-control" style={{ background: '#000', color: '#fff', border: '1px solid #333' }} value={formData.site_name || ''} onChange={e => setFormData({...formData, site_name: e.target.value})} />
              </div>
              <div className="form-group">
                <label style={{ color: '#aaa' }}>Base URL</label>
                <input type="text" className="form-control" style={{ background: '#000', color: '#fff', border: '1px solid #333' }} value={formData.base_url || ''} onChange={e => setFormData({...formData, base_url: e.target.value})} />
              </div>
              <hr style={{ borderColor: '#333', margin: '20px 0' }} />
              <div className="form-group"><label style={{ color: '#aaa' }}>Cloud Name</label><input type="text" className="form-control" style={{ background: '#000', color: '#fff', border: '1px solid #333' }} value={formData.cloudinary_name || ''} onChange={e => setFormData({...formData, cloudinary_name: e.target.value})} /></div>
              <div className="form-group"><label style={{ color: '#aaa' }}>API Key</label><input type="text" className="form-control" style={{ background: '#000', color: '#fff', border: '1px solid #333' }} value={formData.cloudinary_key || ''} onChange={e => setFormData({...formData, cloudinary_key: e.target.value})} /></div>
              <div className="form-group"><label style={{ color: '#aaa' }}>API Secret</label><input type="password" className="form-control" style={{ background: '#000', color: '#fff', border: '1px solid #333' }} value={formData.cloudinary_secret || ''} onChange={e => setFormData({...formData, cloudinary_secret: e.target.value})} /></div>
            </div>

            {/* Box Script Global */}
            <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '6px', borderTop: '4px solid #1db954' }}>
              <h4 style={{ marginTop: 0, marginBottom: '20px', fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>Script Head Global (Analytics)</h4>
              <textarea className="form-control" rows="6" style={{ background: '#000', color: '#1db954', border: '1px solid #333', fontSize: '13px', fontFamily: 'monospace' }} placeholder="<script>...</script>" value={formData.head_script || ''} onChange={e => setFormData({...formData, head_script: e.target.value})}></textarea>
              <p style={{ fontSize: '12px', color: '#888', marginTop: '10px', marginBottom: 0 }}>*Kode JS di sini akan aktif di seluruh halaman web.</p>
            </div>
          </div>

          {/* BAGIAN KANAN (Iklan) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '6px', borderTop: '4px solid #0288d1' }}>
              <h4 style={{ marginTop: 0, marginBottom: '20px', fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>Manajemen Iklan JS (Adsterra/Monetag)</h4>
              
              <div className="form-group">
                <label style={{ color: '#aaa' }}>Ads Head Video (Muncul di atas player)</label>
                <textarea className="form-control" rows="3" style={{ background: '#000', color: '#ffeb3b', border: '1px solid #333', fontSize: '12px', fontFamily: 'monospace' }} value={formData.ads_video_head || ''} onChange={e => setFormData({...formData, ads_video_head: e.target.value})}></textarea>
              </div>

              <div className="form-group">
                <label style={{ color: '#aaa' }}>Ads Body (Di bawah detail video)</label>
                <textarea className="form-control" rows="3" style={{ background: '#000', color: '#ffeb3b', border: '1px solid #333', fontSize: '12px', fontFamily: 'monospace' }} value={formData.ads_body || ''} onChange={e => setFormData({...formData, ads_body: e.target.value})}></textarea>
              </div>

              <div className="form-group">
                <label style={{ color: '#aaa' }}>Ads Footer (Paling bawah halaman)</label>
                <textarea className="form-control" rows="3" style={{ background: '#000', color: '#ffeb3b', border: '1px solid #333', fontSize: '12px', fontFamily: 'monospace' }} value={formData.ads_footer || ''} onChange={e => setFormData({...formData, ads_footer: e.target.value})}></textarea>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: '#aaa' }}>Mobile Only Ads</label>
                  <textarea className="form-control" rows="4" style={{ background: '#000', color: '#ffeb3b', border: '1px solid #333', fontSize: '12px', fontFamily: 'monospace' }} value={formData.ads_mobile || ''} onChange={e => setFormData({...formData, ads_mobile: e.target.value})}></textarea>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: '#aaa' }}>Desktop Only Ads</label>
                  <textarea className="form-control" rows="4" style={{ background: '#000', color: '#ffeb3b', border: '1px solid #333', fontSize: '12px', fontFamily: 'monospace' }} value={formData.ads_desktop || ''} onChange={e => setFormData({...formData, ads_desktop: e.target.value})}></textarea>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '15px', marginBottom: 0 }}>
                <label style={{ color: '#aaa' }}>Native Banner / Link Offer</label>
                <input type="text" className="form-control" style={{ background: '#000', color: '#fff', border: '1px solid #333' }} placeholder="https://..." value={formData.offer_link || ''} onChange={e => setFormData({...formData, offer_link: e.target.value})} />
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
