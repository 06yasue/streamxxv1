import { supabase } from '../../../lib/supabaseClient';
import { redirect } from 'next/navigation';
import DownloadTimerClient from './DownloadTimerClient';

export const metadata = {
  title: 'Secure Download',
  robots: { index: false, follow: false },
};

export default async function SecureDownloadPage({ params, searchParams }) {
  const { videoId } = await params;
  const sp = await searchParams;
  const token = sp?.token;

  // 1. Cek keberadaan token
  if (!token) redirect('/');

  // 2. VALIDASI TOKEN TINGKAT TINGGI
  try {
    // Decode Base64
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [tokenVideoId, tokenTime] = decoded.split('_');
    const timeDiff = Date.now() - parseInt(tokenTime);

    // Syarat Batal: Video ID beda, ATAU token usianya udah lebih dari 1 jam (3600000 ms), ATAU format rusak
    if (tokenVideoId !== videoId || timeDiff > 3600000 || timeDiff < 0) {
      redirect('/');
    }
  } catch (err) {
    // Kalau user masukin string ngasal yang gak bisa di-decode
    redirect('/');
  }

  const [vRes, sRes] = await Promise.all([
    supabase.from('videos').select('*').eq('video_id', videoId).single(),
    supabase.from('settings').select('*').eq('id', 1).single()
  ]);

  const video = vRes.data;
  const settings = sRes.data;

  if (!video || video.source_type !== 'upload') redirect('/');

  return <DownloadTimerClient video={video} settings={settings} />;
}
