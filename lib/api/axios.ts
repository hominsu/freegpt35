import https from 'https'
import axios, { AxiosInstance } from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'

import { siteConfig } from '@/config/site'

const headers = {
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
}

const createAxiosInstance = (proxy?: string): AxiosInstance => {
  const agent = proxy ? new HttpsProxyAgent(proxy) : new https.Agent({ rejectUnauthorized: false })
  return axios.create({
    httpsAgent: agent,
    headers: headers,
  })
}

const axiosInstances = siteConfig.server.proxy
  ? siteConfig.server.proxy
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item !== '')
      .map(createAxiosInstance)
  : [createAxiosInstance()]

function* cycleIterator<T>(items: T[]): Generator<T, never, undefined> {
  let index = 0
  const length = items.length
  while (true) {
    yield items[index++]
    if (index >= length) index = 0
  }
}

const axiosInstanceIterator = cycleIterator(axiosInstances)

export default axiosInstanceIterator
