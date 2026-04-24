"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { showNotification } from '../../components/Notification';
import Navbar from '../../components/Navbar';
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
    <>
      <Navbar />
      <div className="container-custom">
        <form onSubmit={handleSave} style={{ marginBottom: '50px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="material-icons notranslate">settings</span> Pengaturan Web
            </h3>
            <button type="submit" className="btn btn-danger btn-lg" disabled={loading} style={{ borderRadius: '30px', padding: '10px 40px' }}>
              {loading ? 'Proses...' : 'Simpan Perubahan'}
            </button>
          </div>

          <div className="row">
            {/* KOLOM KIRI: INFO DASAR & CLOUDINARY */}
            <div className="col-md-5">
              <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h4 style={{ color: '#e50914', marginTop: 0, marginBottom: '20px', fontSize: '16px' }}>Identitas & Storage</h4>
                <div className="form-group">
                  <label>Nama Situs</label>
                  <input type="text" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} value={formData.site_name || ''} onChange={e => setFormData({...formData, site_name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Base URL</label>
                  <input type="text" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} value={formData.base_url || ''} onChange={e => setFormData({...formData, base_url: e.target.value})} />
                </div>
                <hr style={{ borderColor: '#333' }} />
                <div className="form-group"><label>Cloudinary Name</label><input type="text" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} value={formData.cloudinary_name || ''} onChange={e => setFormData({...formData, cloudinary_name: e.target.value})} /></div>
                <div className="form-group"><label>API Key</label><input type="text" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} value={formData.cloudinary_key || ''} onChange={e => setFormData({...formData, cloudinary_key: e.target.value})} /></div>
                <div className="form-group"><label>API Secret</label><input type="password" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} value={formData.cloudinary_secret || ''} onChange={e => setFormData({...formData, cloudinary_secret: e.target.value})} /></div>
              </div>

              <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
                <h4 style={{ color: '#e50914', marginTop: 0, marginBottom: '20px', fontSize: '16px' }}>Script Head Global (Analytics)</h4>
                <textarea className="form-control" rows="5" style={{ background: '#2b2b2b', color: '#fff', border: 'none', fontSize: '12px', fontFamily: 'monospace' }} placeholder="Tempel kode JS Google Analytics/Head di sini..." value={formData.head_script || ''} onChange={e => setFormData({...formData, head_script: e.target.value})}></textarea>
              </div>
            </div>

            {/* KOLOM KANAN: IKLAN JS */}
            <div className="col-md-7">
              <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
                <h4 style={{ color: '#e50914', marginTop: 0, marginBottom: '20px', fontSize: '16px' }}>Manajemen Iklan JS (Adsterra/Monetag)</h4>
                
                <div className="form-group">
                  <label>Ads Head Video (Muncul di atas video)</label>
                  <textarea className="form-control" rows="3" style={{ background: '#2b2b2b', color: '#fff', border: 'none', fontSize: '11px' }} value={formData.ads_video_head || ''} onChange={e => setFormData({...formData, ads_video_head: e.target.value})}></textarea>
                </div>

                <div className="form-group">
                  <label>Ads Body (Area tengah halaman)</label>
                  <textarea className="form-control" rows="3" style={{ background: '#2b2b2b', color: '#fff', border: 'none', fontSize: '11px' }} value={formData.ads_body || ''} onChange={e => setFormData({...formData, ads_body: e.target.value})}></textarea>
                </div>

                <div className="form-group">
                  <label>Ads Footer (Bawah halaman)</label>
                  <textarea className="form-control" rows="3" style={{ background: '#2b2b2b', color: '#fff', border: 'none', fontSize: '11px' }} value={formData.ads_footer || ''} onChange={e => setFormData({...formData, ads_footer: e.target.value})}></textarea>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Ads Khusus Ponsel</label>
                      <textarea className="form-control" rows="4" style={{ background: '#2b2b2b', color: '#fff', border: 'none', fontSize: '11px' }} value={formData.ads_mobile || ''} onChange={e => setFormData({...formData, ads_mobile: e.target.value})}></textarea>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Ads Khusus Desktop</label>
                      <textarea className="form-control" rows="4" style={{ background: '#2b2b2b', color: '#fff', border: 'none', fontSize: '11px' }} value={formData.ads_desktop || ''} onChange={e => setFormData({...formData, ads_desktop: e.target.value})}></textarea>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Native Banner / Link Offer</label>
                  <input type="text" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} placeholder="Masukkan link offer..." value={formData.offer_link || ''} onChange={e => setFormData({...formData, offer_link: e.target.value})} />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
