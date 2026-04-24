import { supabase } from '../lib/supabaseClient';

export default async function sitemap() {
  // 1. Ambil Base URL dari Settings biar otomatis menyesuaikan domain
  const { data: settings } = await supabase.from('settings').select('base_url').eq('id', 1).single();
  
  let baseUrl = 'https://streamxxv1.vercel.app';
  if (settings?.base_url) {
    baseUrl = settings.base_url.startsWith('http') ? settings.base_url : `https://${settings.base_url}`;
  }

  // 2. SITEMAP HALAMAN UTAMA (Pages)
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0, // Prioritas paling tinggi buat Landing Page
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8, // Halaman legal cukup 0.8
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dmca`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // 3. SITEMAP HALAMAN VIDEO (Ditarik Otomatis dari Database)
  let videoPages = [];
  try {
    // Ambil semua video_id dan tanggal upload dari Supabase
    const { data: videos } = await supabase.from('videos').select('video_id, created_at');
    
    if (videos && videos.length > 0) {
      videoPages = videos.map((video) => ({
        url: `${baseUrl}/${video.video_id}`,
        lastModified: new Date(video.created_at), // Tanggal update sesuai waktu upload video
        changeFrequency: 'yearly', // Video jarang diubah kontennya
        priority: 0.9, // Prioritas tinggi biar cepat di-index Google
      }));
    }
  } catch (error) {
    console.error("Gagal menarik data video untuk sitemap:", error);
  }

  // 4. GABUNGKAN KEDUANYA DAN KELUARKAN SEBAGAI SITEMAP.XML
  return [...staticPages, ...videoPages];
}
