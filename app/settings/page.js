"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { showNotification } from '../../components/Notification';
import Navbar from '../../components/Navbar';

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
    if (error) showNotification('Gagal menyimpan pengaturan!');
    else showNotification('Pengaturan Berhasil Diperbarui!');
  };

  return (
    <>
      <Navbar />
      <div className="container-custom" style={{ paddingBottom: '60px' }}>
        
        {/* Header Judul */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
          <h3 style={{ margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-icons notranslate" translate="no" style={{ color: '#e50914' }}>settings</span> 
            Pengaturan Web & Iklan
          </h3>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
            
            {/* BAGIAN KIRI */}
            <div style={{ flex: '1 1 300px' }}>
              <h4 style={{ color: '#e50914', fontWeight: 'bold', marginBottom: '15px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px' }}>dns</span> Identitas & Cloudinary
              </h4>
              
              <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '6px' }}>
                <div className="form-group">
                  <label style={{ color: '#888' }}>Nama Situs</label>
                  <input type="text" className="form-control" style={{ background: '#222', color: '#fff', height: '45px' }} value={formData.site_name || ''} onChange={e => setFormData({...formData, site_name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label style={{ color: '#888' }}>Base URL</label>
                  <input type="url" className="form-control" style={{ background: '#222', color: '#fff', height: '45px' }} value={formData.base_url || ''} onChange={e => setFormData({...formData, base_url: e.target.value})} />
                </div>
                <div className="form-group">
                  <label style={{ color: '#888' }}>Cloud Name</label>
                  <input type="text" className="form-control" style={{ background: '#222', color: '#fff', height: '45px' }} value={formData.cloudinary_name || ''} onChange={e => setFormData({...formData, cloudinary_name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label style={{ color: '#888' }}>API Key</label>
                  <input type="text" className="form-control" style={{ background: '#222', color: '#fff', height: '45px' }} value={formData.cloudinary_key || ''} onChange={e => setFormData({...formData, cloudinary_key: e.target.value})} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: '#888' }}>API Secret</label>
                  <input type="password" className="form-control" style={{ background: '#222', color: '#fff', height: '45px' }} value={formData.cloudinary_secret || ''} onChange={e => setFormData({...formData, cloudinary_secret: e.target.value})} />
                </div>
              </div>

              <h4 style={{ color: '#1db954', fontWeight: 'bold', marginTop: '35px', marginBottom: '15px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px' }}>code</span> Script Head Global
              </h4>
              <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '6px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: '#888' }}>Kode JS / Google Analytics</label>
                  <textarea className="form-control" style={{ background: '#222', color: '#1db954', minHeight: '120px', resize: 'vertical', fontFamily: 'monospace', fontSize: '13px' }} placeholder="<script>...</script>" value={formData.head_script || ''} onChange={e => setFormData({...formData, head_script: e.target.value})}></textarea>
                </div>
              </div>
            </div>

            {/* BAGIAN KANAN */}
            <div style={{ flex: '1 1 300px' }}>
              <h4 style={{ color: '#0288d1', fontWeight: 'bold', marginBottom: '15px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px' }}>monetization_on</span> Manajemen Iklan JS
              </h4>

              <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '6px' }}>
                <div className="form-group">
                  <label style={{ color: '#888' }}>Ads Head Video (Atas Player)</label>
                  <textarea className="form-control" style={{ background: '#222', color: '#ffeb3b', minHeight: '80px', resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }} value={formData.ads_video_head || ''} onChange={e => setFormData({...formData, ads_video_head: e.target.value})}></textarea>
                </div>

                <div className="form-group">
                  <label style={{ color: '#888' }}>Ads Body / Native Banner</label>
                  <textarea className="form-control" style={{ background: '#222', color: '#ffeb3b', minHeight: '80px', resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }} value={formData.ads_body || ''} onChange={e => setFormData({...formData, ads_body: e.target.value})}></textarea>
                </div>

                <div className="form-group">
                  <label style={{ color: '#888' }}>Ads Footer (Paling Bawah)</label>
                  <textarea className="form-control" style={{ background: '#222', color: '#ffeb3b', minHeight: '80px', resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }} value={formData.ads_footer || ''} onChange={e => setFormData({...formData, ads_footer: e.target.value})}></textarea>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ color: '#888' }}>Mobile Only Ads</label>
                    <textarea className="form-control" style={{ background: '#222', color: '#ffeb3b', minHeight: '80px', resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }} value={formData.ads_mobile || ''} onChange={e => setFormData({...formData, ads_mobile: e.target.value})}></textarea>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ color: '#888' }}>Desktop Only Ads</label>
                    <textarea className="form-control" style={{ background: '#222', color: '#ffeb3b', minHeight: '80px', resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }} value={formData.ads_desktop || ''} onChange={e => setFormData({...formData, ads_desktop: e.target.value})}></textarea>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '10px', marginBottom: 0 }}>
                  <label style={{ color: '#888' }}>Link Offer (Penawaran)</label>
                  <input type="url" className="form-control" style={{ background: '#222', color: '#fff', height: '45px' }} placeholder="https://..." value={formData.offer_link || ''} onChange={e => setFormData({...formData, offer_link: e.target.value})} />
                </div>
              </div>
            </div>

          </div>

          <button type="submit" className="btn btn-danger btn-block btn-lg" disabled={loading} style={{ marginTop: '35px', fontWeight: 'bold', height: '55px', fontSize: '16px', letterSpacing: '1px' }}>
            {loading ? 'MENYIMPAN...' : 'SIMPAN SEMUA PENGATURAN'}
          </button>
          
        </form>
      </div>
    </>
  );
}
