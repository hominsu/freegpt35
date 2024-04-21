export const siteConfig = {
  server: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://chat.openai.com',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || '/backend-anon/conversation',
    cron: process.env.NEXT_PUBLIC_CRON || '0 */10 * * * *',
    userAgent:
      process.env.NEXT_PUBLIC_USER_AGENT ||
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  },
  proxy: {
    enable: process.env.NEXT_PUBLIC_PROXY_ENABLE || 'false',
    protocol: process.env.NEXT_PUBLIC_PROXY_PROTOCOL || 'https',
    host: process.env.NEXT_PUBLIC_PROXY_HOST || '127.0.0.1',
    port: process.env.NEXT_PUBLIC_PROXY_PORT || 7890,
    auth: process.env.NEXT_PUBLIC_PROXY_AUTH || 'false',
    username: process.env.NEXT_PUBLIC_PROXY_USERNAME || '',
    password: process.env.NEXT_PUBLIC_PROXY_PASSWORD || '',
  },
}

export type SiteConfig = typeof siteConfig
