/**
 * @description 自动生成非菜单路由
 */
import type { RouteRecordRaw } from 'vue-router'
// 获取所有非 index 的 tsx 和 vue 页面组件
const tsxModules = import.meta.glob('@/views/**/*.tsx', { eager: false })
const vueModules = import.meta.glob('@/views/**/*.vue', { eager: false })

// 合并模块，优先使用 tsx 文件
const modules = { ...vueModules, ...tsxModules }
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
    // 只处理非 index 文件（包括 .tsx 和 .vue）
    if (key.endsWith('/index.tsx') || key.endsWith('/index.vue')) return
    // 排除 component 目录
    if (key.includes('/component/')) return
    // 直接处理 /src/views/ 前缀
    // 1. 首先移除文件扩展名
    const pathWithoutExt = key.replace(/\.(tsx|vue)$/, '')
    // 2. 移除 /src/views/ 前缀
    const relativePath = pathWithoutExt.replace(/^\/src\/views\/?/, '')
    // 3. 分割路径部分
    const pathParts = relativePath.split('/').filter(part => part !== '')
    // 4. 只处理第一层和第二层文件（views/文件名 和 views/xx/文件名），不处理第三层及更深层
    if (pathParts.length !== 1 && pathParts.length !== 2) {
      console.log(`跳过路径: ${key} (路径深度: ${pathParts.length}, 只处理深度为1和2的路径)`)
      return
    }
    // 5. 生成路由路径
    let routePath = ''
    if (pathParts.length === 2) {
      // 第二层文件：包含文件夹名称，例如 'vue-test/detial' -> '/vue-test/detial'
      routePath = pathParts.join('/')
    } else {
      // 第一层文件：直接使用文件名，例如 'home' -> '/home'
      routePath = pathParts[0] || ''
    }
    // 调试信息：打印详细的路径处理过程
    console.log(`原始路径: ${key}`)
    console.log(`移除扩展名: ${pathWithoutExt}`)
    console.log(`相对路径: ${relativePath}`)
    console.log(`路径部分: ${JSON.stringify(pathParts)}`)
    console.log(`最终路由路径: /${routePath}`)
    console.log('---')
    routes.push({
      path: `/${routePath}` || '',
      name: toPascalCase(routePath || ''),
      component: modules[key],
      meta: {
        title: '',
        nonMenu: true
      }
    })
  })

  return routes
}
