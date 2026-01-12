<script setup lang="ts">
import { computed } from 'vue'
import { useSetStore } from '@/store'

/*
 * This starter template is using Vue 3 <script setup> SFCs
 * Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
 */

const setStore = useSetStore()

// 根据配置判断是否启用灰色模式
const grayModeClass = computed(() => {
  return setStore.config.grayMode ? 'gray-mode' : ''
})
</script>

<template>
  <div :class="grayModeClass">
    <router-view />
  </div>
</template>
