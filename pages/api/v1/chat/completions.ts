import * as url from 'url'
import { NextApiRequest, NextApiResponse } from 'next'
import { encode } from 'gpt-3-encoder'

import { siteConfig } from '@/config/site'
import axiosInstance from '@/lib/axios'
import { createBody } from '@/lib/body'
import { GlobalsVars } from '@/lib/globals'
import {
  GenerateCompletionId,
  handleInvalidInput,
  handleMethodNotAllowed,
  setupResponseHeader,
  streamCompletion,
} from '@/lib/utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    handleMethodNotAllowed(res)
    return
  }

  const messages = req.body.messages
  if (!messages || !Array.isArray(messages)) {
    handleInvalidInput(res)
    return
  }

  const body = createBody(messages)
  setupResponseHeader(res, !!req.body.stream)

  try {
    const chatResponse = await axiosInstance.post(
      url.resolve(siteConfig.server.baseUrl, siteConfig.server.apiUrl),
      body,
      {
        responseType: 'stream',
        headers: {
          'oai-device-id': GlobalsVars.getInstance().oaiDeviceId,
          'openai-sentinel-chat-requirements-token': GlobalsVars.getInstance().token,
        },
      }
    )

    await processStream(req, res, chatResponse.data)
  } catch (error: any) {
    if (!res.headersSent) res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ status: false, error }))
  }
}

async function processStream(req: NextApiRequest, res: NextApiResponse, data: any) {
  let finish_reason: string | null = null
  let fullContent = ''
  let completionTokens = 0
  const requestId = GenerateCompletionId('chatcmpl-')
  const created = Date.now()

  for await (const message of streamCompletion(data)) {
    if (message.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{6}$/)) continue

    const parsed = JSON.parse(message)
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
              content: '',
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
              content: fullContent,
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