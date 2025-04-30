import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
export const useTestStore = defineStore('test-store', () => {
  // State - 使用 ref 定义响应式状态
  const count = ref(0)

  // Getters - 使用 computed 定义
  const doubleCount = computed(() => count.value * 2)

  // Actions - 直接定义函数
  function increment () {
    count.value++
  }

  return {
    count,
    doubleCount,
    increment
  }
})
