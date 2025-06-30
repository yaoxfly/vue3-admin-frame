/**
 * @description 全局路由守卫
 */
import type { Router } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import '@/assets/style/nprogress.scss'
import { useLayTag } from '@/store/lay-tag'

// 配置NProgress - 调整为更慢的速度
NProgress.configure({
  showSpinner: false, // 不显示右上角螺旋加载提示
  trickleSpeed: 300, // 增加trickle速度
  minimum: 0.3, // 降低最小值
  easing: 'ease',
  speed: 800 // 增加speed让进度条更慢
})

export const routerGuard = (router: Router) => {
  // 全局前置守卫
  router.beforeEach(async (to, from, next) => {
    // 只处理非菜单路由
    if (to.meta.nonMenu) {
      // 继承上一个页面的面包屑
      const prevBreadcrumb = from.meta.breadcrumb || []
      // 详情页 title 可自定义
      const detailTitle = to.meta.title || `${from.meta.title || ''}详情`
      // 生成新的面包屑
      to.meta.breadcrumb = [
        ...(Array.isArray(prevBreadcrumb) ? prevBreadcrumb : []),
        { title: detailTitle, path: to.path }
      ]
    }

    // 开始进度条
    NProgress.start()

    // 添加小延时，让进度条有时间显示
    await new Promise(resolve => setTimeout(resolve, 100))

    // 可以添加登录验证、权限校验等
    next()
  })

  // 全局后置守卫
  router.afterEach((to, from) => {
    // 延时完成进度条，与页面动画同步
    setTimeout(() => {
      NProgress.done()
    }, 100)

    // 自动添加所有有效路由到标签页（包括菜单路由和非菜单路由）
    if (to.meta && (to.meta.title || to.meta.nonMenu)) {
      const layTagStore = useLayTag()
      // 优先使用 meta.title，其次使用路由名称，最后使用默认值
      let title = ''
      if (to.meta.title) {
        title = to.meta.title as string
      } else if (to.meta.nonMenu) {
        // 非菜单路由使用生成的标题（如："标签测试详情"）
        const detailTitle = to.meta.title || `${from.meta?.title || ''}详情`
        title = detailTitle as string
      } else {
        title = (to.name as string) || '未命名页面'
      }
      // 添加到标签页并设置为活动标签
      layTagStore.setTag(to.path, title)
    }

    // 处理重定向路由--在标签页组件中，当用户点击"重新加载"时触发
    if (to.path.startsWith('/redirect') && to.path !== from.path) {
      const dynamicPart = Array.isArray(to.params.pathMatch)
        ? '/' + to.params.pathMatch.join('/')
        : '/' + to.params.pathMatch
      // 如果有查询或 hash，一起带上
      const query = to.query
      const hash = to.hash
      router.replace({ path: dynamicPart, query, hash })
    }
  })
}
