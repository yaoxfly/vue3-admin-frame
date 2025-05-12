import type { Router } from 'vue-router'

export const setupRouterGuard = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    // 可以添加登录验证、权限校验等
    next()
  })

  // 重新加载
  router.afterEach((to, from) => {
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
