/**
 * @description 自动生成非菜单路由
 */
import type { RouteRecordRaw } from 'vue-router'
// 获取所有非 index.tsx 的 tsx 页面组件
const modules = import.meta.glob('@/views/**/*.tsx', { eager: false })
/**
 * 将路径转换为 PascalCase 格式
 */
const toPascalCase = (path: string): string => {
  return path
    .replace(/^[\/]/, '') // 去掉开头的斜杠
    .split(/[\/-]/) // 按斜杠和短横线分割
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

/**
 * 自动获取非菜单路由
 */
export const generateNonMenuRoutes = (): RouteRecordRaw[] => {
  const routes: RouteRecordRaw[] = []
  Object.keys(modules).forEach((key) => {
    // 只处理非 index.tsx
    if (key.endsWith('/index.tsx')) return
    // 排除 component 目录
    if (key.includes('/component/')) return

    // 生成 path，例如 '@/views/foo/bar.tsx' -> '/foo/bar'
    const url = key.replace(/^@\/views/, '').replace(/\.tsx$/, '')
    const path = url.split('/').pop()
    routes.push({
      path: `/${path}` || '',
      name: toPascalCase(path || ''),
      component: modules[key],
      meta: {
        title: '',
        nonMenu: true
      }
    })
  })

  return routes
}
