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
  const limit = 10; // Menampilkan maksimal 10 baris data per halaman

  useEffect(() => {
    fetchVideos(currentPage);
  }, [currentPage]);

  const fetchVideos = async (page) => {
    setLoading(true);
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // Ambil total seluruh video
    const { count } = await supabase.from('videos').select('*', { count: 'exact', head: true });
    setTotalVideos(count || 0);

    // Ambil data spesifik per halaman
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false }).range(start, end);
    if (data) setVideos(data);
    setLoading(false);
  };

  const handleCopy = (id) => {
    const url = `${window.location.origin}/${id}`;
    navigator.clipboard.writeText(url).then(() => showNotification('Link berhasil disalin!'));
  };

  const executeDelete = async (id) => {
    const { error } = await supabase.from('videos').delete().eq('video_id', id);
    if (!error) {
      showNotification('Video berhasil dihapus!');
      setDeleteConfirmId(null);
      fetchVideos(currentPage); // Refresh otomatis
    }
  };

  const totalPages = Math.ceil(totalVideos / limit);

  return (
    <>
      <Navbar />
      <div className="container-custom">
        {/* Header List */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: 0, fontWeight: 'bold' }}>
            Database Video <span className="badge" style={{ background: '#e50914', fontSize: '14px', marginLeft: '10px' }}>{totalVideos} Total Data</span>
          </h3>
          <Link href="/upload"><button className="btn btn-danger">Upload Baru</button></Link>
        </div>
        
        {loading && videos.length === 0 ? (
          <p className="text-center text-muted" style={{ marginTop: '40px' }}>Memuat tabel data...</p>
        ) : (
          <div style={{ background: '#1a1a1a', borderRadius: '6px', padding: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
            
            {/* Tabel Scrollable */}
            <div className="table-responsive" style={{ border: 'none' }}>
              <table className="table" style={{ minWidth: '900px', marginBottom: 0, color: '#ddd' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #333' }}>
                    <th style={{ color: '#aaa', border: 'none' }}>Thumbnail</th>
                    <th style={{ color: '#aaa', border: 'none' }}>Judul Video</th>
                    <th style={{ color: '#aaa', border: 'none' }}>Tipe</th>
                    <th style={{ color: '#aaa', border: 'none' }}>Tayangan</th>
                    <th style={{ color: '#aaa', border: 'none' }}>Tanggal Dibuat</th>
                    <th style={{ color: '#aaa', border: 'none', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.length === 0 ? (
                    <tr><td colSpan="6" className="text-center" style={{ padding: '30px', color: '#888', border: 'none' }}>Belum ada data video.</td></tr>
                  ) : (
                    videos.map((vid) => (
                      <tr key={vid.video_id} style={{ borderBottom: '1px solid #2b2b2b' }}>
                        <td style={{ verticalAlign: 'middle', border: 'none', width: '120px' }}>
                          <img src={vid.thumbnail_url} alt="thumb" style={{ width: '100px', height: '56px', objectFit: 'cover', borderRadius: '4px' }} />
                        </td>
                        <td style={{ verticalAlign: 'middle', border: 'none', fontWeight: 'bold', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {vid.title}
                        </td>
                        <td style={{ verticalAlign: 'middle', border: 'none' }}>
                          <span style={{ background: '#333', padding: '3px 8px', borderRadius: '3px', fontSize: '12px' }}>{vid.source_type}</span>
                        </td>
                        <td style={{ verticalAlign: 'middle', border: 'none' }}>{vid.hit_count}</td>
                        <td style={{ verticalAlign: 'middle', border: 'none' }}>{new Date(vid.created_at).toLocaleDateString('id-ID')}</td>
                        <td style={{ verticalAlign: 'middle', border: 'none', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                            <Link href={`/${vid.video_id}`}><button className="btn btn-default btn-sm" style={{ background: '#333', color: '#fff', border: 'none' }}>Buka</button></Link>
                            <button className="btn btn-primary btn-sm" onClick={() => handleCopy(vid.video_id)} style={{ border: 'none' }}>Copy</button>
                            {deleteConfirmId === vid.video_id ? (
                              <button className="btn btn-warning btn-sm" onClick={() => executeDelete(vid.video_id)}>Yakin?</button>
                            ) : (
                              <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirmId(vid.video_id)}>Hapus</button>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #333' }}>
                <button className="btn btn-default" style={{ background: '#333', color: '#fff', border: 'none', padding: '6px 15px' }} disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                  &larr; Prev
                </button>
                <span style={{ color: '#aaa', fontSize: '14px' }}>Halaman {currentPage} dari {totalPages}</span>
                <button className="btn btn-default" style={{ background: '#333', color: '#fff', border: 'none', padding: '6px 15px' }} disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                  Next &rarr;
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </>
  );
}
