# XmovAvatarSDK

这是一个基于魔珐星云sdk构建的智能虚拟人交互演示应用，集成了语音识别、大语言模型和虚拟人SDK，提供完整的语音交互体验。

## 📋 功能特性

- **🎭 虚拟人渲染**: 基于 XmovAvatar SDK 的3D虚拟人渲染
- **🎤 语音识别**: 集成腾讯云ASR实现实时语音转文字
- **🤖 AI对话**: 支持豆包大模型进行智能对话
- **💬 字幕显示**: 实时显示语音识别结果和AI回复
- **🎙️ 语音输入**: 支持语音输入和文本输入两种交互方式
- **⚙️ 配置管理**: 灵活的配置界面，支持多种API配置

## 技术交流群
技术交流&&邀请码获取
![Fay.魔珐星云SDK技术交流群](wechatgroup.jpg)


## 🏗️ 项目结构

```
src/
├── App.vue                    # 应用主组件
├── main.ts                    # 应用入口
├── style.css                  # 全局样式
├── vite-env.d.ts             # Vite环境类型声明
├── components/                # Vue组件
│   ├── AvatarRender.vue      # 虚拟人渲染组件
│   └── ConfigPanel.vue       # 配置面板组件
├── stores/                    # 状态管理
│   ├── app.ts                # 应用状态和业务逻辑
│   └── sdk-test.html         # SDK测试页面
├── services/                  # 服务层
│   ├── avatar.ts             # 虚拟人SDK服务
│   └── llm.ts                # 大语言模型服务
├── composables/               # Vue组合式函数
│   └── useAsr.ts             # 语音识别Hook
├── types/                     # TypeScript类型定义
│   └── index.ts              # 统一类型导出
├── constants/                 # 常量定义
│   └── index.ts              # 应用常量
├── utils/                     # 工具函数
│   ├── index.ts              # 通用工具函数
│   └── sdk-loader.ts         # SDK加载器
├── lib/                       # 第三方库封装
│   └── asr.ts                # 语音识别底层服务
└── assets/                    # 静态资源
    ├── siri.png              # 语音识别动画图标
    └── vue.svg               # Vue Logo
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- pnpm (推荐)

### 安装依赖

```bash
pnpm install
```

### 开发环境运行

```bash
pnpm run dev
```

### 构建生产版本

```bash
pnpm run build
```

### 预览构建结果

```bash
pnpm run preview
```

## ⚙️ 配置说明

在使用本应用前，需要配置以下参数：

### 1. 虚拟人SDK配置
- **应用APP ID**: XmovAvatar SDK的应用ID
- **应用APP Secret**: XmovAvatar SDK的应用密钥

### 2. 语音识别配置（腾讯云ASR）
- **ASR App ID**: 腾讯云语音识别应用ID
- **ASR Secret ID**: 腾讯云访问密钥ID
- **ASR Secret Key**: 腾讯云访问密钥

### 3. 大语言模型配置
- **大模型**: 当前支持 `doubao-1-5-pro-32k-250115`
- **大模型Key**: 对应API的访问密钥

## 🎯 使用指南

1. **配置参数**: 在右侧配置面板中填入所需的API配置信息
2. **建立连接**: 点击"连接"按钮初始化虚拟人SDK
3. **文本交互**: 在文本框中输入内容，点击"发送"进行对话
4. **语音交互**: 点击"语音输入"按钮进行语音对话
5. **查看回复**: 虚拟人会播报AI回复，同时显示字幕

## 🔧 技术栈

- **前端框架**: Vue 3 (Composition API)
- **开发语言**: TypeScript
- **构建工具**: Vite
- **虚拟人SDK**: XmovAvatar
- **语音识别**: 腾讯云ASR
- **大语言模型**: 豆包API (基于OpenAI兼容接口)

## 📦 核心依赖

```json
{
  "vue": "3.5.18",
  "openai": "5.12.2",
  "typescript": "~5.8.3",
  "vite": "7.1.2",
  "@vitejs/plugin-vue": "6.0.1",
  "vue-tsc": "3.0.5"
}
```

## 🎨 界面说明

### 主界面布局
- **左侧**: 虚拟人渲染区域，显示3D虚拟人和字幕
- **右侧**: 配置和控制面板

### 交互元素
- **字幕区域**: 显示语音识别结果和AI回复
- **语音动画**: 语音输入时显示Siri风格动画
- **加载状态**: 连接建立前显示加载提示

## 🔥 核心功能实现

### 虚拟人渲染
```typescript
// 连接虚拟人SDK
const avatar = await avatarService.connect(appId, appSecret, subtitleCallback, closeCallback)
```

### 语音识别
```typescript
// 使用语音识别Hook
const { start, stop, asrText } = useAsr(config, vadTime)
```

### AI对话
```typescript
// 发送消息到大语言模型
const answer = await llmService.send(model, text)
```

## 🔑 关键组件介绍

### Store (状态管理)
`src/stores/app.ts` - 全局状态管理中心
- **功能**: 管理应用状态、SDK连接、配置信息
- **核心方法**:
  - `connect()`: 建立虚拟人SDK连接
  - `destroy()`: 断开连接并清理资源
  - `sendToLLM()`: 发送消息到大语言模型
- **状态属性**: appId、appSecret、llmKey、connected等

### AvatarRender (虚拟人渲染组件)
`src/components/AvatarRender.vue` - 虚拟人展示组件
- **功能**: 渲染3D虚拟人、显示字幕、语音动画
- **特性**:
  - 动态容器ID生成
  - 字幕实时显示
  - 语音输入状态指示
  - 连接状态管理

### ConfigPanel (配置面板组件)
`src/components/ConfigPanel.vue` - 配置和控制面板
- **功能**: API配置、连接控制、文本输入、语音输入
- **配置项**:
  - 虚拟人SDK配置 (appId、appSecret)
  - ASR配置 (腾讯云相关参数)
  - 大模型配置 (模型选择、API密钥)
- **操作按钮**: 连接/断开、语音输入、发送消息

### AvatarService (虚拟人SDK服务)
`src/services/avatar.ts` - XmovAvatar SDK封装
- **功能**: 
  - SDK初始化和连接管理
  - 事件回调处理 (字幕、状态变化)
  - 错误处理和重连机制
- **核心特性**:
  - 随机容器ID生成
  - 状态监听 (speak、think等)
  - 字幕事件处理

### LLM服务 (大语言模型)
`src/services/llm.ts` - 大语言模型服务封装
- **功能**: 
  - OpenAI兼容API调用
  - 支持流式和非流式响应
  - 豆包API集成
- **配置**: 
  - 基础URL: `https://ark.cn-beijing.volces.com/api/v3`
  - 支持模型: `doubao-1-5-pro-32k-250115`

### ASR Hook (语音识别)
`src/composables/useAsr.ts` - 语音识别复用逻辑
- **功能**:
  - 腾讯云ASR集成
  - 语音识别生命周期管理
  - VAD (语音活动检测) 配置
- **事件处理**:
  - 识别开始/结束
  - 实时识别结果
  - 错误处理

### 工具函数
- `src/utils/index.ts`: 通用工具函数集合
- `src/utils/sdk-loader.ts`: SDK动态加载器
- `src/lib/asr.ts`: 腾讯云ASR签名和配置

## 📝 注意事项

1. **API配置**: 确保所有API配置信息正确填写
2. **网络连接**: 需要稳定的网络连接以确保SDK和API正常工作
3. **浏览器兼容**: 建议使用现代浏览器以获得最佳体验
4. **麦克风权限**: 语音功能需要浏览器麦克风权限

## 🌐 相关项目

### Web Director (网页导办)
`apps/web-director/` - 网页导办演示项目
- **功能**: 提供网页导办服务的交互界面
- **特性**:
  - 响应式设计，适配不同屏幕尺寸
  - 支持麦克风权限的 iframe 嵌入
  - 一键展开/收起交互体验
- **技术**: 纯 HTML + CSS + JavaScript
- **访问**: 通过 HTTP 服务器访问 `http://localhost:8000/demo.html`

## 📄 许可证

本项目仅供学习和演示使用。