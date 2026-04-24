"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { showNotification } from '../../components/Notification';
import Navbar from '../../components/Navbar';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    site_name: '', site_title: '', site_description: '', base_url: '', 
    cloudinary_name: '', cloudinary_key: '', cloudinary_secret: '',
    site_logo_url: '', og_image_url: '',
    head_script: '', ads_video_head: '', ads_body: '', ads_footer: '', 
    ads_mobile: '', ads_desktop: '', offer_link: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [uploadingText, setUploadingText] = useState('');

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (data) setFormData(data);
    }
    loadSettings();
  }, []);

  // FUNGSI UPLOAD GAMBAR KE CLOUDINARY (Buat Logo & OG Image)
  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!formData.cloudinary_name) {
      return showNotification('Isi dan simpan Cloud Name dulu!');
    }

    setUploadingText(`Mengunggah ${fieldName}...`);
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'videoku_preset'); // Pastikan preset ini udah Unsigned di Cloudinary

      const res = await fetch(`https://api.cloudinary.com/v1_1/${formData.cloudinary_name}/image/upload`, {
        method: 'POST',
        body: data
      });
      const cloudRes = await res.json();
      
      if (cloudRes.secure_url) {
        setFormData({ ...formData, [fieldName]: cloudRes.secure_url });
        showNotification('Gambar berhasil diunggah! Jangan lupa klik Simpan.');
      } else {
        throw new Error('Gagal upload gambar');
      }
    } catch (err) {
      showNotification('Error: ' + err.message);
    } finally {
      setUploadingText('');
    }
  };

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
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
          <h3 style={{ margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-icons notranslate" translate="no" style={{ color: '#e50914' }}>settings</span> 
            Pengaturan Web, SEO & Iklan
          </h3>
          {uploadingText && <span style={{ color: '#1db954', fontWeight: 'bold' }}>{uploadingText}</span>}
        </div>

        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
            
            {/* BAGIAN KIRI: SEO, IDENTITAS & CLOUDINARY */}
            <div style={{ flex: '1 1 300px' }}>
              
              {/* BOX IDENTITAS & SEO */}
              <h4 style={{ color: '#e50914', fontWeight: 'bold', marginBottom: '15px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px' }}>travel_explore</span> Identitas & SEO
              </h4>
              <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '6px' }}>
                <div className="form-group">
                  <label style={{ color: '#888' }}>Nama Situs Pendek (Merek)</label>
                  <input type="text" className="form-control" style={{ background: '#222', color: '#fff' }} value={formData.site_name || ''} onChange={e => setFormData({...formData, site_name: e.target.value})} placeholder="Contoh: VideoKu" />
                </div>
                <div className="form-group">
                  <label style={{ color: '#888' }}>Judul SEO (Digabung dengan nama situs)</label>
                  <input type="text" className="form-control" style={{ background: '#222', color: '#fff' }} value={formData.site_title || ''} onChange={e => setFormData({...formData, site_title: e.target.value})} placeholder="Contoh: Nonton Video Viral Terbaru" />
                </div>
                <div className="form-group">
                  <label style={{ color: '#888' }}>Deskripsi Web (Meta Description)</label>
                  <textarea className="form-control" style={{ background: '#222', color: '#fff', minHeight: '60px', resize: 'vertical' }} value={formData.site_description || ''} onChange={e => setFormData({...formData, site_description: e.target.value})} placeholder="Situs terbaik untuk..."></textarea>
                </div>
                <div className="form-group">
                  <label style={{ color: '#888' }}>Base URL (Canonical)</label>
                  <input type="url" className="form-control" style={{ background: '#222', color: '#fff' }} value={formData.base_url || ''} onChange={e => setFormData({...formData, base_url: e.target.value})} placeholder="https://..." />
                </div>

                <hr style={{ borderColor: '#333' }} />

                <div className="form-group">
                  <label style={{ color: '#888' }}>Logo Situs / Favicon (Otomatis ke Cloudinary)</label>
                  <input type="file" accept="image/*" className="form-control" style={{ background: '#222', color: '#fff', padding: '5px' }} onChange={(e) => handleImageUpload(e, 'site_logo_url')} />
                  {formData.site_logo_url && <img src={formData.site_logo_url} alt="Logo" style={{ height: '30px', marginTop: '10px' }} />}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: '#888' }}>Gambar Meta Thumbnail (OG Image)</label>
                  <input type="file" accept="image/*" className="form-control" style={{ background: '#222', color: '#fff', padding: '5px' }} onChange={(e) => handleImageUpload(e, 'og_image_url')} />
                  {formData.og_image_url && <img src={formData.og_image_url} alt="OG" style={{ height: '60px', marginTop: '10px', borderRadius: '4px' }} />}
                </div>
              </div>

              {/* BOX CLOUDINARY */}
              <h4 style={{ color: '#1db954', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px' }}>cloud</span> Kunci API Cloudinary
              </h4>
              <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '6px' }}>
                <div className="form-group"><label style={{ color: '#888' }}>Cloud Name</label><input type="text" className="form-control" style={{ background: '#222', color: '#fff' }} value={formData.cloudinary_name || ''} onChange={e => setFormData({...formData, cloudinary_name: e.target.value})} /></div>
                <div className="form-group"><label style={{ color: '#888' }}>API Key</label><input type="text" className="form-control" style={{ background: '#222', color: '#fff' }} value={formData.cloudinary_key || ''} onChange={e => setFormData({...formData, cloudinary_key: e.target.value})} /></div>
                <div className="form-group" style={{ marginBottom: 0 }}><label style={{ color: '#888' }}>API Secret</label><input type="password" className="form-control" style={{ background: '#222', color: '#fff' }} value={formData.cloudinary_secret || ''} onChange={e => setFormData({...formData, cloudinary_secret: e.target.value})} /></div>
              </div>

            </div>

            {/* BAGIAN KANAN: SCRIPT & IKLAN */}
            <div style={{ flex: '1 1 300px' }}>
              
              {/* BOX SCRIPT HEAD */}
              <h4 style={{ color: '#0288d1', fontWeight: 'bold', marginBottom: '15px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px' }}>code</span> Script Head Global
              </h4>
              <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '6px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <textarea className="form-control" style={{ background: '#222', color: '#0288d1', minHeight: '80px', resize: 'vertical', fontFamily: 'monospace', fontSize: '13px' }} placeholder="<script>...</script>" value={formData.head_script || ''} onChange={e => setFormData({...formData, head_script: e.target.value})}></textarea>
                </div>
              </div>

              {/* BOX IKLAN */}
              <h4 style={{ color: '#ffeb3b', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px' }}>monetization_on</span> Manajemen Iklan JS
              </h4>
              <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '6px' }}>
                <div className="form-group">
                  <label style={{ color: '#888' }}>Ads Head Video (Atas Player)</label>
                  <textarea className="form-control" style={{ background: '#222', color: '#ffeb3b', minHeight: '60px', resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }} value={formData.ads_video_head || ''} onChange={e => setFormData({...formData, ads_video_head: e.target.value})}></textarea>
                </div>
                <div className="form-group">
                  <label style={{ color: '#888' }}>Ads Body / Native Banner</label>
                  <textarea className="form-control" style={{ background: '#222', color: '#ffeb3b', minHeight: '60px', resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }} value={formData.ads_body || ''} onChange={e => setFormData({...formData, ads_body: e.target.value})}></textarea>
                </div>
                <div className="form-group">
                  <label style={{ color: '#888' }}>Ads Footer (Paling Bawah)</label>
                  <textarea className="form-control" style={{ background: '#222', color: '#ffeb3b', minHeight: '60px', resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }} value={formData.ads_footer || ''} onChange={e => setFormData({...formData, ads_footer: e.target.value})}></textarea>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ color: '#888' }}>Mobile Only Ads</label>
                    <textarea className="form-control" style={{ background: '#222', color: '#ffeb3b', minHeight: '60px', resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }} value={formData.ads_mobile || ''} onChange={e => setFormData({...formData, ads_mobile: e.target.value})}></textarea>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ color: '#888' }}>Desktop Only Ads</label>
                    <textarea className="form-control" style={{ background: '#222', color: '#ffeb3b', minHeight: '60px', resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }} value={formData.ads_desktop || ''} onChange={e => setFormData({...formData, ads_desktop: e.target.value})}></textarea>
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '10px', marginBottom: 0 }}>
                  <label style={{ color: '#888' }}>Link Offer (Penawaran Video)</label>
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
