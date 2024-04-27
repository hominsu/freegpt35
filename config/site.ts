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
    proxy: process.env.NEXT_PROXY || null,
  },
}

export type SiteConfig = typeof siteConfig
