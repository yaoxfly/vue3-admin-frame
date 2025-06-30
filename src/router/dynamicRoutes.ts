/**
 * @description 注册动态路由
 */
import type { Router } from 'vue-router'
import { useMenuStore } from '@/store/menu'
import { generateRoutesFromMenu } from './generateRoutesFromMenu'
import { generateNonMenuRoutes } from './generateNonMenuRoutes'
export const dynamicRoutes = async (router: Router) => {
  const menuStore = useMenuStore()
  let routes = generateRoutesFromMenu(menuStore.getMenu)
  const nonMenuRoutes = generateNonMenuRoutes()
  routes = [...routes, ...nonMenuRoutes]
  console.log(nonMenuRoutes, 'generateNonMenuRoutes')
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
