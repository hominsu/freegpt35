import https from 'https'
import axios from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'

import { siteConfig } from '@/config/site'

const axiosInstance = axios.create({
  httpsAgent: siteConfig.server.proxy
    ? new HttpsProxyAgent(siteConfig.server.proxy)
    : new https.Agent({ rejectUnauthorized: false }),
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
    'user-agent': siteConfig.server.userAgent,
  },
})

export default axiosInstance
