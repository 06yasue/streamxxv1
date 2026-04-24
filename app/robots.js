import { supabase } from '../lib/supabaseClient';

export default async function robots() {
  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();

  let baseUrl = 'https://streamxxv1.vercel.app';

  if (settings?.base_url) {
    baseUrl = settings.base_url.startsWith('http')
      ? settings.base_url
      : `https://${settings.base_url}`;
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',

        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/login/',
          '/private/',
          '/download/private/',
        ],
      },

      // Googlebot khusus
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
        ],
      },

      // Facebook crawler
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
      },

      // Twitter crawler
      {
        userAgent: 'Twitterbot',
        allow: '/',
      },

      // WhatsApp crawler
      {
        userAgent: 'WhatsApp',
        allow: '/',
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
