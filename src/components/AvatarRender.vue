<template>
  <div ref="containerRef" class="avatar-render">
    <!-- SDK 渲染容器 -->
    <div :id="containerId" class="sdk-container" />
    
    <!-- 字幕显示 -->
    <div v-show="appState.ui.subTitleText" class="subtitle">
      {{ appState.ui.subTitleText }}
    </div>
    
    <!-- 语音输入动画 -->
    <div v-show="appState.asr.isListening" class="voice-animation">
      <img :src="siriIcon" alt="语音输入" />
    </div>
    
    <!-- 加载状态 -->
    <div v-if="!appState.avatar.connected" class="loading-placeholder">
      <div class="loading-text">-- 正在连接 --</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import { avatarService } from '../services/avatar'
import type { AppState } from '../types'
import siriIcon from '../assets/siri.png'

// 注入全局状态
const appState = inject<AppState>('appState')!

// 获取容器ID
const containerId = computed(() => avatarService.getContainerId())
</script>

<style scoped>
.avatar-render {
  flex: 1;
  position: relative;
  border-right: 1px solid #e0e0e0;
  background: #f5f5f5;
}

.sdk-container {
  width: 100%;
  height: 100%;
}

.subtitle {
  position: absolute;
  z-index: 100;
  bottom: 220px;
  left: 50%;
  width: 375px;
  max-width: 90%;
  word-break: break-word;
  text-align: center;
  transform: translateX(-50%);
  font-size: 20px;
  color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 8px 16px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
}

.voice-animation {
  position: absolute;
  left: 50%;
  top: 75%;
  transform: translateX(-50%);
  width: 360px;
  max-width: 90%;
  z-index: 101;
}

.voice-animation > img {
  width: 100%;
  height: auto;
}

.loading-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
}

.loading-text {
  font-size: 18px;
  color: #666;
  font-weight: 500;
}
</style>
