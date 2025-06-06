import type { Router } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import '@/assets/style/nprogress.scss'

// 配置NProgress - 调整为更慢的速度
NProgress.configure({
  showSpinner: false, // 不显示右上角螺旋加载提示
  trickleSpeed: 300, // 增加trickle速度
  minimum: 0.3, // 降低最小值
  easing: 'ease',
  speed: 800 // 增加speed让进度条更慢
})

export const setupRouterGuard = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    // 开始进度条
    NProgress.start()

    // 添加小延时，让进度条有时间显示
    await new Promise(resolve => setTimeout(resolve, 100))

    // 可以添加登录验证、权限校验等
    next()
  })

  // 重新加载
  router.afterEach((to, from) => {
    // 延时完成进度条，与页面动画同步
    setTimeout(() => {
      NProgress.done()
    }, 100)

    // eslint-disable-next-line no-debugger
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
