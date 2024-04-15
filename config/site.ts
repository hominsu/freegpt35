import { getEnvBoolean, getEnvNumber, getEnvString } from '@/lib/env'

export const siteConfig = {
  server: {
    baseUrl: getEnvString('NEXT_BASE_URL', 'https://chat.openai.com'),
    apiUrl: getEnvString('NEXT_API_URL', '/backend-anon/conversation'),
    cron: getEnvString('NEXT_CRON', '0 */10 * * * *'),
  },
  proxy: {
    enable: getEnvBoolean('NEXT_PROXY_ENABLE', false),
    protocol: getEnvString('NEXT_PROXY_PROTOCOL', 'socks5'),
    host: getEnvString('NEXT_PROXY_HOST', '127.0.0.1'),
    port: getEnvNumber('NEXT_PROXY_PORT', 7890),
    auth: getEnvBoolean('NEXT_PROXY_AUTH', false),
    username: getEnvString('NEXT_PROXY_USERNAME', ''),
    password: getEnvString('NEXT_PROXY_PASSWORD', ''),
  },
}

export type SiteConfig = typeof siteConfig
