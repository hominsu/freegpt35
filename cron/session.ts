import { randomUUID } from 'crypto'
import { CronJob } from 'cron'

import { siteConfig } from '@/config/site'
import axiosInstance from '@/lib/axios'
import { GlobalsVars } from '@/lib/globals'

interface SessionResponse {
  token: string
}

async function getSessionId(): Promise<void> {
  const deviceId = randomUUID()

  try {
    const resp = await axiosInstance.post<SessionResponse>(
      `${siteConfig.server.baseUrl}/backend-anon/sentinel/chat-requirements`,
      {},
      {
        headers: { 'oai-device-id': deviceId },
      }
    )

    const globals = GlobalsVars.getInstance()
    globals.oaiDeviceId = deviceId
    globals.token = resp.data.token

    console.log(
      `System: Successfully refreshed session ID and token. ${!resp.data.token ? "(Now it's ready to process requests)" : ''}`
    )
  } catch (error: any) {
    console.error(
      `Error refreshing session ID and token: ${error.response.status}, ${error.response.statusText}`
    )
  }
}

export function scheduler() {
  getSessionId().then(() => {})
  const job = new CronJob('0 */10 * * * *', getSessionId)
  job.start()
}
