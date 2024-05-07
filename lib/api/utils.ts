import { getRandomValues } from 'crypto'
import { NextApiResponse } from 'next'

export const handleUnauthorized = (res: NextApiResponse) => {
  res.status(401).json({ error: 'Incorrect API key provided' })
}

export const handleMethodNotAllowed = (res: NextApiResponse) => {
  res.status(405).json({ error: 'Method not allowed' })
}

export const handleInvalidInput = (res: NextApiResponse) => {
  res.status(400).json({ error: 'Invalid input: messages must be an array.' })
}

export const handleInvalidSession = (res: NextApiResponse) => {
  res.status(405).json({ error: 'Error getting a new session, please try again later.' })
}

export const setupResponseHeader = (res: NextApiResponse, stream: boolean) => {
  const headers = {
    'Content-Type': stream ? 'text/event-stream' : 'application/json',
    ...(stream ? { 'Cache-Control': 'no-cache' } : {}),
    ...(stream ? { Connection: 'keep-alive' } : {}),
  }
  Object.entries(headers).forEach(([key, value]) => res.setHeader(key, value))
}

export function GenerateCompletionId(prefix: string = 'chatcmpl-') {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const length = 28
  const randomBytes = new Uint8Array(length)
  getRandomValues(randomBytes)

  return prefix + Array.from(randomBytes, (byte) => chars[byte % chars.length]).join('')
}

type DataChunk = Buffer | string

async function* chunksToLines(chunks: AsyncIterable<DataChunk>): AsyncGenerator<string> {
  let previous = ''
  for await (const chunk of chunks) {
    const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    previous += bufferChunk
    let eolIndex: number
    while ((eolIndex = previous.indexOf('\n')) >= 0) {
      const line = previous.substring(0, eolIndex + 1).trimEnd()
      if (line === 'data: [DONE]') break
      if (line.startsWith('data: ')) yield line
      previous = previous.slice(eolIndex + 1)
    }
  }
}

async function* linesToMessages(lines: AsyncIterable<string>): AsyncGenerator<string> {
  for await (const line of lines) {
    const message = line.substring('data :'.length)
    yield message
  }
}

export async function* streamCompletion(data: AsyncIterable<DataChunk>) {
  yield* linesToMessages(chunksToLines(data))
}
