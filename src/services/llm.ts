import OpenAI from 'openai'
import type { LlmConfig, ChatMessage } from '../types'
import { LLM_CONFIG } from '../constants'

class LlmService {
  private openai: OpenAI | null = null
  private currentApiKey: string = ''

  /**
   * 初始化LLM客户端
   * @param config - LLM配置对象
   * @param config.apiKey - API密钥
   * @param config.model - 模型名称
   * @param config.baseURL - 可选的基础URL
   * @returns void
   */
  private initClient(config: LlmConfig): void {
    if (this.currentApiKey === config.apiKey && this.openai) {
      return
    }

    this.openai = new OpenAI({
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: true,
      baseURL: config.baseURL || LLM_CONFIG.BASE_URL
    })
    
    this.currentApiKey = config.apiKey
  }

  /**
   * 发送消息到大语言模型
   * @param config - LLM配置对象
   * @param config.apiKey - API密钥
   * @param config.model - 模型名称
   * @param config.baseURL - 可选的基础URL
   * @param userMessage - 用户输入的消息内容
   * @returns Promise<string | null> - 返回模型的回复内容，失败时返回null
   * @throws {Error} - 当LLM客户端未初始化或请求失败时抛出错误
   */
  async sendMessage(config: LlmConfig, userMessage: string): Promise<string | null> {
    this.initClient(config)
    
    if (!this.openai) {
      throw new Error('LLM客户端未初始化')
    }

    const messages: ChatMessage[] = [
      { role: 'system', content: LLM_CONFIG.SYSTEM_PROMPT },
      { role: 'user', content: userMessage }
    ]

    try {
      console.log('发送LLM请求:', { model: config.model, message: userMessage })
      
      const completion = await this.openai.chat.completions.create({
        messages,
        model: config.model
      })

      const response = completion.choices[0]?.message?.content
      console.log('LLM响应:', response)
      
      return response || null
    } catch (error) {
      console.error('LLM请求失败:', error)
      throw error
    }
  }

  /**
   * 流式发送消息（预留接口）
   * @param config - LLM配置对象
   * @param config.apiKey - API密钥
   * @param config.model - 模型名称
   * @param config.baseURL - 可选的基础URL
   * @param userMessage - 用户输入的消息内容
   * @returns Promise<AsyncIterable<string>> - 返回异步可迭代的字符串流
   * @throws {Error} - 当LLM客户端未初始化或请求失败时抛出错误
   */
  async sendMessageWithStream(config: LlmConfig, userMessage: string): Promise<AsyncIterable<string>> {
    this.initClient(config)
    
    if (!this.openai) {
      throw new Error('LLM客户端未初始化')
    }

    const messages: ChatMessage[] = [
      { role: 'system', content: LLM_CONFIG.SYSTEM_PROMPT },
      { role: 'user', content: userMessage }
    ]

    const stream = await this.openai.chat.completions.create({
      messages,
      model: config.model,
      stream: true
    })

    return (async function* () {
      for await (const part of stream) {
        const content = part.choices[0]?.delta?.content
        if (content) {
          yield content
        }
      }
    })()
  }
}

export const llmService = new LlmService()