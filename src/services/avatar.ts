import type { AvatarConfig } from '../types'
import { generateContainerId, getPromiseState } from '../utils'
import { SDK_CONFIG, APP_CONFIG } from '../constants'

interface AvatarCallbacks {
  onSubtitleOn: (text: string) => void
  onSubtitleOff: () => void
  onStateChange: (state: string) => void
}

class AvatarService {
  private containerId: string

  constructor() {
    this.containerId = generateContainerId()
  }

  /**
   * 获取容器ID
   * @returns {string} - 返回随机生成的容器ID
   */
  getContainerId(): string {
    return this.containerId
  }

  /**
   * 连接虚拟人SDK
   * @param config - 虚拟人配置对象
   * @param config.appId - 应用ID
   * @param config.appSecret - 应用密钥
   * @param callbacks - 回调函数集合
   * @param callbacks.onSubtitleOn - 字幕显示回调
   * @param callbacks.onSubtitleOff - 字幕隐藏回调
   * @param callbacks.onStateChange - 状态变化回调
   * @returns {Promise<any>} - 返回虚拟人SDK实例
   * @throws {Error} - 当连接失败时抛出错误
   */
  async connect(config: AvatarConfig, callbacks: AvatarCallbacks): Promise<any> {
    const { appId, appSecret } = config
    const { onSubtitleOn, onSubtitleOff, onStateChange } = callbacks

    // 构建网关URL
    const url = new URL(SDK_CONFIG.GATEWAY_URL)
    url.searchParams.append('data_source', SDK_CONFIG.DATA_SOURCE)
    url.searchParams.append('custom_id', SDK_CONFIG.CUSTOM_ID)

    // 连接Promise管理
    let resolve: (value: boolean) => void
    let reject: (reason?: any) => void
    const connectPromise = new Promise<boolean>((res, rej) => {
      resolve = res
      reject = rej
    })

    // SDK构造选项
    const constructorOptions = {
      containerId: `#${this.containerId}`,
      appId,
      appSecret,
      enableDebugger: false,
      gatewayServer: url.toString(),
      onWidgetEvent: (event: any) => {
        console.log('SDK事件:', event)
        if (event.type === 'subtitle_on') {
          onSubtitleOn(event.text)
        } else if (event.type === 'subtitle_off') {
          onSubtitleOff()
        }
      },
      onStateChange,
      onMessage: async (error: any) => {
        const state = await getPromiseState(connectPromise)
        const plainError = new Error(error.message)
        if (state === 'pending') {
          reject(plainError)
        }
      }
    }

    // 创建SDK实例
    const avatar = new window.XmovAvatar(constructorOptions)
    
    // 等待初始化
    await new Promise(resolve => {
      setTimeout(resolve, APP_CONFIG.AVATAR_INIT_TIMEOUT)
    })

    // 初始化SDK
    await avatar.init({
      onDownloadProgress: (progress: number) => {
        console.log(`初始化进度: ${progress}%`)
        if (progress >= 100) {
          resolve(true)
        }
      },
      onClose: () => {
        onStateChange('')
        console.log('SDK连接关闭')
      }
    })

    // 等待连接完成
    const [result] = await Promise.allSettled([
      connectPromise,
      new Promise(resolve => setTimeout(resolve, 1000))
    ])

    if (result.status === 'rejected') {
      console.error('SDK连接失败:', result.reason)
      throw result.reason
    }

    return avatar
  }

  /**
   * 断开虚拟人连接
   * @param avatar - 虚拟人SDK实例
   * @returns {void}
   */
  disconnect(avatar: any): void {
    if (!avatar) return
    
    try {
      avatar.stop()
      avatar.destroy()
    } catch (error) {
      console.error('断开连接时出错:', error)
    }
  }
}

export const avatarService = new AvatarService()