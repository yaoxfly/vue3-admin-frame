import { useKeepAliveStore } from '@/store'
import { useRouter, useRoute } from 'vue-router'
import { onMounted, onBeforeUnmount } from 'vue'

// 全局标记，避免重复注册路由守卫
let isRouterGuardRegistered = false

/**
 * 页面缓存管理Hook
 * 核心逻辑：
 * 1. 离开页面时，缓存当前页面
 * 2. 进入页面时，如果是通过返回操作，保持缓存；如果是push操作，清除缓存
 */
export function usePageCache (componentName?: string) {
  const router = useRouter()
  const route = useRoute()
  const keepAliveStore = useKeepAliveStore()

  // 获取当前组件名
  const currentComponentName = componentName || String(route.name || 'Unknown')

  // 判断是否为浏览器的前进后退操作
  let isPopstateNavigation = false

  const handlePopstate = () => {
    isPopstateNavigation = true
    setTimeout(() => {
      isPopstateNavigation = false
    }, 100)
  }

  // 注册全局路由守卫
  const registerRouterGuard = () => {
    if (isRouterGuardRegistered) return

    router.beforeEach((to, from, next) => {
      // 离开页面时，缓存当前页面
      if (from.name) {
        const fromComponentName = String(from.name)
        keepAliveStore.addCachedComponent(fromComponentName)
        console.log(`💾 离开页面，缓存: ${fromComponentName}`)
      }

      next()
    })

    router.afterEach((to) => {
      // 进入页面时的缓存控制
      if (to.name) {
        const toComponentName = String(to.name)

        // 判断是否为返回操作
        if (isPopstateNavigation) {
          // 返回操作：保持缓存
          keepAliveStore.addCachedComponent(toComponentName)
          console.log(`🔙 返回到页面，保持缓存: ${toComponentName}`)
        } else {
          // push操作：清除缓存
          keepAliveStore.removeCachedComponent(toComponentName)
          console.log(`➡️ Push到页面，清除缓存: ${toComponentName}`)
        }
      }
    })

    isRouterGuardRegistered = true
    console.log('🔧 页面缓存路由守卫已注册')
  }

  // 手动控制缓存
  const enableCache = (name?: string) => {
    const targetName = name || currentComponentName
    keepAliveStore.addCachedComponent(targetName)
    console.log(`✅ 手动启用缓存: ${targetName}`)
  }

  const disableCache = (name?: string) => {
    const targetName = name || currentComponentName
    keepAliveStore.removeCachedComponent(targetName)
    console.log(`❌ 手动禁用缓存: ${targetName}`)
  }

  const clearAllCache = () => {
    keepAliveStore.clearAllCachedComponents()
    console.log('🗑️ 清空所有缓存')
  }

  // 强制无缓存跳转
  const pushWithoutCache = (location: any) => {
    const targetRoute = router.resolve(location)
    if (targetRoute.name) {
      const targetName = String(targetRoute.name)
      keepAliveStore.removeCachedComponent(targetName)
      console.log(`🚫 强制清除目标页面缓存: ${targetName}`)
    }
    return router.push(location)
  }

  onMounted(() => {
    // 注册路由守卫
    registerRouterGuard()

    // 监听浏览器前进后退
    window.addEventListener('popstate', handlePopstate)

    console.log(`📱 页面缓存Hook初始化: ${currentComponentName}`)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('popstate', handlePopstate)
  })

  return {
    currentComponentName,
    enableCache,
    disableCache,
    clearAllCache,
    pushWithoutCache
  }
}
