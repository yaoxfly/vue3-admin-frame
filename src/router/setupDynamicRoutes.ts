import type { Router } from 'vue-router'
import { useMenuStore } from '@/store/menu'
import { generateRoutesFromMenu } from './generateRoutesFromMenu'
export const preloadDynamicRoutes = async (router: Router) => {
  const menuStore = useMenuStore()
  const routes = generateRoutesFromMenu(menuStore.getMenu)
  routes.forEach(route => {
    router.addRoute('layout', route)
  })

  // 添加 layout 下的兜底 404
  router.addRoute('layout', {
    path: ':pathMatch(.*)*',
    name: 'demo-404',
    component: () => import('@/views/404/index'),
    meta: {
      breadcrumb: [
        { title: '异常页面' },
        { title: '404' }
      ]
    }
  })

  // 全局兜底 404
  router.addRoute({
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/404/index'),
    meta: {
      breadcrumb: [
        { title: '异常页面' },
        { title: '404' }
      ]
    }
  })

  menuStore.isLoaded = true
}
