import { supabase } from '../../lib/supabaseClient';
import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar';

export async function generateMetadata({ params }) {
  const { videoId } = params;
  const { data: video } = await supabase.from('videos').select('*').eq('video_id', videoId).single();
  if (!video) return { title: 'Video Tidak Ditemukan' };
  return { title: `${video.title}`, openGraph: { title: video.title, images: [video.thumbnail_url] } };
}

export default async function VideoPlayerPage({ params }) {
  const { videoId } = params;
  const { data: video, error } = await supabase.from('videos').select('*').eq('video_id', videoId).single();
  
  if (error || !video) return notFound();
  await supabase.from('videos').update({ hit_count: video.hit_count + 1 }).eq('video_id', videoId);

  return (
    <>
      <Navbar />
      <div className="container-custom" style={{ padding: '0' }}>
        <div style={{ background: '#000', width: '100%', aspectRatio: '16/9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {video.source_type === 'upload' ? (
            <video controls src={video.video_url} poster={video.thumbnail_url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <iframe src={video.video_url} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen />
          )}
        </div>
        <div style={{ padding: '15px' }}>
          <h2 style={{ marginTop: '0', fontSize: '20px', fontWeight: 'bold' }}>{video.title}</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '13px', marginTop: '10px' }}>
            <span>👀 {video.hit_count + 1} tayangan</span>
            <span>{new Date(video.created_at).toLocaleDateString('id-ID')}</span>
          </div>
        </div>
      </div>
    </>
  );
}
