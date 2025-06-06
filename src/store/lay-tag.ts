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
  const fill = ref<boolean>(false)

  // Getters - 使用 computed 定义，保持 getXxx 命名风格
  const getTags = computed(() => tags.value)
  const getActiveTag = computed(() => activeTag.value)
  const getFill = computed(() => fill.value)

  // 添加标签但不设置为活动标签
  const addTag = (path: string, title: string) => {
    // 检查是否存在相同path的标签，确保去重
    const exists = tags.value.some(item => item.path === path)
    if (!exists) {
      tags.value.push({ path, title })
    }
  }

  // 将标签添加到开头
  const addTagToStart = (path: string, title: string) => {
    // 检查是否存在相同path的标签，确保去重
    const exists = tags.value.some(item => item.path === path)
    if (!exists) {
      tags.value.unshift({ path, title })
    }
  }

  // Actions - 使用箭头函数
  const setTag = (path: string, title: string) => {
    // 检查是否存在相同path的标签，确保去重
    const exists = tags.value.some(item => item.path === path)
    if (!exists) {
      tags.value.push({ path, title })
    }

    // 设置当前活动标签
    activeTag.value = path
  }

  const removeTag = (path: string) => {
    const index = tags.value.findIndex(item => item.path === path)
    if (index !== -1) {
      tags.value.splice(index, 1)
    }
  }

  const setActiveTag = (path: string) => {
    activeTag.value = path
  }

  const setFill = (value: boolean) => {
    fill.value = value
  }

  // 清空所有标签
  const clearAllTags = () => {
    tags.value = []
    activeTag.value = ''
  }

  return {
    // 只暴露 getter，不暴露私有状态
    getTags,
    getActiveTag,
    getFill,
    // 暴露方法
    addTag,
    addTagToStart,
    setTag,
    removeTag,
    setActiveTag,
    clearAllTags,
    setFill
  }
})
