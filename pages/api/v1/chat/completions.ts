import * as url from 'url'
import { NextApiRequest, NextApiResponse } from 'next'
import { encode } from 'gpt-3-encoder'

import { siteConfig } from '@/config/site'
import axiosInstanceIterator from '@/lib/axios'
import { createBody } from '@/lib/body'
import { cors, corsMiddleware } from '@/lib/cors'
import { ProofTokenGenerator } from '@/lib/proof'
import { refreshSession } from '@/lib/refresh'
import {
  GenerateCompletionId,
  handleInvalidInput,
  handleInvalidSession,
  handleMethodNotAllowed,
  handleUnauthorized,
  setupResponseHeader,
  streamCompletion,
} from '@/lib/utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res, cors)

  if (siteConfig.server.apiKey) {
    const clientApiKey = req.headers.authorization?.split(' ')[1] ?? null
    if (!clientApiKey || clientApiKey != siteConfig.server.apiKey) {
      handleUnauthorized(res)
      return
    }
  }

  if (req.method !== 'POST') {
    handleMethodNotAllowed(res)
    return
  }

  const messages = req.body.messages
  if (!messages || !Array.isArray(messages)) {
    handleInvalidInput(res)
    return
  }

  const { axiosInstance, session } = await refreshSession(axiosInstanceIterator)
  if (!session) {
    handleInvalidSession(res)
    return
  }

  const body = createBody(messages)
  setupResponseHeader(res, !!req.body.stream)

  axiosInstance
    .post(url.resolve(siteConfig.server.baseUrl, siteConfig.server.apiUrl), body, {
      responseType: 'stream',
      headers: {
        'oai-device-id': session.deviceId,
        'openai-sentinel-chat-requirements-token': session.token,
        'openai-sentinel-proof-token': ProofTokenGenerator.generateToken({
          seed: session.proofofwork.seed,
          difficulty: session.proofofwork.difficulty,
          userAgent: siteConfig.server.userAgent,
        }),
      },
    })
    .then((resp) => {
      processStream(req, res, resp.data)
    })
    .catch((err) => {
      if (!res.headersSent) res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ status: false, err }))
    })
}

async function processStream(req: NextApiRequest, res: NextApiResponse, data: any) {
  let finish_reason: string | null = null
  let error: string | null = null
  let fullContent = ''
  let completionTokens = 0
  const requestId = GenerateCompletionId('chatcmpl-')
  const created = Math.floor(Date.now() / 1000)

  for await (const message of streamCompletion(data)) {
    if (message.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{6}$/)) continue

    const parsed = JSON.parse(message)
    if (parsed.error) {
      error = `Error message from OpenAI: ${parsed.error}`
      finish_reason = 'stop'
      break
    }
    let content = parsed?.message?.content?.parts[0] ?? ''
    let status = parsed?.message?.status ?? ''

    for (let message of req.body.messages) {
      if (message.content === content) {
        content = ''
        break
      }
    }

    switch (status) {
      case 'in_progress':
        finish_reason = null
        break
      case 'finished_successfully':
        let finish_reason_data = parsed?.message?.metadata?.finish_details?.type ?? null
        switch (finish_reason_data) {
          case 'max_tokens':
            finish_reason = 'length'
            break
          case 'stop':
          default:
            finish_reason = 'stop'
        }
        break
      default:
        finish_reason = null
    }

    if (content === '') continue

    let completionChunk = content.replace(fullContent, '')
    completionTokens += encode(completionChunk).length

    if (req.body.stream) {
      let response = {
        id: requestId,
        created: created,
        object: 'chat.completion.chunk',
        model: 'gpt-3.5-turbo',
        choices: [
          {
            delta: {
              content: completionChunk,
            },
            index: 0,
            finish_reason: finish_reason,
          },
        ],
      }

      res.write(`data: ${JSON.stringify(response)}\n\n`)
    }

    fullContent = content.length > fullContent.length ? content : fullContent
  }

  if (req.body.stream) {
    res.write(
      `data: ${JSON.stringify({
        id: requestId,
        created: created,
        object: 'chat.completion.chunk',
        model: 'gpt-3.5-turbo',
        choices: [
          {
            delta: {
              content: error ?? '',
            },
            index: 0,
            finish_reason: finish_reason,
          },
        ],
      })}\n\n`
    )
  } else {
    let promptTokens = 0
    for (let message of req.body.messages) {
      promptTokens += encode(message.content).length
    }

    res.write(
      JSON.stringify({
        id: requestId,
        created: created,
        model: 'gpt-3.5-turbo',
        object: 'chat.completion',
        choices: [
          {
            finish_reason: finish_reason,
            index: 0,
            message: {
              content: error ?? fullContent,
              role: 'assistant',
            },
          },
        ],
        usage: {
          prompt_tokens: promptTokens,
          completion_tokens: completionTokens,
          total_tokens: promptTokens + completionTokens,
        },
      })
    )
  }
  res.end()
}
