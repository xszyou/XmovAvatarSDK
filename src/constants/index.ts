// 应用常量
export const APP_CONFIG = {
  CONTAINER_PREFIX: 'CONTAINER_',
  DEFAULT_VAD_SILENCE_TIME: 300,
  AVATAR_INIT_TIMEOUT: 3000,
  SPEAK_INTERRUPT_DELAY: 2000
} as const

// LLM配置
export const LLM_CONFIG = {
  BASE_URL: 'https://ark.cn-beijing.volces.com/api/v3',
  DEFAULT_MODEL: 'doubao-1-5-pro-32k-250115',
  SYSTEM_PROMPT: '你是人工智能助手'
} as const

// ASR配置
export const ASR_CONFIG = {
  ENGINE_MODEL_TYPE: '16k_zh',
  VOICE_FORMAT: 1,
  FILTER_DIRTY: 1,
  FILTER_MODAL: 1,
  FILTER_PUNC: 1,
  CONVERT_NUM_MODE: 1,
  WORD_INFO: 2,
  NEEDVAD: 1
} as const

// SDK配置
export const SDK_CONFIG = {
  GATEWAY_URL: 'https://nebula-agent.xingyun3d.com/user/v1/ttsa/session',
  DATA_SOURCE: '2',
  CUSTOM_ID: 'demo'
} as const

// 支持的LLM模型列表
export const SUPPORTED_LLM_MODELS = [
  'doubao-1-5-pro-32k-250115'
] as const

// 支持的ASR提供商
export const SUPPORTED_ASR_PROVIDERS = [
  { value: 'tx', label: '腾讯' }
] as const
