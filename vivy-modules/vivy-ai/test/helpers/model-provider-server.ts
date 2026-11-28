import { createServer } from 'node:http'
import type { ServerResponse } from 'node:http'

export interface ModelProviderRequest {
  path: string
  body: Record<string, unknown>
  authorization?: string
}

/** 本地供应商协议模拟，真实SDK请求不访问外部模型服务。 */
export async function modelProviderServer() {
  const requests: ModelProviderRequest[] = []
  const server = createServer(async (request, response) => {
    const buffers: Buffer[] = []
    for await (const chunk of request) buffers.push(Buffer.from(chunk))
    const body = JSON.parse(Buffer.concat(buffers).toString('utf8')) as Record<string, unknown>
    requests.push({ path: request.url, body, authorization: request.headers.authorization })
    if (body.model === 'fixture-auth-failure') {
      response.writeHead(401, { 'content-type': 'application/json' })
      response.end(
        JSON.stringify({
          error: { type: 'authentication_error', message: 'Rejected ' + request.headers.authorization },
        })
      )
      return
    }
    if (body.model === 'fixture-timeout') return
    response.writeHead(200, { 'content-type': 'text/event-stream' })
    const tool = Array.isArray(body.tools) && body.tools.length > 0
    if (request.url === '/v1/messages') {
      anthropicStream(response, tool)
    } else {
      openaiStream(response, tool)
    }
    response.end()
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('Missing fixture address')
  return {
    url: 'http://127.0.0.1:' + address.port,
    requests,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()))
        server.closeAllConnections()
      }),
  }
}

function openaiStream(response: ServerResponse, tool: boolean) {
  const emit = (delta: Record<string, unknown>, finishReason: string | null = null) => {
    response.write(
      'data: ' +
        JSON.stringify({
          id: 'chat-fixture',
          object: 'chat.completion.chunk',
          created: 1,
          model: 'fixture',
          choices: [{ index: 0, delta, finish_reason: finishReason }],
        }) +
        '\n\n'
    )
  }
  emit({ role: 'assistant', content: '' })
  if (tool) {
    emit({
      tool_calls: [
        {
          index: 0,
          id: 'call-fixture',
          type: 'function',
          function: { name: 'ai_connection_check', arguments: '{"message":' },
        },
      ],
    })
    emit({ tool_calls: [{ index: 0, function: { arguments: '"连接成功"}' } }] })
    emit({}, 'tool_calls')
  } else {
    emit({ content: '连接' })
    emit({ content: '成功' })
    emit({}, 'stop')
  }
  response.write('data: [DONE]\n\n')
}

function anthropicStream(response: ServerResponse, tool: boolean) {
  const emit = (type: string, data: Record<string, unknown>) => {
    response.write('event: ' + type + '\ndata: ' + JSON.stringify({ type, ...data }) + '\n\n')
  }
  emit('message_start', {
    message: {
      id: 'msg-fixture',
      type: 'message',
      role: 'assistant',
      model: 'fixture',
      content: [],
      stop_reason: null,
      stop_sequence: null,
      usage: { input_tokens: 10, output_tokens: 0 },
    },
  })
  if (tool) {
    emit('content_block_start', {
      index: 0,
      content_block: { type: 'tool_use', id: 'call-fixture', name: 'ai_connection_check', input: {} },
    })
    emit('content_block_delta', { index: 0, delta: { type: 'input_json_delta', partial_json: '{"message":' } })
    emit('content_block_delta', { index: 0, delta: { type: 'input_json_delta', partial_json: '"连接成功"}' } })
  } else {
    emit('content_block_start', { index: 0, content_block: { type: 'text', text: '' } })
    emit('content_block_delta', { index: 0, delta: { type: 'text_delta', text: '连接' } })
    emit('content_block_delta', { index: 0, delta: { type: 'text_delta', text: '成功' } })
  }
  emit('content_block_stop', { index: 0 })
  emit('message_delta', {
    delta: { stop_reason: tool ? 'tool_use' : 'end_turn', stop_sequence: null },
    usage: { output_tokens: 4 },
  })
  emit('message_stop', {})
}
