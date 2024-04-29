import { randomUUID } from 'crypto'
import { AxiosInstance } from 'axios'

import { siteConfig } from '@/config/site'

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

export type SessionWithInstance = {
  axiosInstance: AxiosInstance
  session: Session | null
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function refreshSession(
  iterator: Generator<AxiosInstance, never, undefined>,
  retries: number = 0
): Promise<SessionWithInstance> {
  const deviceId = randomUUID()
  const axiosInstance = iterator.next().value
  return axiosInstance
    .post<SessionResponse>(
      `${siteConfig.server.baseUrl}/backend-anon/sentinel/chat-requirements`,
      {},
      { headers: { 'oai-device-id': deviceId } }
    )
    .then((resp) => {
      return {
        axiosInstance,
        session: {
          ...resp.data,
          deviceId,
        } as Session,
      }
    })
    .catch(async (err) => {
      if (err.response) {
        console.error(
          `Error refreshing session ID and token: ${err.response.status}, ${err.response.statusText}`
        )
      } else {
        console.error(`Error refreshing session ID and token: ${err}`)
      }
      await wait(250)
      return retries < Number(siteConfig.server.maxRetries)
        ? refreshSession(iterator, retries + 1)
        : { axiosInstance, session: null }
    })
}
