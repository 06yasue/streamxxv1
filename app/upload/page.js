"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { showNotification } from '../../components/Notification';
import Navbar from '../../components/Navbar';
import Link from 'next/link';

export default function UploadPage() {
  const [mode, setMode] = useState('upload'); // 'upload' atau 'embed'
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [successLink, setSuccessLink] = useState('');
  
  // Data Form
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [embedUrl, setEmbedUrl] = useState('');
  const [thumbMode, setThumbMode] = useState('auto'); // 'auto', 'url', 'file'
  const [thumbUrl, setThumbUrl] = useState('');
  const [thumbFile, setThumbFile] = useState(null);
  
  const [cloudName, setCloudName] = useState('');

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase.from('settings').select('cloudinary_name').eq('id', 1).single();
      if (data) setCloudName(data.cloudinary_name);
    }
    loadSettings();
  }, []);

  const generateId = () => Math.random().toString(36).substring(2, 8);

  // Fungsi bantu upload ke Cloudinary (bisa buat video atau gambar)
  const uploadToCloudinary = async (file, resourceType = 'auto') => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'videoku_preset');
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
      method: 'POST',
      body: data
    });
    return await res.json();
  };

  const handleProcessUpload = async (e) => {
    e.preventDefault();
    if (!cloudName) return showNotification('Isi Cloud Name di Setting dulu!');
    
    setLoading(true);
    setSuccessLink('');
    setStatusText('Memulai proses...');

    try {
      let finalVideoUrl = '';
      let finalThumbUrl = '';

      // 1. PROSES VIDEO
      if (mode === 'upload') {
        if (!videoFile) throw new Error('Pilih file video!');
        setStatusText('Mengunggah video ke Cloudinary...');
        const vRes = await uploadToCloudinary(videoFile, 'video');
        if (!vRes.secure_url) throw new Error('Gagal upload video');
        finalVideoUrl = vRes.secure_url;
        // Default thumbnail dari video detik ke-5 jika mode auto
        finalThumbUrl = vRes.secure_url.replace('.mp4', '.jpg').replace('/upload/', '/upload/so_5/');
      } else {
        if (!embedUrl) throw new Error('Isi URL Embed!');
        finalVideoUrl = embedUrl;
      }

      // 2. PROSES THUMBNAIL (Jika user pilih manual)
      if (thumbMode === 'file' && thumbFile) {
        setStatusText('Mengunggah thumbnail kustom...');
        const tRes = await uploadToCloudinary(thumbFile, 'image');
        if (tRes.secure_url) finalThumbUrl = tRes.secure_url;
      } else if (thumbMode === 'url' && thumbUrl) {
        finalThumbUrl = thumbUrl;
      }

      // 3. SIMPAN KE SUPABASE
      setStatusText('Menyimpan ke database...');
      const newId = generateId();
      const { error } = await supabase.from('videos').insert([{
        video_id: newId,
        title: title || 'Video Tanpa Judul',
        source_type: mode,
        video_url: finalVideoUrl,
        thumbnail_url: finalThumbUrl || 'https://via.placeholder.com/640x360.png?text=No+Image'
      }]);

      if (error) throw error;

      setSuccessLink(`${window.location.origin}/${newId}`);
      showNotification('Berhasil disimpan!');
      // Reset Form
      setTitle(''); setVideoFile(null); setEmbedUrl(''); setThumbUrl(''); setThumbFile(null);
    } catch (err) {
      showNotification(err.message);
    } finally {
      setLoading(false);
      setStatusText('');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-custom">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          <Link href="/list">
            <button className="btn btn-link" style={{ color: '#aaa', paddingLeft: 0, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span className="material-icons notranslate" translate="no">arrow_back</span> Kembali ke List
            </button>
          </Link>

          {successLink && (
            <div style={{ background: '#1a1a1a', border: '1px solid #1db954', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h4 style={{ color: '#1db954', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-icons notranslate" translate="no">check_circle</span> Berhasil Terbit!
              </h4>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input type="text" readOnly className="form-control" value={successLink} style={{ background: '#000', color: '#fff', border: '1px solid #333' }} />
                <button className="btn btn-primary" onClick={() => { navigator.clipboard.writeText(successLink); showNotification('Link disalin!'); }}>Copy</button>
              </div>
            </div>
          )}

          <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '25px', fontWeight: 'bold', textAlign: 'center' }}>Upload Konten Baru</h3>
            
            {/* TABS MODE */}
            <div style={{ display: 'flex', background: '#000', padding: '5px', borderRadius: '6px', marginBottom: '25px' }}>
              <button onClick={() => setMode('upload')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '4px', background: mode === 'upload' ? '#e50914' : 'transparent', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span className="material-icons notranslate" translate="no">cloud_upload</span> Upload Video
              </button>
              <button onClick={() => setMode('embed')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '4px', background: mode === 'embed' ? '#e50914' : 'transparent', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span className="material-icons notranslate" translate="no">link</span> Embed URL
              </button>
            </div>

            <form onSubmit={handleProcessUpload}>
              <div className="form-group">
                <label style={{ color: '#888' }}>Judul Konten</label>
                <input type="text" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none', height: '45px' }} value={title} onChange={e => setTitle(e.target.value)} placeholder="Masukkan judul..." required />
              </div>

              {mode === 'upload' ? (
                <div className="form-group">
                  <label style={{ color: '#888' }}>Pilih File Video (MP4)</label>
                  <input 
                    type="file" 
                    accept="video/*" 
                    className="form-control" 
                    style={{ background: '#2b2b2b', color: '#fff', border: 'none', height: 'auto', padding: '10px' }} 
                    onChange={e => {
                      const file = e.target.files[0];
                      setVideoFile(file);
                      if (file) {
                        // Fitur Auto-Title: Ngambil nama file dan buang ekstensinya (.mp4, .mkv, dll)
                        const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
                        setTitle(fileNameWithoutExt);
                      }
                    }} 
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label style={{ color: '#888' }}>URL Video Embed</label>
                  <input type="url" className="form-control" style={{ background: '#2b2b2b', color: '#fff', border: 'none', height: '45px' }} value={embedUrl} onChange={e => setEmbedUrl(e.target.value)} placeholder="https://..." />
                </div>
              )}

              {/* SEKSI THUMBNAIL */}
              <div style={{ marginTop: '25px', padding: '15px', background: '#222', borderRadius: '6px' }}>
                <label style={{ color: '#ccc', marginBottom: '10px', display: 'block' }}>Pengaturan Gambar Thumbnail</label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <label style={{ flex: 1, cursor: 'pointer' }}>
                    <input type="radio" name="tm" checked={thumbMode === 'auto'} onChange={() => setThumbMode('auto')} /> Auto
                  </label>
                  <label style={{ flex: 1, cursor: 'pointer' }}>
                    <input type="radio" name="tm" checked={thumbMode === 'url'} onChange={() => setThumbMode('url')} /> URL
                  </label>
                  <label style={{ flex: 1, cursor: 'pointer' }}>
                    <input type="radio" name="tm" checked={thumbMode === 'file'} onChange={() => setThumbMode('file')} /> File
                  </label>
                </div>

                {thumbMode === 'url' && (
                  <input type="url" className="form-control" style={{ background: '#111', color: '#fff', border: '1px solid #333' }} placeholder="Tempel URL gambar di sini..." value={thumbUrl} onChange={e => setThumbUrl(e.target.value)} />
                )}
                {thumbMode === 'file' && (
                  <input type="file" accept="image/*" className="form-control" style={{ background: '#111', color: '#fff', border: '1px solid #333' }} onChange={e => setThumbFile(e.target.files[0])} />
                )}
                {thumbMode === 'auto' && (
                  <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                    {mode === 'upload' ? '*Mengambil gambar dari detik ke-5 video.' : '*Akan menggunakan gambar cadangan jika tidak diisi.'}
                  </p>
                )}
              </div>

              <button type="submit" className="btn btn-danger btn-block btn-lg" style={{ marginTop: '30px', fontWeight: 'bold', height: '50px' }} disabled={loading}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <span className="material-icons notranslate spin" translate="no" style={{ fontSize: '20px' }}>sync</span> {statusText}
                  </span>
                ) : 'TERBITKAN SEKARANG'}
              </button>
            </form>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        input[type="radio"] { margin-right: 5px; }
      `}} />
    </>
  );
}
