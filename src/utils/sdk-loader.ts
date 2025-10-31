/**
 * SDK加载工具
 * 确保必要的SDK正确加载
 */

// 检查SDK是否已加载
export function checkSDKStatus() {
  const status = {
    cryptoJS: !!window.CryptoJSTest,
    speechRecognizer: !!window.WebAudioSpeechRecognizer,
    xmovAvatar: !!window.XmovAvatar
  }
  
  console.log('SDK加载状态:', status)
  return status
}

// 等待SDK加载
export function waitForSDK(sdkName: keyof ReturnType<typeof checkSDKStatus>, timeout = 10000): Promise<boolean> {
  return new Promise((resolve) => {
    const startTime = Date.now()
    
    const check = () => {
      const status = checkSDKStatus()
      
      if (status[sdkName]) {
        resolve(true)
        return
      }
      
      if (Date.now() - startTime > timeout) {
        console.error(`${sdkName} SDK加载超时`)
        resolve(false)
        return
      }
      
      setTimeout(check, 100)
    }
    
    check()
  })
}

// 动态加载SDK
export function loadSDK(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // 检查是否已经加载
    const existingScript = document.querySelector(`script[src="${src}"]`)
    if (existingScript) {
      resolve()
      return
    }
    
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    
    document.head.appendChild(script)
  })
}

// 确保所有SDK加载完成
export async function ensureSDKsLoaded(): Promise<boolean> {
  try {
    // 尝试加载本地SDK
    await Promise.all([
      loadSDK('/cryptojs.js').catch(() => {
        console.warn('本地cryptojs.js加载失败，尝试CDN')
        return loadSDK('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js')
      }),
      loadSDK('/speechrecognizer.js'),
      loadSDK('https://media.xingyun3d.com/xingyun3d/general/litesdk/xmovAvatar.0.1.0-alpha.63.js')
    ])
    
    // 等待SDK初始化
    await Promise.all([
      waitForSDK('cryptoJS'),
      waitForSDK('speechRecognizer'),
      waitForSDK('xmovAvatar')
    ])
    
    console.log('所有SDK加载完成')
    return true
  } catch (error) {
    console.error('SDK加载失败:', error)
    return false
  }
}

// 初始化SDK
export async function initSDKs() {
  const loaded = await ensureSDKsLoaded()
  
  if (!loaded) {
    console.error('SDK初始化失败')
    return false
  }
  
  // 设置CryptoJS全局变量（如果使用CDN版本）
  if (!window.CryptoJSTest && window.CryptoJS) {
    window.CryptoJSTest = window.CryptoJS
  }
  
  return true
}
