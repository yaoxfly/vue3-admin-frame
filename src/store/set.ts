import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
export interface AppConfig {
  hideTag: boolean
  hideLogo: boolean
  grayMode: boolean
}

export const useSetStore = defineStore('set', () => {
  // 应用配置项 - 使用 vueuse 的 useStorage 自动同步到 localStorage
  const config = useStorage<AppConfig>('config', {
    hideTag: false,
    hideLogo: false,
    grayMode: false
  })

  /**
   * 检查当前日期是否为清明节
   * 清明节通常在4月4日或4月5日
   */
  const isQingmingFestival = (): boolean => {
    const now = new Date()
    const month = now.getMonth() + 1 // 月份从0开始，需要+1
    const date = now.getDate()

    // 清明节通常在4月4日或4月5日
    return month === 4 && (date === 4 || date === 5)
  }

  /**
   * 自动设置清明节灰色模式
   * 如果是清明节，自动启用灰色模式
   */
  const autoSetQingmingGrayMode = () => {
    if (isQingmingFestival()) {
      config.value.grayMode = true
    }
  }

  // 初始化时检查清明节
  autoSetQingmingGrayMode()

  return {
    config,
    isQingmingFestival,
    autoSetQingmingGrayMode
  }
})
