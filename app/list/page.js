"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { showNotification } from '../../components/Notification';
import Navbar from '../../components/Navbar';
import Link from 'next/link';

export default function ListPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    if (data) setVideos(data);
    setLoading(false);
  };

  const handleCopy = (id) => {
    const url = `${window.location.origin}/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      showNotification('Link berhasil disalin!');
    });
  };

  const executeDelete = async (id) => {
    const { error } = await supabase.from('videos').delete().eq('video_id', id);
    if (!error) {
      showNotification('Berhasil dihapus!');
      setDeleteConfirmId(null);
      fetchVideos();
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-custom">
        <h3 style={{ marginBottom: '20px', fontWeight: 'bold' }}>Daftar Koleksi Video</h3>
        
        {loading ? (
          <p className="text-center text-muted">Memuat...</p>
        ) : (
          <div className="row">
            {videos.map((vid) => (
              <div key={vid.video_id} className="col-xs-12 col-sm-6 col-md-4" style={{ marginBottom: '25px' }}>
                <div style={{ background: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
                  <img src={vid.thumbnail_url} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
                  <div style={{ padding: '15px' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{vid.title}</h4>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <Link href={`/${vid.video_id}`} style={{ flex: 1 }}><button className="btn btn-default btn-sm btn-block" style={{ background: '#333', color: '#fff', border: 'none' }}>Buka</button></Link>
                      <button className="btn btn-primary btn-sm" onClick={() => handleCopy(vid.video_id)}>Copy</button>
                      {deleteConfirmId === vid.video_id ? (
                        <button className="btn btn-warning btn-sm" onClick={() => executeDelete(vid.video_id)}>Yakin?</button>
                      ) : (
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirmId(vid.video_id)}>Hapus</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
