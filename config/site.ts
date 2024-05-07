import * as process from 'process'

export const siteConfig = {
  name: 'freegpt35',
  url: process.env.NEXT_PUBLIC_URL || 'http://127.0.0.1',
  description: 'Unlimited free GPT-3.5 turbo API service.',
  links: {
    author: 'https://homing.so/about',
    twitter: 'https://twitter.com/is_homingso',
    github: 'https://github.com/hominsu/freegpt35',
  },
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
