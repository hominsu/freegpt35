import * as process from 'process'

export const siteConfig = {
  server: {
    baseUrl: process.env.NEXT_BASE_URL || 'https://chat.openai.com',
    apiUrl: process.env.NEXT_API_URL || '/backend-anon/conversation',
    apiKey: process.env.NEXT_API_KEY || null,
    maxRetries: process.env.NEXT_MAX_RETRIES || 2,
    userAgent:
      process.env.NEXT_USER_AGENT ||
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  },
  proxy: {
    enable: process.env.NEXT_PROXY_ENABLE || 'false',
    protocol: process.env.NEXT_PROXY_PROTOCOL || 'https',
    host: process.env.NEXT_PROXY_HOST || '127.0.0.1',
    port: process.env.NEXT_PROXY_PORT || 7890,
    auth: process.env.NEXT_PROXY_AUTH || 'false',
    username: process.env.NEXT_PROXY_USERNAME || '',
    password: process.env.NEXT_PROXY_PASSWORD || '',
  },
}

export type SiteConfig = typeof siteConfig
