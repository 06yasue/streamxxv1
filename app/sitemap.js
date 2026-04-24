export default function sitemap() {
  // Lo bisa ganti pakai domain asli lo nanti kalau udah punya domain custom
  const baseUrl = 'https://streamxxv1.vercel.app';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/list`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.8,
    }
  ]
}
