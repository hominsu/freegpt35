export const siteConfig = {
  server: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://chat.openai.com',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || '/backend-anon/conversation',
    cron: process.env.NEXT_PUBLIC_CRON || '0 */10 * * * *',
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
