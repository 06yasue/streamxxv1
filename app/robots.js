export default function robots() {
  // Ganti dengan domain asli lo nanti kalau udah punya domain custom
  const baseUrl = 'https://streamxxv1.vercel.app';

  return {
    rules: [
      {
        // Aturan untuk Googlebot dan search engine umum lainnya
        userAgent: '*',
        allow: '/',
        disallow: [
          '/login',      // Jangan index halaman login
          '/list',       // Jangan index daftar video admin
          '/upload',     // Jangan index halaman upload
          '/settings',   // Jangan index halaman setting
          '/api/',       // Jangan index jalur API (keamanan)
        ],
      },
      {
        // Bot Facebook / Instagram / Messenger
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      {
        // Bot WhatsApp
        userAgent: 'WhatsApp',
        allow: '/',
      },
      {
        // Bot Twitter / X
        userAgent: 'Twitterbot',
        allow: '/',
      },
      {
        // Bot Telegram
        userAgent: 'TelegramBot',
        allow: '/',
      },
      {
        // Bot Discord
        userAgent: 'Discordbot',
        allow: '/',
      }
    ],
    // Peta situs buat ngasih tau Google semua link video lo
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
