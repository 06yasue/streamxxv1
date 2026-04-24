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
  
  // Sistem Pagination
  const [totalVideos, setTotalVideos] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; 

  useEffect(() => {
    fetchVideos(currentPage);
  }, [currentPage]);

  const fetchVideos = async (page) => {
    setLoading(true);
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { count } = await supabase.from('videos').select('*', { count: 'exact', head: true });
    setTotalVideos(count || 0);

    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false }).range(start, end);
    if (data) setVideos(data);
    setLoading(false);
  };

  const handleCopy = (id) => {
    const url = `${window.location.origin}/${id}`;
    navigator.clipboard.writeText(url).then(() => showNotification('Link berhasil disalin!'));
  };

  // Logika Delete ke Backend API (Hapus Supabase + Cloudinary)
  const executeDelete = async (id) => {
    try {
      const res = await fetch('/api/delete-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: id })
      });
      const result = await res.json();
      
      if (result.success) {
        showNotification('Video berhasil dihapus total!');
        setDeleteConfirmId(null);
        fetchVideos(currentPage); 
      } else {
        showNotification('Error: ' + result.error);
      }
    } catch (err) {
      showNotification('Gagal menghubungi server!');
    }
  };

  const totalPages = Math.ceil(totalVideos / limit);

  return (
    <>
      <Navbar />
      <div className="container-custom">
        {/* Header List */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-icons notranslate" translate="no" style={{ color: '#e50914' }}>video_library</span>
            Database Video 
            <span className="badge" style={{ background: '#333', fontSize: '13px', marginLeft: '5px', fontWeight: 'normal' }}>
              {totalVideos} Total Link
            </span>
          </h3>
          <Link href="/upload">
            <button className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px' }}>add_circle</span> Upload Baru
            </button>
          </Link>
        </div>
        
        {loading && videos.length === 0 ? (
          <p className="text-center text-muted" style={{ marginTop: '40px' }}>Memuat tabel data...</p>
        ) : (
          <div style={{ background: '#1a1a1a', borderRadius: '6px', padding: '0', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
            
            {/* Tabel Scrollable */}
            <div className="table-responsive" style={{ border: 'none', margin: 0 }}>
              <table className="table table-hover" style={{ minWidth: '950px', marginBottom: 0, color: '#ddd' }}>
                <thead style={{ background: '#222' }}>
                  <tr>
                    <th style={{ color: '#aaa', borderBottom: '2px solid #333', padding: '15px' }}>Thumbnail</th>
                    <th style={{ color: '#aaa', borderBottom: '2px solid #333', padding: '15px' }}>Judul Video</th>
                    <th style={{ color: '#aaa', borderBottom: '2px solid #333', padding: '15px' }}>Sumber</th>
                    <th style={{ color: '#aaa', borderBottom: '2px solid #333', padding: '15px' }}>Tayangan</th>
                    <th style={{ color: '#aaa', borderBottom: '2px solid #333', padding: '15px' }}>Dibuat</th>
                    <th style={{ color: '#aaa', borderBottom: '2px solid #333', padding: '15px', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.length === 0 ? (
                    <tr><td colSpan="6" className="text-center" style={{ padding: '40px', color: '#888', border: 'none' }}>Belum ada data video.</td></tr>
                  ) : (
                    videos.map((vid) => (
                      <tr key={vid.video_id} style={{ borderBottom: '1px solid #2b2b2b' }}>
                        
                        {/* Thumbnail */}
                        <td style={{ verticalAlign: 'middle', border: 'none', width: '130px', padding: '10px 15px' }}>
                          <div style={{ width: '110px', height: '62px', background: '#000', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                            <img src={vid.thumbnail_url} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        </td>
                        
                        {/* Judul (Dibatasi lebarnya agar jadi ellipsis '...') */}
                        <td style={{ verticalAlign: 'middle', border: 'none', fontWeight: 'bold', maxWidth: '220px', padding: '15px' }}>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                            {vid.title}
                          </div>
                          <div style={{ color: '#666', fontSize: '12px', marginTop: '4px', fontWeight: 'normal' }}>ID: {vid.video_id}</div>
                        </td>
                        
                        {/* Sumber (Upload / Embed) */}
                        <td style={{ verticalAlign: 'middle', border: 'none', padding: '15px' }}>
                          {vid.source_type === 'upload' ? (
                            <span className="label label-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 8px', fontSize: '11px' }}>
                              <span className="material-icons notranslate" translate="no" style={{ fontSize: '14px' }}>cloud_upload</span> Cloudinary
                            </span>
                          ) : (
                            <span className="label label-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 8px', fontSize: '11px', background: '#0288d1' }}>
                              <span className="material-icons notranslate" translate="no" style={{ fontSize: '14px' }}>link</span> Embed URL
                            </span>
                          )}
                        </td>
                        
                        {/* Tayangan */}
                        <td style={{ verticalAlign: 'middle', border: 'none', padding: '15px', color: '#aaa' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span className="material-icons notranslate" translate="no" style={{ fontSize: '16px' }}>visibility</span> {vid.hit_count}
                          </div>
                        </td>
                        
                        {/* Tanggal Dibuat */}
                        <td style={{ verticalAlign: 'middle', border: 'none', padding: '15px', color: '#aaa' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span className="material-icons notranslate" translate="no" style={{ fontSize: '16px' }}>event</span> 
                            {new Date(vid.created_at).toLocaleDateString('id-ID')}
                          </div>
                        </td>
                        
                        {/* Tombol Aksi */}
                        <td style={{ verticalAlign: 'middle', border: 'none', padding: '15px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <Link href={`/${vid.video_id}`}>
                              <button className="btn btn-default btn-sm" style={{ background: '#333', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '3px' }} title="Tonton">
                                <span className="material-icons notranslate" translate="no" style={{ fontSize: '16px' }}>play_arrow</span>
                              </button>
                            </Link>
                            <button className="btn btn-primary btn-sm" onClick={() => handleCopy(vid.video_id)} style={{ border: 'none', display: 'flex', alignItems: 'center', gap: '3px' }} title="Copy Link">
                              <span className="material-icons notranslate" translate="no" style={{ fontSize: '16px' }}>content_copy</span>
                            </button>
                            
                            {deleteConfirmId === vid.video_id ? (
                              <button className="btn btn-warning btn-sm" onClick={() => executeDelete(vid.video_id)} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <span className="material-icons notranslate" translate="no" style={{ fontSize: '16px' }}>warning</span> Yakin?
                              </button>
                            ) : (
                              <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirmId(vid.video_id)} style={{ display: 'flex', alignItems: 'center', gap: '3px' }} title="Hapus">
                                <span className="material-icons notranslate" translate="no" style={{ fontSize: '16px' }}>delete</span>
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Navigasi Pagination Prev & Next */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#222', borderTop: '1px solid #333' }}>
                <button className="btn btn-default btn-sm" style={{ background: '#444', color: '#fff', border: 'none', padding: '6px 15px', display: 'flex', alignItems: 'center', gap: '5px' }} disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                  <span className="material-icons notranslate" translate="no" style={{ fontSize: '16px' }}>chevron_left</span> Prev
                </button>
                <span style={{ color: '#aaa', fontSize: '13px' }}>Halaman {currentPage} dari {totalPages}</span>
                <button className="btn btn-default btn-sm" style={{ background: '#444', color: '#fff', border: 'none', padding: '6px 15px', display: 'flex', alignItems: 'center', gap: '5px' }} disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                  Next <span className="material-icons notranslate" translate="no" style={{ fontSize: '16px' }}>chevron_right</span>
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </>
  );
}
