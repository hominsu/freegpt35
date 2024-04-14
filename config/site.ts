import { getEnvBoolean, getEnvNumber, getEnvString } from '@/lib/env'

export const siteConfig = {
  server: {
    port: getEnvNumber('PORT', 3040),
    baseUrl: getEnvString('BASE_URL', 'https://chat.openai.com'),
    apiUrl: getEnvString('API_URL', '/backend-anon/conversation'),
    refreshInterval: getEnvNumber('REFRESH_INTERVAL', 60000),
    errorWait: getEnvNumber('ErrorWait', 120000),
  },
  proxy: {
    enable: getEnvBoolean('PROXY_ENABLE', false),
    protocol: getEnvString('PROXY_PROTOCOL', 'socks5'),
    host: getEnvString('PROXY_HOST', '127.0.0.1'),
    port: getEnvNumber('PROXY_PORT', 7890),
    auth: getEnvBoolean('PROXY_AUTH', false),
    username: getEnvString('PROXY_USERNAME', ''),
    password: getEnvString('PROXY_PASSWORD', ''),
  },
}

export type SiteConfig = typeof siteConfig
