"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { showNotification } from '../../components/Notification';
import Link from 'next/link';

export default function UploadPage() {
  const [mode, setMode] = useState('upload');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [successLink, setSuccessLink] = useState('');
  
  const [formData, setFormData] = useState({ title: '', video_url: '', thumbnail_url: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [cloudName, setCloudName] = useState('');

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (data && data.cloudinary_name) setCloudName(data.cloudinary_name);
    }
    loadSettings();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(successLink).then(() => {
      showNotification('Link video disalin!');
    });
  };

  const handleUploadFile = async (e) => {
    e.preventDefault();
    if (!videoFile || !cloudName) return showNotification('Lengkapi file dan setting!');
    setLoading(true);
    setStatusText('Sedang mengunggah...');
    setSuccessLink('');

    try {
      const data = new FormData();
      data.append('file', videoFile);
      data.append('upload_preset', 'videoku_preset'); 

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, { method: 'POST', body: data });
      const cloudRes = await res.json();
      if (!cloudRes.secure_url) throw new Error('Cloudinary error');

      const newId = Math.random().toString(36).substring(2, 8);
      const thumb = cloudRes.secure_url.replace('.mp4', '.jpg').replace('/upload/', '/upload/so_5/');

      await supabase.from('videos').insert([{
        video_id: newId, title: videoTitle, source_type: 'upload', video_url: cloudRes.secure_url, thumbnail_url: thumb
      }]);

      setSuccessLink(`${window.location.origin}/${newId}`);
      showNotification('Upload Berhasil!');
      setVideoTitle('');
    } catch (err) {
      showNotification('Gagal: ' + err.message);
    } finally {
      setLoading(false);
      setStatusText('');
    }
  };

  const handleEmbedSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newId = Math.random().toString(36).substring(2, 8);
    await supabase.from('videos').insert([{
      video_id: newId, title: formData.title, source_type: 'embed', video_url: formData.video_url, thumbnail_url: formData.thumbnail_url
    }]);
    setSuccessLink(`${window.location.origin}/${newId}`);
    showNotification('Embed Berhasil!');
    setLoading(false);
  };

  return (
    <div className="container-custom" style={{ marginTop: '30px' }}>
      <Link href="/list"><button className="btn btn-default" style={{ marginBottom: '20px', background: '#333', color: '#fff', border: 'none' }}>&larr; Ke List Video</button></Link>
      
      {successLink && (
        <div style={{ background: '#1a1a1a', border: '1px solid #1db954', padding: '20px', marginBottom: '20px', borderRadius: '4px' }}>
          <h4 style={{ color: '#1db954', marginTop: 0 }}>Sukses!</h4>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input type="text" readOnly className="form-control" value={successLink} style={{ background: '#000', color: '#fff', border: '1px solid #333' }} />
            <button className="btn btn-primary" onClick={copyToClipboard}>Copy</button>
          </div>
        </div>
      )}

      <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '4px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button className={`btn ${mode === 'upload' ? 'btn-danger' : 'btn-default'}`} onClick={() => {setMode('upload'); setSuccessLink('')}} style={{ flex: 1, border: 'none', background: mode === 'upload' ? '#e50914' : '#333', color: '#fff' }}>Upload File</button>
          <button className={`btn ${mode === 'embed' ? 'btn-danger' : 'btn-default'}`} onClick={() => {setMode('embed'); setSuccessLink('')}} style={{ flex: 1, border: 'none', background: mode === 'embed' ? '#e50914' : '#333', color: '#fff' }}>Embed URL</button>
        </div>

        {mode === 'upload' ? (
          <form onSubmit={handleUploadFile}>
            <div className="form-group"><label>Judul</label><input type="text" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} value={videoTitle} onChange={e => setVideoTitle(e.target.value)} required /></div>
            <div className="form-group"><label>Pilih Video</label><input type="file" accept="video/*" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} onChange={e => setVideoFile(e.target.files[0])} required /></div>
            <button type="submit" className="btn btn-danger btn-block" disabled={loading}>{loading ? statusText : 'Mulai Upload'}</button>
          </form>
        ) : (
          <form onSubmit={handleEmbedSubmit}>
            <div className="form-group"><label>URL Embed</label><input type="url" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} required /></div>
            <div className="form-group"><label>Judul</label><input type="text" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
            <button type="submit" className="btn btn-danger btn-block" disabled={loading}>Simpan Embed</button>
          </form>
        )}
      </div>
    </div>
  );
}
