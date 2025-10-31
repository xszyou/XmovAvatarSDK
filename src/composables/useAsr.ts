import { ref } from 'vue'
import type { AsrConfig, AsrCallbacks } from '../types'
import { ASR_CONFIG } from '../constants'
import { signCallback } from '../lib/asr'

/**
 * 语音识别Composable
 * @param config - ASR配置对象
 * @param config.provider - ASR服务提供商（目前只支持'tx'）
 * @param config.appId - ASR应用ID
 * @param config.secretId - ASR密钥ID
 * @param config.secretKey - ASR密钥
 * @param config.vadSilenceTime - 可选的静音检测时间
 * @returns {object} - 返回包含asrText, isListening, start, stop的对象
 */
export function useAsr(config: AsrConfig) {
  const asrText = ref('')
  const isListening = ref(false)
  let webAudioSpeechRecognizer: any = null

  /**
   * 构建ASR配置
   * @param vadSilenceTime - 可选的静音检测时间
   * @returns {object} - 返回ASR配置对象
   */
  const buildAsrConfig = (vadSilenceTime?: number) => ({
    signCallback: signCallback.bind(null, config.secretKey),
    appid: config.appId,
    secretid: config.secretId,
    secretkey: config.secretKey,
    engine_model_type: ASR_CONFIG.ENGINE_MODEL_TYPE,
    voice_format: ASR_CONFIG.VOICE_FORMAT,
    filter_dirty: ASR_CONFIG.FILTER_DIRTY,
    filter_modal: ASR_CONFIG.FILTER_MODAL,
    filter_punc: ASR_CONFIG.FILTER_PUNC,
    convert_num_mode: ASR_CONFIG.CONVERT_NUM_MODE,
    word_info: ASR_CONFIG.WORD_INFO,
    needvad: ASR_CONFIG.NEEDVAD,
    vad_silence_time: vadSilenceTime || config.vadSilenceTime || 300
  })

  /**
   * 开始语音识别
   * @param callbacks - 回调函数集合
   * @param callbacks.onFinished - 识别完成回调
   * @param callbacks.onError - 识别错误回调
   * @param vadSilenceTime - 可选的静音检测时间
   * @returns {void}
   */
  const start = (callbacks: AsrCallbacks, vadSilenceTime?: number) => {
    if (isListening.value) {
      console.warn('语音识别已在进行中')
      return
    }

    // 检查WebAudioSpeechRecognizer是否可用
    if (!window.WebAudioSpeechRecognizer) {
      console.error('WebAudioSpeechRecognizer 未加载')
      callbacks.onError('WebAudioSpeechRecognizer 未加载')
      return
    }

    // 验证必要的配置
    if (!config.appId || !config.secretId || !config.secretKey) {
      console.error('ASR配置不完整')
      callbacks.onError('ASR配置不完整，请检查App ID、Secret ID和Secret Key')
      return
    }

    const asrConfig = buildAsrConfig(vadSilenceTime)
    console.log('ASR配置:', asrConfig)
    
    try {
      webAudioSpeechRecognizer = new window.WebAudioSpeechRecognizer(asrConfig)
      
      // 设置事件监听
      setupEventListeners(callbacks)
      
      // 开始识别
      webAudioSpeechRecognizer.start()
      isListening.value = true
      console.log('开始语音识别')
    } catch (error) {
      console.error('创建WebAudioSpeechRecognizer失败:', error)
      callbacks.onError(error)
    }
  }

  /**
   * 停止语音识别
   * @returns {void}
   */
  const stop = () => {
    if (webAudioSpeechRecognizer) {
      webAudioSpeechRecognizer.stop()
      webAudioSpeechRecognizer = null
    }
    isListening.value = false
    console.log('停止语音识别')
  }

  /**
   * 设置事件监听器
   * @param callbacks - 回调函数集合
   * @param callbacks.onFinished - 识别完成回调
   * @param callbacks.onError - 识别错误回调
   * @returns {void}
   */
  const setupEventListeners = (callbacks: AsrCallbacks) => {
    // 开始识别
    webAudioSpeechRecognizer.OnRecognitionStart = (res: any) => {
      console.log('识别开始:', res)
    }

    // 一句话开始
    webAudioSpeechRecognizer.OnSentenceBegin = (res: any) => {
      console.log('句子开始:', res)
      asrText.value = ''
    }

    // 识别结果变化
    webAudioSpeechRecognizer.OnRecognitionResultChange = (res: any) => {
      const currentText = res.result?.voice_text_str
      if (currentText) {
        asrText.value = currentText
        console.log('识别中:', currentText)
      }
    }

    // 一句话结束
    webAudioSpeechRecognizer.OnSentenceEnd = (res: any) => {
      const resultText = res.result?.voice_text_str
      console.log('句子结束:', resultText)
      
      if (resultText) {
        asrText.value = resultText
        callbacks.onFinished(resultText)
      }
    }

    // 识别完成
    webAudioSpeechRecognizer.OnRecognitionComplete = (res: any) => {
      console.log('识别完成:', res)
      isListening.value = false
    }

    // 识别错误
    webAudioSpeechRecognizer.OnError = (res: any) => {
      console.error('识别错误:', res)
      callbacks.onError(res)
      isListening.value = false
    }
  }

  return {
    asrText,
    isListening,
    start,
    stop
  }
}
