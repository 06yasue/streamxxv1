"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { showNotification } from '../../components/Notification';
import Link from 'next/link';

export default function SettingsPage() {
  const [formData, setFormData] = useState({ site_name: '', base_url: '', cloudinary_name: '', cloudinary_key: '', cloudinary_secret: '' });
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
    error ? showNotification('Gagal menyimpan pengaturan.') : showNotification('Pengaturan tersimpan!');
  };

  return (
    <div className="container-custom" style={{ marginTop: '30px' }}>
      <Link href="/"><button className="btn btn-default" style={{ marginBottom: '20px', background: '#333', color: '#fff', border: 'none' }}>&larr; Kembali</button></Link>
      <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '4px' }}>
        <h3>Pengaturan Sistem</h3>
        <form onSubmit={handleSave}>
          <div className="form-group"><label>Nama Situs</label><input type="text" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} value={formData.site_name || ''} onChange={e => setFormData({...formData, site_name: e.target.value})} /></div>
          <div className="form-group"><label>Base URL</label><input type="text" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} value={formData.base_url || ''} onChange={e => setFormData({...formData, base_url: e.target.value})} /></div>
          <h4 style={{ color: '#ccc' }}>Kunci Cloudinary</h4>
          <div className="form-group"><label>Cloud Name</label><input type="text" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} value={formData.cloudinary_name || ''} onChange={e => setFormData({...formData, cloudinary_name: e.target.value})} /></div>
          <div className="form-group"><label>API Key</label><input type="text" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} value={formData.cloudinary_key || ''} onChange={e => setFormData({...formData, cloudinary_key: e.target.value})} /></div>
          <div className="form-group"><label>API Secret</label><input type="password" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} value={formData.cloudinary_secret || ''} onChange={e => setFormData({...formData, cloudinary_secret: e.target.value})} /></div>
          <button type="submit" className="btn btn-danger btn-block" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
        </form>
      </div>
    </div>
  );
}
