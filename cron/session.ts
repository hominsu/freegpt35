import * as process from 'process'

import { siteConfig } from '@/config/site'
import { GlobalsVars } from '@/lib/globals'

interface SessionResponse {
  token: string
}

export async function scheduler() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { default: axios } = await import('axios')
    const { Agent } = await import('https')

    const axiosInstance = axios.create({
      httpsAgent: new Agent({ rejectUnauthorized: false }),
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

    const refreshSession = async () => {
      const { randomUUID } = await import('crypto')
      const deviceId = randomUUID()

      axiosInstance
        .post<SessionResponse>(
          `${siteConfig.server.baseUrl}/backend-anon/sentinel/chat-requirements`,
          {},
          { headers: { 'oai-device-id': deviceId } }
        )
        .then((resp) => {
          const globals = GlobalsVars.getInstance()
          globals.oaiDeviceId = deviceId
          globals.token = resp.data.token

          console.log(
            `System: Successfully refreshed session ID and token. ${!resp.data.token ? "(Now it's ready to process requests)" : ''}`
          )
        })
        .catch((err) => {
          if (err.response) {
            console.error(
              `Error refreshing session ID and token: ${err.response.status}, ${err.response.statusText}`
            )
          } else {
            console.error(`Error refreshing session ID and token: ${err}`)
          }
        })
    }

    await refreshSession()
    const { CronJob } = await import('cron')
    const job = new CronJob(siteConfig.server.cron, refreshSession)
    job.start()
  }
}
