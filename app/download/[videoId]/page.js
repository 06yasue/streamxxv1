import { supabase } from '../../../lib/supabaseClient';
import { redirect } from 'next/navigation';
import DownloadTimerClient from './DownloadTimerClient'; // Komponen UI & Timer

export async function generateMetadata({ params }) {
  const { videoId } = await params;
  const { data: video } = await supabase.from('videos').select('title').eq('video_id', videoId).single();
  return {
    title: `Download ${video?.title || 'Video'}`,
    robots: { index: false, follow: false }, // Jangan index halaman download ini ke Google
  };
}

export default async function SecureDownloadPage({ params, searchParams }) {
  const { videoId } = await params;
  const { token } = await searchParams;

  // KEAMANAN 1: Kalau gak ada token atau token kependekan, tendang ke Home!
  if (!token || token.length < 15) {
    redirect('/');
  }

  // KEAMANAN 2: Ambil data video
  const [vRes, sRes] = await Promise.all([
    supabase.from('videos').select('*').eq('video_id', videoId).single(),
    supabase.from('settings').select('*').eq('id', 1).single()
  ]);

  const video = vRes.data;
  const settings = sRes.data;

  // KEAMANAN 3: Kalau video gak ada atau bukan tipe upload, tendang ke Home!
  if (!video || video.source_type !== 'upload') {
    redirect('/');
  }

  // Lolos keamanan? Tampilkan halaman timer
  return <DownloadTimerClient video={video} settings={settings} />;
}
