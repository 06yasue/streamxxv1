export default function robots() {
  const baseUrl = 'https://streamxxv1.vercel.app';

  return {
    rules: [
      {
        // Akses global buat Google, Bing, Yahoo, dll
        userAgent: '*',
        allow: '/',
      },
      {
        // Bot khusus Facebook, Instagram, Messenger, WhatsApp
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      {
        // Bot khusus Twitter / X
        userAgent: 'Twitterbot',
        allow: '/',
      },
      {
        // Bot khusus Telegram
        userAgent: 'TelegramBot',
        allow: '/',
      },
      {
        // Bot khusus LinkedIn
        userAgent: 'LinkedInBot',
        allow: '/',
      },
      {
        // Bot khusus Discord
        userAgent: 'Discordbot',
        allow: '/',
      }
    ],
    // Kasih tau bot lokasi sitemap lo sekalian biar SEO makin mantap
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
