import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 定义标签类型
interface TagItem {
  path: string
  title: string
}

export const useLayTag = defineStore('lay-tag', () => {
  // State - 使用 ref 定义响应式状态
  const tags = ref<TagItem[]>([])
  const activeTag = ref<string>('')

  // Getters - 使用 computed 定义
  const getTags = computed(() => tags.value)
  const getActiveTag = computed(() => activeTag.value)

  // Actions - 直接定义函数
  function setTag (path: string, title: string) {
    // 检查是否存在相同path的标签，确保去重
    const exists = tags.value.some(item => item.path === path)
    if (!exists) {
      tags.value.push({ path, title })
    }

    // 设置当前活动标签
    activeTag.value = path
  }

  function removeTag (path: string) {
    const index = tags.value.findIndex(item => item.path === path)
    if (index !== -1) {
      tags.value.splice(index, 1)
    }
  }

  function setActiveTag (path: string) {
    activeTag.value = path
  }

  // 清空所有标签
  function clearAllTags () {
    tags.value = []
    activeTag.value = ''
  }

  return {
    tags,
    activeTag,
    getTags,
    getActiveTag,
    setTag,
    removeTag,
    setActiveTag,
    clearAllTags
  }
})
