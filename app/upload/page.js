"use client";
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { showNotification } from '../../components/Notification';
import Link from 'next/link';

export default function UploadPage() {
  const [mode, setMode] = useState('upload');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', video_url: '', thumbnail_url: '' });

  const generateId = () => Math.random().toString(36).substring(2, 8);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newVideoId = generateId();
    const { error } = await supabase.from('videos').insert([{
      video_id: newVideoId,
      title: formData.title || 'Video Tanpa Judul',
      source_type: mode,
      video_url: formData.video_url,
      thumbnail_url: formData.thumbnail_url || 'https://via.placeholder.com/640x360.png?text=No+Thumbnail'
    }]);
    setLoading(false);
    if (error) showNotification('Gagal menyimpan data!');
    else { showNotification('Sukses! ID: ' + newVideoId); setFormData({ title: '', video_url: '', thumbnail_url: '' }); }
  };

  return (
    <div className="container-custom" style={{ marginTop: '30px' }}>
      <Link href="/"><button className="btn btn-default" style={{ marginBottom: '20px', background: '#333', color: '#fff', border: 'none' }}>&larr; Kembali</button></Link>
      <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '4px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button className={`btn ${mode === 'upload' ? 'btn-danger' : 'btn-default'}`} onClick={() => setMode('upload')} style={{ flex: 1, border: 'none', background: mode === 'upload' ? '#e50914' : '#333', color: '#fff' }}>Upload Video</button>
          <button className={`btn ${mode === 'embed' ? 'btn-danger' : 'btn-default'}`} onClick={() => setMode('embed')} style={{ flex: 1, border: 'none', background: mode === 'embed' ? '#e50914' : '#333', color: '#fff' }}>Embed URL</button>
        </div>
        <form onSubmit={handleSubmit}>
          {mode === 'embed' && (
            <>
              <div className="form-group"><label>URL Video</label><input type="url" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} required /></div>
              <div className="form-group"><label>Judul Opsional</label><input type="text" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
              <div className="form-group"><label>URL Thumbnail Opsional</label><input type="url" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} value={formData.thumbnail_url} onChange={e => setFormData({...formData, thumbnail_url: e.target.value})} /></div>
            </>
          )}
          {mode === 'upload' && (
            <div className="alert alert-info" style={{ background: '#2b2b2b', color: '#aaa', border: 'none' }}>
              <p>Form upload Cloudinary akan masuk di sini.</p>
              <div className="form-group" style={{marginTop: '15px'}}><label>Judul Video</label><input type="text" className="form-control" style={{ background: '#1a1a1a', color: '#fff', border: 'none' }} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required /></div>
              <div className="form-group"><label>URL Final Cloudinary</label><input type="url" className="form-control" style={{ background: '#1a1a1a', color: '#fff', border: 'none' }} value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} required /></div>
            </div>
          )}
          <button type="submit" className="btn btn-danger btn-block" disabled={loading}>{loading ? 'Memproses...' : 'Simpan Data'}</button>
        </form>
      </div>
    </div>
  );
}
