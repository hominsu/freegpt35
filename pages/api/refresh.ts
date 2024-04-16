import { randomUUID } from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next'

import { siteConfig } from '@/config/site'
import axiosInstance from '@/lib/axios'
import { cors, corsMiddleware } from '@/lib/cors'
import { GlobalsVars } from '@/lib/globals'

interface SessionResponse {
  token: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res, cors)

  const deviceId = randomUUID()

  axiosInstance
    .post<SessionResponse>(
      `${siteConfig.server.baseUrl}/backend-anon/sentinel/chat-requirements`,
      {},
      { headers: { 'oai-device-id': deviceId } }
    )
    .then((resp) => {
      const globals = GlobalsVars.getInstance()
      console.log(
        `System: Successfully refreshed session ID and token. ${globals.token === '' ? "(Now it's ready to process requests)" : ''}`
      )
      globals.oaiDeviceId = deviceId
      globals.token = resp.data.token
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

  res.status(200).json({ status: true })
}
