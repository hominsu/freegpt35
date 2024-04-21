import { randomUUID } from 'crypto'

import { siteConfig } from '@/config/site'
import axiosInstance from '@/lib/axios'

export type Session = {
  deviceId: string
  persona: string
  arkose: {
    required: boolean
    dx: any
  }
  turnstile: {
    required: boolean
  }
  proofofwork: {
    required: boolean
    seed: string
    difficulty: string
  }
  token: string
}

interface SessionResponse {
  token: string
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function refreshSession(retries: number = 0): Promise<Session | null> {
  const deviceId = randomUUID()
  return axiosInstance
    .post<SessionResponse>(
      `${siteConfig.server.baseUrl}/backend-anon/sentinel/chat-requirements`,
      {},
      { headers: { 'oai-device-id': deviceId } }
    )
    .then((resp) => {
      return {
        ...resp.data,
        deviceId,
      } as Session
    })
    .catch(async (err) => {
      if (err.response) {
        console.error(
          `Error refreshing session ID and token: ${err.response.status}, ${err.response.statusText}`
        )
      } else {
        console.error(`Error refreshing session ID and token: ${err}`)
      }
      await wait(500)
      return retries < Number(siteConfig.server.maxRetries) ? refreshSession(retries + 1) : null
    })
}
