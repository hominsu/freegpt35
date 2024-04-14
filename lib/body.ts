import { randomUUID } from 'crypto'

interface Message {
  role: string
  content: string
}

interface Body {
  action: string
  messages: { author: { role: string }; content: { content_type: string; parts: string[] } }[]
  parent_message_id: string
  model: string
  timezone_offset_min: number
  suggestions: string[]
  history_and_training_disabled: boolean
  conversation_mode: { kind: string }
  websocket_request_id: string
}

export const createBody = (
  messages: Message[],
  model: string = 'text-davinci-002-render-sha',
  timezoneOffset: number = -180
): Body => {
  return {
    action: 'next',
    messages: messages.map((msg: Message) => ({
      author: { role: msg.role },
      content: { content_type: 'text', parts: [msg.content] },
    })),
    parent_message_id: randomUUID(),
    model,
    timezone_offset_min: timezoneOffset,
    suggestions: [],
    history_and_training_disabled: true,
    conversation_mode: { kind: 'primary_assistant' },
    websocket_request_id: randomUUID(),
  }
}
