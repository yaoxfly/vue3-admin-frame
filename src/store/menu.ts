import { defineStore } from 'pinia'
import { ref, computed, markRaw } from 'vue'
import { Location } from '@element-plus/icons-vue'

// 菜单项类型定义
export interface MenuItem {
  index: string
  title?: string
  icon?: string | any
  disabled?: boolean
  children?: MenuItem[]
  groupTitle?: string
}

export const useMenuStore = defineStore('menu', () => {
  const initialMenu: MenuItem[] = [
    {
      index: '/',
      title: '范例',
      icon: markRaw(Location),
      children: [
        {
          index: '/group1',
          groupTitle: '分组1',
          children: [
            { index: '/test', title: '演示' }
          ]
        },
        {
          index: '/group2',
          groupTitle: '分组2',
          children: [
            { index: '/home', title: '首页' }
          ]
        }
      ]
    }
  ]

  const menu = ref<MenuItem[]>(initialMenu)
  const isLoaded = ref(false)

  const getMenu = computed(() => menu.value)

  const setMenu = (newMenu: MenuItem[]) => {
    menu.value = newMenu
  }

  return {
    getMenu,
    setMenu,
    isLoaded
  }
})
