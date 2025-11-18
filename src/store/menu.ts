import { defineStore } from 'pinia'
import { ref, computed, markRaw } from 'vue'
import { Location } from '@element-plus/icons-vue'

// 菜单项类型定义
export type MenuItem =
  // 分组项（可以没有 index，有 groupTitle）
  | {
      groupTitle: string
      index?: string
      title?: string
      icon?: string | Component
      disabled?: boolean
      children?: MenuItem[]
    }

  // 非分组项：非叶子节点（有 children，index 可选）
  | {
      groupTitle?: undefined
      index?: string
      children: MenuItem[]
      title?: string
      icon?: string | Component
      disabled?: boolean
    }

  // 非分组项：叶子节点（无 children，index 必填）
  | {
      groupTitle?: undefined
      index: string
      children?: undefined
      title?: string
      icon?: string | Component
      disabled?: boolean

    }

export const useMenuStore = defineStore('menu', () => {
  /** 菜单数据操作 */

  // 初始菜单数据--测试用，可以在这里请求接口
  const initialMenu: MenuItem[] = [
    {
      title: '范例',
      icon: markRaw(Location),
      children: [
        {
          groupTitle: '分组1',
          children: [
            { index: '/test', title: '演示' }
          ]
        },
        {
          groupTitle: '分组2',
          children: [
            { index: '/home', title: '首页' }
          ]
        }
      ]
    },

    {
      index: '/tag-test',
      title: '标签测试',
      icon: markRaw(Location)
    },
    {
      index: '/vue-test',
      title: 'vue测试',
      icon: markRaw(Location)
    }
  ]

  const menu = ref<MenuItem[]>(initialMenu)

  const getMenu = computed(() => menu.value)

  const setMenu = (newMenu: MenuItem[]) => {
    menu.value = newMenu
  }

  /** 收缩按钮 */

  const isCollapse = ref(false)

  const getIsCollapse = computed(() => {
    return isCollapse.value
  })

  const setIsCollapse = (val: boolean) => {
    isCollapse.value = val
  }

  return {
    getMenu,
    setMenu,
    getIsCollapse,
    setIsCollapse
  }
})
