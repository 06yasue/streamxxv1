import { supabase } from '../../../lib/supabaseClient';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import DownloadTimerClient from './DownloadTimerClient';

export default async function SecureDownloadPage({ params, searchParams }) {
  const { videoId } = await params;
  const sp = await searchParams;
  const token = sp?.token;
  const headerList = await headers();
  const currentUA = headerList.get('user-agent'); // Ambil User Agent browser pengakses

  if (!token) redirect('/');

  try {
    // Decode Token
    const decoded = decodeURIComponent(escape(atob(token)));
    const [tokenVideoId, tokenTime, tokenUA] = decoded.split('|');
    const timeDiff = Date.now() - parseInt(tokenTime);

    // VALIDASI MATI-MATIAN:
    // 1. Video ID harus cocok
    // 2. User Agent harus sama persis (Anti pindah browser)
    // 3. Waktu tidak boleh lebih dari 30 menit
    if (tokenVideoId !== videoId || tokenUA !== currentUA || timeDiff > 1800000 || timeDiff < 0) {
      redirect('/');
    }
  } catch (err) {
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
