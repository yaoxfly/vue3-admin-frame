import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useKeepAliveStore = defineStore('keep-alive', () => {
  // 缓存的组件名列表
  const cachedComponents = ref<string[]>([])

  // 获取缓存组件列表
  const getCachedComponents = computed(() => cachedComponents.value)

  // 添加组件到缓存
  const addCachedComponent = (componentName: string) => {
    if (!cachedComponents.value.includes(componentName)) {
      cachedComponents.value.push(componentName)
    }
  }

  // 从缓存中移除组件
  const removeCachedComponent = (componentName: string) => {
    const index = cachedComponents.value.indexOf(componentName)
    if (index !== -1) {
      cachedComponents.value.splice(index, 1)
    }
  }

  // 清空所有缓存
  const clearAllCachedComponents = () => {
    cachedComponents.value = []
  }

  // 批量移除缓存组件
  const removeCachedComponents = (componentNames: string[]) => {
    componentNames.forEach(name => {
      removeCachedComponent(name)
    })
  }

  return {
    getCachedComponents,
    addCachedComponent,
    removeCachedComponent,
    clearAllCachedComponents,
    removeCachedComponents
  }
})
