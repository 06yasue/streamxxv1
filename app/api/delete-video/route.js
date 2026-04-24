import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { videoId } = await request.json();

    // Koneksi Supabase dari variabel Vercel
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Tarik data video buat ngecek URL-nya
    const { data: video, error: vidErr } = await supabase.from('videos').select('*').eq('video_id', videoId).single();
    if (vidErr || !video) throw new Error('Video tidak ditemukan di database');

    // 2. Kalau videonya dari hasil Upload (Cloudinary), eksekusi hapus file fisik
    if (video.source_type === 'upload') {
      const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).single();
      
      if (settings && settings.cloudinary_name && settings.cloudinary_key && settings.cloudinary_secret) {
        // Ekstrak ID File (public_id) dari URL panjang Cloudinary
        const urlParts = video.video_url.split('/upload/');
        if (urlParts.length > 1) {
          let publicId = urlParts[1].replace(/^v\d+\//, ''); // Hapus kode versi (contoh: v171000/)
          publicId = publicId.substring(0, publicId.lastIndexOf('.')); // Hapus ekstensi .mp4

          // Tembak API Rahasia Cloudinary pakai Basic Auth
          const auth = btoa(`${settings.cloudinary_key}:${settings.cloudinary_secret}`);
          await fetch(`https://api.cloudinary.com/v1_1/${settings.cloudinary_name}/resources/video/upload`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ public_ids: [publicId] })
          });
        }
      }
    }

    // 3. Terakhir, bersihkan juga datanya dari Supabase
    const { error: delErr } = await supabase.from('videos').delete().eq('video_id', videoId);
    if (delErr) throw new Error('Gagal menghapus data dari Supabase');

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
