import https from 'https'
import axios from 'axios'

import { siteConfig } from '@/config/site'

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  proxy:
    siteConfig.proxy.enable === 'true'
      ? {
          protocol: siteConfig.proxy.protocol,
          host: siteConfig.proxy.host,
          port: Number(siteConfig.proxy.port),
          auth:
            siteConfig.proxy.auth === 'true'
              ? {
                  username: siteConfig.proxy.username,
                  password: siteConfig.proxy.password,
                }
              : undefined,
        }
      : false,
  headers: {
    accept: '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    'oai-language': 'en-US',
    origin: siteConfig.server.baseUrl,
    pragma: 'no-cache',
    referer: siteConfig.server.baseUrl,
    'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  },
})

export default axiosInstance
