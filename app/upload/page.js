"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { showNotification } from '../../components/Notification';
import Link from 'next/link';

export default function UploadPage() {
  const [mode, setMode] = useState('upload');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [successLink, setSuccessLink] = useState(''); // State untuk nampilin link sukses
  
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

  const generateId = () => Math.random().toString(36).substring(2, 8);

  const handleUploadFile = async (e) => {
    e.preventDefault();
    if (!videoFile) return showNotification('Pilih file video dulu!');
    if (!cloudName) return showNotification('Isi Cloud Name dulu di menu Pengaturan!');

    setLoading(true);
    setStatusText('Mengunggah video... (Jangan tutup halaman)');
    setSuccessLink('');

    try {
      const data = new FormData();
      data.append('file', videoFile);
      data.append('upload_preset', 'videoku_preset'); 

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, { method: 'POST', body: data });
      const cloudRes = await res.json();
      
      if (!cloudRes.secure_url) throw new Error('Gagal dari server Cloudinary');

      setStatusText('Menyimpan ke database...');
      const newVideoId = generateId();
      const thumbUrl = cloudRes.secure_url.replace('.mp4', '.jpg').replace('/upload/', '/upload/so_5/');

      const { error } = await supabase.from('videos').insert([{
        video_id: newVideoId, title: videoTitle, source_type: 'upload', video_url: cloudRes.secure_url, thumbnail_url: thumbUrl
      }]);

      if (error) throw error;
      showNotification('Sukses! Video berhasil diunggah.');
      setSuccessLink(`${window.location.origin}/${newVideoId}`); // Munculin link
      setVideoTitle('');
      setVideoFile(null);
    } catch (err) {
      showNotification('Error: ' + err.message);
    } finally {
      setLoading(false);
      setStatusText('');
    }
  };

  const handleEmbedSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessLink('');
    const newVideoId = generateId();
    const { error } = await supabase.from('videos').insert([{
      video_id: newVideoId, title: formData.title || 'Video Tanpa Judul', source_type: 'embed', video_url: formData.video_url, thumbnail_url: formData.thumbnail_url || 'https://via.placeholder.com/640x360.png?text=No+Thumbnail'
    }]);
    setLoading(false);
    if (error) {
      showNotification('Gagal menyimpan data!');
    } else {
      showNotification('Sukses!');
      setSuccessLink(`${window.location.origin}/${newVideoId}`);
      setFormData({ title: '', video_url: '', thumbnail_url: '' });
    }
  };

  return (
    <div className="container-custom" style={{ marginTop: '30px' }}>
      <Link href="/"><button className="btn btn-default" style={{ marginBottom: '20px', background: '#333', color: '#fff', border: 'none' }}>&larr; Kembali ke Daftar</button></Link>
      
      {/* Box Notifikasi Jika Berhasil */}
      {successLink && (
        <div style={{ background: '#0f3a1f', borderLeft: '4px solid #1db954', padding: '15px', marginBottom: '20px', borderRadius: '4px' }}>
          <h5 style={{ color: '#fff', marginTop: 0 }}>Video Berhasil Ditambahkan!</h5>
          <p style={{ margin: 0, color: '#ccc' }}>Link Video: <a href={successLink} style={{ color: '#1db954', fontWeight: 'bold' }}>{successLink}</a></p>
        </div>
      )}

      <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '4px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button className={`btn ${mode === 'upload' ? 'btn-danger' : 'btn-default'}`} onClick={() => {setMode('upload'); setSuccessLink('');}} style={{ flex: 1, border: 'none', background: mode === 'upload' ? '#e50914' : '#333', color: '#fff' }}>Upload Video</button>
          <button className={`btn ${mode === 'embed' ? 'btn-danger' : 'btn-default'}`} onClick={() => {setMode('embed'); setSuccessLink('');}} style={{ flex: 1, border: 'none', background: mode === 'embed' ? '#e50914' : '#333', color: '#fff' }}>Embed URL</button>
        </div>

        {mode === 'embed' && (
          <form onSubmit={handleEmbedSubmit}>
            <div className="form-group"><label>URL Video (Embed)</label><input type="url" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} required /></div>
            <div className="form-group"><label>Judul Opsional</label><input type="text" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
            <div className="form-group"><label>URL Thumbnail Opsional</label><input type="url" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} value={formData.thumbnail_url} onChange={e => setFormData({...formData, thumbnail_url: e.target.value})} /></div>
            <button type="submit" className="btn btn-danger btn-block" disabled={loading}>{loading ? 'Memproses...' : 'Simpan Data'}</button>
          </form>
        )}

        {mode === 'upload' && (
          <form onSubmit={handleUploadFile}>
            <div className="form-group"><label>Judul Video</label><input type="text" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} value={videoTitle} onChange={e => setVideoTitle(e.target.value)} required /></div>
            <div className="form-group"><label>Pilih File Video</label><input type="file" accept="video/*" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none' }} onChange={e => setVideoFile(e.target.files[0])} required /></div>
            <button type="submit" className="btn btn-danger btn-block" disabled={loading}>{loading ? statusText : 'Mulai Upload Video'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
