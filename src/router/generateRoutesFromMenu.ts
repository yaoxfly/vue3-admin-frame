import type { RouteRecordRaw } from 'vue-router'
import type { MenuItem } from '@/store/menu'
// 动态导入 tsx 页面组件
const modules = import.meta.glob('@/views/**/index.tsx')
/**
 * 从菜单中提取所有合法可用的动态路由
 */
export const generateRoutesFromMenu = (
  menus: MenuItem[],
  allPaths: string[] = Object.keys(modules)
): RouteRecordRaw[] => {
  const routes: RouteRecordRaw[] = []
  // eslint-disable-next-line no-debugger
  // debugger
  const traverse = (menuItems: MenuItem[], parentBreadcrumb: { title: string; path: string }[] = []) => {
    for (const item of menuItems) {
      const fullPath = item.index
      const viewPath = `/src/views${fullPath}/index.tsx`

      // 如果当前节点不是 group（即没有 groupTitle），才加入 breadcrumb
      const currentBreadcrumb = item.groupTitle
        ? [...parentBreadcrumb]
        : [...parentBreadcrumb, { title: item.title || '', path: fullPath || '' }]

      if (allPaths.includes(viewPath)) {
        const route: RouteRecordRaw = {
          path: fullPath || '',
          name: fullPath?.replace(/^\//, ''),
          component: modules[viewPath],
          meta: {
            title: item.title,
            breadcrumb: currentBreadcrumb
          }
        }
        routes.push(route)
      }

      if (item.children) {
        traverse(item.children, currentBreadcrumb)
      }
    }
  }

  traverse(menus)
  return routes
}
